import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import businessRoutes from "./business.routes";
import categoryRoutes from "./category.routes";
import adminRoutes from "./admin.routes";
import approvedRoutes from "./approved.routes";

/**
 * API Router
 * Aggregates all route modules under a single router.
 * Each module is mounted at its respective path prefix.
 */
const router = Router();

/**
 * Health check endpoint.
 * Returns the API status and current timestamp.
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LocalVibe API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Mount route modules
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/businesses", businessRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);
router.use("/approved", approvedRoutes);

export default router;
