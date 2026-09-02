ALTER TABLE `supplier_verification_payments`
  ADD COLUMN `paymentPurpose` VARCHAR(40) NOT NULL DEFAULT 'VERIFICATION';

UPDATE `supplier_verification_payments`
SET `paymentPurpose` = 'LEGACY_COMBINED'
WHERE `transportFeeMinor` > 0;

CREATE INDEX `svp_request_purpose_status_idx`
  ON `supplier_verification_payments`(`requestId`, `paymentPurpose`, `status`);

UPDATE `verify_supplier` AS `request`
SET
  `request`.`status` = 'AWAITING_PAYMENT',
  `request`.`transportQuoteStatus` = 'LOCKED_UNTIL_VERIFICATION_PAID',
  `request`.`updatedAt` = NOW(3)
WHERE `request`.`verificationType` = 'PHYSICAL'
  AND `request`.`status` = 'AWAITING_TRAVEL_QUOTE'
  AND NOT EXISTS (
    SELECT 1
    FROM `supplier_verification_payments` AS `payment`
    WHERE `payment`.`requestId` = `request`.`pidVerifySupplier`
      AND `payment`.`status` = 'paid'
      AND `payment`.`paymentPurpose` IN ('VERIFICATION', 'LEGACY_COMBINED')
  );
