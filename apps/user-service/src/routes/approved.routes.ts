import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";

/**
 * Approved Content Routes
 *
 * Public endpoints that return only approved content.
 * These are designed for the mobile app to consume.
 *
 * GET /api/approved/businesses  - List approved businesses
 * GET /api/approved/jobs        - List approved jobs
 * GET /api/approved/offers      - List approved offers
 */
const router = Router();

router.get("/businesses", AdminController.getApprovedBusinesses);
router.get("/jobs", AdminController.getApprovedJobs);
router.get("/offers", AdminController.getApprovedOffers);

export default router;
