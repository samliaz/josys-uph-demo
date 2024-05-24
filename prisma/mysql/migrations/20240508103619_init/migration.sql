-- CreateTable
CREATE TABLE `departments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `organization_id` BIGINT NULL,
    `name` VARCHAR(255) NULL,
    `department_code` VARCHAR(255) NULL,
    `external_department_id` VARCHAR(255) NULL,
    `data_source` INTEGER NULL,
    `display_order` INTEGER NULL DEFAULT 1,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    `parent_id` BIGINT NULL,
    `full_name` TEXT NULL,

    INDEX `index_departments_on_external_department_id`(`external_department_id`),
    INDEX `index_departments_on_organization_id`(`organization_id`),
    INDEX `index_departments_on_parent_id`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
