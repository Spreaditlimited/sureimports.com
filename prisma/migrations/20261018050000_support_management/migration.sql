CREATE TABLE support_reads (
 conversationId CHAR(32) NOT NULL,
 adminId VARCHAR(191) NOT NULL,
 lastReadMessageId INT NOT NULL DEFAULT 0,
 updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY (conversationId,adminId),
 CONSTRAINT support_read_conversation FOREIGN KEY (conversationId) REFERENCES support_conversations(id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE support_email_receipts (
 noticeId INT NOT NULL,
 revision INT NOT NULL,
 recipientHash CHAR(64) NOT NULL,
 sentAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY (noticeId,revision,recipientHash),
 CONSTRAINT support_email_notice FOREIGN KEY (noticeId) REFERENCES support_notifications(id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE INDEX support_assignment_inbox ON support_conversations(assignedTo,updatedAt);
