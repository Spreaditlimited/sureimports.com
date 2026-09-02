ALTER TABLE `verify_supplier`
  ADD COLUMN `userEmail` VARCHAR(255) NULL,
  ADD COLUMN `customerName` VARCHAR(240) NULL,
  ADD COLUMN `supplierNameChinese` VARCHAR(255) NULL,
  ADD COLUMN `registrationNumber` VARCHAR(120) NULL,
  ADD COLUMN `supplierEmail` VARCHAR(255) NULL,
  ADD COLUMN `supplierWechat` VARCHAR(160) NULL,
  ADD COLUMN `supplierAddressChinese` TEXT NULL,
  ADD COLUMN `marketplaceUrls` JSON NULL,
  ADD COLUMN `verificationType` VARCHAR(40) NOT NULL DEFAULT 'ONLINE',
  ADD COLUMN `billingCountry` VARCHAR(120) NULL,
  ADD COLUMN `transportQuoteStatus` VARCHAR(40) NULL,
  ADD COLUMN `transportEstimateCnyFen` INTEGER NULL,
  ADD COLUMN `transportFeeNgnKobo` INTEGER NULL,
  ADD COLUMN `transportFeeUsdCents` INTEGER NULL,
  ADD COLUMN `transportDistanceMeters` INTEGER NULL,
  ADD COLUMN `transportDurationSeconds` INTEGER NULL,
  ADD COLUMN `transportEstimateSource` VARCHAR(80) NULL,
  ADD COLUMN `supplierLatitude` DECIMAL(10,7) NULL,
  ADD COLUMN `supplierLongitude` DECIMAL(10,7) NULL,
  ADD COLUMN `quoteExpiresAt` DATETIME(3) NULL,
  ADD COLUMN `assignedTo` VARCHAR(191) NULL,
  ADD COLUMN `customerMessage` TEXT NULL,
  ADD COLUMN `adminNotes` TEXT NULL,
  ADD COLUMN `reportOutcome` VARCHAR(60) NULL,
  ADD COLUMN `reportSummary` LONGTEXT NULL,
  ADD COLUMN `reportUrl` VARCHAR(1000) NULL,
  ADD COLUMN `termsVersion` VARCHAR(40) NULL,
  ADD COLUMN `submittedAt` DATETIME(3) NULL,
  ADD COLUMN `completedAt` DATETIME(3) NULL;

UPDATE `verify_supplier`
SET `verificationType` = 'PHYSICAL',
    `status` = CASE
      WHEN `status` = 'pending-payment' THEN 'AWAITING_PAYMENT'
      WHEN `status` = 'processing-request' THEN 'IN_REVIEW'
      WHEN `status` = 'request-processed' THEN 'COMPLETED'
      WHEN `status` IN ('cancelled', 'request-cancelled') THEN 'CANCELLED'
      ELSE COALESCE(UPPER(`status`), 'AWAITING_PAYMENT')
    END,
    `submittedAt` = COALESCE(`createdAt`, CURRENT_TIMESTAMP(3));

CREATE INDEX `verify_supplier_pidUser_status_idx` ON `verify_supplier`(`pidUser`, `status`);
CREATE INDEX `verify_supplier_status_createdAt_idx` ON `verify_supplier`(`status`, `createdAt`);
CREATE INDEX `verify_supplier_verificationType_status_idx` ON `verify_supplier`(`verificationType`, `status`);

CREATE TABLE `supplier_verification_settings` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `settingKey` VARCHAR(80) NOT NULL,
  `feeNgnKobo` INTEGER NOT NULL,
  `feeUsdCents` INTEGER NOT NULL,
  `officeAddressChinese` TEXT NULL,
  `officeLatitude` DECIMAL(10,7) NULL,
  `officeLongitude` DECIMAL(10,7) NULL,
  `onlineEnabled` BOOLEAN NOT NULL DEFAULT true,
  `physicalEnabled` BOOLEAN NOT NULL DEFAULT true,
  `quoteValidityDays` INTEGER NOT NULL DEFAULT 7,
  `onlineTurnaroundDays` INTEGER NOT NULL DEFAULT 3,
  `physicalTurnaroundDays` INTEGER NOT NULL DEFAULT 5,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `supplier_verification_settings_settingKey_key`(`settingKey`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `supplier_verification_settings`
  (`settingKey`, `feeNgnKobo`, `feeUsdCents`)
VALUES ('supplier_verification', 40000000, 25000);

CREATE TABLE `supplier_verification_payments` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `pidPayment` VARCHAR(80) NOT NULL,
  `requestId` VARCHAR(191) NOT NULL,
  `paymentProvider` VARCHAR(40) NOT NULL,
  `providerReference` VARCHAR(191) NULL,
  `providerCaptureReference` VARCHAR(191) NULL,
  `authorizationUrl` VARCHAR(2000) NULL,
  `amountMinor` INTEGER NOT NULL,
  `currency` VARCHAR(10) NOT NULL,
  `serviceFeeMinor` INTEGER NOT NULL,
  `transportFeeMinor` INTEGER NOT NULL DEFAULT 0,
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `providerEventId` VARCHAR(191) NULL,
  `paidAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `supplier_verification_payments_pidPayment_key`(`pidPayment`),
  UNIQUE INDEX `supplier_verification_payments_providerReference_key`(`providerReference`),
  UNIQUE INDEX `supplier_verification_payments_providerEventId_key`(`providerEventId`),
  INDEX `supplier_verification_payments_requestId_status_idx`(`requestId`, `status`),
  INDEX `supplier_verification_payments_status_createdAt_idx`(`status`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `supplier_verification_events` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `pidEvent` VARCHAR(80) NOT NULL,
  `requestId` VARCHAR(191) NOT NULL,
  `eventType` VARCHAR(60) NOT NULL,
  `fromStatus` VARCHAR(40) NULL,
  `toStatus` VARCHAR(40) NULL,
  `message` TEXT NULL,
  `visibility` VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
  `actorId` VARCHAR(191) NULL,
  `actorEmail` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `supplier_verification_events_pidEvent_key`(`pidEvent`),
  INDEX `supplier_verification_events_requestId_createdAt_idx`(`requestId`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `supplier_verification_payments`
  ADD CONSTRAINT `supplier_verification_payments_requestId_fkey`
  FOREIGN KEY (`requestId`) REFERENCES `verify_supplier`(`pidVerifySupplier`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `supplier_verification_events`
  ADD CONSTRAINT `supplier_verification_events_requestId_fkey`
  FOREIGN KEY (`requestId`) REFERENCES `verify_supplier`(`pidVerifySupplier`) ON DELETE CASCADE ON UPDATE CASCADE;
