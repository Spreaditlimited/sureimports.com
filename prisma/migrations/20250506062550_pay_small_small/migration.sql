/*
  Warnings:

  - The values [INCOME,EXPENSE] on the enum `Transaction_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `type` ENUM('CREDIT', 'DEBIT', 'TRANSFER') NOT NULL;

-- AlterTable
ALTER TABLE `wallet` MODIFY `currency` VARCHAR(191) NOT NULL DEFAULT 'NGN';

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pidAccount` VARCHAR(191) NOT NULL,
    `accountName` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `customer_code` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `type` ENUM('CASH', 'BANK', 'CREDIT_CARD', 'INVESTMENT', 'SAVINGS', 'OTHER') NOT NULL,
    `balance` DECIMAL(65, 30) NULL DEFAULT 0,
    `currency` VARCHAR(191) NULL DEFAULT 'NGN',
    `color` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Account_pidAccount_key`(`pidAccount`),
    INDEX `Account_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaySmallSmall` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pidPaySmallSmall` VARCHAR(191) NOT NULL,
    `pidUser` VARCHAR(191) NOT NULL,
    `pidProduct` VARCHAR(191) NULL,
    `productName` VARCHAR(191) NULL,
    `productDescription` VARCHAR(191) NULL,
    `amount` VARCHAR(191) NULL,
    `status` ENUM('SAVED', 'STARTED', 'COMPLETED', 'CANCELLED') NOT NULL,
    `ext1` VARCHAR(191) NULL,
    `ext2` VARCHAR(191) NULL,
    `statusx` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PaySmallSmall_pidPaySmallSmall_key`(`pidPaySmallSmall`),
    UNIQUE INDEX `PaySmallSmall_pidUser_key`(`pidUser`),
    UNIQUE INDEX `PaySmallSmall_pidProduct_key`(`pidProduct`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`pidUser`) ON DELETE CASCADE ON UPDATE CASCADE;
