import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

/**
 * Admin Routes
 *
 * All routes require admin authentication.
 *
 * GET    /api/admin/stats                          - Dashboard statistics
 * GET    /api/admin/posts                          - List all posts/listings
 * PATCH  /api/admin/posts/:id/approve              - Approve a post
 * PATCH  /api/admin/posts/:id/reject               - Reject a post
 * GET    /api/admin/users                          - List all users
 * PATCH  /api/admin/users/:id/toggle-status        - Toggle user active status
 * GET    /api/admin/businesses                     - List all businesses
 * PATCH  /api/admin/businesses/:id/toggle-status   - Toggle business active status
 * GET    /api/admin/categories                     - List all categories
 */
const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize(["admin"]));

// Dashboard
router.get("/stats", AdminController.getStats);

// Posts / Listings management
router.get("/posts", AdminController.getPosts);
router.patch("/posts/:id/approve", AdminController.approvePost);
router.patch("/posts/:id/reject", AdminController.rejectPost);

// User management
router.get("/users", AdminController.getUsers);
router.patch("/users/:id/toggle-status", AdminController.toggleUserStatus);

// Business management
router.get("/businesses", AdminController.getBusinesses);
router.patch("/businesses/:id/toggle-status", AdminController.toggleBusinessStatus);

// Category management
router.get("/categories", AdminController.getCategories);

export default router;
