import { Router } from "express";
import { WorkspaceController } from "../controllers/WorkspaceController";
import { authMiddleware } from "../middlewares/auth.middleware";

const workspaceRoutes = Router();

workspaceRoutes.post("/workspaces", authMiddleware, WorkspaceController.create);

workspaceRoutes.get("/workspaces/:id", authMiddleware, WorkspaceController.getById);

export default workspaceRoutes;
