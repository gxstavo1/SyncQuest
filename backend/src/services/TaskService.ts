import { prisma } from "../database/prisma";
import { throwError } from "../middlewares/error.middleware";

const VALID_PRIORITIES = ["low", "medium", "high", "urgent"];
const VALID_STATUSES = ["open", "in_progress", "in_review", "done"];

export class TaskService {
  private static async verifyTaskAccess(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId },
      include: {
        list: { include: { board: { include: { workspace: true } } } },
      },
    });

    if (!task) throwError(404, "Tarefa não encontrada");
    if (task!.list.board.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    return task!;
  }

  static async listByList(listId: string, userId: string) {
    const list = await prisma.list.findFirst({
      where: { id: listId },
      include: { board: { include: { workspace: true } } },
    });

    if (!list) throwError(404, "Lista não encontrada");
    if (list!.board.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    return prisma.task.findMany({
      where: { listId, isArchived: false },
      orderBy: { position: "asc" },
      include: {
        tags: { include: { tag: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async getById(id: string, userId: string) {
    const task = await TaskService.verifyTaskAccess(id, userId);
    return prisma.task.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        assignee: { select: { id: true, name: true, email: true } },
        list: { select: { id: true, title: true, boardId: true } },
      },
    });
  }

  static async create(
    data: {
      title: string;
      description?: string;
      priority?: string;
      dueDate?: string;
      assigneeId?: string;
      listId: string;
    },
    userId: string
  ) {
    const list = await prisma.list.findFirst({
      where: { id: data.listId },
      include: { board: { include: { workspace: true } } },
    });

    if (!list) throwError(404, "Lista não encontrada");
    if (list!.board.workspace.ownerId !== userId) throwError(403, "Sem permissão");

    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
      throwError(400, `Prioridade inválida. Use: ${VALID_PRIORITIES.join(", ")}`);
    }

    const lastTask = await prisma.task.findFirst({
      where: { listId: data.listId },
      orderBy: { position: "desc" },
    });

    const position = lastTask ? lastTask.position + 1 : 0;

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "medium",
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assigneeId: data.assigneeId,
        listId: data.listId,
        position,
        status: "open",
      },
      include: {
        tags: { include: { tag: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string | null;
      assigneeId?: string | null;
    },
    userId: string
  ) {
    await TaskService.verifyTaskAccess(id, userId);

    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
      throwError(400, `Prioridade inválida. Use: ${VALID_PRIORITIES.join(", ")}`);
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throwError(400, `Status inválido. Use: ${VALID_STATUSES.join(", ")}`);
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
      },
      include: {
        tags: { include: { tag: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async move(
    taskId: string,
    targetListId: string,
    newPosition: number,
    userId: string
  ) {
    const task = await TaskService.verifyTaskAccess(taskId, userId);

    // Verifica se a lista destino existe no mesmo board
    const targetList = await prisma.list.findFirst({
      where: { id: targetListId, boardId: task.list.boardId },
    });

    if (!targetList) throwError(400, "Lista destino inválida ou pertence a outro board");

    // Abre espaço na posição destino
    await prisma.task.updateMany({
      where: { listId: targetListId, position: { gte: newPosition } },
      data: { position: { increment: 1 } },
    });

    // Move a tarefa
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { listId: targetListId, position: newPosition },
      include: {
        tags: { include: { tag: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return updatedTask;
  }

  static async archive(id: string, userId: string) {
    await TaskService.verifyTaskAccess(id, userId);
    return prisma.task.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  static async delete(id: string, userId: string) {
    await TaskService.verifyTaskAccess(id, userId);
    await prisma.task.delete({ where: { id } });
  }
}