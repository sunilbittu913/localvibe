import { Request, Response } from "express";
import { eq, and, like, sql, desc, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { businesses, categories, subcategories, users } from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendPaginated, generateUniqueSlug } from "../utils/helpers";
import { AppError } from "../utils/AppError";
import {
  AuthenticatedRequest,
  CreateBusinessRequestBody,
  UpdateBusinessRequestBody,
  BusinessQueryFilters,
} from "../types";

/**
 * Business Controller
 * Handles CRUD operations for business profiles.
 * Supports filtering, pagination, and search functionality.
 */
export class BusinessController {
  /**
   * GET /api/businesses
   * List all businesses with optional filters, search, and pagination.
   *
   * Supports filtering by category, subcategory, city, state, pincode,
   * and verification status. Also supports text search on business name.
   */
  static list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as BusinessQueryFilters;
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const offset = (page - 1) * limit;

    // Build WHERE conditions dynamically
    const conditions: any[] = [eq(businesses.isActive, true)];

    if (filters.categoryId) {
      conditions.push(eq(businesses.categoryId, Number(filters.categoryId)));
    }

    if (filters.subcategoryId) {
      conditions.push(eq(businesses.subcategoryId, Number(filters.subcategoryId)));
    }

    if (filters.city) {
      conditions.push(eq(businesses.city, filters.city));
    }

    if (filters.state) {
      conditions.push(eq(businesses.state, filters.state));
    }

    if (filters.pincode) {
      conditions.push(eq(businesses.pincode, filters.pincode));
    }

    if (filters.isVerified !== undefined) {
      conditions.push(eq(businesses.isVerified, filters.isVerified === true || filters.isVerified === ("true" as any)));
    }

