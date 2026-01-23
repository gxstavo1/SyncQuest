import { Router } from 'express';
import helthRoutes from './health.routes';
import authRoutes from './auth.routes';

export const routes = Router();

routes.use(helthRoutes);
routes.use(authRoutes);