ALTER TABLE `seo_opportunities`
  ADD COLUMN `pageType` VARCHAR(40) NOT NULL DEFAULT 'blog' AFTER `pageUrl`;

CREATE INDEX `seo_opportunities_pageType_idx`
  ON `seo_opportunities` (`pageType`);
