import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../utils/validators";

/**
 * User Routes
 *
 * GET  /api/users/me  - Get current user profile
 * PUT  /api/users/me  - Update current user profile
 */
const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users/me
 * @desc    Get the authenticated user's profile
 * @access  Private (any authenticated user)
 */
router.get("/me", UserController.getProfile);

/**
 * @route   PUT /api/users/me
 * @desc    Update the authenticated user's profile
 * @access  Private (any authenticated user)
 */
router.put("/me", validate(updateProfileSchema), UserController.updateProfile);

export default router;
