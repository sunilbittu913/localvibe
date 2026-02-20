import { Router } from "express";
import { BusinessController } from "../controllers/business.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createBusinessSchema,
  updateBusinessSchema,
  businessQuerySchema,
} from "../utils/validators";

/**
 * Business Routes
 *
 * GET    /api/businesses      - List businesses with filters
 * GET    /api/businesses/:id  - Get a single business
 * POST   /api/businesses      - Create a new business (authenticated)
 * PUT    /api/businesses/:id  - Update a business (owner or admin)
 */
const router = Router();

/**
 * @route   GET /api/businesses
 * @desc    List all businesses with optional filters and pagination
 * @access  Public
 */
router.get("/", validate(businessQuerySchema, "query"), BusinessController.list);

/**
 * @route   GET /api/businesses/:id
 * @desc    Get a single business by ID or UUID
 * @access  Public
 */
router.get("/:id", BusinessController.getById);

/**
 * @route   POST /api/businesses
 * @desc    Create a new business profile
 * @access  Private (business_user, admin, or normal_user who will be upgraded)
 */
router.post(
  "/",
  authenticate,
  authorize(["normal_user", "business_user", "admin"]),
  validate(createBusinessSchema),
  BusinessController.create
);

/**
 * @route   PUT /api/businesses/:id
 * @desc    Update an existing business profile
 * @access  Private (business owner or admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize(["business_user", "admin"]),
  validate(updateBusinessSchema),
  BusinessController.update
);

export default router;
