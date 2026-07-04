-- CreateTable
CREATE TABLE IF NOT EXISTS `intelligence_niches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pidNiche` VARCHAR(80) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `summary` TEXT NULL,
    `status` VARCHAR(40) NOT NULL DEFAULT 'draft',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `intelligence_niches_pidNiche_key`(`pidNiche`),
    UNIQUE INDEX `intelligence_niches_slug_key`(`slug`),
    INDEX `intelligence_niches_status_idx`(`status`),
    INDEX `intelligence_niches_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `intelligence_suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pidSupplier` VARCHAR(80) NOT NULL,
    `nicheId` VARCHAR(80) NOT NULL,
    `supplierName` VARCHAR(180) NOT NULL,
    `productFit` TEXT NOT NULL,
    `officialWebsite` VARCHAR(500) NOT NULL,
    `officialContactPage` VARCHAR(500) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(120) NULL,
    `whatsapp` VARCHAR(120) NULL,
    `address` TEXT NULL,
    `countryRegion` VARCHAR(180) NULL,
    `sourceType` VARCHAR(80) NOT NULL,
    `verifiedFrom` LONGTEXT NOT NULL,
    `buyerNotes` LONGTEXT NOT NULL,
    `verificationStatus` VARCHAR(80) NOT NULL,
    `lastVerifiedAt` DATETIME(3) NULL,
    `status` VARCHAR(40) NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `intelligence_suppliers_pidSupplier_key`(`pidSupplier`),
    INDEX `intelligence_suppliers_nicheId_idx`(`nicheId`),
    INDEX `intelligence_suppliers_status_idx`(`status`),
    INDEX `intelligence_suppliers_verificationStatus_idx`(`verificationStatus`),
    INDEX `intelligence_suppliers_lastVerifiedAt_idx`(`lastVerifiedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `intelligence_subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pidSubscription` VARCHAR(80) NOT NULL,
    `pidUser` VARCHAR(191) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `plan` VARCHAR(60) NOT NULL,
    `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
    `paystackReference` VARCHAR(120) NULL,
    `paystackCustomerCode` VARCHAR(120) NULL,
    `paystackSubscriptionCode` VARCHAR(120) NULL,
    `paystackEmailToken` VARCHAR(120) NULL,
    `amountKobo` INTEGER NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'NGN',
    `currentPeriodStart` DATETIME(3) NULL,
    `currentPeriodEnd` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `intelligence_subscriptions_pidSubscription_key`(`pidSubscription`),
    UNIQUE INDEX `intelligence_subscriptions_paystackReference_key`(`paystackReference`),
    INDEX `intelligence_subscriptions_pidUser_idx`(`pidUser`),
    INDEX `intelligence_subscriptions_email_idx`(`email`),
    INDEX `intelligence_subscriptions_status_idx`(`status`),
    INDEX `intelligence_subscriptions_plan_idx`(`plan`),
    INDEX `intelligence_subscriptions_currentPeriodEnd_idx`(`currentPeriodEnd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @supplier_niche_fk_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'intelligence_suppliers'
    AND CONSTRAINT_NAME = 'intelligence_suppliers_nicheId_fkey'
);

SET @add_supplier_niche_fk_sql := IF(
  @supplier_niche_fk_exists = 0,
  'ALTER TABLE `intelligence_suppliers` ADD CONSTRAINT `intelligence_suppliers_nicheId_fkey` FOREIGN KEY (`nicheId`) REFERENCES `intelligence_niches`(`pidNiche`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);

PREPARE add_supplier_niche_fk_statement FROM @add_supplier_niche_fk_sql;
EXECUTE add_supplier_niche_fk_statement;
DEALLOCATE PREPARE add_supplier_niche_fk_statement;

SET @subscription_user_fk_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'intelligence_subscriptions'
    AND CONSTRAINT_NAME = 'intelligence_subscriptions_pidUser_fkey'
);

SET @add_subscription_user_fk_sql := IF(
  @subscription_user_fk_exists = 0,
  'ALTER TABLE `intelligence_subscriptions` ADD CONSTRAINT `intelligence_subscriptions_pidUser_fkey` FOREIGN KEY (`pidUser`) REFERENCES `users`(`pidUser`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);

PREPARE add_subscription_user_fk_statement FROM @add_subscription_user_fk_sql;
EXECUTE add_subscription_user_fk_statement;
DEALLOCATE PREPARE add_subscription_user_fk_statement;
