import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    if (!decoded.sub) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.userId = decoded.sub as string;

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}