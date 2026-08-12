import { prisma } from '@/lib/prisma';

export const CORPORATE_SOURCING_PRICING_KEY = 'corporate_sourcing_research_fee';
export const DEFAULT_CORPORATE_SOURCING_PRICE_NAIRA = 50_000;
export const DEFAULT_CORPORATE_SOURCING_PRICE_USD_CENTS = 5_000;

export type CorporateSourcingPricing = {
  priceNaira: number;
  priceUsdCents: number;
};

export async function getCorporateSourcingPricing(): Promise<CorporateSourcingPricing> {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS intelligence_report_price_settings (
      id INT NOT NULL AUTO_INCREMENT,
      settingKey VARCHAR(80) NOT NULL,
      priceNaira INT NOT NULL,
      priceUsdCents INT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE KEY intelligence_report_price_settings_key (settingKey),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
  await prisma.$executeRaw`
    INSERT IGNORE INTO intelligence_report_price_settings (
      settingKey, priceNaira, priceUsdCents
    ) VALUES (
      ${CORPORATE_SOURCING_PRICING_KEY},
      ${DEFAULT_CORPORATE_SOURCING_PRICE_NAIRA},
      ${DEFAULT_CORPORATE_SOURCING_PRICE_USD_CENTS}
    )
  `;
  const rows = await prisma.$queryRaw<CorporateSourcingPricing[]>`
    SELECT priceNaira, priceUsdCents
    FROM intelligence_report_price_settings
    WHERE settingKey = ${CORPORATE_SOURCING_PRICING_KEY}
    LIMIT 1
  `;
  return (
    rows[0] || {
      priceNaira: DEFAULT_CORPORATE_SOURCING_PRICE_NAIRA,
      priceUsdCents: DEFAULT_CORPORATE_SOURCING_PRICE_USD_CENTS,
    }
  );
}
