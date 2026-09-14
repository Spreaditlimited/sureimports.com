CREATE TABLE refund_settlements (
  refundId VARCHAR(191) NOT NULL PRIMARY KEY,
  pidUser VARCHAR(191) NOT NULL,
  sourceCurrency CHAR(3) NOT NULL,
  sourceAmount DECIMAL(20,2) NOT NULL,
  settlementCurrency CHAR(3) NOT NULL,
  settlementAmount DECIMAL(20,2) NOT NULL,
  exchangeRate DECIMAL(20,8) NOT NULL,
  method VARCHAR(32) NOT NULL,
  destinationCiphertext TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED',
  reference VARCHAR(191) NULL UNIQUE,
  approvedBy VARCHAR(191) NULL,
  settledAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX refund_settlements_owner (pidUser, createdAt)
);
