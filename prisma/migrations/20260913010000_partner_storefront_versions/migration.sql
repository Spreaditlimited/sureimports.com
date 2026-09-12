-- Existing public fields remain untouched. A null draft reads the existing content.
ALTER TABLE `procurement_partner_storefronts`
  ADD COLUMN `draftSettings` JSON NULL,
  ADD COLUMN `previousSettings` JSON NULL,
  ADD COLUMN `revision` INTEGER NOT NULL DEFAULT 0;

-- Set only after ownership, DNS, HTTPS and routing checks in domain provisioning.
ALTER TABLE `procurement_partner_domains` ADD COLUMN `readyAt` DATETIME(3) NULL;
