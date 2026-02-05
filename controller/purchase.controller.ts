import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib";

const buySchema = z.object({
  courseId: z.string(),
});

const controller = {
  buy: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }
      const validationResult = buySchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      const { courseId } = validationResult.data;

      const purchase = await prisma.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });

      return res.status(201).json({
        success: true,
        data: purchase,
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
