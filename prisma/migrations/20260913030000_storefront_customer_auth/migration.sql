CREATE TABLE `procurement_storefront_customers` (
 `id` VARCHAR(191) NOT NULL PRIMARY KEY,
 `partnerId` VARCHAR(191) NOT NULL,
 `pidUser` VARCHAR(191) NOT NULL,
 `email` VARCHAR(191) NOT NULL,
 `firstName` VARCHAR(100) NOT NULL,
 `passwordHash` VARCHAR(191) NOT NULL,
 `verifiedAt` DATETIME(3) NULL,
 `version` INTEGER NOT NULL DEFAULT 0,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 UNIQUE KEY `procurement_storefront_customers_partnerId_email_key` (`partnerId`,`email`),
 UNIQUE KEY `procurement_storefront_customers_partnerId_pidUser_key` (`partnerId`,`pidUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `procurement_storefront_auth_tokens` (
 `hash` CHAR(64) NOT NULL PRIMARY KEY,
 `customerId` VARCHAR(191) NOT NULL,
 `hostname` VARCHAR(191) NOT NULL,
 `purpose` VARCHAR(16) NOT NULL,
 `expiresAt` DATETIME(3) NOT NULL,
 `usedAt` DATETIME(3) NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 KEY `storefront_auth_token_customer_purpose_idx` (`customerId`,`purpose`,`createdAt`),
 KEY `procurement_storefront_auth_tokens_expiresAt_idx` (`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `procurement_storefront_auth_limits` (
 `key` CHAR(64) NOT NULL PRIMARY KEY,
 `count` INTEGER NOT NULL DEFAULT 0,
 `expiresAt` DATETIME(3) NOT NULL,
 KEY `procurement_storefront_auth_limits_expiresAt_idx` (`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
