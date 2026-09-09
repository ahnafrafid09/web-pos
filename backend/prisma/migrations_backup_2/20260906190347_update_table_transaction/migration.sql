-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_tenantId_fkey`;

-- DropIndex
DROP INDEX `Transaction_createdAt_idx` ON `transaction`;

-- DropIndex
DROP INDEX `Transaction_status_idx` ON `transaction`;

-- DropIndex
DROP INDEX `Transaction_tenantId_invoiceNumber_key` ON `transaction`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `change` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `serviceCharge` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalPaid` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
-- ALTER TABLE `UnitConversion` ADD CONSTRAINT `UnitConversion_fromUnitId_fkey` FOREIGN KEY (`fromUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
