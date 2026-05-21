import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "../services/WorkspaceService";

export class WorkspaceController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaces = await WorkspaceService.list(req.userId);
      return res.json(workspaces);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = await WorkspaceService.getById(req.params.id, req.userId);
      return res.json(workspace);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Nome é obrigatório" });
      }

      const workspace = await WorkspaceService.create(name, req.userId);
      return res.status(201).json(workspace);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Nome é obrigatório" });
      }

      const workspace = await WorkspaceService.update(req.params.id, name, req.userId);
      return res.json(workspace);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await WorkspaceService.delete(req.params.id, req.userId);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}