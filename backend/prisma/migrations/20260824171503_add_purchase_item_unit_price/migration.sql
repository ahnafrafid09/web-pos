/*
  Warnings:

  - Added the required column `unitPrice` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchaseitem` ADD COLUMN `unitPrice` INTEGER NOT NULL;
