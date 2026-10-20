CREATE TABLE support_push_subscriptions (
 id CHAR(32) NOT NULL PRIMARY KEY,
 adminId VARCHAR(191) NOT NULL,
 endpointHash CHAR(64) NOT NULL UNIQUE,
 endpoint TEXT NOT NULL,
 p256dh VARCHAR(100) NOT NULL,
 auth VARCHAR(40) NOT NULL,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 expiresAt DATETIME(3) NOT NULL,
 createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 KEY support_push_admin (adminId, active)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE support_push_deliveries (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 conversationId CHAR(32) NOT NULL,
 subscriptionId CHAR(32) NOT NULL,
 revision INT NOT NULL DEFAULT 1,
 attempts INT NOT NULL DEFAULT 0,
 availableAt DATETIME(3) NOT NULL,
 leaseUntil DATETIME(3) NULL,
 leaseToken CHAR(32) NULL,
 UNIQUE KEY support_push_pending (conversationId, subscriptionId),
 KEY support_push_ready (availableAt, leaseUntil),
 CONSTRAINT support_push_conversation FOREIGN KEY (conversationId) REFERENCES support_conversations(id),
 CONSTRAINT support_push_device FOREIGN KEY (subscriptionId) REFERENCES support_push_subscriptions(id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
