import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export class WorkspaceController {
  static async create(req: Request, res: Response) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        ownerId: req.userId, // vem do authmiddleware
      },
    });

    return res.status(201).json(workspace);
  }

  static async getById(req: Request, res: Response) {
    const paramId = req.params.id;

    if (!paramId || Array.isArray(paramId)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const id = paramId;

    const workspace = await prisma.workspace.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace não encontrado" });
    }

    return res.json(workspace);
  }
}
