-- Hotfix: prevent truncation of long store product content fields.
-- Safe for drifted environments where `prisma migrate deploy` is blocked.

ALTER TABLE `store`
  MODIFY COLUMN `productDescription` TEXT NULL,
  MODIFY COLUMN `productFeature` TEXT NULL,
  MODIFY COLUMN `productSpecification` TEXT NULL;

-- Optional parity for copied descriptions in pay-small-small snapshots.
ALTER TABLE `paysmallsmall`
  MODIFY COLUMN `productDescription` TEXT NULL;
