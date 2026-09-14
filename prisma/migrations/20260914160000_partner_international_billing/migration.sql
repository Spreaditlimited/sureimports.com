CREATE TABLE partner_platform_accounts (
 partnerId VARCHAR(191) NOT NULL PRIMARY KEY,
 country VARCHAR(2) NOT NULL,
 currency VARCHAR(3) NOT NULL,
 amountMinor INT NOT NULL,
 policyRevision INT NOT NULL,
 activatedAt DATETIME(3) NOT NULL,
 trialEndsAt DATETIME(3) NOT NULL,
 createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
CREATE TABLE partner_platform_agreements (
 id VARCHAR(64) NOT NULL PRIMARY KEY,
 partnerId VARCHAR(191) NOT NULL,
 provider VARCHAR(16) NOT NULL,
 environment VARCHAR(8) NOT NULL,
 currency VARCHAR(3) NOT NULL,
 amountMinor INT NOT NULL,
 policyRevision INT NOT NULL,
 consentAt DATETIME(3) NOT NULL,
 status VARCHAR(32) NOT NULL,
 planCode VARCHAR(120) NULL,
 subscriptionCode VARCHAR(120) NULL,
 checkoutUrl TEXT NULL,
 checkedAt DATETIME(3) NULL,
 cancelRequestedAt DATETIME(3) NULL,
 createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 UNIQUE KEY provider_subscription (provider, environment, subscriptionCode),
 INDEX partner_billing_agreements (partnerId, createdAt),
 INDEX partner_billing_reconciliation (checkedAt)
);
CREATE TABLE partner_platform_charges (
 provider VARCHAR(16) NOT NULL,
 environment VARCHAR(8) NOT NULL,
 reference VARCHAR(120) NOT NULL,
 agreementId VARCHAR(64) NOT NULL,
 partnerId VARCHAR(191) NOT NULL,
 currency VARCHAR(3) NOT NULL,
 amountMinor INT NOT NULL,
 paidAt DATETIME(3) NOT NULL,
 paidThrough DATETIME(3) NOT NULL,
 status VARCHAR(24) NOT NULL,
 createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY(provider, environment, reference),
 INDEX partner_billing_access (partnerId, status, paidThrough)
);
