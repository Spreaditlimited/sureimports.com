-- NULL preserves the pricing basis of existing frozen/paid orders.
ALTER TABLE `orders` ADD COLUMN `productPricingVersion` INTEGER NULL;
