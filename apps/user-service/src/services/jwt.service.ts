import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload, RefreshTokenPayload } from "../types";

/**
 * JWT Service
 * Handles generation and verification of access and refresh tokens.
 * Implements a dual-token strategy for secure authentication.
 */
export class JwtService {
  /**
   * Generate an access token for a user.
   * Access tokens are short-lived and used for API authentication.
   *
   * @param payload - User data to encode in the token
   * @returns Signed JWT access token string
   */
  static generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRY as any,
      issuer: "localvibe",
      audience: "localvibe-client",
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
  }

  /**
   * Generate a refresh token for a user.
   * Refresh tokens are long-lived and used to obtain new access tokens.
   *
   * @param payload - Minimal user data to encode in the token
   * @returns Signed JWT refresh token string
   */
  static generateRefreshToken(payload: RefreshTokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRY as any,
      issuer: "localvibe",
      audience: "localvibe-client",
    };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
  }

  /**
   * Generate both access and refresh tokens for a user.
   * Convenience method used during login and token refresh.
   *
   * @param user - User data for token generation
   * @returns Object containing both access and refresh tokens
   */
  static generateTokenPair(user: JwtPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateAccessToken({
      userId: user.userId,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.generateRefreshToken({
      userId: user.userId,
      uuid: user.uuid,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode an access token.
   *
   * @param token - JWT access token to verify
   * @returns Decoded JWT payload
   * @throws Error if token is invalid or expired
   */
  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: "localvibe",
      audience: "localvibe-client",
    }) as JwtPayload;
  }

  /**
   * Verify and decode a refresh token.
   *
   * @param token - JWT refresh token to verify
   * @returns Decoded refresh token payload
   * @throws Error if token is invalid or expired
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: "localvibe",
      audience: "localvibe-client",
    }) as RefreshTokenPayload;
  }
}
