ALTER TABLE support_messages
 ADD COLUMN attachmentAsset VARCHAR(191) NULL,
 ADD COLUMN attachmentName VARCHAR(180) NULL,
 ADD COLUMN attachmentSize INT NULL,
 ADD COLUMN attachmentHash CHAR(64) NULL;
CREATE TABLE support_files (
 asset VARCHAR(191) NOT NULL PRIMARY KEY,
 expiresAt DATETIME(3) NOT NULL,
 INDEX support_file_expiry (expiresAt)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE INDEX support_message_asset ON support_messages(attachmentAsset);
