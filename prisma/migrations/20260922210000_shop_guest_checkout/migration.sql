ALTER TABLE shop_checkouts
  ADD COLUMN guestTokenHash VARCHAR(64) NULL,
  ADD COLUMN affiliateReferralReference VARCHAR(191) NULL,
  ADD COLUMN accountSetupRequired BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN accountSetupEmailSentAt DATETIME(3) NULL,
  ADD UNIQUE INDEX shop_guest_request (guestTokenHash, requestKey);
