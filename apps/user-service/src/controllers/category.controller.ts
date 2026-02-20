import { Request, Response } from "express";
import { eq, asc } from "drizzle-orm";
import { db } from "../config/database";
import { categories } from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, generateSlug } from "../utils/helpers";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest, CreateCategoryRequestBody } from "../types";

/**
 * Category Controller
 * Handles CRUD operations for business categories.
 * Category creation is restricted to admin users only.
 */
export class CategoryController {
  /**
   * GET /api/categories
   * List all active categories with their subcategories.
   *
   * Returns categories sorted by sortOrder, including nested subcategories.
   * This endpoint is publicly accessible (no authentication required).
   */
  static list = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const categoryList = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      with: {
        subcategories: {
          columns: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
            sortOrder: true,
          },
        },
      },
      columns: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        sortOrder: true,
        createdAt: true,
      },
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    });

    sendSuccess(res, 200, "Categories retrieved successfully.", {
      categories: categoryList,
      total: categoryList.length,
    });
  });

  /**
   * POST /api/categories
   * Create a new category (admin only).
   *
   * Validates that the category name is unique before creating.
   * Automatically generates a URL-friendly slug from the name.
   */
  static create = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { name, description, icon, sortOrder } = req.body as CreateCategoryRequestBody;

      // Generate slug from the category name
      const slug = generateSlug(name);

      // Check if a category with this name or slug already exists
      const existingCategory = await db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      });

      if (existingCategory) {
        throw AppError.conflict(`A category with the name "${name}" already exists.`);
      }

      // Insert the new category and return the created row
      const [newCategory] = await db.insert(categories).values({
        name: name.trim(),
        slug,
        description: description || null,
        icon: icon || null,
        sortOrder: sortOrder || 0,
      }).returning({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        sortOrder: categories.sortOrder,
        createdAt: categories.createdAt,
      });

      sendSuccess(res, 201, "Category created successfully.", { category: newCategory });
    }
  );
}
