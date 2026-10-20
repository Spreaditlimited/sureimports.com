import 'server-only';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { defaultFeatureRules, validateFeatureRules } from './catalog';
import { normalizeAccountCountry } from './country';
export const getFeatureRules = cache(async () => {
  try {
    const rows = await prisma.$queryRaw<Array<{ rulesJson: string }>>`SELECT rulesJson FROM dashboard_feature_settings WHERE id=1`;
    const rules: unknown = rows[0] ? JSON.parse(rows[0].rulesJson) : defaultFeatureRules;
    if (!validateFeatureRules(rules)) throw new Error('Invalid dashboard feature settings');
    return rules;
  } catch (error) {
    // Deployment ordering: only a missing table gets defaults. Other failures must not broaden access.
    if ((error as { meta?: { code?: string } }).meta?.code === '1146') return defaultFeatureRules;
    throw error;
  }
});
export const getAccountCountry = cache(async (pidUser: string) => {
  const user = await prisma.users.findUnique({ where: { pidUser }, select: { country: true } });
  return normalizeAccountCountry(user?.country);
});
