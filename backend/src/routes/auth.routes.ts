import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/auth/register", AuthController.register);
authRoutes.post("/auth/login", AuthController.login);
authRoutes.get("/auth/me", authMiddleware, AuthController.me);

export default authRoutes;