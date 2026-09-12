-- CreateTable
CREATE TABLE `procurement_partners` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,
    `legalName` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(80) NOT NULL,
    `ownerPidUser` VARCHAR(191) NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    `country` CHAR(2) NOT NULL DEFAULT 'NG',
    `settlementCurrency` CHAR(3) NOT NULL DEFAULT 'NGN',
    `serviceChargeBps` INTEGER NOT NULL DEFAULT 1500,
    `partnerShareBps` INTEGER NOT NULL DEFAULT 500,
    `pricingRevision` INTEGER NOT NULL DEFAULT 1,
    `liveCollectionEnabled` BOOLEAN NOT NULL DEFAULT false,
    `settlementPolicy` VARCHAR(40) NOT NULL DEFAULT 'UNCONFIRMED',
    `paystackSubaccountCode` VARCHAR(80) NULL,
    `bankVerifiedAt` DATETIME(3) NULL,
    `approvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `procurement_partners_slug_key`(`slug`),
    UNIQUE INDEX `procurement_partners_registrationNumber_key`(`registrationNumber`),
    UNIQUE INDEX `procurement_partners_ownerPidUser_key`(`ownerPidUser`),
    UNIQUE INDEX `procurement_partners_paystackSubaccountCode_key`(`paystackSubaccountCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_partner_storefronts` (
    `partnerId` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `templateKey` VARCHAR(80) NOT NULL DEFAULT 'procurement-v1',
    `logoUrl` TEXT NULL,
    `primaryColor` VARCHAR(7) NOT NULL DEFAULT '#1d4ed8',
    `supportEmail` VARCHAR(191) NOT NULL,
    `supportPhone` VARCHAR(32) NOT NULL,
    `receivingAddress` TEXT NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`partnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_partner_domains` (
    `id` VARCHAR(191) NOT NULL,
    `partnerId` VARCHAR(191) NOT NULL,
    `hostname` VARCHAR(191) NOT NULL,
    `verificationTokenHash` CHAR(64) NOT NULL,
    `verifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `procurement_partner_domains_hostname_key`(`hostname`),
    INDEX `procurement_partner_domains_partnerId_idx`(`partnerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_partner_orders` (
    `pidOrder` VARCHAR(191) NOT NULL,
    `partnerId` VARCHAR(191) NOT NULL,
    `source` VARCHAR(24) NOT NULL,
    `externalReference` VARCHAR(191) NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'NGN',
    `pricingRevision` INTEGER NOT NULL,
    `serviceChargeBps` INTEGER NOT NULL,
    `partnerShareBps` INTEGER NOT NULL,
    `productCostMinor` BIGINT NOT NULL,
    `serviceChargeMinor` BIGINT NOT NULL,
    `partnerEarningsMinor` BIGINT NOT NULL,
    `sureImportsServiceMinor` BIGINT NOT NULL,
    `shippingMinor` BIGINT NOT NULL,
    `taxMinor` BIGINT NOT NULL,
    `otherChargesMinor` BIGINT NOT NULL,
    `orderTotalMinor` BIGINT NOT NULL,
    `partnerReceivingAddress` TEXT NOT NULL,
    `lockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `procurement_partner_orders_partnerId_lockedAt_idx`(`partnerId`, `lockedAt`),
    UNIQUE INDEX `procurement_partner_orders_partnerId_externalReference_key`(`partnerId`, `externalReference`),
    PRIMARY KEY (`pidOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `procurement_partner_storefronts` ADD CONSTRAINT `procurement_partner_storefronts_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `procurement_partner_domains` ADD CONSTRAINT `procurement_partner_domains_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `procurement_partner_orders` ADD CONSTRAINT `procurement_partner_orders_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `procurement_partners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `procurement_partner_orders` ADD CONSTRAINT `procurement_partner_orders_pidOrder_fkey` FOREIGN KEY (`pidOrder`) REFERENCES `orders`(`pidOrder`) ON DELETE RESTRICT ON UPDATE CASCADE;
