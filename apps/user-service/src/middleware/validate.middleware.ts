import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/AppError";

/**
 * Request Validation Middleware Factory
 * Creates middleware that validates request body, query, or params against a Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate (body, query, or params)
 * @returns Express middleware function
 *
 * @example
 * router.post('/register', validate(registerSchema), authController.register);
 * router.get('/businesses', validate(businessQuerySchema, 'query'), businessController.list);
 */
export const validate = (
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace the source data with the parsed (and potentially transformed) data
      (req as any)[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(
          AppError.badRequest("Validation failed. Please check your input.", validationErrors)
        );
      } else {
        next(error);
      }
    }
  };
};
