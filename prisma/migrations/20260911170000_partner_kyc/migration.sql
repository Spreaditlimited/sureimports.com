-- CreateTable
CREATE TABLE `procurement_partner_kyc` (
    `partnerId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    `revision` INTEGER NOT NULL DEFAULT 0,
    `policyVersion` VARCHAR(24) NOT NULL DEFAULT '2026-09-11',
    `detailsCiphertext` LONGTEXT NULL,
    `submittedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`partnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_partner_kyc_documents` (
    `id` VARCHAR(191) NOT NULL,
    `partnerId` VARCHAR(191) NOT NULL,
    `slot` VARCHAR(191) NOT NULL,
    `cloudinaryId` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(40) NOT NULL,
    `bytes` INTEGER NOT NULL,
    `sha256` CHAR(64) NOT NULL,
    `status` VARCHAR(24) NOT NULL DEFAULT 'UPLOADING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `procurement_partner_kyc_documents_cloudinaryId_key`(`cloudinaryId`),
    INDEX `procurement_partner_kyc_documents_partnerId_slot_status_idx`(`partnerId`, `slot`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_partner_kyc_events` (
    `id` VARCHAR(191) NOT NULL,
    `partnerId` VARCHAR(191) NOT NULL,
    `actorPid` VARCHAR(191) NOT NULL,
    `action` VARCHAR(40) NOT NULL,
    `documentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `procurement_partner_kyc_events_partnerId_createdAt_idx`(`partnerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `procurement_partner_kyc` ADD CONSTRAINT `procurement_partner_kyc_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `procurement_partner_kyc_documents` ADD CONSTRAINT `procurement_partner_kyc_documents_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partner_kyc`(`partnerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `procurement_partner_kyc_events` ADD CONSTRAINT `procurement_partner_kyc_events_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partner_kyc`(`partnerId`) ON DELETE RESTRICT ON UPDATE CASCADE;
