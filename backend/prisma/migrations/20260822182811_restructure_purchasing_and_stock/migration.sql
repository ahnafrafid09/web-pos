/*
  Warnings:

  - You are about to drop the column `kode` on the `paymentmethod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,purchaseNumber]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `RawMaterial` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseNumber` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseType` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `Purchase_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_tenantId_fkey`;

-- DropIndex
DROP INDEX `PaymentMethod_kode_key` ON `paymentmethod`;

-- DropIndex
DROP INDEX `User_email_idx` ON `user`;

-- AlterTable
ALTER TABLE `paymentmethod` DROP COLUMN `kode`,
    ADD COLUMN `code` VARCHAR(50) NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `usageType` ENUM('PURCHASE', 'TRANSACTION', 'BOTH') NOT NULL DEFAULT 'BOTH';

-- AlterTable
ALTER TABLE `purchase` ADD COLUMN `discount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `discountType` ENUM('PERCENTAGE', 'FIXED') NULL,
    ADD COLUMN `discountValue` DECIMAL(15, 2) NULL,
    ADD COLUMN `paymentStatus` ENUM('UNPAID', 'PARTIAL', 'PAID') NOT NULL DEFAULT 'UNPAID',
    ADD COLUMN `purchaseNumber` VARCHAR(50) NOT NULL,
    ADD COLUMN `purchaseType` ENUM('PO', 'DIRECT') NOT NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'ORDERED', 'PARTIAL', 'RECEIVED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN `subtotal` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `supplierId` VARCHAR(191) NOT NULL,
    ADD COLUMN `tax` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `taxType` ENUM('PERCENTAGE', 'FIXED') NULL,
    ADD COLUMN `taxValue` DECIMAL(15, 2) NULL;

-- AlterTable
ALTER TABLE `purchaseitem` ADD COLUMN `receivedBaseQuantity` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    MODIFY `subtotal` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `stockmovement` MODIFY `note` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `address` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Supplier_tenantId_idx`(`tenantId`),
    INDEX `Supplier_status_idx`(`status`),
    UNIQUE INDEX `Supplier_tenantId_code_key`(`tenantId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseReceiving` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `receivingNumber` VARCHAR(50) NOT NULL,
    `receivingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PurchaseReceiving_purchaseId_idx`(`purchaseId`),
    INDEX `PurchaseReceiving_receivingDate_idx`(`receivingDate`),
    UNIQUE INDEX `PurchaseReceiving_purchaseId_receivingNumber_key`(`purchaseId`, `receivingNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseReceivingItem` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseReceivingId` VARCHAR(191) NOT NULL,
    `purchaseItemId` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `baseQuantity` DECIMAL(15, 3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PurchaseReceivingItem_purchaseReceivingId_idx`(`purchaseReceivingId`),
    INDEX `PurchaseReceivingItem_purchaseItemId_idx`(`purchaseItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasePayment` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `paymentMethodId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PurchasePayment_purchaseId_idx`(`purchaseId`),
    INDEX `PurchasePayment_paymentMethodId_idx`(`paymentMethodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Category_status_idx` ON `Category`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `PaymentMethod_code_key` ON `PaymentMethod`(`code`);

-- CreateIndex
CREATE INDEX `PaymentMethod_usageType_idx` ON `PaymentMethod`(`usageType`);

-- CreateIndex
CREATE INDEX `PaymentMethod_status_idx` ON `PaymentMethod`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_tenantId_name_key` ON `Product`(`tenantId`, `name`);

-- CreateIndex
CREATE INDEX `Purchase_supplierId_idx` ON `Purchase`(`supplierId`);

-- CreateIndex
CREATE INDEX `Purchase_status_idx` ON `Purchase`(`status`);

-- CreateIndex
CREATE INDEX `Purchase_purchaseType_idx` ON `Purchase`(`purchaseType`);

-- CreateIndex
CREATE INDEX `Purchase_paymentStatus_idx` ON `Purchase`(`paymentStatus`);

-- CreateIndex
CREATE UNIQUE INDEX `Purchase_tenantId_purchaseNumber_key` ON `Purchase`(`tenantId`, `purchaseNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `RawMaterial_tenantId_name_key` ON `RawMaterial`(`tenantId`, `name`);

-- CreateIndex
CREATE INDEX `StockMovement_referenceId_idx` ON `StockMovement`(`referenceId`);

-- CreateIndex
CREATE INDEX `User_status_idx` ON `User`(`status`);

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiving` ADD CONSTRAINT `PurchaseReceiving_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceivingItem` ADD CONSTRAINT `PurchaseReceivingItem_purchaseReceivingId_fkey` FOREIGN KEY (`purchaseReceivingId`) REFERENCES `PurchaseReceiving`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceivingItem` ADD CONSTRAINT `PurchaseReceivingItem_purchaseItemId_fkey` FOREIGN KEY (`purchaseItemId`) REFERENCES `PurchaseItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `PaymentMethod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `purchaseitem` RENAME INDEX `PurchaseItem_unitId_fkey` TO `PurchaseItem_unitId_idx`;

-- RenameIndex
ALTER TABLE `rawmaterial` RENAME INDEX `RawMaterial_unitId_fkey` TO `RawMaterial_unitId_idx`;
