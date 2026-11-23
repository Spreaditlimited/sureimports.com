-- Durable checkout evidence; no customer/order foreign key cascade.
CREATE TABLE IF NOT EXISTS procurement_paystack_checkouts (
  reference VARCHAR(80) PRIMARY KEY,
  pidOrder VARCHAR(191) NOT NULL,
  pidUser VARCHAR(191) NOT NULL,
  amountMinor BIGINT NOT NULL,
  currency VARCHAR(8) NOT NULL,
  snapshotJson LONGTEXT NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'PENDING',
  effectsStatus VARCHAR(24) NOT NULL DEFAULT 'PENDING',
  attempts INT NOT NULL DEFAULT 0,
  lastError VARCHAR(191) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX procurement_checkout_retry (status, updatedAt),
  INDEX procurement_checkout_order (pidOrder, status)
);
