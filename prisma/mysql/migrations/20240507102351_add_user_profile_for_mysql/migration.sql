-- CreateTable
CREATE TABLE `UserProfile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `session_id` VARCHAR(255) NOT NULL,
    `page_number` BIGINT NULL,
    `organization_id` VARCHAR(255) NULL,
    `integration_id` VARCHAR(255) NULL,
    `external_id` VARCHAR(255) NULL,
    `employee_code` VARCHAR(255) NULL,
    `departments` VARCHAR(255) NULL,
    `employment_status` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `personal_email` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `telephone` BIGINT NULL,
    `title` VARCHAR(255) NULL,
    `joined_on` VARCHAR(255) NULL,
    `resigned_on` VARCHAR(255) NULL,
    `employment_type` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
