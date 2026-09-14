CREATE TABLE partner_billing_settings (
  id INT NOT NULL PRIMARY KEY,
  monthlyMinor INT NOT NULL DEFAULT 0,
  trialDays INT NOT NULL DEFAULT 14,
  revision INT NOT NULL DEFAULT 1,
  enabledAt DATETIME(3) NULL,
  updatedBy VARCHAR(191) NULL,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO partner_billing_settings (id) VALUES (1);
CREATE TABLE partner_platform_subscriptions (
  partnerId VARCHAR(191) NOT NULL PRIMARY KEY,
  planCode VARCHAR(120) NULL UNIQUE,
  subscriptionCode VARCHAR(120) NULL UNIQUE,
  checkoutReference VARCHAR(120) NOT NULL UNIQUE,
  checkoutUrl TEXT NULL,
  amountMinor INT NOT NULL,
  chargeMinor INT NOT NULL,
  termsRevision INT NOT NULL,
  consentAt DATETIME(3) NOT NULL,
  customerCode VARCHAR(120) NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'PENDING',
  paidThrough DATETIME(3) NULL,
  nextBillingAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE partner_platform_receipts (
  reference VARCHAR(120) NOT NULL PRIMARY KEY,
  partnerId VARCHAR(191) NOT NULL,
  amountMinor INT NOT NULL,
  paidAt DATETIME(3) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'PAID',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX partner_platform_receipt_partner (partnerId, paidAt)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE partner_billing_settings_history (
  revision INT NOT NULL PRIMARY KEY,
  monthlyMinor INT NOT NULL,
  trialDays INT NOT NULL,
  actorPid VARCHAR(191) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
