-- CreateTable
CREATE TABLE `TransactionSetting` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `taxEnabled` BOOLEAN NOT NULL DEFAULT false,
    `taxRate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `serviceChargeEnabled` BOOLEAN NOT NULL DEFAULT false,
    `serviceChargeRate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TransactionSetting_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TransactionSetting` ADD CONSTRAINT `TransactionSetting_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
