import express, { Router } from "express";
import purchaseController from "../../controller/purchase.controller";
import { instructorMiddleware } from "../../middleware/instructorMiddleware";

const router: Router = express.Router();

router.post("/", instructorMiddleware, purchaseController.buy);

export default router;
