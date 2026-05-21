import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/TaskService";

export class TaskController {
  static async listByList(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await TaskService.listByList(req.params.listId, req.userId);
      return res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.getById(req.params.id, req.userId);
      return res.json(task);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, priority, dueDate, assigneeId, listId } = req.body;

      if (!title || !listId) {
        return res.status(400).json({ message: "Título e listId são obrigatórios" });
      }

      const task = await TaskService.create(
        { title, description, priority, dueDate, assigneeId, listId },
        req.userId
      );
      return res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, status, priority, dueDate, assigneeId } = req.body;

      const task = await TaskService.update(
        req.params.id,
        { title, description, status, priority, dueDate, assigneeId },
        req.userId
      );
      return res.json(task);
    } catch (err) {
      next(err);
    }
  }

  static async move(req: Request, res: Response, next: NextFunction) {
    try {
      const { listId, position } = req.body;

      if (!listId || position === undefined) {
        return res.status(400).json({ message: "listId e position são obrigatórios" });
      }

      const task = await TaskService.move(
        req.params.id,
        listId,
        Number(position),
        req.userId
      );
      return res.json(task);
    } catch (err) {
      next(err);
    }
  }

  static async archive(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.archive(req.params.id, req.userId);
      return res.json(task);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await TaskService.delete(req.params.id, req.userId);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}