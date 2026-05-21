import { Request, Response } from "express";

export class HealthController {
  static check(req: Request, res: Response) {
    return res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
}