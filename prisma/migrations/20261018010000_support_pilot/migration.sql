-- Additive pilot tables. Run once from Sure Imports; admin uses the same database.
CREATE TABLE support_conversations (
 id CHAR(32) NOT NULL PRIMARY KEY,
 brand VARCHAR(32) NOT NULL,
 customerId VARCHAR(191) NOT NULL,
 requestKey VARCHAR(80) NOT NULL,
 subject VARCHAR(120) NOT NULL,
 country VARCHAR(191) NULL,
 status VARCHAR(24) NOT NULL DEFAULT 'OPEN',
 assignedTo VARCHAR(191) NULL,
 createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 firstResponseAt DATETIME(3) NULL,
 resolvedAt DATETIME(3) NULL,
 UNIQUE KEY support_create_retry (brand, customerId, requestKey),
 KEY support_customer_inbox (brand, customerId, updatedAt),
 KEY support_team_inbox (status, updatedAt),
 KEY support_created_at (createdAt)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE support_messages (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 conversationId CHAR(32) NOT NULL,
 authorId VARCHAR(191) NOT NULL,
 authorKind VARCHAR(16) NOT NULL,
 requestKey VARCHAR(80) NOT NULL,
 body TEXT NOT NULL,
 internal BOOLEAN NOT NULL DEFAULT FALSE,
 createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 UNIQUE KEY support_message_retry (conversationId, authorKind, authorId, requestKey),
 KEY support_message_history (conversationId, id),
 CONSTRAINT support_message_conversation FOREIGN KEY (conversationId) REFERENCES support_conversations(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE support_rate_limits (
 actorKey CHAR(64) NOT NULL PRIMARY KEY,
 windowStart DATETIME(3) NOT NULL,
 messageCount INT NOT NULL DEFAULT 0
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
