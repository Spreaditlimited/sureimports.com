-- AlterTable
ALTER TABLE `corporate_gift_request`
  ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
  ADD COLUMN `handledByPidUser` VARCHAR(191) NULL,
  ADD COLUMN `handledByEmail` VARCHAR(191) NULL,
  ADD COLUMN `handledByName` VARCHAR(191) NULL;
