import { Router } from 'express';
import helthRoutes from './health.routes';
import authRoutes from './auth.routes';
import workspaceRoutes from './workspace.routes';

const routes = Router();

routes.use(helthRoutes);
routes.use(authRoutes);
routes.use(workspaceRoutes);

export default routes;