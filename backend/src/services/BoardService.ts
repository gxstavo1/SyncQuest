import { prisma } from "../database/prisma";
import { throwError } from "../middlewares/error.middleware";

export class BoardService {
  // Verifica se o usuário tem acesso ao workspace do board
  private static async verifyBoardAccess(boardId: string, userId: string) {
    const board = await prisma.board.findFirst({
      where: { id: boardId },
      include: { workspace: true },
    });

    if (!board) throwError(404, "Board não encontrado");
    if (board!.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    return board!;
  }

  static async listByWorkspace(workspaceId: string, userId: string) {
    // Verifica que o workspace pertence ao usuário
    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId: userId },
    });

    if (!workspace) throwError(404, "Workspace não encontrado");

    return prisma.board.findMany({
      where: { workspaceId },
      orderBy: { position: "asc" },
      include: { _count: { select: { lists: true } } },
    });
  }

  static async getById(id: string, userId: string) {
    const board = await prisma.board.findFirst({
      where: { id },
      include: {
        workspace: true,
        lists: {
          orderBy: { position: "asc" },
          include: {
            tasks: {
              where: { isArchived: false },
              orderBy: { position: "asc" },
              include: {
                tags: { include: { tag: true } },
                assignee: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!board) throwError(404, "Board não encontrado");
    if (board!.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    return board;
  }

  static async create(title: string, workspaceId: string, userId: string) {
    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId: userId },
    });

    if (!workspace) throwError(404, "Workspace não encontrado");

    // Calcula a próxima posição
    const lastBoard = await prisma.board.findFirst({
      where: { workspaceId },
      orderBy: { position: "desc" },
    });

    const position = lastBoard ? lastBoard.position + 1 : 0;

    return prisma.board.create({
      data: { title, workspaceId, position },
    });
  }

  static async update(id: string, title: string, userId: string) {
    await BoardService.verifyBoardAccess(id, userId);
    return prisma.board.update({ where: { id }, data: { title } });
  }

  static async delete(id: string, userId: string) {
    await BoardService.verifyBoardAccess(id, userId);
    await prisma.board.delete({ where: { id } });
  }
}