ALTER TABLE `seo_change_rewrite_artifacts`
  ADD COLUMN `openAiResponseId` VARCHAR(100) NULL AFTER `qualityPolicyVersion`,
  ADD COLUMN `openAiResponseStatus` VARCHAR(40) NULL AFTER `openAiResponseId`,
  ADD COLUMN `openAiModel` VARCHAR(80) NULL AFTER `openAiResponseStatus`;
