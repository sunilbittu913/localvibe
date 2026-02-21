import { Request, Response } from "express";
import { eq, and, like, sql, desc, asc, or } from "drizzle-orm";
import { db } from "../config/database";
import {
  businesses,
  categories,
  subcategories,
  users,
  jobs,
  offers,
  reviews,
} from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendPaginated } from "../utils/helpers";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest } from "../types";

/**
 * Admin Controller
 * Handles Super Admin operations including content moderation,
 * user management, business management, and analytics.
 */
export class AdminController {
  // ============================================
  // DASHBOARD / STATS
  // ============================================

  /**
   * GET /api/admin/stats
   * Get platform overview statistics for the admin dashboard.
   */
  static getStats = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const [userCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users);

      const [businessCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(businesses);

      const [pendingBusinessCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(businesses)
        .where(eq(businesses.status, "pending"));

      const [categoryCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(categories);

      const [jobCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(jobs);

      const [pendingJobCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(jobs)
        .where(eq(jobs.status, "pending"));

      const [offerCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(offers);

      const [pendingOfferCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(offers)
        .where(eq(offers.status, "pending"));

      const [reviewCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(reviews);

      sendSuccess(res, 200, "Admin stats retrieved successfully.", {
        stats: {
          totalUsers: Number(userCount?.count) || 0,
          totalBusinesses: Number(businessCount?.count) || 0,
          pendingBusinesses: Number(pendingBusinessCount?.count) || 0,
          totalCategories: Number(categoryCount?.count) || 0,
          totalJobs: Number(jobCount?.count) || 0,
          pendingJobs: Number(pendingJobCount?.count) || 0,
          totalOffers: Number(offerCount?.count) || 0,
          pendingOffers: Number(pendingOfferCount?.count) || 0,
          totalReviews: Number(reviewCount?.count) || 0,
        },
      });
    }
  );

  // ============================================
  // POSTS / LISTINGS MANAGEMENT
  // ============================================

  /**
   * GET /api/admin/posts
   * Get all posts/listings (businesses, jobs, offers) with optional status filter.
   * Super Admin can see ALL posts regardless of status.
   */
  static getPosts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { status, type, search, page = "1", limit = "20" } = req.query as Record<string, string>;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;
      const offset = (pageNum - 1) * limitNum;

      const posts: any[] = [];

      // Fetch businesses as posts
      if (!type || type === "business" || type === "all") {
        const bizConditions: any[] = [];
        if (status && status !== "all") bizConditions.push(eq(businesses.status, status as any));
        if (search) bizConditions.push(like(businesses.name, `%${search}%`));

        const bizWhere = bizConditions.length > 0 ? and(...bizConditions) : undefined;

        const bizList = await db
          .select({
            id: businesses.id,
            uuid: businesses.uuid,
            title: businesses.name,
            description: businesses.description,
            status: businesses.status,
            businessName: businesses.name,
            businessId: businesses.id,
            categoryName: categories.name,
            createdAt: businesses.createdAt,
          })
          .from(businesses)
          .leftJoin(categories, eq(businesses.categoryId, categories.id))
          .where(bizWhere)
          .orderBy(desc(businesses.createdAt))
          .limit(limitNum)
          .offset(offset);

        bizList.forEach((b) => posts.push({ ...b, type: "listing" }));
      }

      // Fetch jobs as posts
      if (!type || type === "job" || type === "all") {
        const jobConditions: any[] = [];
        if (status && status !== "all") jobConditions.push(eq(jobs.status, status as any));
        if (search) jobConditions.push(like(jobs.title, `%${search}%`));

        const jobWhere = jobConditions.length > 0 ? and(...jobConditions) : undefined;

        const jobList = await db
          .select({
            id: jobs.id,
            uuid: jobs.uuid,
            title: jobs.title,
            description: jobs.description,
            status: jobs.status,
            businessName: businesses.name,
            businessId: jobs.businessId,
            categoryName: categories.name,
            createdAt: jobs.createdAt,
          })
          .from(jobs)
          .leftJoin(businesses, eq(jobs.businessId, businesses.id))
          .leftJoin(categories, eq(businesses.categoryId, categories.id))
          .where(jobWhere)
          .orderBy(desc(jobs.createdAt))
          .limit(limitNum)
          .offset(offset);

        jobList.forEach((j) => posts.push({ ...j, type: "job" }));
      }

      // Fetch offers as posts
      if (!type || type === "offer" || type === "all") {
        const offerConditions: any[] = [];
        if (status && status !== "all") offerConditions.push(eq(offers.status, status as any));
        if (search) offerConditions.push(like(offers.title, `%${search}%`));

        const offerWhere = offerConditions.length > 0 ? and(...offerConditions) : undefined;

        const offerList = await db
          .select({
            id: offers.id,
            uuid: offers.uuid,
            title: offers.title,
            description: offers.description,
            status: offers.status,
            businessName: businesses.name,
            businessId: offers.businessId,
            categoryName: categories.name,
            createdAt: offers.createdAt,
          })
          .from(offers)
          .leftJoin(businesses, eq(offers.businessId, businesses.id))
          .leftJoin(categories, eq(businesses.categoryId, categories.id))
          .where(offerWhere)
          .orderBy(desc(offers.createdAt))
          .limit(limitNum)
          .offset(offset);

        offerList.forEach((o) => posts.push({ ...o, type: "offer" }));
      }

      // Sort all posts by createdAt descending
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      sendSuccess(res, 200, "Posts retrieved successfully.", { posts });
    }
  );

  /**
   * PATCH /api/admin/posts/:id/approve
   * Approve a business listing, job, or offer.
   */
  static approvePost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { type } = req.body as { type: string };
      const numId = parseInt(id, 10);

      if (!type || !["business", "listing", "job", "offer"].includes(type)) {
        throw AppError.badRequest("Post type is required (business, job, or offer).");
      }

      const postType = type === "listing" ? "business" : type;

      if (postType === "business") {
        const [updated] = await db
          .update(businesses)
          .set({ status: "approved", rejectionReason: null })
          .where(eq(businesses.id, numId))
          .returning();
        if (!updated) throw AppError.notFound("Business not found.");
        sendSuccess(res, 200, "Business approved successfully.", { post: updated });
      } else if (postType === "job") {
        const [updated] = await db
          .update(jobs)
          .set({ status: "approved", rejectionReason: null })
          .where(eq(jobs.id, numId))
          .returning();
        if (!updated) throw AppError.notFound("Job not found.");
        sendSuccess(res, 200, "Job approved successfully.", { post: updated });
      } else if (postType === "offer") {
        const [updated] = await db
          .update(offers)
          .set({ status: "approved", rejectionReason: null })
          .where(eq(offers.id, numId))
          .returning();
        if (!updated) throw AppError.notFound("Offer not found.");
        sendSuccess(res, 200, "Offer approved successfully.", { post: updated });
      }
    }
  );

  /**
   * PATCH /api/admin/posts/:id/reject
   * Reject a business listing, job, or offer.
   */
  static rejectPost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { type, reason } = req.body as { type: string; reason?: string };
      const numId = parseInt(id, 10);

      if (!type || !["business", "listing", "job", "offer"].includes(type)) {
        throw AppError.badRequest("Post type is required (business, job, or offer).");
      }

      const postType = type === "listing" ? "business" : type;

      if (postType === "business") {
        const [updated] = await db
          .update(businesses)
          .set({ status: "rejected", rejectionReason: reason || null })
          .where(eq(businesses.id, numId))
          .returning();
        if (!updated) throw AppError.notFound("Business not found.");
        sendSuccess(res, 200, "Business rejected.", { post: updated });
      } else if (postType === "job") {
        const [updated] = await db
          .update(jobs)
          .set({ status: "rejected", rejectionReason: reason || null })
          .where(eq(jobs.id, numId))
          .returning();
        if (!updated) throw AppError.notFound("Job not found.");
        sendSuccess(res, 200, "Job rejected.", { post: updated });
      } else if (postType === "offer") {
        const [updated] = await db
          .update(offers)
          .set({ status: "rejected", rejectionReason: reason || null })
          .where(eq(offers.id, numId))
          .returning();
        if (!updated) throw AppError.notFound("Offer not found.");
        sendSuccess(res, 200, "Offer rejected.", { post: updated });
      }
    }
  );

