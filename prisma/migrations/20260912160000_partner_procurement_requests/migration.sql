CREATE TABLE `procurement_partner_requests` (
  `id` VARCHAR(80) NOT NULL,
  `partnerId` VARCHAR(191) NOT NULL,
  `externalReference` VARCHAR(80) NOT NULL,
  `idempotencyKey` VARCHAR(100) NOT NULL,
  `payloadHash` CHAR(64) NOT NULL,
  `detailsCiphertext` LONGTEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED',
  `actorPid` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `partner_request_reference_key` (`partnerId`, `externalReference`),
  UNIQUE INDEX `partner_request_retry_key` (`partnerId`, `idempotencyKey`),
  INDEX `partner_request_owner_idx` (`partnerId`, `createdAt`),
  INDEX `partner_request_queue_idx` (`status`, `createdAt`),
  CONSTRAINT `partner_request_owner_fk` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partners` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
