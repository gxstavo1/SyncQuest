import { prisma } from "../database/prisma";
import { throwError } from "../middlewares/error.middleware";

export class WorkspaceService {
  static async list(userId: string) {
    return prisma.workspace.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { boards: true } } },
    });
  }

  static async getById(id: string, userId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: { id, ownerId: userId },
      include: {
        boards: {
          orderBy: { position: "asc" },
          include: { _count: { select: { lists: true } } },
        },
      },
    });

    if (!workspace) throwError(404, "Workspace não encontrado");
    return workspace;
  }

  static async create(name: string, userId: string) {
    return prisma.workspace.create({
      data: { name, owner: { connect: { id: userId } } },
    });
  }

  static async update(id: string, name: string, userId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: { id, ownerId: userId },
    });

    if (!workspace) throwError(404, "Workspace não encontrado");

    return prisma.workspace.update({ where: { id }, data: { name } });
  }

  static async delete(id: string, userId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: { id, ownerId: userId },
    });

    if (!workspace) throwError(404, "Workspace não encontrado");

    await prisma.workspace.delete({ where: { id } });
  }
}