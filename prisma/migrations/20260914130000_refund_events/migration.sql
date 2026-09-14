CREATE TABLE refund_events (
  id VARCHAR(80) NOT NULL,
  refundId VARCHAR(191) NOT NULL,
  eventType VARCHAR(40) NOT NULL,
  actorPid VARCHAR(191) NOT NULL,
  detailsJson TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  INDEX refund_events_timeline (refundId, createdAt)
);
