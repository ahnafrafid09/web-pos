-- CreateTable
CREATE TABLE `tenant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenant_code_key`(`code`),
    INDEX `tenant_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module` (
    `id` VARCHAR(191) NOT NULL,
    `code` ENUM('SALES', 'INVENTORY', 'PURCHASE', 'RECIPE', 'REPORTING') NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `module_code_key`(`code`),
    INDEX `module_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant_module` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `module_id` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'EXPIRED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `started_at` DATETIME(3) NULL,
    `expired_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `tenant_module_tenant_id_status_idx`(`tenant_id`, `status`),
    INDEX `tenant_module_module_id_idx`(`module_id`),
    INDEX `tenant_module_expired_at_idx`(`expired_at`),
    UNIQUE INDEX `tenant_module_tenant_id_module_id_key`(`tenant_id`, `module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NULL,
    `name` VARCHAR(150) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'OWNER', 'ADMIN', 'CASHIER') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_tenant_id_idx`(`tenant_id`),
    INDEX `user_tenant_id_role_idx`(`tenant_id`, `role`),
    INDEX `user_tenant_id_status_idx`(`tenant_id`, `status`),
    INDEX `user_email_idx`(`email`),
    UNIQUE INDEX `user_tenant_id_username_key`(`tenant_id`, `username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `category_tenant_id_idx`(`tenant_id`),
    INDEX `category_tenant_id_status_idx`(`tenant_id`, `status`),
    UNIQUE INDEX `category_tenant_id_name_key`(`tenant_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NULL,
    `name` VARCHAR(150) NOT NULL,
    `sku` VARCHAR(100) NULL,
    `type` ENUM('MENU', 'MERCHANDISE') NOT NULL,
    `unit` VARCHAR(50) NOT NULL,
    `selling_price` INTEGER NOT NULL,
    `hpp` INTEGER NOT NULL DEFAULT 0,
    `image_url` TEXT NULL,
    `image_key` VARCHAR(255) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `product_tenant_id_idx`(`tenant_id`),
    INDEX `product_tenant_id_category_id_idx`(`tenant_id`, `category_id`),
    INDEX `product_tenant_id_type_idx`(`tenant_id`, `type`),
    INDEX `product_tenant_id_status_idx`(`tenant_id`, `status`),
    INDEX `product_tenant_id_name_idx`(`tenant_id`, `name`),
    UNIQUE INDEX `product_tenant_id_sku_key`(`tenant_id`, `sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raw_material` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `unit_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(100) NULL,
    `average_cost` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `raw_material_tenant_id_idx`(`tenant_id`),
    INDEX `raw_material_tenant_id_unit_id_idx`(`tenant_id`, `unit_id`),
    INDEX `raw_material_tenant_id_status_idx`(`tenant_id`, `status`),
    UNIQUE INDEX `raw_material_tenant_id_name_key`(`tenant_id`, `name`),
    UNIQUE INDEX `raw_material_tenant_id_code_key`(`tenant_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock` (
    `id` VARCHAR(191) NOT NULL,
    `raw_material_id` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    `min_quantity` DECIMAL(15, 3) NULL,
    `max_quantity` DECIMAL(15, 3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_raw_material_id_key`(`raw_material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_item` (
    `id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `raw_material_id` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `recipe_item_product_id_idx`(`product_id`),
    INDEX `recipe_item_raw_material_id_idx`(`raw_material_id`),
    UNIQUE INDEX `recipe_item_product_id_raw_material_id_key`(`product_id`, `raw_material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `address` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `supplier_tenant_id_idx`(`tenant_id`),
    INDEX `supplier_tenant_id_status_idx`(`tenant_id`, `status`),
    INDEX `supplier_tenant_id_name_idx`(`tenant_id`, `name`),
    UNIQUE INDEX `supplier_tenant_id_code_key`(`tenant_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `supplier_id` VARCHAR(191) NOT NULL,
    `created_by_id` VARCHAR(191) NULL,
    `purchase_number` VARCHAR(100) NOT NULL,
    `invoice_number` VARCHAR(100) NULL,
    `type` ENUM('PO', 'DIRECT') NOT NULL,
    `status` ENUM('DRAFT', 'ORDERED', 'PARTIAL', 'RECEIVED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `tax` INTEGER NOT NULL DEFAULT 0,
    `total_amount` INTEGER NOT NULL DEFAULT 0,
    `payment_status` ENUM('UNPAID', 'PARTIAL', 'PAID') NOT NULL DEFAULT 'UNPAID',
    `notes` TEXT NULL,
    `purchased_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `purchase_tenant_id_idx`(`tenant_id`),
    INDEX `purchase_tenant_id_supplier_id_idx`(`tenant_id`, `supplier_id`),
    INDEX `purchase_tenant_id_status_idx`(`tenant_id`, `status`),
    INDEX `purchase_tenant_id_payment_status_idx`(`tenant_id`, `payment_status`),
    INDEX `purchase_tenant_id_purchased_at_idx`(`tenant_id`, `purchased_at`),
    UNIQUE INDEX `purchase_tenant_id_purchase_number_key`(`tenant_id`, `purchase_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_item` (
    `id` VARCHAR(191) NOT NULL,
    `purchase_id` VARCHAR(191) NOT NULL,
    `raw_material_id` VARCHAR(191) NOT NULL,
    `unit_id` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `base_quantity` DECIMAL(15, 3) NOT NULL,
    `received_base_quantity` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    `unit_price` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `purchase_item_purchase_id_idx`(`purchase_id`),
    INDEX `purchase_item_raw_material_id_idx`(`raw_material_id`),
    INDEX `purchase_item_unit_id_idx`(`unit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_receiving` (
    `id` VARCHAR(191) NOT NULL,
    `purchase_id` VARCHAR(191) NOT NULL,
    `receiving_number` VARCHAR(100) NOT NULL,
    `received_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `purchase_receiving_purchase_id_idx`(`purchase_id`),
    INDEX `purchase_receiving_received_at_idx`(`received_at`),
    UNIQUE INDEX `purchase_receiving_purchase_id_receiving_number_key`(`purchase_id`, `receiving_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_receiving_item` (
    `id` VARCHAR(191) NOT NULL,
    `receiving_id` VARCHAR(191) NOT NULL,
    `purchase_item_id` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `purchase_receiving_item_receiving_id_idx`(`receiving_id`),
    INDEX `purchase_receiving_item_purchase_item_id_idx`(`purchase_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_payment` (
    `id` VARCHAR(191) NOT NULL,
    `purchase_id` VARCHAR(191) NOT NULL,
    `payment_method_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `reference` VARCHAR(150) NULL,
    `notes` TEXT NULL,
    `paid_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `purchase_payment_purchase_id_idx`(`purchase_id`),
    INDEX `purchase_payment_payment_method_id_idx`(`payment_method_id`),
    INDEX `purchase_payment_paid_at_idx`(`paid_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_movement` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `raw_material_id` VARCHAR(191) NOT NULL,
    `type` ENUM('PURCHASE', 'RECIPE_USAGE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'WASTE', 'RETURN') NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `unit_cost` INTEGER NOT NULL DEFAULT 0,
    `reference_id` VARCHAR(191) NULL,
    `reference_type` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `stock_movement_tenant_id_idx`(`tenant_id`),
    INDEX `stock_movement_tenant_id_raw_material_id_idx`(`tenant_id`, `raw_material_id`),
    INDEX `stock_movement_tenant_id_type_idx`(`tenant_id`, `type`),
    INDEX `stock_movement_tenant_id_created_at_idx`(`tenant_id`, `created_at`),
    INDEX `stock_movement_reference_id_reference_type_idx`(`reference_id`, `reference_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `cashier_id` VARCHAR(191) NULL,
    `invoice_number` VARCHAR(100) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `service_charge` INTEGER NOT NULL DEFAULT 0,
    `tax` INTEGER NOT NULL DEFAULT 0,
    `total` INTEGER NOT NULL DEFAULT 0,
    `total_paid` INTEGER NOT NULL DEFAULT 0,
    `change` INTEGER NOT NULL DEFAULT 0,
    `total_hpp` INTEGER NOT NULL DEFAULT 0,
    `profit` INTEGER NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `transaction_tenant_id_idx`(`tenant_id`),
    INDEX `transaction_tenant_id_cashier_id_idx`(`tenant_id`, `cashier_id`),
    INDEX `transaction_tenant_id_status_idx`(`tenant_id`, `status`),
    INDEX `transaction_tenant_id_created_at_idx`(`tenant_id`, `created_at`),
    UNIQUE INDEX `transaction_tenant_id_invoice_number_key`(`tenant_id`, `invoice_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_item` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(150) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `selling_price` INTEGER NOT NULL,
    `hpp` INTEGER NOT NULL DEFAULT 0,
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `profit` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `transaction_item_transaction_id_idx`(`transaction_id`),
    INDEX `transaction_item_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `usage_type` ENUM('PURCHASE', 'TRANSACTION', 'BOTH') NOT NULL DEFAULT 'BOTH',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `payment_method_tenant_id_idx`(`tenant_id`),
    INDEX `payment_method_tenant_id_usage_type_idx`(`tenant_id`, `usage_type`),
    INDEX `payment_method_tenant_id_status_idx`(`tenant_id`, `status`),
    UNIQUE INDEX `payment_method_tenant_id_code_key`(`tenant_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `payment_method_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `reference` VARCHAR(150) NULL,
    `paid_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `payment_transaction_id_idx`(`transaction_id`),
    INDEX `payment_payment_method_id_idx`(`payment_method_id`),
    INDEX `payment_paid_at_idx`(`paid_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `refresh_token_user_id_idx`(`user_id`),
    INDEX `refresh_token_tenant_id_idx`(`tenant_id`),
    INDEX `refresh_token_expires_at_idx`(`expires_at`),
    INDEX `refresh_token_revoked_at_idx`(`revoked_at`),
    UNIQUE INDEX `refresh_token_token_hash_key`(`token_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unit` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(30) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `unit_code_key`(`code`),
    UNIQUE INDEX `unit_name_key`(`name`),
    INDEX `unit_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unit_conversion` (
    `id` VARCHAR(191) NOT NULL,
    `from_unit_id` VARCHAR(191) NOT NULL,
    `to_unit_id` VARCHAR(191) NOT NULL,
    `multiplier` DECIMAL(15, 6) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `unit_conversion_from_unit_id_idx`(`from_unit_id`),
    INDEX `unit_conversion_to_unit_id_idx`(`to_unit_id`),
    UNIQUE INDEX `unit_conversion_from_unit_id_to_unit_id_key`(`from_unit_id`, `to_unit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raw_material_unit_conversion` (
    `id` VARCHAR(191) NOT NULL,
    `raw_material_id` VARCHAR(191) NOT NULL,
    `from_unit_id` VARCHAR(191) NOT NULL,
    `to_unit_id` VARCHAR(191) NOT NULL,
    `multiplier` DECIMAL(15, 6) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `raw_material_unit_conversion_raw_material_id_idx`(`raw_material_id`),
    INDEX `raw_material_unit_conversion_from_unit_id_idx`(`from_unit_id`),
    INDEX `raw_material_unit_conversion_to_unit_id_idx`(`to_unit_id`),
    UNIQUE INDEX `raw_material_unit_conversion_raw_material_id_from_unit_id_to_key`(`raw_material_id`, `from_unit_id`, `to_unit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'REGISTER', 'LOGIN', 'LOGIN_FAILED', 'LOGOUT') NOT NULL,
    `module` VARCHAR(50) NOT NULL,
    `entity_type` VARCHAR(100) NOT NULL,
    `entity_id` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_log_tenant_id_idx`(`tenant_id`),
    INDEX `audit_log_user_id_idx`(`user_id`),
    INDEX `audit_log_tenant_id_module_idx`(`tenant_id`, `module`),
    INDEX `audit_log_tenant_id_entity_type_entity_id_idx`(`tenant_id`, `entity_type`, `entity_id`),
    INDEX `audit_log_tenant_id_created_at_idx`(`tenant_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_setting` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `tax_enabled` BOOLEAN NOT NULL DEFAULT false,
    `tax_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `service_charge_enabled` BOOLEAN NOT NULL DEFAULT false,
    `service_charge_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transaction_setting_tenant_id_key`(`tenant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tenant_module` ADD CONSTRAINT `tenant_module_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenant_module` ADD CONSTRAINT `tenant_module_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material` ADD CONSTRAINT `raw_material_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material` ADD CONSTRAINT `raw_material_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_raw_material_id_fkey` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_item` ADD CONSTRAINT `recipe_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_item` ADD CONSTRAINT `recipe_item_raw_material_id_fkey` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier` ADD CONSTRAINT `supplier_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase` ADD CONSTRAINT `purchase_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase` ADD CONSTRAINT `purchase_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_raw_material_id_fkey` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving` ADD CONSTRAINT `purchase_receiving_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving_item` ADD CONSTRAINT `purchase_receiving_item_receiving_id_fkey` FOREIGN KEY (`receiving_id`) REFERENCES `purchase_receiving`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving_item` ADD CONSTRAINT `purchase_receiving_item_purchase_item_id_fkey` FOREIGN KEY (`purchase_item_id`) REFERENCES `purchase_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_payment` ADD CONSTRAINT `purchase_payment_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_payment` ADD CONSTRAINT `purchase_payment_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movement` ADD CONSTRAINT `stock_movement_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movement` ADD CONSTRAINT `stock_movement_raw_material_id_fkey` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_cashier_id_fkey` FOREIGN KEY (`cashier_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_item` ADD CONSTRAINT `transaction_item_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_item` ADD CONSTRAINT `transaction_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_method` ADD CONSTRAINT `payment_method_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit_conversion` ADD CONSTRAINT `unit_conversion_from_unit_id_fkey` FOREIGN KEY (`from_unit_id`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit_conversion` ADD CONSTRAINT `unit_conversion_to_unit_id_fkey` FOREIGN KEY (`to_unit_id`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material_unit_conversion` ADD CONSTRAINT `raw_material_unit_conversion_raw_material_id_fkey` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material_unit_conversion` ADD CONSTRAINT `raw_material_unit_conversion_from_unit_id_fkey` FOREIGN KEY (`from_unit_id`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material_unit_conversion` ADD CONSTRAINT `raw_material_unit_conversion_to_unit_id_fkey` FOREIGN KEY (`to_unit_id`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_setting` ADD CONSTRAINT `transaction_setting_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
