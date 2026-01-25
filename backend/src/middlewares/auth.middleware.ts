import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader); // ⬅️ AQUI (ANTES DE QUALQUER COISA)

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    if (!decoded.sub) {
      return res.status(401).json({ message: "Token sem subject" });
    }

    req.userId = decoded.sub as string;

    console.log("USER ID SETADO NO MIDDLEWARE:", req.userId);

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}
