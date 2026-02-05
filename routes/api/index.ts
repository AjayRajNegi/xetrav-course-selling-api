import express, { Router } from "express";
import authRoutes from "./auth.router";
import courseRoutes from "./courses.router";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);

export default router;
