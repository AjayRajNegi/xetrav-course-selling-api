import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib";

const lessonSchama = z.object({
  title: z.string().min(6),
  content: z.string().min(10),
  courseId: z.string(),
});
const controller = {
  createLesson: async (req: Request, res: Response) => {
    try {
      const validationResult = lessonSchama.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      const { title, content, courseId } = validationResult.data;

      const lesson = await prisma.lesson.create({
        data: {
          courseId: courseId,
          title,
          content,
        },
        select: {
          id: true,
          title: true,
          content: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: lesson,
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
  getLesson: async (req: Request, res: Response) => {},
};
export default controller;
