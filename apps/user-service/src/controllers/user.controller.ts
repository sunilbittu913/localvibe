import { Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { users } from "../db/schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/helpers";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest, UpdateProfileRequestBody } from "../types";

/**
 * User Controller
 * Handles user profile retrieval and update operations.
 */
export class UserController {
  /**
   * GET /api/users/me
   * Get the currently authenticated user's profile.
   *
   * Returns the full user profile excluding sensitive fields
   * like password and refresh token.
   */
  static getProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.");
      }

      // Fetch the user from the database
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.user.userId),
        columns: {
          id: true,
          uuid: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw AppError.notFound("User profile not found.");
      }

      sendSuccess(res, 200, "User profile retrieved successfully.", { user });
    }
  );

  /**
   * PUT /api/users/me
   * Update the currently authenticated user's profile.
   *
   * Allows updating firstName, lastName, phone, and avatar.
   * Email and role changes are not permitted through this endpoint.
   */
  static updateProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.");
      }

      const { firstName, lastName, phone, avatar } = req.body as UpdateProfileRequestBody;

      // Check if phone number is already taken by another user
      if (phone) {
        const existingPhone = await db.query.users.findFirst({
          where: eq(users.phone, phone),
        });

        if (existingPhone && existingPhone.id !== req.user.userId) {
          throw AppError.conflict("This phone number is already registered to another account.");
        }
      }

      // Build the update object with only provided fields
      const updateData: Record<string, any> = {};
      if (firstName !== undefined) updateData.firstName = firstName.trim();
      if (lastName !== undefined) updateData.lastName = lastName.trim();
      if (phone !== undefined) updateData.phone = phone;
      if (avatar !== undefined) updateData.avatar = avatar;

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        throw AppError.badRequest("No fields provided for update.");
      }

      // Update the user profile
      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, req.user.userId));

      // Fetch the updated user profile
      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, req.user.userId),
        columns: {
          id: true,
          uuid: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      sendSuccess(res, 200, "Profile updated successfully.", { user: updatedUser });
    }
  );
}
