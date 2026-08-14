CREATE TABLE `seo_linkable_pages` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `pidLink` VARCHAR(80) NOT NULL,
  `url` VARCHAR(1000) NOT NULL,
  `normalizedUrl` VARCHAR(500) NOT NULL,
  `label` VARCHAR(180) NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'active',
  `source` VARCHAR(40) NOT NULL DEFAULT 'admin',
  `approvedBy` VARCHAR(80) NULL,
  `approvedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `seo_linkable_pages_pidLink_key`(`pidLink`),
  UNIQUE INDEX `seo_linkable_pages_normalizedUrl_key`(`normalizedUrl`),
  INDEX `seo_linkable_pages_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `seo_change_rewrite_artifacts` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `pidArtifact` VARCHAR(80) NOT NULL,
  `pidChange` VARCHAR(80) NOT NULL,
  `sourceContentHash` CHAR(64) NOT NULL,
  `rewrittenHtml` LONGTEXT NULL,
  `appliedChangesJson` LONGTEXT NULL,
  `discoveredLinksJson` LONGTEXT NULL,
  `pendingLinksJson` LONGTEXT NULL,
  `decisionsJson` LONGTEXT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'rewriting',
  `errorCode` VARCHAR(80) NULL,
  `errorMessage` TEXT NULL,
  `attemptCount` INTEGER NOT NULL DEFAULT 0,
  `generatedAt` DATETIME(3) NULL,
  `reviewedAt` DATETIME(3) NULL,
  `appliedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `seo_change_rewrite_artifacts_pidArtifact_key`(`pidArtifact`),
  UNIQUE INDEX `seo_change_rewrite_artifacts_pidChange_key`(`pidChange`),
  INDEX `seo_change_rewrite_artifacts_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `seo_change_pipeline_attempts` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `pidAttempt` VARCHAR(80) NOT NULL,
  `pidChange` VARCHAR(80) NOT NULL,
  `stage` VARCHAR(40) NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'started',
  `errorCode` VARCHAR(80) NULL,
  `errorMessage` TEXT NULL,
  `detailsJson` LONGTEXT NULL,
  `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `seo_change_pipeline_attempts_pidAttempt_key`(`pidAttempt`),
  INDEX `seo_change_pipeline_attempts_pidChange_stage_idx`(`pidChange`, `stage`),
  INDEX `seo_change_pipeline_attempts_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `seo_linkable_pages` (
  `pidLink`, `url`, `normalizedUrl`, `label`, `status`, `source`, `approvedAt`, `createdAt`, `updatedAt`
) VALUES
  ('SEOLINK_SUPPLIER_INTELLIGENCE', '/supplier-intelligence', '/supplier-intelligence', 'Supplier Intelligence', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('SEOLINK_CORPORATE_SOURCING', '/corporate-sourcing', '/corporate-sourcing', 'Corporate Sourcing', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('SEOLINK_BUY_CHINESE_WEBSITES', '/buy-from-chinese-websites', '/buy-from-chinese-websites', 'Buy From Chinese Websites', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('SEOLINK_LINESCOUT', 'https://linescout.sureimports.com/', 'https://linescout.sureimports.com/', 'LineScout', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('SEOLINK_SHIP_WITH_US', '/ship-with-us', '/ship-with-us', 'Ship With Us', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('SEOLINK_IMPORT_HUB', '/import-from-china-to-nigeria', '/import-from-china-to-nigeria', 'Import Hub', 'active', 'system', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
