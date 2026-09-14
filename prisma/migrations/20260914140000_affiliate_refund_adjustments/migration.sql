CREATE TABLE affiliate_refund_adjustments (
  refundId VARCHAR(191) NOT NULL,
  conversionId INT NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  payoutId INT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (refundId, conversionId),
  INDEX affiliate_refund_adjustments_payout (payoutId),
  INDEX affiliate_refund_adjustments_conversion (conversionId),
  CONSTRAINT affiliate_refund_adjustments_conversion_fk FOREIGN KEY (conversionId) REFERENCES affiliate_conversions(id) ON DELETE RESTRICT,
  CONSTRAINT affiliate_refund_adjustments_payout_fk FOREIGN KEY (payoutId) REFERENCES affiliate_payouts(id) ON DELETE RESTRICT
);
