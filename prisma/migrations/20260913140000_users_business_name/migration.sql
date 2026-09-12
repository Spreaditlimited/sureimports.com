-- Move the existing runtime compatibility alteration into migration history.
-- This column already exists on the shared database; preserve all its values.
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `businessName` VARCHAR(191) NULL;
