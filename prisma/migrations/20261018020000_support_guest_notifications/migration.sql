ALTER TABLE support_conversations ADD COLUMN ownerKind VARCHAR(16) NOT NULL DEFAULT 'CUSTOMER', ADD COLUMN orderId VARCHAR(191) NULL;
CREATE TABLE support_guests (
 id CHAR(32) NOT NULL PRIMARY KEY,
 tokenHash CHAR(64) NOT NULL UNIQUE,
 expiresAt DATETIME(3) NOT NULL,
 claimedBy VARCHAR(191) NULL,
 createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 KEY support_guest_expiry (expiresAt)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE support_notifications (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 conversationId CHAR(32) NOT NULL,
 audience VARCHAR(16) NOT NULL,
 revision INT NOT NULL DEFAULT 1,
 attempts INT NOT NULL DEFAULT 0,
 availableAt DATETIME(3) NOT NULL,
 leaseUntil DATETIME(3) NULL,
 leaseToken CHAR(32) NULL,
 UNIQUE KEY support_notification_audience (conversationId, audience),
 KEY support_notification_ready (availableAt, leaseUntil),
 CONSTRAINT support_notification_conversation FOREIGN KEY (conversationId) REFERENCES support_conversations(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
