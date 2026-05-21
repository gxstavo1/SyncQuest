import { Router } from "express";
import { HealthController } from "../controllers/HealthController";

const healthRoutes = Router();

healthRoutes.get("/health", HealthController.check);

export default healthRoutes;