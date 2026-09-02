-- Legacy Supplier Verification requests were physical visits, but the relaunch
-- migration left unpaid records in AWAITING_PAYMENT without a transport quote.
-- Move only legacy, unpaid physical records with no quote into the quote queue.
UPDATE `verify_supplier`
SET `status` = 'AWAITING_TRAVEL_QUOTE',
    `transportQuoteStatus` = 'PENDING',
    `updatedAt` = CURRENT_TIMESTAMP(3)
WHERE `verificationType` = 'PHYSICAL'
  AND `termsVersion` IS NULL
  AND `transportQuoteStatus` IS NULL
  AND `status` IN ('AWAITING_PAYMENT', 'PAYMENT_PENDING');
