import express, { Router } from "express";
import courseController from "../../controller/course.controller";
import { instructorMiddleware } from "../../middleware/instructorMiddleware";

const router: Router = express.Router();

router.post("/", instructorMiddleware, courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseDetails);
router.get("/:courseId/lessons", courseController.getCourseLesson);
router.delete("/:courseId", courseController.deleteCourse);

export default router;
