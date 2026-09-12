CREATE TABLE `partner_wallet_accounts` (
  `partnerId` VARCHAR(191) NOT NULL,
  `bankCiphertext` LONGTEXT NULL,
  `bankVerifiedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`partnerId`),
  CONSTRAINT `partner_wallet_owner_fk` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partners` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `partner_wallet_credits` (
  `orderId` VARCHAR(80) NOT NULL,
  `partnerId` VARCHAR(191) NOT NULL,
  `amountMinor` BIGINT NOT NULL,
  `state` VARCHAR(24) NOT NULL DEFAULT 'PENDING',
  `deliveryConfirmedAt` DATETIME(3) NULL,
  `deliveryMode` VARCHAR(24) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`orderId`),
  INDEX `partner_wallet_credit_state_idx` (`partnerId`, `state`),
  CONSTRAINT `partner_wallet_credit_owner_fk` FOREIGN KEY (`partnerId`) REFERENCES `partner_wallet_accounts` (`partnerId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `partner_wallet_credit_order_fk` FOREIGN KEY (`orderId`) REFERENCES `procurement_partner_customer_orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `partner_wallet_withdrawals` (
  `id` VARCHAR(80) NOT NULL,
  `partnerId` VARCHAR(191) NOT NULL,
  `retryKey` VARCHAR(100) NOT NULL,
  `amountMinor` BIGINT NOT NULL,
  `status` VARCHAR(24) NOT NULL DEFAULT 'REQUESTED',
  `destinationCiphertext` LONGTEXT NOT NULL,
  `transferCode` VARCHAR(100) NULL,
  `failureCode` VARCHAR(100) NULL,
  `processingAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `partner_wallet_withdraw_retry_key` (`partnerId`, `retryKey`),
  INDEX `partner_wallet_withdraw_status_idx` (`partnerId`, `status`),
  CONSTRAINT `partner_wallet_withdraw_owner_fk` FOREIGN KEY (`partnerId`) REFERENCES `partner_wallet_accounts` (`partnerId`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `partner_wallet_events` (
  `id` VARCHAR(80) NOT NULL,
  `partnerId` VARCHAR(191) NOT NULL,
  `subjectId` VARCHAR(100) NOT NULL,
  `actorPid` VARCHAR(191) NOT NULL,
  `action` VARCHAR(40) NOT NULL,
  `detailsCiphertext` LONGTEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `partner_wallet_audit_idx` (`partnerId`, `createdAt`),
  CONSTRAINT `partner_wallet_event_owner_fk` FOREIGN KEY (`partnerId`) REFERENCES `partner_wallet_accounts` (`partnerId`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
