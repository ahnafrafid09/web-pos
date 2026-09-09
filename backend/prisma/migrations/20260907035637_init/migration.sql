-- DropIndex
DROP INDEX `Transaction_tenantId_idx` ON `transaction`;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
