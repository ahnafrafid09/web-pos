/*
  Warnings:

  - You are about to drop the column `unitCost` on the `purchaseitem` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `rawmaterial` table. All the data in the column will be lost.
  - Added the required column `baseQuantity` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `RawMaterial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchaseitem` DROP COLUMN `unitCost`,
    ADD COLUMN `baseQuantity` DECIMAL(15, 3) NOT NULL,
    ADD COLUMN `unitId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `rawmaterial` DROP COLUMN `unit`,
    ADD COLUMN `unitId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Unit` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Unit_name_key`(`name`),
    UNIQUE INDEX `Unit_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnitConversion` (
    `id` VARCHAR(191) NOT NULL,
    `fromUnitId` VARCHAR(191) NOT NULL,
    `toUnitId` VARCHAR(191) NOT NULL,
    `factor` DECIMAL(15, 6) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UnitConversion_fromUnitId_toUnitId_key`(`fromUnitId`, `toUnitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RawMaterial` ADD CONSTRAINT `RawMaterial_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitConversion` ADD CONSTRAINT `UnitConversion_fromUnitId_fkey` FOREIGN KEY (`fromUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitConversion` ADD CONSTRAINT `UnitConversion_toUnitId_fkey` FOREIGN KEY (`toUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
