import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { users } from "../db/schema";
import { JwtService } from "../services/jwt.service";
import { PasswordService } from "../services/password.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/helpers";
import { AppError } from "../utils/AppError";
import {
  RegisterRequestBody,
  LoginRequestBody,
  RefreshTokenRequestBody,
  AuthResponse,
} from "../types";

/**
 * Auth Controller
 * Handles user registration, login, and token refresh operations.
 */
export class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user account.
   *
   * Creates a new user with hashed password, generates JWT tokens,
   * and returns the user profile with authentication tokens.
   */
  static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstName, lastName, phone, role } = req.body as RegisterRequestBody;

    // Check if user already exists with this email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      throw AppError.conflict("An account with this email address already exists.");
    }

    // Check if phone number is already registered (if provided)
    if (phone) {
      const existingPhone = await db.query.users.findFirst({
        where: eq(users.phone, phone),
      });

      if (existingPhone) {
        throw AppError.conflict("An account with this phone number already exists.");
      }
    }

    // Hash the password
    const hashedPassword = await PasswordService.hash(password);

    // Generate a unique UUID for the user
    const userUuid = uuidv4();

    // Insert the new user into the database and return the created row
    const [newUser] = await db.insert(users).values({
      uuid: userUuid,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName?.trim() || null,
      phone: phone || null,
      role: role || "normal_user",
    }).returning();

    if (!newUser) {
      throw AppError.internal("Failed to create user account.");
    }

    // Generate JWT token pair
    const tokens = JwtService.generateTokenPair({
      userId: newUser.id,
      uuid: newUser.uuid,
      email: newUser.email,
      role: newUser.role,
    });

    // Store the refresh token in the database
    await db
      .update(users)
      .set({ refreshToken: tokens.refreshToken })
      .where(eq(users.id, newUser.id));

    // Build the response
    const authResponse: AuthResponse = {
      user: {
        id: newUser.id,
        uuid: newUser.uuid,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        phone: newUser.phone,
        avatar: newUser.avatar,
      },
      tokens,
    };

    sendSuccess(res, 201, "User registered successfully.", authResponse);
  });

  /**
   * POST /api/auth/login
   * Authenticate a user and return JWT tokens.
   *
   * Validates credentials, updates last login timestamp,
   * and returns the user profile with fresh authentication tokens.
   */
  static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginRequestBody;

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      throw AppError.unauthorized("Invalid email or password.");
    }

    // Check if the account is active
    if (!user.isActive) {
      throw AppError.forbidden(
        "Your account has been deactivated. Please contact support."
      );
    }

    // Verify the password
    const isPasswordValid = await PasswordService.compare(password, user.password);

    if (!isPasswordValid) {
      throw AppError.unauthorized("Invalid email or password.");
    }

    // Generate JWT token pair
    const tokens = JwtService.generateTokenPair({
      userId: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
    });

    // Update refresh token and last login timestamp
    await db
      .update(users)
      .set({
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Build the response
    const authResponse: AuthResponse = {
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      tokens,
    };

    sendSuccess(res, 200, "Login successful.", authResponse);
  });

  /**
   * POST /api/auth/refresh-token
   * Refresh the access token using a valid refresh token.
   *
   * Validates the refresh token, generates a new token pair,
   * and invalidates the old refresh token (rotation).
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as RefreshTokenRequestBody;

    // Verify the refresh token
    let decoded;
    try {
      decoded = JwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized("Invalid or expired refresh token. Please log in again.");
    }

    // Find the user and verify the stored refresh token matches
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
    });

    if (!user) {
      throw AppError.unauthorized("User not found. Please log in again.");
    }

    if (!user.isActive) {
      throw AppError.forbidden("Your account has been deactivated.");
    }

    if (user.refreshToken !== refreshToken) {
      // Potential token reuse detected — invalidate all tokens for security
      await db
        .update(users)
        .set({ refreshToken: null })
        .where(eq(users.id, user.id));

      throw AppError.unauthorized(
        "Refresh token has been revoked. Please log in again."
      );
    }

    // Generate new token pair (token rotation)
    const tokens = JwtService.generateTokenPair({
      userId: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
    });

    // Store the new refresh token
    await db
      .update(users)
      .set({ refreshToken: tokens.refreshToken })
      .where(eq(users.id, user.id));

    sendSuccess(res, 200, "Token refreshed successfully.", { tokens });
  });
}
