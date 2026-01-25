import { Router } from "express";
import { WorkspaceController } from "../controllers/WorkspaceController";
import { authMiddleware } from "../middlewares/auth.middleware";

const workspaceRoutes = Router();

//rota para listar todos workspaces
workspaceRoutes.get("/workspaces", authMiddleware, WorkspaceController.list);

//rota para listar workspace com id especifico
workspaceRoutes.get("/workspaces/:id", authMiddleware, WorkspaceController.getById);

//rota para criar workspace
workspaceRoutes.post("/workspaces", authMiddleware, WorkspaceController.create);

export default workspaceRoutes;
