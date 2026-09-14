CREATE TABLE refund_notifications (
  refundId VARCHAR(191) NOT NULL,
  eventType VARCHAR(24) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'PENDING',
  attempts INT NOT NULL DEFAULT 0,
  claimedAt DATETIME(3) NULL,
  nextAttemptAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  sentAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (refundId, eventType),
  INDEX refund_notifications_due (sentAt, nextAttemptAt)
);
