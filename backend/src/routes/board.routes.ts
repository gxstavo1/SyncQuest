import { Router } from "express";
import { BoardController } from "../controllers/BoardController";
import { authMiddleware } from "../middlewares/auth.middleware";

const boardRoutes = Router();

boardRoutes.get("/workspaces/:workspaceId/boards", authMiddleware, BoardController.listByWorkspace);
boardRoutes.get("/boards/:id", authMiddleware, BoardController.getById);
boardRoutes.post("/boards", authMiddleware, BoardController.create);
boardRoutes.put("/boards/:id", authMiddleware, BoardController.update);
boardRoutes.delete("/boards/:id", authMiddleware, BoardController.delete);

export default boardRoutes;