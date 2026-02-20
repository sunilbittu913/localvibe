import bcrypt from "bcrypt";

/**
 * Password Service
 * Handles secure password hashing and comparison using bcrypt.
 * Uses a salt round of 12 for a good balance of security and performance.
 */
export class PasswordService {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash a plain text password using bcrypt.
   *
   * @param password - Plain text password to hash
   * @returns Hashed password string
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password.
   *
   * @param password - Plain text password to compare
   * @param hashedPassword - Hashed password from the database
   * @returns True if the passwords match
   */
  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
