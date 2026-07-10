import { Router } from "express";
import * as membershipsController from "./memberships.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", membershipsController.create);
router.get("/", authenticate, membershipsController.list);

export default router;
