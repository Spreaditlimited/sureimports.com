ALTER TABLE `intelligence_subscriptions`
  ADD COLUMN IF NOT EXISTS `paystackEmailToken` VARCHAR(120) NULL;
