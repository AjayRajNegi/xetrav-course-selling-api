import express, { Router } from "express";
import authRoutes from "./auth.router";
import courseRoutes from "./courses.router";
import lessonRoutes from "./lesson.router";
import purchaseRoutes from "./purchases.router";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/purchases", purchaseRoutes);

export default router;
