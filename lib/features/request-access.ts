import { currentUser } from '@/lib/auth/current-user';
import { getAccountCountry, getFeatureRules } from './server';
import { canSeeFeature, type FeatureKey } from './catalog';

export async function featureRequestAccess(feature: FeatureKey) {
  const user = await currentUser();
  if (!user) return { response: Response.json({ message: 'Please sign in again.' }, { status: 401 }) };
  const [country, rules] = await Promise.all([getAccountCountry(user.pidUser), getFeatureRules()]);
  if (!canSeeFeature(feature, country, rules)) return { response: Response.json({ message: 'This service is not available in your country.' }, { status: 403 }) };
  return { user };
}