  // ============================================
  // USER MANAGEMENT
  // ============================================

  /**
   * GET /api/admin/users
   * List all users with optional filters.
   */
  static getUsers = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { role, search, page = "1", limit = "20" } = req.query as Record<string, string>;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;
      const offset = (pageNum - 1) * limitNum;

      const conditions: any[] = [];
      if (role && role !== "all") conditions.push(eq(users.role, role as any));
      if (search) {
        conditions.push(
          or(
            like(users.firstName, `%${search}%`),
            like(users.email, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const userList = await db
        .select({
          id: users.id,
          uuid: users.uuid,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          avatar: users.avatar,
          role: users.role,
          isActive: users.isActive,
          isVerified: users.isEmailVerified,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limitNum)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .where(whereClause);

      sendPaginated(res, "Users retrieved successfully.", { users: userList }, {
        page: pageNum,
        limit: limitNum,
        total: Number(countResult?.count) || 0,
      });
    }
  );

  /**
   * PATCH /api/admin/users/:id/toggle-status
   * Activate or deactivate a user account.
   */
  static toggleUserStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const numId = parseInt(id, 10);

      const user = await db.query.users.findFirst({
        where: eq(users.id, numId),
      });

      if (!user) throw AppError.notFound("User not found.");
      if (user.role === "admin") throw AppError.forbidden("Cannot modify admin accounts.");

      const [updated] = await db
        .update(users)
        .set({ isActive: !user.isActive })
        .where(eq(users.id, numId))
        .returning();

      sendSuccess(res, 200, `User ${updated.isActive ? "activated" : "deactivated"} successfully.`, { user: updated });
    }
  );

  // ============================================
  // BUSINESS MANAGEMENT
  // ============================================

  /**
   * GET /api/admin/businesses
   * List all businesses for admin management.
   */
  static getBusinesses = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { status, search, page = "1", limit = "50" } = req.query as Record<string, string>;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 50;
      const offset = (pageNum - 1) * limitNum;

      const conditions: any[] = [];
      if (status && status !== "all") conditions.push(eq(businesses.status, status as any));
      if (search) conditions.push(like(businesses.name, `%${search}%`));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const bizList = await db
        .select({
          id: businesses.id,
          uuid: businesses.uuid,
          name: businesses.name,
          slug: businesses.slug,
          description: businesses.description,
          city: businesses.city,
          state: businesses.state,
          averageRating: businesses.averageRating,
          totalReviews: businesses.totalReviews,
          isVerified: businesses.isVerified,
          isActive: businesses.isActive,
          status: businesses.status,
          categoryId: businesses.categoryId,
          categoryName: categories.name,
          ownerName: users.firstName,
          createdAt: businesses.createdAt,
        })
        .from(businesses)
        .leftJoin(categories, eq(businesses.categoryId, categories.id))
        .leftJoin(users, eq(businesses.ownerId, users.id))
        .where(whereClause)
        .orderBy(desc(businesses.createdAt))
        .limit(limitNum)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(businesses)
        .where(whereClause);

      sendPaginated(res, "Businesses retrieved successfully.", { businesses: bizList }, {
        page: pageNum,
        limit: limitNum,
        total: Number(countResult?.count) || 0,
      });
    }
  );

  /**
   * PATCH /api/admin/businesses/:id/toggle-status
   * Activate or deactivate a business.
   */
  static toggleBusinessStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const numId = parseInt(id, 10);

      const business = await db.query.businesses.findFirst({
        where: eq(businesses.id, numId),
      });

      if (!business) throw AppError.notFound("Business not found.");

      const [updated] = await db
        .update(businesses)
        .set({ isActive: !business.isActive })
        .where(eq(businesses.id, numId))
        .returning();

      sendSuccess(res, 200, `Business ${updated.isActive ? "activated" : "deactivated"}.`, { business: updated });
    }
  );

  // ============================================
  // CATEGORY MANAGEMENT
  // ============================================

  /**
   * GET /api/admin/categories
   * List all categories with business counts.
   */
  static getCategories = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const catList = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          icon: categories.icon,
          isActive: categories.isActive,
          sortOrder: categories.sortOrder,
          createdAt: categories.createdAt,
          businessCount: sql<number>`(SELECT COUNT(*) FROM businesses WHERE businesses.category_id = ${categories.id})`,
        })
        .from(categories)
        .orderBy(asc(categories.sortOrder));

      sendSuccess(res, 200, "Categories retrieved successfully.", { categories: catList });
    }
  );

  // ============================================
  // APPROVED CONTENT ENDPOINTS (for mobile app)
  // ============================================

  /**
   * GET /api/approved/businesses
   * Returns only approved businesses (for mobile app consumption).
   */
  static getApprovedBusinesses = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { page = "1", limit = "20", search, categoryId } = req.query as Record<string, string>;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;
      const offset = (pageNum - 1) * limitNum;

      const conditions: any[] = [
        eq(businesses.status, "approved"),
        eq(businesses.isActive, true),
      ];

      if (search) conditions.push(like(businesses.name, `%${search}%`));
      if (categoryId) conditions.push(eq(businesses.categoryId, Number(categoryId)));

      const whereClause = and(...conditions);

      const bizList = await db
        .select({
          id: businesses.id,
          uuid: businesses.uuid,
          name: businesses.name,
          slug: businesses.slug,
          description: businesses.description,
          phone: businesses.phone,
          city: businesses.city,
          state: businesses.state,
          latitude: businesses.latitude,
          longitude: businesses.longitude,
          logo: businesses.logo,
          coverImage: businesses.coverImage,
          isVerified: businesses.isVerified,
          averageRating: businesses.averageRating,
          totalReviews: businesses.totalReviews,
          categoryName: categories.name,
          createdAt: businesses.createdAt,
        })
        .from(businesses)
        .leftJoin(categories, eq(businesses.categoryId, categories.id))
        .where(whereClause)
        .orderBy(desc(businesses.createdAt))
        .limit(limitNum)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(businesses)
        .where(whereClause);

      sendPaginated(res, "Approved businesses retrieved.", bizList, {
        page: pageNum,
        limit: limitNum,
        total: Number(countResult?.count) || 0,
      });
    }
  );

  /**
   * GET /api/approved/jobs
   * Returns only approved jobs (for mobile app consumption).
   */
  static getApprovedJobs = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { page = "1", limit = "20" } = req.query as Record<string, string>;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;
      const offset = (pageNum - 1) * limitNum;

      const whereClause = and(
        eq(jobs.status, "approved"),
        eq(jobs.isActive, true)
      );

      const jobList = await db
        .select({
          id: jobs.id,
          uuid: jobs.uuid,
          title: jobs.title,
          description: jobs.description,
          jobType: jobs.jobType,
          experienceLevel: jobs.experienceLevel,
          salaryMin: jobs.salaryMin,
          salaryMax: jobs.salaryMax,
          location: jobs.location,
          isRemote: jobs.isRemote,
          businessName: businesses.name,
          businessLogo: businesses.logo,
          createdAt: jobs.createdAt,
        })
        .from(jobs)
        .leftJoin(businesses, eq(jobs.businessId, businesses.id))
        .where(whereClause)
        .orderBy(desc(jobs.createdAt))
        .limit(limitNum)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(jobs)
        .where(whereClause);

      sendPaginated(res, "Approved jobs retrieved.", jobList, {
        page: pageNum,
        limit: limitNum,
        total: Number(countResult?.count) || 0,
      });
    }
  );

  /**
   * GET /api/approved/offers
   * Returns only approved offers (for mobile app consumption).
   */
  static getApprovedOffers = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { page = "1", limit = "20" } = req.query as Record<string, string>;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;
      const offset = (pageNum - 1) * limitNum;

      const whereClause = and(
        eq(offers.status, "approved"),
        eq(offers.isActive, true)
      );

      const offerList = await db
        .select({
          id: offers.id,
          uuid: offers.uuid,
          title: offers.title,
          description: offers.description,
          discountType: offers.discountType,
          discountValue: offers.discountValue,
          couponCode: offers.couponCode,
          image: offers.image,
          businessName: businesses.name,
          businessLogo: businesses.logo,
          startsAt: offers.startsAt,
          expiresAt: offers.expiresAt,
          createdAt: offers.createdAt,
        })
        .from(offers)
        .leftJoin(businesses, eq(offers.businessId, businesses.id))
        .where(whereClause)
        .orderBy(desc(offers.createdAt))
        .limit(limitNum)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(offers)
        .where(whereClause);

      sendPaginated(res, "Approved offers retrieved.", offerList, {
        page: pageNum,
        limit: limitNum,
        total: Number(countResult?.count) || 0,
      });
    }
  );
}
