ALTER TABLE `marketing_leads`
  ADD COLUMN IF NOT EXISTS `leadMagnetSlug` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `leadMagnetTitle` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `leadMagnetDownloadUrl` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `offerCta` VARCHAR(120) NULL;

CREATE TABLE IF NOT EXISTS `blog_lead_magnet_downloads` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pidDownload` VARCHAR(80) NOT NULL,
  `pidMagnet` VARCHAR(80) NOT NULL,
  `pidBlog` VARCHAR(80) NULL,
  `email` VARCHAR(255) NULL,
  `source` VARCHAR(100) NULL,
  `pageUrl` TEXT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_lead_magnet_downloads_pidDownload_key` (`pidDownload`),
  KEY `blog_lead_magnet_downloads_pidMagnet_idx` (`pidMagnet`),
  KEY `blog_lead_magnet_downloads_pidBlog_idx` (`pidBlog`),
  KEY `blog_lead_magnet_downloads_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
