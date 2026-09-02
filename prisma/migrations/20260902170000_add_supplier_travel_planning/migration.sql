ALTER TABLE `verify_supplier`
  ADD COLUMN `travelEstimateJson` JSON NULL,
  ADD COLUMN `recommendedTravelMode` VARCHAR(40) NULL,
  ADD COLUMN `travelLodgingNights` INTEGER NULL,
  ADD COLUMN `travelEstimateGeneratedAt` DATETIME(3) NULL;

ALTER TABLE `supplier_verification_settings`
  ADD COLUMN `defaultLodgingCnyFen` INTEGER NOT NULL DEFAULT 20000,
  ADD COLUMN `travelContingencyPercent` INTEGER NOT NULL DEFAULT 10;

UPDATE `supplier_verification_settings`
SET
  `officeAddressChinese` = '广州市白云区机场路111号建发广场3FB3-1',
  `officeLatitude` = COALESCE(`officeLatitude`, 23.1689050),
  `officeLongitude` = COALESCE(`officeLongitude`, 113.2597410)
WHERE `settingKey` = 'supplier_verification'
  AND (`officeAddressChinese` IS NULL OR TRIM(`officeAddressChinese`) = '');
