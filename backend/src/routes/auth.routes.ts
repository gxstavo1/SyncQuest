import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRoutes = Router();

authRoutes.post('/auth/register', AuthController.register);
authRoutes.post('/auth/login', AuthController.login);

export default authRoutes;