CREATE TABLE IF NOT EXISTS `intelligence_search_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pidSearch` VARCHAR(80) NOT NULL,
  `pidUser` VARCHAR(80) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `query` VARCHAR(220) NOT NULL,
  `targetSupplierCount` INT NOT NULL DEFAULT 3,
  `notes` LONGTEXT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'awaiting_admin',
  `creditCost` INT NOT NULL DEFAULT 1,
  `creditReserved` TINYINT(1) NOT NULL DEFAULT 1,
  `relatedPidJob` VARCHAR(80) NULL,
  `adminNotes` LONGTEXT NULL,
  `progressStage` VARCHAR(180) NULL,
  `progressPercent` INT NOT NULL DEFAULT 0,
  `resultSlug` VARCHAR(180) NULL,
  `creditSource` VARCHAR(40) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NULL,
  UNIQUE KEY `intelligence_search_requests_pid_key` (`pidSearch`),
  KEY `intelligence_search_requests_user_idx` (`pidUser`),
  KEY `intelligence_search_requests_status_idx` (`status`),
  KEY `intelligence_search_requests_job_idx` (`relatedPidJob`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `intelligence_credit_transactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pidTransaction` VARCHAR(80) NOT NULL,
  `pidUser` VARCHAR(80) NOT NULL,
  `amount` INT NOT NULL,
  `reason` VARCHAR(120) NOT NULL,
  `reference` VARCHAR(160) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `intelligence_credit_transactions_pid_key` (`pidTransaction`),
  KEY `intelligence_credit_transactions_user_idx` (`pidUser`),
  KEY `intelligence_credit_transactions_reference_idx` (`reference`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @credit_source_column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'intelligence_search_requests'
    AND COLUMN_NAME = 'creditSource'
);

SET @add_credit_source_sql := IF(
  @credit_source_column_exists = 0,
  'ALTER TABLE `intelligence_search_requests` ADD COLUMN `creditSource` VARCHAR(40) NULL',
  'SELECT 1'
);

PREPARE add_credit_source_statement FROM @add_credit_source_sql;
EXECUTE add_credit_source_statement;
DEALLOCATE PREPARE add_credit_source_statement;

UPDATE `intelligence_search_requests` r
SET r.`creditSource` = CASE
  WHEN EXISTS (
    SELECT 1
    FROM `intelligence_credit_transactions` t
    WHERE t.`pidUser` = r.`pidUser`
      AND t.`reason` = 'extra_search_credits_purchase'
      AND t.`amount` > 0
      AND t.`createdAt` <= r.`createdAt`
  ) THEN 'paid'
  WHEN EXISTS (
    SELECT 1
    FROM `intelligence_credit_transactions` t
    WHERE t.`pidUser` = r.`pidUser`
      AND t.`reason` IN ('starter_monthly_search_credits', 'pro_monthly_search_credits')
      AND t.`amount` > 0
      AND t.`createdAt` <= r.`createdAt`
  ) THEN 'subscription'
  ELSE 'free'
END
WHERE r.`creditCost` > 0
  AND (r.`creditSource` IS NULL OR r.`creditSource` = '');
