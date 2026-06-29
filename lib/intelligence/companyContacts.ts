import { prisma } from '@/lib/prisma';

export type CompanyContactSettings = {
  chinaAddress: string;
  chinaContact: string;
  lagosAddress: string;
  lagosContact: string;
};

export const defaultCompanyContactSettings: CompanyContactSettings = {
  chinaAddress: 'China: 广州市白云区机场路111号建发广场3FB3-1.',
  chinaContact: '+8619576837849',
  lagosAddress: '5 Olutosin Ajayi Street, Ajao Estate, Lagos, Nigeria',
  lagosContact: '+234 803 764 9956, +234 806 458 3664',
};

export async function getCompanyContactSettings(): Promise<CompanyContactSettings> {
  try {
    const rows = await prisma.$queryRaw<CompanyContactSettings[]>`
      SELECT
        chinaAddress,
        chinaContact,
        lagosAddress,
        lagosContact
      FROM company_contact_settings
      WHERE status = 'ACTIVE'
      ORDER BY id ASC
      LIMIT 1
    `;

    const settings = rows[0];
    if (!settings) return defaultCompanyContactSettings;

    return {
      chinaAddress:
        settings.chinaAddress?.trim() ||
        defaultCompanyContactSettings.chinaAddress,
      chinaContact:
        settings.chinaContact?.trim() ||
        defaultCompanyContactSettings.chinaContact,
      lagosAddress:
        settings.lagosAddress?.trim() ||
        defaultCompanyContactSettings.lagosAddress,
      lagosContact:
        settings.lagosContact?.trim() ||
        defaultCompanyContactSettings.lagosContact,
    };
  } catch {
    return defaultCompanyContactSettings;
  }
}
