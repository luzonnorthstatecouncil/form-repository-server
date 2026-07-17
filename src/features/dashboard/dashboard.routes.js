import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", authenticate, dashboardController.stats);

export default router;
