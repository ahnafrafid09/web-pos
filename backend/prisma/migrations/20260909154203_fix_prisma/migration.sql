/*
  Warnings:

  - You are about to drop the column `created_at` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `entity_id` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `entity_type` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `new_data` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `old_data` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `module` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `module` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `usage_type` on the `payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `image_key` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `selling_price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `product` table. All the data in the column will be lost.
  - You are about to alter the column `unit` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(30)`.
  - You are about to drop the column `created_at` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_id` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_number` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_number` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchased_at` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `purchase` table. All the data in the column will be lost.
  - You are about to drop the column `base_quantity` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_id` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `raw_material_id` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `received_base_quantity` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `purchase_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `purchase_payment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `purchase_payment` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `purchase_payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method_id` on the `purchase_payment` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_id` on the `purchase_payment` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `purchase_payment` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `purchase_receiving` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `purchase_receiving` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_id` on the `purchase_receiving` table. All the data in the column will be lost.
  - You are about to drop the column `received_at` on the `purchase_receiving` table. All the data in the column will be lost.
  - You are about to drop the column `receiving_number` on the `purchase_receiving` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `purchase_receiving` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `purchase_receiving_item` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_item_id` on the `purchase_receiving_item` table. All the data in the column will be lost.
  - You are about to drop the column `receiving_id` on the `purchase_receiving_item` table. All the data in the column will be lost.
  - You are about to drop the column `average_cost` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `raw_material_unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `from_unit_id` on the `raw_material_unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `multiplier` on the `raw_material_unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `raw_material_id` on the `raw_material_unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `to_unit_id` on the `raw_material_unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `raw_material_unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `recipe_item` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `recipe_item` table. All the data in the column will be lost.
  - You are about to drop the column `raw_material_id` on the `recipe_item` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `recipe_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `revoked_at` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `token_hash` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `max_quantity` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `min_quantity` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `raw_material_id` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `stock_movement` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `stock_movement` table. All the data in the column will be lost.
  - You are about to drop the column `raw_material_id` on the `stock_movement` table. All the data in the column will be lost.
  - You are about to drop the column `reference_id` on the `stock_movement` table. All the data in the column will be lost.
  - You are about to drop the column `reference_type` on the `stock_movement` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `stock_movement` table. All the data in the column will be lost.
  - You are about to drop the column `unit_cost` on the `stock_movement` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `tenant` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tenant` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tenant` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tenant_module` table. All the data in the column will be lost.
  - You are about to drop the column `expired_at` on the `tenant_module` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `tenant_module` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `tenant_module` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `tenant_module` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tenant_module` table. All the data in the column will be lost.
  - You are about to drop the column `cashier_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_number` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `service_charge` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `total_hpp` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `total_paid` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `transaction_item` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `transaction_item` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `transaction_item` table. All the data in the column will be lost.
  - You are about to drop the column `selling_price` on the `transaction_item` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `transaction_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `transaction_setting` table. All the data in the column will be lost.
  - You are about to drop the column `service_charge_enabled` on the `transaction_setting` table. All the data in the column will be lost.
  - You are about to drop the column `service_charge_rate` on the `transaction_setting` table. All the data in the column will be lost.
  - You are about to drop the column `tax_enabled` on the `transaction_setting` table. All the data in the column will be lost.
  - You are about to drop the column `tax_rate` on the `transaction_setting` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `transaction_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `transaction_setting` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `unit` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `unit` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `unit` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `unit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(20)`.
  - You are about to drop the column `created_at` on the `unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `from_unit_id` on the `unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `multiplier` on the `unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `to_unit_id` on the `unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `unit_conversion` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_login_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[tenantId,name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `payment_method` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,sku]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,purchaseNumber]` on the table `purchase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[purchaseId,receivingNumber]` on the table `purchase_receiving` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `raw_material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,sku]` on the table `raw_material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rawMaterialId,unitId]` on the table `raw_material_unit_conversion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,rawMaterialId]` on the table `recipe_item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenHash]` on the table `refresh_token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rawMaterialId]` on the table `stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,code]` on the table `supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `tenant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,moduleId]` on the table `tenant_module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `transaction_setting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fromUnitId,toUnitId]` on the table `unit_conversion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityType` to the `audit_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodId` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `payment_method` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `payment_method` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseNumber` to the `purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseType` to the `purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseQuantity` to the `purchase_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseId` to the `purchase_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawMaterialId` to the `purchase_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `purchase_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `purchase_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodId` to the `purchase_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseId` to the `purchase_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseId` to the `purchase_receiving` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivingNumber` to the `purchase_receiving` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `purchase_receiving` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseQuantity` to the `purchase_receiving_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseItemId` to the `purchase_receiving_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseReceivingId` to the `purchase_receiving_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `raw_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `raw_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `raw_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `factor` to the `raw_material_unit_conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawMaterialId` to the `raw_material_unit_conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `raw_material_unit_conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `recipe_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawMaterialId` to the `recipe_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `recipe_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `refresh_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenHash` to the `refresh_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `refresh_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawMaterialId` to the `stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawMaterialId` to the `stock_movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `stock_movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleId` to the `tenant_module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `tenant_module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tenant_module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `transaction_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `transaction_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `transaction_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `transaction_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `transaction_setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `transaction_setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `factor` to the `unit_conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromUnitId` to the `unit_conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUnitId` to the `unit_conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `audit_log` DROP FOREIGN KEY `audit_log_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `audit_log` DROP FOREIGN KEY `audit_log_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_payment_method_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_transaction_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_method` DROP FOREIGN KEY `payment_method_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `purchase_supplier_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `purchase_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_item` DROP FOREIGN KEY `purchase_item_purchase_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_item` DROP FOREIGN KEY `purchase_item_raw_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_item` DROP FOREIGN KEY `purchase_item_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_payment` DROP FOREIGN KEY `purchase_payment_payment_method_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_payment` DROP FOREIGN KEY `purchase_payment_purchase_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_receiving` DROP FOREIGN KEY `purchase_receiving_purchase_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_receiving_item` DROP FOREIGN KEY `purchase_receiving_item_purchase_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_receiving_item` DROP FOREIGN KEY `purchase_receiving_item_receiving_id_fkey`;

-- DropForeignKey
ALTER TABLE `raw_material` DROP FOREIGN KEY `raw_material_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `raw_material` DROP FOREIGN KEY `raw_material_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `raw_material_unit_conversion` DROP FOREIGN KEY `raw_material_unit_conversion_from_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `raw_material_unit_conversion` DROP FOREIGN KEY `raw_material_unit_conversion_raw_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `raw_material_unit_conversion` DROP FOREIGN KEY `raw_material_unit_conversion_to_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_item` DROP FOREIGN KEY `recipe_item_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_item` DROP FOREIGN KEY `recipe_item_raw_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_token` DROP FOREIGN KEY `refresh_token_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_token` DROP FOREIGN KEY `refresh_token_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_raw_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_movement` DROP FOREIGN KEY `stock_movement_raw_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_movement` DROP FOREIGN KEY `stock_movement_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `supplier` DROP FOREIGN KEY `supplier_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `tenant_module` DROP FOREIGN KEY `tenant_module_module_id_fkey`;

-- DropForeignKey
ALTER TABLE `tenant_module` DROP FOREIGN KEY `tenant_module_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_cashier_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_item` DROP FOREIGN KEY `transaction_item_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_item` DROP FOREIGN KEY `transaction_item_transaction_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_setting` DROP FOREIGN KEY `transaction_setting_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `unit_conversion` DROP FOREIGN KEY `unit_conversion_from_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `unit_conversion` DROP FOREIGN KEY `unit_conversion_to_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_tenant_id_fkey`;

-- DropIndex
DROP INDEX `audit_log_tenant_id_created_at_idx` ON `audit_log`;

-- DropIndex
DROP INDEX `audit_log_tenant_id_entity_type_entity_id_idx` ON `audit_log`;

-- DropIndex
DROP INDEX `audit_log_tenant_id_idx` ON `audit_log`;

-- DropIndex
DROP INDEX `audit_log_tenant_id_module_idx` ON `audit_log`;

-- DropIndex
DROP INDEX `audit_log_user_id_idx` ON `audit_log`;

-- DropIndex
DROP INDEX `category_tenant_id_idx` ON `category`;

-- DropIndex
DROP INDEX `category_tenant_id_name_key` ON `category`;

-- DropIndex
DROP INDEX `category_tenant_id_status_idx` ON `category`;

-- DropIndex
DROP INDEX `module_status_idx` ON `module`;

-- DropIndex
DROP INDEX `payment_paid_at_idx` ON `payment`;

-- DropIndex
DROP INDEX `payment_payment_method_id_idx` ON `payment`;

-- DropIndex
DROP INDEX `payment_transaction_id_idx` ON `payment`;

-- DropIndex
DROP INDEX `payment_method_tenant_id_code_key` ON `payment_method`;

-- DropIndex
DROP INDEX `payment_method_tenant_id_idx` ON `payment_method`;

-- DropIndex
DROP INDEX `payment_method_tenant_id_status_idx` ON `payment_method`;

-- DropIndex
DROP INDEX `payment_method_tenant_id_usage_type_idx` ON `payment_method`;

-- DropIndex
DROP INDEX `product_category_id_fkey` ON `product`;

-- DropIndex
DROP INDEX `product_tenant_id_category_id_idx` ON `product`;

-- DropIndex
DROP INDEX `product_tenant_id_idx` ON `product`;

-- DropIndex
DROP INDEX `product_tenant_id_name_idx` ON `product`;

-- DropIndex
DROP INDEX `product_tenant_id_sku_key` ON `product`;

-- DropIndex
DROP INDEX `product_tenant_id_status_idx` ON `product`;

-- DropIndex
DROP INDEX `product_tenant_id_type_idx` ON `product`;

-- DropIndex
DROP INDEX `purchase_supplier_id_fkey` ON `purchase`;

-- DropIndex
DROP INDEX `purchase_tenant_id_idx` ON `purchase`;

-- DropIndex
DROP INDEX `purchase_tenant_id_payment_status_idx` ON `purchase`;

-- DropIndex
DROP INDEX `purchase_tenant_id_purchase_number_key` ON `purchase`;

-- DropIndex
DROP INDEX `purchase_tenant_id_purchased_at_idx` ON `purchase`;

-- DropIndex
DROP INDEX `purchase_tenant_id_status_idx` ON `purchase`;

-- DropIndex
DROP INDEX `purchase_tenant_id_supplier_id_idx` ON `purchase`;

-- DropIndex
DROP INDEX `purchase_item_purchase_id_idx` ON `purchase_item`;

-- DropIndex
DROP INDEX `purchase_item_raw_material_id_idx` ON `purchase_item`;

-- DropIndex
DROP INDEX `purchase_item_unit_id_idx` ON `purchase_item`;

-- DropIndex
DROP INDEX `purchase_payment_paid_at_idx` ON `purchase_payment`;

-- DropIndex
DROP INDEX `purchase_payment_payment_method_id_idx` ON `purchase_payment`;

-- DropIndex
DROP INDEX `purchase_payment_purchase_id_idx` ON `purchase_payment`;

-- DropIndex
DROP INDEX `purchase_receiving_purchase_id_idx` ON `purchase_receiving`;

-- DropIndex
DROP INDEX `purchase_receiving_purchase_id_receiving_number_key` ON `purchase_receiving`;

-- DropIndex
DROP INDEX `purchase_receiving_received_at_idx` ON `purchase_receiving`;

-- DropIndex
DROP INDEX `purchase_receiving_item_purchase_item_id_idx` ON `purchase_receiving_item`;

-- DropIndex
DROP INDEX `purchase_receiving_item_receiving_id_idx` ON `purchase_receiving_item`;

-- DropIndex
DROP INDEX `raw_material_tenant_id_code_key` ON `raw_material`;

-- DropIndex
DROP INDEX `raw_material_tenant_id_idx` ON `raw_material`;

-- DropIndex
DROP INDEX `raw_material_tenant_id_name_key` ON `raw_material`;

-- DropIndex
DROP INDEX `raw_material_tenant_id_status_idx` ON `raw_material`;

-- DropIndex
DROP INDEX `raw_material_tenant_id_unit_id_idx` ON `raw_material`;

-- DropIndex
DROP INDEX `raw_material_unit_id_fkey` ON `raw_material`;

-- DropIndex
DROP INDEX `raw_material_unit_conversion_from_unit_id_idx` ON `raw_material_unit_conversion`;

-- DropIndex
DROP INDEX `raw_material_unit_conversion_raw_material_id_from_unit_id_to_key` ON `raw_material_unit_conversion`;

-- DropIndex
DROP INDEX `raw_material_unit_conversion_raw_material_id_idx` ON `raw_material_unit_conversion`;

-- DropIndex
DROP INDEX `raw_material_unit_conversion_to_unit_id_idx` ON `raw_material_unit_conversion`;

-- DropIndex
DROP INDEX `recipe_item_product_id_idx` ON `recipe_item`;

-- DropIndex
DROP INDEX `recipe_item_product_id_raw_material_id_key` ON `recipe_item`;

-- DropIndex
DROP INDEX `recipe_item_raw_material_id_idx` ON `recipe_item`;

-- DropIndex
DROP INDEX `refresh_token_expires_at_idx` ON `refresh_token`;

-- DropIndex
DROP INDEX `refresh_token_revoked_at_idx` ON `refresh_token`;

-- DropIndex
DROP INDEX `refresh_token_tenant_id_idx` ON `refresh_token`;

-- DropIndex
DROP INDEX `refresh_token_token_hash_key` ON `refresh_token`;

-- DropIndex
DROP INDEX `refresh_token_user_id_idx` ON `refresh_token`;

-- DropIndex
DROP INDEX `stock_raw_material_id_key` ON `stock`;

-- DropIndex
DROP INDEX `stock_movement_raw_material_id_fkey` ON `stock_movement`;

-- DropIndex
DROP INDEX `stock_movement_reference_id_reference_type_idx` ON `stock_movement`;

-- DropIndex
DROP INDEX `stock_movement_tenant_id_created_at_idx` ON `stock_movement`;

-- DropIndex
DROP INDEX `stock_movement_tenant_id_idx` ON `stock_movement`;

-- DropIndex
DROP INDEX `stock_movement_tenant_id_raw_material_id_idx` ON `stock_movement`;

-- DropIndex
DROP INDEX `stock_movement_tenant_id_type_idx` ON `stock_movement`;

-- DropIndex
DROP INDEX `supplier_tenant_id_code_key` ON `supplier`;

-- DropIndex
DROP INDEX `supplier_tenant_id_idx` ON `supplier`;

-- DropIndex
DROP INDEX `supplier_tenant_id_name_idx` ON `supplier`;

-- DropIndex
DROP INDEX `supplier_tenant_id_status_idx` ON `supplier`;

-- DropIndex
DROP INDEX `tenant_code_key` ON `tenant`;

-- DropIndex
DROP INDEX `tenant_module_expired_at_idx` ON `tenant_module`;

-- DropIndex
DROP INDEX `tenant_module_module_id_idx` ON `tenant_module`;

-- DropIndex
DROP INDEX `tenant_module_tenant_id_module_id_key` ON `tenant_module`;

-- DropIndex
DROP INDEX `tenant_module_tenant_id_status_idx` ON `tenant_module`;

-- DropIndex
DROP INDEX `transaction_cashier_id_fkey` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_tenant_id_cashier_id_idx` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_tenant_id_created_at_idx` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_tenant_id_idx` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_tenant_id_invoice_number_key` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_tenant_id_status_idx` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_item_product_id_idx` ON `transaction_item`;

-- DropIndex
DROP INDEX `transaction_item_transaction_id_idx` ON `transaction_item`;

-- DropIndex
DROP INDEX `transaction_setting_tenant_id_key` ON `transaction_setting`;

-- DropIndex
DROP INDEX `unit_status_idx` ON `unit`;

-- DropIndex
DROP INDEX `unit_conversion_from_unit_id_idx` ON `unit_conversion`;

-- DropIndex
DROP INDEX `unit_conversion_from_unit_id_to_unit_id_key` ON `unit_conversion`;

-- DropIndex
DROP INDEX `unit_conversion_to_unit_id_idx` ON `unit_conversion`;

-- DropIndex
DROP INDEX `user_email_idx` ON `user`;

-- DropIndex
DROP INDEX `user_tenant_id_idx` ON `user`;

-- DropIndex
DROP INDEX `user_tenant_id_role_idx` ON `user`;

-- DropIndex
DROP INDEX `user_tenant_id_status_idx` ON `user`;

-- DropIndex
DROP INDEX `user_tenant_id_username_key` ON `user`;

-- AlterTable
ALTER TABLE `audit_log` DROP COLUMN `created_at`,
    DROP COLUMN `entity_id`,
    DROP COLUMN `entity_type`,
    DROP COLUMN `ip_address`,
    DROP COLUMN `new_data`,
    DROP COLUMN `old_data`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `user_agent`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `entityId` VARCHAR(191) NULL,
    ADD COLUMN `entityType` VARCHAR(100) NOT NULL,
    ADD COLUMN `ipAddress` VARCHAR(45) NULL,
    ADD COLUMN `newData` JSON NULL,
    ADD COLUMN `oldData` JSON NULL,
    ADD COLUMN `tenantId` VARCHAR(191) NULL,
    ADD COLUMN `userAgent` TEXT NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `created_at`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `module` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `created_at`,
    DROP COLUMN `paid_at`,
    DROP COLUMN `payment_method_id`,
    DROP COLUMN `reference`,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `paymentMethodId` VARCHAR(191) NOT NULL,
    ADD COLUMN `transactionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payment_method` DROP COLUMN `created_at`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `usage_type`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `usageType` ENUM('PURCHASE', 'TRANSACTION', 'BOTH') NOT NULL DEFAULT 'BOTH',
    MODIFY `name` VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `category_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `image_key`,
    DROP COLUMN `image_url`,
    DROP COLUMN `selling_price`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imageKey` VARCHAR(191) NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `sellingPrice` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `unit` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `purchase` DROP COLUMN `created_at`,
    DROP COLUMN `created_by_id`,
    DROP COLUMN `invoice_number`,
    DROP COLUMN `notes`,
    DROP COLUMN `payment_status`,
    DROP COLUMN `purchase_number`,
    DROP COLUMN `purchased_at`,
    DROP COLUMN `supplier_id`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `total_amount`,
    DROP COLUMN `type`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `discountType` ENUM('PERCENTAGE', 'FIXED') NULL,
    ADD COLUMN `discountValue` DECIMAL(15, 2) NULL,
    ADD COLUMN `invoiceNumber` VARCHAR(100) NULL,
    ADD COLUMN `paymentStatus` ENUM('UNPAID', 'PARTIAL', 'PAID') NOT NULL DEFAULT 'UNPAID',
    ADD COLUMN `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `purchaseNumber` VARCHAR(50) NOT NULL,
    ADD COLUMN `purchaseType` ENUM('PO', 'DIRECT') NOT NULL,
    ADD COLUMN `supplierId` VARCHAR(191) NOT NULL,
    ADD COLUMN `taxType` ENUM('PERCENTAGE', 'FIXED') NULL,
    ADD COLUMN `taxValue` DECIMAL(15, 2) NULL,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalAmount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_item` DROP COLUMN `base_quantity`,
    DROP COLUMN `created_at`,
    DROP COLUMN `purchase_id`,
    DROP COLUMN `raw_material_id`,
    DROP COLUMN `received_base_quantity`,
    DROP COLUMN `unit_id`,
    DROP COLUMN `unit_price`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `baseQuantity` DECIMAL(15, 3) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `purchaseId` VARCHAR(191) NOT NULL,
    ADD COLUMN `rawMaterialId` VARCHAR(191) NOT NULL,
    ADD COLUMN `receivedBaseQuantity` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    ADD COLUMN `unitId` VARCHAR(191) NOT NULL,
    ADD COLUMN `unitPrice` INTEGER NOT NULL,
    MODIFY `subtotal` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `purchase_payment` DROP COLUMN `created_at`,
    DROP COLUMN `notes`,
    DROP COLUMN `paid_at`,
    DROP COLUMN `payment_method_id`,
    DROP COLUMN `purchase_id`,
    DROP COLUMN `reference`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `note` TEXT NULL,
    ADD COLUMN `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `paymentMethodId` VARCHAR(191) NOT NULL,
    ADD COLUMN `purchaseId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_receiving` DROP COLUMN `created_at`,
    DROP COLUMN `notes`,
    DROP COLUMN `purchase_id`,
    DROP COLUMN `received_at`,
    DROP COLUMN `receiving_number`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `note` TEXT NULL,
    ADD COLUMN `purchaseId` VARCHAR(191) NOT NULL,
    ADD COLUMN `receivingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `receivingNumber` VARCHAR(50) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_receiving_item` DROP COLUMN `created_at`,
    DROP COLUMN `purchase_item_id`,
    DROP COLUMN `receiving_id`,
    ADD COLUMN `baseQuantity` DECIMAL(15, 3) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `purchaseItemId` VARCHAR(191) NOT NULL,
    ADD COLUMN `purchaseReceivingId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `raw_material` DROP COLUMN `average_cost`,
    DROP COLUMN `code`,
    DROP COLUMN `created_at`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `unit_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `averageCost` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `sku` VARCHAR(100) NULL,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `unitId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `raw_material_unit_conversion` DROP COLUMN `created_at`,
    DROP COLUMN `from_unit_id`,
    DROP COLUMN `multiplier`,
    DROP COLUMN `raw_material_id`,
    DROP COLUMN `to_unit_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `factor` DECIMAL(15, 6) NOT NULL,
    ADD COLUMN `rawMaterialId` VARCHAR(191) NOT NULL,
    ADD COLUMN `unitId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `recipe_item` DROP COLUMN `created_at`,
    DROP COLUMN `product_id`,
    DROP COLUMN `raw_material_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `productId` VARCHAR(191) NOT NULL,
    ADD COLUMN `rawMaterialId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `refresh_token` DROP COLUMN `created_at`,
    DROP COLUMN `expires_at`,
    DROP COLUMN `revoked_at`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `token_hash`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL,
    ADD COLUMN `revokedAt` DATETIME(3) NULL,
    ADD COLUMN `tokenHash` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `stock` DROP COLUMN `max_quantity`,
    DROP COLUMN `min_quantity`,
    DROP COLUMN `raw_material_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `minimumStock` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    ADD COLUMN `rawMaterialId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `stock_movement` DROP COLUMN `created_at`,
    DROP COLUMN `notes`,
    DROP COLUMN `raw_material_id`,
    DROP COLUMN `reference_id`,
    DROP COLUMN `reference_type`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `unit_cost`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `rawMaterialId` VARCHAR(191) NOT NULL,
    ADD COLUMN `referenceId` VARCHAR(191) NULL,
    ADD COLUMN `referenceType` VARCHAR(191) NULL,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `unitCost` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `created_at`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tenant` DROP COLUMN `code`,
    DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `slug` VARCHAR(100) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tenant_module` DROP COLUMN `created_at`,
    DROP COLUMN `expired_at`,
    DROP COLUMN `module_id`,
    DROP COLUMN `started_at`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expiredAt` DATETIME(3) NULL,
    ADD COLUMN `moduleId` VARCHAR(191) NOT NULL,
    ADD COLUMN `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `cashier_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `invoice_number`,
    DROP COLUMN `notes`,
    DROP COLUMN `service_charge`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `total_hpp`,
    DROP COLUMN `total_paid`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `cashierId` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `invoiceNumber` VARCHAR(100) NOT NULL,
    ADD COLUMN `serviceCharge` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalHpp` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalPaid` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `transaction_item` DROP COLUMN `created_at`,
    DROP COLUMN `product_id`,
    DROP COLUMN `product_name`,
    DROP COLUMN `selling_price`,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `productId` VARCHAR(191) NOT NULL,
    ADD COLUMN `productName` VARCHAR(150) NOT NULL,
    ADD COLUMN `sellingPrice` INTEGER NOT NULL,
    ADD COLUMN `transactionId` VARCHAR(191) NOT NULL,
    ALTER COLUMN `hpp` DROP DEFAULT,
    ALTER COLUMN `subtotal` DROP DEFAULT,
    ALTER COLUMN `profit` DROP DEFAULT;

-- AlterTable
ALTER TABLE `transaction_setting` DROP COLUMN `created_at`,
    DROP COLUMN `service_charge_enabled`,
    DROP COLUMN `service_charge_rate`,
    DROP COLUMN `tax_enabled`,
    DROP COLUMN `tax_rate`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `serviceChargeEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `serviceChargeRate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `taxEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `taxRate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `unit` DROP COLUMN `created_at`,
    DROP COLUMN `status`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `code` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `unit_conversion` DROP COLUMN `created_at`,
    DROP COLUMN `from_unit_id`,
    DROP COLUMN `multiplier`,
    DROP COLUMN `to_unit_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `factor` DECIMAL(15, 6) NOT NULL,
    ADD COLUMN `fromUnitId` VARCHAR(191) NOT NULL,
    ADD COLUMN `toUnitId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `created_at`,
    DROP COLUMN `last_login_at`,
    DROP COLUMN `tenant_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `tenantId` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `email` VARCHAR(150) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('SUPER_ADMIN', 'OWNER', 'ADMIN', 'CASHIER') NOT NULL DEFAULT 'CASHIER';

-- CreateIndex
CREATE INDEX `audit_log_tenantId_idx` ON `audit_log`(`tenantId`);

-- CreateIndex
CREATE INDEX `audit_log_userId_idx` ON `audit_log`(`userId`);

-- CreateIndex
CREATE INDEX `audit_log_module_idx` ON `audit_log`(`module`);

-- CreateIndex
CREATE INDEX `audit_log_entityType_entityId_idx` ON `audit_log`(`entityType`, `entityId`);

-- CreateIndex
CREATE INDEX `audit_log_createdAt_idx` ON `audit_log`(`createdAt`);

-- CreateIndex
CREATE INDEX `category_tenantId_idx` ON `category`(`tenantId`);

-- CreateIndex
CREATE INDEX `category_status_idx` ON `category`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `category_tenantId_name_key` ON `category`(`tenantId`, `name`);

-- CreateIndex
CREATE INDEX `payment_transactionId_idx` ON `payment`(`transactionId`);

-- CreateIndex
CREATE INDEX `payment_paymentMethodId_idx` ON `payment`(`paymentMethodId`);

-- CreateIndex
CREATE UNIQUE INDEX `payment_method_code_key` ON `payment_method`(`code`);

-- CreateIndex
CREATE INDEX `payment_method_usageType_idx` ON `payment_method`(`usageType`);

-- CreateIndex
CREATE INDEX `payment_method_status_idx` ON `payment_method`(`status`);

-- CreateIndex
CREATE INDEX `product_tenantId_idx` ON `product`(`tenantId`);

-- CreateIndex
CREATE INDEX `product_categoryId_idx` ON `product`(`categoryId`);

-- CreateIndex
CREATE INDEX `product_type_idx` ON `product`(`type`);

-- CreateIndex
CREATE INDEX `product_status_idx` ON `product`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `product_tenantId_name_key` ON `product`(`tenantId`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `product_tenantId_sku_key` ON `product`(`tenantId`, `sku`);

-- CreateIndex
CREATE INDEX `purchase_tenantId_idx` ON `purchase`(`tenantId`);

-- CreateIndex
CREATE INDEX `purchase_supplierId_idx` ON `purchase`(`supplierId`);

-- CreateIndex
CREATE INDEX `purchase_purchaseDate_idx` ON `purchase`(`purchaseDate`);

-- CreateIndex
CREATE INDEX `purchase_status_idx` ON `purchase`(`status`);

-- CreateIndex
CREATE INDEX `purchase_purchaseType_idx` ON `purchase`(`purchaseType`);

-- CreateIndex
CREATE INDEX `purchase_paymentStatus_idx` ON `purchase`(`paymentStatus`);

-- CreateIndex
CREATE UNIQUE INDEX `purchase_tenantId_purchaseNumber_key` ON `purchase`(`tenantId`, `purchaseNumber`);

-- CreateIndex
CREATE INDEX `purchase_item_purchaseId_idx` ON `purchase_item`(`purchaseId`);

-- CreateIndex
CREATE INDEX `purchase_item_rawMaterialId_idx` ON `purchase_item`(`rawMaterialId`);

-- CreateIndex
CREATE INDEX `purchase_item_unitId_idx` ON `purchase_item`(`unitId`);

-- CreateIndex
CREATE INDEX `purchase_payment_purchaseId_idx` ON `purchase_payment`(`purchaseId`);

-- CreateIndex
CREATE INDEX `purchase_payment_paymentMethodId_idx` ON `purchase_payment`(`paymentMethodId`);

-- CreateIndex
CREATE INDEX `purchase_receiving_purchaseId_idx` ON `purchase_receiving`(`purchaseId`);

-- CreateIndex
CREATE INDEX `purchase_receiving_receivingDate_idx` ON `purchase_receiving`(`receivingDate`);

-- CreateIndex
CREATE UNIQUE INDEX `purchase_receiving_purchaseId_receivingNumber_key` ON `purchase_receiving`(`purchaseId`, `receivingNumber`);

-- CreateIndex
CREATE INDEX `purchase_receiving_item_purchaseReceivingId_idx` ON `purchase_receiving_item`(`purchaseReceivingId`);

-- CreateIndex
CREATE INDEX `purchase_receiving_item_purchaseItemId_idx` ON `purchase_receiving_item`(`purchaseItemId`);

-- CreateIndex
CREATE INDEX `raw_material_tenantId_idx` ON `raw_material`(`tenantId`);

-- CreateIndex
CREATE INDEX `raw_material_unitId_idx` ON `raw_material`(`unitId`);

-- CreateIndex
CREATE INDEX `raw_material_status_idx` ON `raw_material`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `raw_material_tenantId_name_key` ON `raw_material`(`tenantId`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `raw_material_tenantId_sku_key` ON `raw_material`(`tenantId`, `sku`);

-- CreateIndex
CREATE UNIQUE INDEX `raw_material_unit_conversion_rawMaterialId_unitId_key` ON `raw_material_unit_conversion`(`rawMaterialId`, `unitId`);

-- CreateIndex
CREATE INDEX `recipe_item_productId_idx` ON `recipe_item`(`productId`);

-- CreateIndex
CREATE INDEX `recipe_item_rawMaterialId_idx` ON `recipe_item`(`rawMaterialId`);

-- CreateIndex
CREATE UNIQUE INDEX `recipe_item_productId_rawMaterialId_key` ON `recipe_item`(`productId`, `rawMaterialId`);

-- CreateIndex
CREATE UNIQUE INDEX `refresh_token_tokenHash_key` ON `refresh_token`(`tokenHash`);

-- CreateIndex
CREATE INDEX `refresh_token_userId_idx` ON `refresh_token`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `stock_rawMaterialId_key` ON `stock`(`rawMaterialId`);

-- CreateIndex
CREATE INDEX `stock_movement_tenantId_idx` ON `stock_movement`(`tenantId`);

-- CreateIndex
CREATE INDEX `stock_movement_rawMaterialId_idx` ON `stock_movement`(`rawMaterialId`);

-- CreateIndex
CREATE INDEX `stock_movement_type_idx` ON `stock_movement`(`type`);

-- CreateIndex
CREATE INDEX `stock_movement_createdAt_idx` ON `stock_movement`(`createdAt`);

-- CreateIndex
CREATE INDEX `stock_movement_referenceId_idx` ON `stock_movement`(`referenceId`);

-- CreateIndex
CREATE INDEX `supplier_tenantId_idx` ON `supplier`(`tenantId`);

-- CreateIndex
CREATE INDEX `supplier_status_idx` ON `supplier`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `supplier_tenantId_code_key` ON `supplier`(`tenantId`, `code`);

-- CreateIndex
CREATE UNIQUE INDEX `tenant_slug_key` ON `tenant`(`slug`);

-- CreateIndex
CREATE INDEX `tenant_module_tenantId_idx` ON `tenant_module`(`tenantId`);

-- CreateIndex
CREATE INDEX `tenant_module_moduleId_idx` ON `tenant_module`(`moduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `tenant_module_tenantId_moduleId_key` ON `tenant_module`(`tenantId`, `moduleId`);

-- CreateIndex
CREATE INDEX `transaction_item_transactionId_idx` ON `transaction_item`(`transactionId`);

-- CreateIndex
CREATE INDEX `transaction_item_productId_idx` ON `transaction_item`(`productId`);

-- CreateIndex
CREATE UNIQUE INDEX `transaction_setting_tenantId_key` ON `transaction_setting`(`tenantId`);

-- CreateIndex
CREATE UNIQUE INDEX `unit_conversion_fromUnitId_toUnitId_key` ON `unit_conversion`(`fromUnitId`, `toUnitId`);

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);

-- CreateIndex
CREATE INDEX `user_tenantId_idx` ON `user`(`tenantId`);

-- CreateIndex
CREATE INDEX `user_role_idx` ON `user`(`role`);

-- CreateIndex
CREATE INDEX `user_status_idx` ON `user`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `user_tenantId_username_key` ON `user`(`tenantId`, `username`);

-- AddForeignKey
ALTER TABLE `tenant_module` ADD CONSTRAINT `tenant_module_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenant_module` ADD CONSTRAINT `tenant_module_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material` ADD CONSTRAINT `raw_material_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material` ADD CONSTRAINT `raw_material_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_item` ADD CONSTRAINT `recipe_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_item` ADD CONSTRAINT `recipe_item_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier` ADD CONSTRAINT `supplier_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase` ADD CONSTRAINT `purchase_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase` ADD CONSTRAINT `purchase_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_item` ADD CONSTRAINT `purchase_item_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving` ADD CONSTRAINT `purchase_receiving_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving_item` ADD CONSTRAINT `purchase_receiving_item_purchaseReceivingId_fkey` FOREIGN KEY (`purchaseReceivingId`) REFERENCES `purchase_receiving`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_receiving_item` ADD CONSTRAINT `purchase_receiving_item_purchaseItemId_fkey` FOREIGN KEY (`purchaseItemId`) REFERENCES `purchase_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_payment` ADD CONSTRAINT `purchase_payment_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_payment` ADD CONSTRAINT `purchase_payment_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movement` ADD CONSTRAINT `stock_movement_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movement` ADD CONSTRAINT `stock_movement_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_item` ADD CONSTRAINT `transaction_item_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_item` ADD CONSTRAINT `transaction_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_method` ADD CONSTRAINT `payment_method_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_method`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit_conversion` ADD CONSTRAINT `unit_conversion_fromUnitId_fkey` FOREIGN KEY (`fromUnitId`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit_conversion` ADD CONSTRAINT `unit_conversion_toUnitId_fkey` FOREIGN KEY (`toUnitId`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material_unit_conversion` ADD CONSTRAINT `raw_material_unit_conversion_rawMaterialId_fkey` FOREIGN KEY (`rawMaterialId`) REFERENCES `raw_material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_material_unit_conversion` ADD CONSTRAINT `raw_material_unit_conversion_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_setting` ADD CONSTRAINT `transaction_setting_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
