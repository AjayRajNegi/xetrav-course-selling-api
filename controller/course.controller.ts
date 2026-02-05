import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib";

const courseSchema = z.object({
  title: z.string().min(6, "Title should be descriptive."),
  description: z.string().min(10, "Thoroughly describe your course."),
  price: z.number(),
});

type courseInput = z.infer<typeof courseSchema>;
const controller = {
  createCourse: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "UNAUTHORIZED",
        });
      }

      const validationResult = courseSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      const { title, description, price } = validationResult.data;

      const course = await prisma.course.create({
        data: {
          instructorId: req.user.userId,
          title,
          description,
          price,
        },
        select: {
          id: true,
          instructorId: true,
          title: true,
          description: true,
          price: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: course,
        error: null,
      });
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        return res.status(400).json({
          success: false,
          data: null,
          error: "TITLE_ALREADY_TAKEN",
        });
      }
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  getAllCourses: async (req: Request, res: Response) => {
    try {
      const courses = await prisma.course.findMany();

      if (!courses || courses.length === 0) {
        return res.status(201).json({
          success: true,
          data: "No courses available.",
          error: null,
        });
      }
      return res.status(200).json({
        success: true,
        data: courses,
        error: null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  getCourseDetails: async (req: Request, res: Response) => {
    try {
      const courseId = req.params.id as string;

      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
        },
        select: {
          title: true,
          description: true,
          price: true,
          lesson: true,
        },
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Course not found",
        });
      }

      return res.status(201).json({
        success: true,
        data: course,
        error: null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  getCourseLesson: async (req: Request, res: Response) => {
    try {
      const courseId = req.params.courseId as string;

      const lesson = await prisma.course.findFirst({
        where: {
          id: courseId,
        },
        select: {
          lesson: {
            select: {
              title: true,
              content: true,
            },
          },
        },
      });

      if (!lesson) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      return res.status(200).json({
        success: true,
        data: lesson,
        error: null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  deleteCourse: async (req: Request, res: Response) => {
    try {
      const courseId = req.params.courseId as string;

      const course = await prisma.course.delete({
        where: {
          id: courseId,
        },
      });
      return res.status(200).json({
        success: true,
        data: course,
        error: null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
export default controller;
