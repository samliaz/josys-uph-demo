/*
  Warnings:

  - You are about to drop the column `departments` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserProfile` DROP COLUMN `departments`,
    ADD COLUMN `user_departments` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `departments` MODIFY `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);
