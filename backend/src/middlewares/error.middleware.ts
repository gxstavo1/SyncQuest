import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError {
  status: number;
  message: string;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message =
    status === 500 && env.nodeEnv === "production"
      ? "Erro interno do servidor"
      : err.message || "Erro interno do servidor";

  return res.status(status).json({ message });
}

export function throwError(status: number, message: string): never {
  throw { status, message } as AppError;
}