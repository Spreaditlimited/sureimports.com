CREATE TABLE `commercial_program_memberships` (
  `emailHash` CHAR(64) NOT NULL,
  `program` VARCHAR(16) NOT NULL,
  `subjectId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`emailHash`),
  INDEX `commercial_membership_subject_idx` (`program`, `subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Preserve all existing affiliate reservations, including pending/suspended accounts.
INSERT INTO `commercial_program_memberships` (`emailHash`, `program`, `subjectId`)
SELECT `emailHash`, 'AFFILIATE', CONCAT('affiliate:', `id`) FROM `affiliate_accounts`;
