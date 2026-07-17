import { Router } from "express";
import * as auditLogsController from "./audit-logs.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, auditLogsController.list);

export default router;
