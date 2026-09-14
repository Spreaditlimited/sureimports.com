CREATE TABLE refund_provider_legs (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  refundId VARCHAR(191) NOT NULL,
  paymentId VARCHAR(191) NOT NULL,
  captureId VARCHAR(191) NOT NULL,
  currency CHAR(3) NOT NULL,
  amount DECIMAL(20,2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED',
  providerReference VARCHAR(191) NULL UNIQUE,
  firstAttemptAt DATETIME(3) NULL,
  checkedAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX refund_provider_refund (refundId),
  INDEX refund_provider_capture (captureId),
  INDEX refund_provider_pending (status, checkedAt)
);
