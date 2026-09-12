ALTER TABLE `procurement_partner_kyc_events`
  ADD COLUMN `emailStatus` VARCHAR(24) NOT NULL DEFAULT 'NONE',
  ADD COLUMN `emailAttempts` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `emailLockedAt` DATETIME(3) NULL,
  ADD COLUMN `emailNextAttemptAt` DATETIME(3) NULL,
  ADD COLUMN `emailSentAt` DATETIME(3) NULL,
  ADD COLUMN `emailFailureCode` VARCHAR(40) NULL;
CREATE INDEX `partner_kyc_email_queue_idx`
  ON `procurement_partner_kyc_events` (`emailStatus`, `emailNextAttemptAt`);
