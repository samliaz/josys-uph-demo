/*
  Warnings:

  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user_profiles`;

-- CreateTable
CREATE TABLE `employee_external_profiles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `employee_id` BIGINT NOT NULL,
    `employee_ledger_integration_id` BIGINT NOT NULL,
    `external_id` VARCHAR(191) NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `employee_code` VARCHAR(255) NULL,
    `personal_email` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `employment_status` INTEGER NULL,
    `employment_type` INTEGER NULL,
    `organization_id` BIGINT NOT NULL,
    `joined_on` DATETIME(6) NULL,
    `resigned_on` DATETIME(6) NULL,
    `username` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `status` INTEGER NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,

    INDEX `index_employee_external_profiles_on_employee_code`(`employee_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
