import { Router } from "express";
import { WorkspaceController } from "../controllers/WorkspaceController";
import { authMiddleware } from "../middlewares/auth.middleware";

const workspaceRoutes = Router();

workspaceRoutes.get("/workspaces", authMiddleware, WorkspaceController.list);
workspaceRoutes.get("/workspaces/:id", authMiddleware, WorkspaceController.getById);
workspaceRoutes.post("/workspaces", authMiddleware, WorkspaceController.create);
workspaceRoutes.put("/workspaces/:id", authMiddleware, WorkspaceController.update);
workspaceRoutes.delete("/workspaces/:id", authMiddleware, WorkspaceController.delete);

export default workspaceRoutes;