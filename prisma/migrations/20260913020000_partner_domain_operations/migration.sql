ALTER TABLE `procurement_partner_domains`
 ADD COLUMN `status` VARCHAR(40) NOT NULL DEFAULT 'OWNERSHIP_REQUIRED',
 ADD COLUMN `primary` BOOLEAN NOT NULL DEFAULT false,
 ADD COLUMN `lastCheckedAt` DATETIME(3) NULL,
 ADD COLUMN `lastError` VARCHAR(500) NULL,
 ADD COLUMN `dnsInstructions` JSON NULL,
 ADD COLUMN `leaseUntil` DATETIME(3) NULL,
 ADD COLUMN `leaseToken` VARCHAR(80) NULL,
 ADD COLUMN `disconnectedAt` DATETIME(3) NULL,
 ADD COLUMN `expiresAt` DATETIME(3) NULL,
 ADD COLUMN `registrarReference` VARCHAR(191) NULL;
CREATE TABLE `procurement_partner_domain_events` (
 `id` VARCHAR(191) NOT NULL,
 `domainId` VARCHAR(191) NOT NULL,
 `partnerId` VARCHAR(191) NOT NULL,
 `action` VARCHAR(40) NOT NULL,
 `message` VARCHAR(500) NOT NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY (`id`),
 INDEX `partner_domain_events_partner_created` (`partnerId`, `createdAt`),
 INDEX `partner_domain_events_domain_created` (`domainId`, `createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
