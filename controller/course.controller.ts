import type { Request, Response } from "express";

const controller = {
  createCourse: async (req: Request, res: Response) => {
    return res.json({
      data: "Hello",
    });
  },
};
export default controller;
