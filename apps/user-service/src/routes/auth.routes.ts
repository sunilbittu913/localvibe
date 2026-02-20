import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "../utils/validators";

/**
 * Authentication Routes
 *
 * POST /api/auth/register     - Register a new user
 * POST /api/auth/login        - Login with email and password
 * POST /api/auth/refresh-token - Refresh JWT access token
 */
const router = Router();

// Apply stricter rate limiting to all auth routes
router.use(authRateLimiter);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post("/register", validate(registerSchema), AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT tokens
 * @access  Public
 */
router.post("/login", validate(loginSchema), AuthController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh the access token using a valid refresh token
 * @access  Public
 */
router.post("/refresh-token", validate(refreshTokenSchema), AuthController.refreshToken);

export default router;
