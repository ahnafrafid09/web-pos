/*
  Warnings:

  - You are about to drop the `auditlog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paymentmethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchaseitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchasepayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchasereceiving` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchasereceivingitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rawmaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipeitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refreshtoken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stockmovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactionitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `unitconversion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `auditlog` DROP FOREIGN KEY `AuditLog_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `auditlog` DROP FOREIGN KEY `AuditLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_paymentMethodId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_transactionId_fkey`;

-- DropForeignKey
ALTER TABLE `paymentmethod` DROP FOREIGN KEY `PaymentMethod_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `Purchase_supplierId_fkey`;

-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `Purchase_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `purchaseitem` DROP FOREIGN KEY `PurchaseItem_purchaseId_fkey`;

-- DropForeignKey
ALTER TABLE `purchaseitem` DROP FOREIGN KEY `PurchaseItem_rawMaterialId_fkey`;

-- DropForeignKey
ALTER TABLE `purchaseitem` DROP FOREIGN KEY `PurchaseItem_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasepayment` DROP FOREIGN KEY `PurchasePayment_paymentMethodId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasepayment` DROP FOREIGN KEY `PurchasePayment_purchaseId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasereceiving` DROP FOREIGN KEY `PurchaseReceiving_purchaseId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasereceivingitem` DROP FOREIGN KEY `PurchaseReceivingItem_purchaseItemId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasereceivingitem` DROP FOREIGN KEY `PurchaseReceivingItem_purchaseReceivingId_fkey`;

-- DropForeignKey
ALTER TABLE `rawmaterial` DROP FOREIGN KEY `RawMaterial_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `rawmaterial` DROP FOREIGN KEY `RawMaterial_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeitem` DROP FOREIGN KEY `RecipeItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeitem` DROP FOREIGN KEY `RecipeItem_rawMaterialId_fkey`;

-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `Stock_rawMaterialId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_rawMaterialId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `supplier` DROP FOREIGN KEY `Supplier_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `transactionitem` DROP FOREIGN KEY `TransactionItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `transactionitem` DROP FOREIGN KEY `TransactionItem_transactionId_fkey`;

-- DropForeignKey
ALTER TABLE `unitconversion` DROP FOREIGN KEY `UnitConversion_fromUnitId_fkey`;

-- DropForeignKey
ALTER TABLE `unitconversion` DROP FOREIGN KEY `UnitConversion_toUnitId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_tenantId_fkey`;

-- DropTable
DROP TABLE `auditlog`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `payment`;

-- DropTable
DROP TABLE `paymentmethod`;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `purchase`;

-- DropTable
DROP TABLE `purchaseitem`;

-- DropTable
DROP TABLE `purchasepayment`;

-- DropTable
DROP TABLE `purchasereceiving`;

-- DropTable
DROP TABLE `purchasereceivingitem`;

-- DropTable
DROP TABLE `rawmaterial`;

-- DropTable
DROP TABLE `recipeitem`;

-- DropTable
DROP TABLE `refreshtoken`;

-- DropTable
DROP TABLE `stock`;

-- DropTable
DROP TABLE `stockmovement`;

-- DropTable
DROP TABLE `supplier`;

-- DropTable
DROP TABLE `tenant`;

-- DropTable
DROP TABLE `transaction`;

-- DropTable
DROP TABLE `transactionitem`;

-- DropTable
DROP TABLE `unit`;

-- DropTable
DROP TABLE `unitconversion`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `tenants` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenants_slug_key`(`slug`),
    INDEX `tenants_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NULL,
    `name` VARCHAR(150) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'OWNER', 'ADMIN', 'CASHIER') NOT NULL DEFAULT 'CASHIER',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_tenantId_idx`(`tenantId`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_status_idx`(`status`),
    UNIQUE INDEX `users_tenantId_username_key`(`tenantId`, `username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `categories_tenantId_idx`(`tenantId`),
    INDEX `categories_status_idx`(`status`),
    UNIQUE INDEX `categories_tenantId_name_key`(`tenantId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `type` ENUM('MENU', 'MERCHANDISE') NOT NULL,
    `sku` VARCHAR(100) NULL,
    `unit` VARCHAR(30) NOT NULL,
    `sellingPrice` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `products_tenantId_idx`(`tenantId`),
    INDEX `products_categoryId_idx`(`categoryId`),
    INDEX `products_type_idx`(`type`),
    INDEX `products_status_idx`(`status`),
    UNIQUE INDEX `products_tenantId_name_key`(`tenantId`, `name`),
    UNIQUE INDEX `products_tenantId_sku_key`(`tenantId`, `sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raw_materials` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `sku` VARCHAR(100) NULL,
    `unitId` VARCHAR(191) NOT NULL,
    `averageCost` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `raw_materials_tenantId_idx`(`tenantId`),
    INDEX `raw_materials_unitId_idx`(`unitId`),
    INDEX `raw_materials_status_idx`(`status`),
    UNIQUE INDEX `raw_materials_tenantId_name_key`(`tenantId`, `name`),
    UNIQUE INDEX `raw_materials_tenantId_sku_key`(`tenantId`, `sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stocks` (
    `id` VARCHAR(191) NOT NULL,
    `rawMaterialId` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    `minimumStock` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stocks_rawMaterialId_key`(`rawMaterialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_items` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `rawMaterialId` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `recipe_items_productId_idx`(`productId`),
    INDEX `recipe_items_rawMaterialId_idx`(`rawMaterialId`),
    UNIQUE INDEX `recipe_items_productId_rawMaterialId_key`(`productId`, `rawMaterialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
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

    INDEX `suppliers_tenantId_idx`(`tenantId`),
    INDEX `suppliers_status_idx`(`status`),
    UNIQUE INDEX `suppliers_tenantId_code_key`(`tenantId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchases` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `purchaseNumber` VARCHAR(50) NOT NULL,
    `invoiceNumber` VARCHAR(100) NULL,
    `purchaseType` ENUM('PO', 'DIRECT') NOT NULL,
    `status` ENUM('DRAFT', 'ORDERED', 'PARTIAL', 'RECEIVED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `discountType` ENUM('PERCENTAGE', 'FIXED') NULL,
    `discountValue` DECIMAL(15, 2) NULL,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `taxType` ENUM('PERCENTAGE', 'FIXED') NULL,
    `taxValue` DECIMAL(15, 2) NULL,
    `tax` INTEGER NOT NULL DEFAULT 0,
    `totalAmount` INTEGER NOT NULL DEFAULT 0,
    `paymentStatus` ENUM('UNPAID', 'PARTIAL', 'PAID') NOT NULL DEFAULT 'UNPAID',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `purchases_tenantId_idx`(`tenantId`),
    INDEX `purchases_supplierId_idx`(`supplierId`),
    INDEX `purchases_purchaseDate_idx`(`purchaseDate`),
    INDEX `purchases_status_idx`(`status`),
    INDEX `purchases_purchaseType_idx`(`purchaseType`),
    INDEX `purchases_paymentStatus_idx`(`paymentStatus`),
    UNIQUE INDEX `purchases_tenantId_purchaseNumber_key`(`tenantId`, `purchaseNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_items` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `rawMaterialId` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `unitId` VARCHAR(191) NOT NULL,
    `baseQuantity` DECIMAL(15, 3) NOT NULL,
    `receivedBaseQuantity` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `purchase_items_purchaseId_idx`(`purchaseId`),
    INDEX `purchase_items_rawMaterialId_idx`(`rawMaterialId`),
    INDEX `purchase_items_unitId_idx`(`unitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_receivings` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `receivingNumber` VARCHAR(50) NOT NULL,
    `receivingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `purchase_receivings_purchaseId_idx`(`purchaseId`),
    INDEX `purchase_receivings_receivingDate_idx`(`receivingDate`),
    UNIQUE INDEX `purchase_receivings_purchaseId_receivingNumber_key`(`purchaseId`, `receivingNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_receiving_items` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseReceivingId` VARCHAR(191) NOT NULL,
    `purchaseItemId` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `baseQuantity` DECIMAL(15, 3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `purchase_receiving_items_purchaseReceivingId_idx`(`purchaseReceivingId`),
    INDEX `purchase_receiving_items_purchaseItemId_idx`(`purchaseItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_payments` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `paymentMethodId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `purchase_payments_purchaseId_idx`(`purchaseId`),
    INDEX `purchase_payments_paymentMethodId_idx`(`paymentMethodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_movements` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `rawMaterialId` VARCHAR(191) NOT NULL,
    `type` ENUM('PURCHASE', 'RECIPE_USAGE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'WASTE', 'RETURN') NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `unitCost` INTEGER NOT NULL DEFAULT 0,
    `referenceId` VARCHAR(191) NULL,
    `referenceType` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `stock_movements_tenantId_idx`(`tenantId`),
    INDEX `stock_movements_rawMaterialId_idx`(`rawMaterialId`),
    INDEX `stock_movements_type_idx`(`type`),
    INDEX `stock_movements_createdAt_idx`(`createdAt`),
    INDEX `stock_movements_referenceId_idx`(`referenceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(100) NOT NULL,
    `status` ENUM('COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'COMPLETED',
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `tax` INTEGER NOT NULL DEFAULT 0,
    `total` INTEGER NOT NULL DEFAULT 0,
    `totalHpp` INTEGER NOT NULL DEFAULT 0,
    `profit` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transactions_tenantId_idx`(`tenantId`),
    INDEX `transactions_createdAt_idx`(`createdAt`),
    INDEX `transactions_status_idx`(`status`),
    UNIQUE INDEX `transactions_tenantId_invoiceNumber_key`(`tenantId`, `invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_items` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(150) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `sellingPrice` INTEGER NOT NULL,
    `hpp` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,
    `profit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `transaction_items_transactionId_idx`(`transactionId`),
    INDEX `transaction_items_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `usageType` ENUM('PURCHASE', 'TRANSACTION', 'BOTH') NOT NULL DEFAULT 'BOTH',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `payment_methods_tenantId_idx`(`tenantId`),
    INDEX `payment_methods_usageType_idx`(`usageType`),
    INDEX `payment_methods_status_idx`(`status`),
    UNIQUE INDEX `payment_methods_tenantId_code_key`(`tenantId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `paymentMethodId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `payments_transactionId_idx`(`transactionId`),
    INDEX `payments_paymentMethodId_idx`(`paymentMethodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refresh_tokens_tokenHash_key`(`tokenHash`),
    INDEX `refresh_tokens_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `units_name_key`(`name`),
    UNIQUE INDEX `units_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unit_conversions` (
    `id` VARCHAR(191) NOT NULL,
    `fromUnitId` VARCHAR(191) NOT NULL,
    `toUnitId` VARCHAR(191) NOT NULL,
    `factor` DECIMAL(15, 6) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `unit_conversions_fromUnitId_toUnitId_key`(`fromUnitId`, `toUnitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'REGISTER', 'LOGIN', 'LOGIN_FAILED', 'LOGOUT') NOT NULL,
    `module` VARCHAR(50) NOT NULL,
    `entityType` VARCHAR(100) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `oldData` JSON NULL,
    `newData` JSON NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_tenantId_idx`(`tenantId`),
    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_module_idx`(`module`),
    INDEX `audit_logs_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_materials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_items` ADD CONSTRAINT `recipe_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_items` ADD CONSTRAINT `recipe_items_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_items` ADD CONSTRAINT `purchase_items_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `purchases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_items` ADD CONSTRAINT `purchase_items_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_items` ADD CONSTRAINT `purchase_items_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receivings` ADD CONSTRAINT `purchase_receivings_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `purchases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving_items` ADD CONSTRAINT `purchase_receiving_items_purchaseReceivingId_fkey` FOREIGN KEY (`purchaseReceivingId`) REFERENCES `purchase_receivings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving_items` ADD CONSTRAINT `purchase_receiving_items_purchaseItemId_fkey` FOREIGN KEY (`purchaseItemId`) REFERENCES `purchase_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_payments` ADD CONSTRAINT `purchase_payments_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `purchases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_payments` ADD CONSTRAINT `purchase_payments_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_methods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_items` ADD CONSTRAINT `transaction_items_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_items` ADD CONSTRAINT `transaction_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_methods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit_conversions` ADD CONSTRAINT `unit_conversions_fromUnitId_fkey` FOREIGN KEY (`fromUnitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit_conversions` ADD CONSTRAINT `unit_conversions_toUnitId_fkey` FOREIGN KEY (`toUnitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