    if (filters.search) {
      conditions.push(like(businesses.name, `%${filters.search}%`));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Determine sort order
    const sortColumn = filters.sortBy || "createdAt";
    const sortDirection = filters.sortOrder === "asc" ? asc : desc;

    let orderByClause;
    switch (sortColumn) {
      case "name":
        orderByClause = sortDirection(businesses.name);
        break;
      case "averageRating":
        orderByClause = sortDirection(businesses.averageRating);
        break;
      case "totalReviews":
        orderByClause = sortDirection(businesses.totalReviews);
        break;
      default:
        orderByClause = sortDirection(businesses.createdAt);
    }

    // Execute the query with pagination
    const businessList = await db
      .select({
        id: businesses.id,
        uuid: businesses.uuid,
        name: businesses.name,
        slug: businesses.slug,
        description: businesses.description,
        phone: businesses.phone,
        email: businesses.email,
        website: businesses.website,
        addressLine1: businesses.addressLine1,
        city: businesses.city,
        state: businesses.state,
        pincode: businesses.pincode,
        latitude: businesses.latitude,
        longitude: businesses.longitude,
        logo: businesses.logo,
        coverImage: businesses.coverImage,
        openingTime: businesses.openingTime,
        closingTime: businesses.closingTime,
        workingDays: businesses.workingDays,
        isVerified: businesses.isVerified,
        averageRating: businesses.averageRating,
        totalReviews: businesses.totalReviews,
        createdAt: businesses.createdAt,
        categoryId: businesses.categoryId,
        categoryName: categories.name,
        subcategoryId: businesses.subcategoryId,
        subcategoryName: subcategories.name,
        ownerFirstName: users.firstName,
        ownerLastName: users.lastName,
      })
      .from(businesses)
      .leftJoin(categories, eq(businesses.categoryId, categories.id))
      .leftJoin(subcategories, eq(businesses.subcategoryId, subcategories.id))
      .leftJoin(users, eq(businesses.ownerId, users.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(businesses)
      .where(whereClause);

    const total = Number(countResult?.count) || 0;

    sendPaginated(res, "Businesses retrieved successfully.", businessList, {
      page,
      limit,
      total,
    });
  });

  /**
   * GET /api/businesses/:id
   * Get a single business by its ID or UUID.
   *
   * Returns the full business profile with category, subcategory,
   * and owner information.
   */
  static getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    // Support lookup by numeric ID or UUID
    const isNumericId = /^\d+$/.test(id);

    const business = await db.query.businesses.findFirst({
      where: isNumericId
        ? eq(businesses.id, parseInt(id, 10))
        : eq(businesses.uuid, id),
      with: {
        category: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
        owner: {
          columns: {
            id: true,
            uuid: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!business) {
      throw AppError.notFound("Business not found.");
    }

    // Remove sensitive fields
    const { ownerId, ...businessData } = business;

    sendSuccess(res, 200, "Business retrieved successfully.", { business: businessData });
  });

  /**
   * POST /api/businesses
   * Create a new business profile.
   *
   * Only business_user and admin roles can create businesses.
   * Validates that the category exists before creating the business.
   */
  static create = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.");
      }

      const body = req.body as CreateBusinessRequestBody;

      // Verify the category exists
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, body.categoryId),
      });

      if (!category) {
        throw AppError.badRequest("The specified category does not exist.");
      }

      // Verify the subcategory exists (if provided)
      if (body.subcategoryId) {
        const subcategory = await db.query.subcategories.findFirst({
          where: and(
            eq(subcategories.id, body.subcategoryId),
            eq(subcategories.categoryId, body.categoryId)
          ),
        });

        if (!subcategory) {
          throw AppError.badRequest(
            "The specified subcategory does not exist or does not belong to the selected category."
          );
        }
      }

      // Generate unique slug and UUID
      const slug = generateUniqueSlug(body.name);
      const businessUuid = uuidv4();

      // Insert the new business
      const [result] = await db.insert(businesses).values({
        uuid: businessUuid,
        ownerId: req.user.userId,
        categoryId: body.categoryId,
        subcategoryId: body.subcategoryId || null,
        name: body.name.trim(),
        slug,
        description: body.description || null,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        addressLine1: body.addressLine1 || null,
        addressLine2: body.addressLine2 || null,
        city: body.city || null,
        state: body.state || null,
        pincode: body.pincode || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        openingTime: body.openingTime || null,
        closingTime: body.closingTime || null,
        workingDays: body.workingDays || null,
      });

      // Fetch the newly created business with relations
      const newBusiness = await db.query.businesses.findFirst({
        where: eq(businesses.id, result.insertId),
        with: {
          category: {
            columns: { id: true, name: true, slug: true },
          },
          subcategory: {
            columns: { id: true, name: true, slug: true },
          },
        },
      });

      // Update user role to business_user if they were a normal_user
      if (req.user.role === "normal_user") {
        await db
          .update(users)
          .set({ role: "business_user" })
          .where(eq(users.id, req.user.userId));
      }

      sendSuccess(res, 201, "Business created successfully.", { business: newBusiness });
    }
  );

  /**
   * PUT /api/businesses/:id
   * Update an existing business profile.
   *
   * Only the business owner or an admin can update a business.
   * Validates ownership before allowing the update.
   */
  static update = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.");
      }

      const id = req.params.id as string;
      const body = req.body as UpdateBusinessRequestBody;

      // Find the business
      const isNumericId = /^\d+$/.test(id);
      const business = await db.query.businesses.findFirst({
        where: isNumericId
          ? eq(businesses.id, parseInt(id, 10))
          : eq(businesses.uuid, id),
      });

      if (!business) {
        throw AppError.notFound("Business not found.");
      }

      // Check ownership (owner or admin can update)
      if (business.ownerId !== req.user.userId && req.user.role !== "admin") {
        throw AppError.forbidden("You do not have permission to update this business.");
      }

      // Validate category if being updated
      if (body.categoryId) {
        const category = await db.query.categories.findFirst({
          where: eq(categories.id, body.categoryId),
        });

        if (!category) {
          throw AppError.badRequest("The specified category does not exist.");
        }
      }

      // Validate subcategory if being updated
      if (body.subcategoryId) {
        const catId = body.categoryId || business.categoryId;
        const subcategory = await db.query.subcategories.findFirst({
          where: and(
            eq(subcategories.id, body.subcategoryId),
            eq(subcategories.categoryId, catId)
          ),
        });

        if (!subcategory) {
          throw AppError.badRequest(
            "The specified subcategory does not exist or does not belong to the selected category."
          );
        }
      }

      // Build update data
      const updateData: Record<string, any> = {};
      if (body.name !== undefined) {
        updateData.name = body.name.trim();
        updateData.slug = generateUniqueSlug(body.name);
      }
      if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
      if (body.subcategoryId !== undefined) updateData.subcategoryId = body.subcategoryId;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.phone !== undefined) updateData.phone = body.phone;
      if (body.email !== undefined) updateData.email = body.email;
      if (body.website !== undefined) updateData.website = body.website;
      if (body.addressLine1 !== undefined) updateData.addressLine1 = body.addressLine1;
      if (body.addressLine2 !== undefined) updateData.addressLine2 = body.addressLine2;
      if (body.city !== undefined) updateData.city = body.city;
      if (body.state !== undefined) updateData.state = body.state;
      if (body.pincode !== undefined) updateData.pincode = body.pincode;
      if (body.latitude !== undefined) updateData.latitude = body.latitude;
      if (body.longitude !== undefined) updateData.longitude = body.longitude;
      if (body.openingTime !== undefined) updateData.openingTime = body.openingTime;
      if (body.closingTime !== undefined) updateData.closingTime = body.closingTime;
      if (body.workingDays !== undefined) updateData.workingDays = body.workingDays;

      if (Object.keys(updateData).length === 0) {
        throw AppError.badRequest("No fields provided for update.");
      }

      // Update the business
      await db
        .update(businesses)
        .set(updateData)
        .where(eq(businesses.id, business.id));

      // Fetch the updated business
      const updatedBusiness = await db.query.businesses.findFirst({
        where: eq(businesses.id, business.id),
        with: {
          category: {
            columns: { id: true, name: true, slug: true },
          },
          subcategory: {
            columns: { id: true, name: true, slug: true },
          },
        },
      });

      sendSuccess(res, 200, "Business updated successfully.", { business: updatedBusiness });
    }
  );
}
