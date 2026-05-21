import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middlewares/auth.middleware";

const taskRoutes = Router();

taskRoutes.get("/lists/:listId/tasks", authMiddleware, TaskController.listByList);
taskRoutes.get("/tasks/:id", authMiddleware, TaskController.getById);
taskRoutes.post("/tasks", authMiddleware, TaskController.create);
taskRoutes.put("/tasks/:id", authMiddleware, TaskController.update);
taskRoutes.patch("/tasks/:id/move", authMiddleware, TaskController.move);
taskRoutes.patch("/tasks/:id/archive", authMiddleware, TaskController.archive);
taskRoutes.delete("/tasks/:id", authMiddleware, TaskController.delete);

export default taskRoutes;