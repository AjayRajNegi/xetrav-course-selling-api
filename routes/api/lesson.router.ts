import express, { Router } from "express";
import lessonController from "../../controller/lesson.controller";

const router: Router = express.Router();
router.post("/", lessonController.createLesson);

export default router;
