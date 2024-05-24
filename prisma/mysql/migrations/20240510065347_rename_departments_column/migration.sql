/*
  Warnings:

  - You are about to drop the column `user_departments` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserProfile` DROP COLUMN `user_departments`,
    ADD COLUMN `departments` VARCHAR(255) NULL;
