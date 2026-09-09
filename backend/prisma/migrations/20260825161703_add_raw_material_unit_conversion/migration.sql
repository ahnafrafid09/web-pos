-- CreateTable
CREATE TABLE `RawMaterialUnitConversion` (
    `id` VARCHAR(191) NOT NULL,
    `rawMaterialId` VARCHAR(191) NOT NULL,
    `unitId` VARCHAR(191) NOT NULL,
    `factor` DECIMAL(15, 6) NOT NULL,

    UNIQUE INDEX `RawMaterialUnitConversion_rawMaterialId_unitId_key`(`rawMaterialId`, `unitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RawMaterialUnitConversion` ADD CONSTRAINT `RawMaterialUnitConversion_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `RawMaterial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RawMaterialUnitConversion` ADD CONSTRAINT `RawMaterialUnitConversion_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
