CREATE TABLE IF NOT EXISTS `seo_manual_gsc_dispatch_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pidToken` VARCHAR(80) NOT NULL,
  `tokenHash` CHAR(64) NOT NULL,
  `pidUser` VARCHAR(80) NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `expiresAt` DATETIME(3) NOT NULL,
  `consumedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seo_manual_gsc_dispatch_tokens_pidToken_key` (`pidToken`),
  UNIQUE KEY `seo_manual_gsc_dispatch_tokens_tokenHash_key` (`tokenHash`),
  KEY `seo_manual_gsc_dispatch_tokens_status_expiresAt_idx` (`status`, `expiresAt`),
  KEY `seo_manual_gsc_dispatch_tokens_pidUser_idx` (`pidUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
