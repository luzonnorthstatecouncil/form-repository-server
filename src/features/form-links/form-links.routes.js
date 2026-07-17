import { Router } from "express";
import * as formLinksController from "./form-links.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", formLinksController.list);
router.post("/", authenticate, formLinksController.create);
router.put("/:id", authenticate, formLinksController.update);
router.delete("/:id", authenticate, formLinksController.remove);

export default router;
