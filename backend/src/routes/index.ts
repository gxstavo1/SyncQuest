import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import workspaceRoutes from "./workspace.routes";
import boardRoutes from "./board.routes";
import listRoutes from "./list.routes";
import taskRoutes from "./task.routes";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use(workspaceRoutes);
routes.use(boardRoutes);
routes.use(listRoutes);
routes.use(taskRoutes);

export default routes;