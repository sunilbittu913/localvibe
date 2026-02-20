import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCategorySchema } from "../utils/validators";

/**
 * Category Routes
 *
 * GET  /api/categories  - List all categories
 * POST /api/categories  - Create a new category (admin only)
 */
const router = Router();

/**
 * @route   GET /api/categories
 * @desc    List all active categories with subcategories
 * @access  Public
 */
router.get("/", CategoryController.list);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (admin only)
 */
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validate(createCategorySchema),
  CategoryController.create
);

export default router;
