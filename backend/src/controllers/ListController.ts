import { Request, Response, NextFunction } from "express";
import { ListService } from "../services/ListService";

export class ListController {
  static async listByBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const lists = await ListService.listByBoard(req.params.boardId, req.userId);
      return res.json(lists);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, boardId } = req.body;

      if (!title || !boardId) {
        return res.status(400).json({ message: "Título e boardId são obrigatórios" });
      }

      const list = await ListService.create(title, boardId, req.userId);
      return res.status(201).json(list);
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

      const list = await ListService.update(req.params.id, title, req.userId);
      return res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ListService.delete(req.params.id, req.userId);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}