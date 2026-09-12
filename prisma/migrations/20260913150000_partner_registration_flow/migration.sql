-- Optional fields preserve existing applications; legacy KYC remains authoritative
-- until the owner reviews and saves their registration step.
ALTER TABLE `procurement_partners`
  ADD COLUMN `businessType` VARCHAR(32) NULL,
  ADD COLUMN `companyEra` VARCHAR(16) NULL;
