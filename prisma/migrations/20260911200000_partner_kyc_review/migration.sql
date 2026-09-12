ALTER TABLE `procurement_partner_kyc` ADD COLUMN `reviewCiphertext` LONGTEXT NULL;
ALTER TABLE `procurement_partner_kyc_events` ADD COLUMN `detailsCiphertext` LONGTEXT NULL;
