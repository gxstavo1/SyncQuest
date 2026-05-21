/*
  Warnings:

  - You are about to drop the column `boardId` on the `task` table. All the data in the column will be lost.
  - Added the required column `listId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `board` DROP FOREIGN KEY `Board_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `tasktag` DROP FOREIGN KEY `TaskTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `tasktag` DROP FOREIGN KEY `TaskTag_taskId_fkey`;

-- AlterTable
ALTER TABLE `board` ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `boardId`,
    ADD COLUMN `assigneeId` VARCHAR(191) NULL,
    ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `listId` VARCHAR(191) NOT NULL,
    ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `priority` VARCHAR(191) NOT NULL DEFAULT 'medium',
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'open';

-- CreateTable
CREATE TABLE `List` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `boardId` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `List` ADD CONSTRAINT `List_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskTag` ADD CONSTRAINT `TaskTag_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskTag` ADD CONSTRAINT `TaskTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
