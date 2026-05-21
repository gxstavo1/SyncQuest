import { prisma } from "../database/prisma";
import { throwError } from "../middlewares/error.middleware";

export class ListService {
  private static async verifyListAccess(listId: string, userId: string) {
    const list = await prisma.list.findFirst({
      where: { id: listId },
      include: { board: { include: { workspace: true } } },
    });

    if (!list) throwError(404, "Lista não encontrada");
    if (list!.board.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    return list!;
  }

  static async listByBoard(boardId: string, userId: string) {
    const board = await prisma.board.findFirst({
      where: { id: boardId },
      include: { workspace: true },
    });

    if (!board) throwError(404, "Board não encontrado");
    if (board!.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    return prisma.list.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
      include: { _count: { select: { tasks: true } } },
    });
  }

  static async create(title: string, boardId: string, userId: string) {
    const board = await prisma.board.findFirst({
      where: { id: boardId },
      include: { workspace: true },
    });

    if (!board) throwError(404, "Board não encontrado");
    if (board!.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
    });

    const position = lastList ? lastList.position + 1 : 0;

    return prisma.list.create({ data: { title, boardId, position } });
  }

  static async update(id: string, title: string, userId: string) {
    await ListService.verifyListAccess(id, userId);
    return prisma.list.update({ where: { id }, data: { title } });
  }

  static async delete(id: string, userId: string) {
    await ListService.verifyListAccess(id, userId);
    await prisma.list.delete({ where: { id } });
  }
}