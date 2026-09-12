ALTER TABLE `procurement_partner_customer_orders`
  ADD COLUMN `checkoutReference` VARCHAR(100) NULL,
  ADD COLUMN `checkoutCiphertext` LONGTEXT NULL,
  ADD UNIQUE INDEX `partner_customer_checkout_key` (`checkoutReference`);
ALTER TABLE `products` MODIFY COLUMN `productLink` TEXT NULL, MODIFY COLUMN `productInfo` TEXT NULL;
CREATE TABLE `procurement_partner_order_events` (
  `id` VARCHAR(80) NOT NULL,
  `customerOrderId` VARCHAR(80) NOT NULL,
  `actorPid` VARCHAR(191) NOT NULL,
  `action` VARCHAR(40) NOT NULL,
  `detailsCiphertext` LONGTEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `partner_order_event_idx` (`customerOrderId`, `createdAt`),
  CONSTRAINT `partner_order_event_order_fk` FOREIGN KEY (`customerOrderId`) REFERENCES `procurement_partner_customer_orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
