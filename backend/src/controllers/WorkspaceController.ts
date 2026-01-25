import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export class WorkspaceController {
  //lista todos workspace do usuario
  static async list(req: Request, res: Response) {
    const workspace = await prisma.workspace.findMany({
      where: {
        ownerId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(workspace);
  }

  //lista workspace com id especifico
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

  //cria workspace
  static async create(req: Request, res: Response) {
    console.log("USER ID NO CREATE:", req.userId);

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        owner: {
          connect: {
            id: req.userId,
          },
        },
      },
    });

    return res.status(201).json(workspace);
  }

  //deleta workspace
  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id inválido" });
    }

    if (!id) {
      return res.status(400).json({ message: "Id não informado" });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace não encontrado" });
    }

    await prisma.workspace.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
