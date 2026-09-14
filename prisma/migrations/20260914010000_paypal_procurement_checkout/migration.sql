CREATE TABLE `paypal_procurement_checkouts` (
  `id` VARCHAR(64) NOT NULL,
  `stageKey` VARCHAR(64) NOT NULL,
  `pidOrder` VARCHAR(191) NOT NULL,
  `pidUser` VARCHAR(191) NOT NULL,
  `providerReference` VARCHAR(191) NULL,
  `captureReference` VARCHAR(191) NULL,
  `status` VARCHAR(24) NOT NULL DEFAULT 'PENDING',
  `amountMinor` INTEGER NOT NULL,
  `context` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `paypal_procurement_stage_key` (`stageKey`),
  UNIQUE INDEX `paypal_procurement_reference` (`providerReference`),
  INDEX `paypal_procurement_user_order` (`pidUser`, `pidOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
