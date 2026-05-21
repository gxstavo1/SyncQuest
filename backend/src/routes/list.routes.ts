import { Router } from "express";
import { ListController } from "../controllers/ListController";
import { authMiddleware } from "../middlewares/auth.middleware";

const listRoutes = Router();

listRoutes.get("/boards/:boardId/lists", authMiddleware, ListController.listByBoard);
listRoutes.post("/lists", authMiddleware, ListController.create);
listRoutes.put("/lists/:id", authMiddleware, ListController.update);
listRoutes.delete("/lists/:id", authMiddleware, ListController.delete);

export default listRoutes;