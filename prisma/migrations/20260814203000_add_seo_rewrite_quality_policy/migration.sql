ALTER TABLE `seo_change_rewrite_artifacts`
  ADD COLUMN `externalLinkChangesJson` LONGTEXT NULL AFTER `decisionsJson`,
  ADD COLUMN `qualityPolicyVersion` VARCHAR(80) NULL AFTER `externalLinkChangesJson`;
