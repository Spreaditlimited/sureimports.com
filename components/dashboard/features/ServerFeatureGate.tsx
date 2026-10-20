import { checkAuth } from '@/lib/auth/checkAuth';
import { getAccountCountry, getFeatureRules } from '@/lib/features/server';
import { canSeeFeature, type FeatureKey } from '@/lib/features/catalog';
// The dashboard boundary displays onboarding/unavailability; restricted child pages are not rendered.
export default async function ServerFeatureGate({ feature, children }: { feature: FeatureKey; children: React.ReactNode }) {
  const user = await checkAuth();
  if (!user) return null;
  const [country, rules] = await Promise.all([getAccountCountry(user.pidUser), getFeatureRules()]);
  return canSeeFeature(feature, country, rules) ? children : null;
}
