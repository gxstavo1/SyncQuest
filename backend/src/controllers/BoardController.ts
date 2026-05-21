import { Request, Response, NextFunction } from "express";
import { BoardService } from "../services/BoardService";

export class BoardController {
  static async listByWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const boards = await BoardService.listByWorkspace(
        req.params.workspaceId,
        req.userId
      );
      return res.json(boards);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const board = await BoardService.getById(req.params.id, req.userId);
      return res.json(board);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, workspaceId } = req.body;

      if (!title || !workspaceId) {
        return res.status(400).json({ message: "Título e workspaceId são obrigatórios" });
      }

      const board = await BoardService.create(title, workspaceId, req.userId);
      return res.status(201).json(board);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Título é obrigatório" });
      }

      const board = await BoardService.update(req.params.id, title, req.userId);
      return res.json(board);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await BoardService.delete(req.params.id, req.userId);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}