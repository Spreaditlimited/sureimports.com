'use client';
import { createContext, useContext, useState, type ReactNode, type FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import countries from '@/lib/data/countries';
import { canSeeFeature, featureForPath, type FeatureRules } from '@/lib/features/catalog';
import styles from './FeatureAvailability.module.css';
type Availability = { country: string | null; rules: FeatureRules };
const Context = createContext<Availability | null>(null);
export function FeatureAvailabilityProvider({ children, country, rules }: Availability & { children: ReactNode }) {
  return <Context.Provider value={{ country, rules }}>{children}</Context.Provider>;
}
export function useFeatureVisibility() {
  const context = useContext(Context);
  return (href: string) => {
    const key = featureForPath(href);
    return !context || !key || canSeeFeature(key, context.country, context.rules);
  };
}
export function FeatureLink({ href, children, ...props }: React.ComponentProps<typeof Link>) {
  const visible = useFeatureVisibility();
  return typeof href !== 'string' || visible(href) ? <Link href={href} {...props}>{children}</Link> : null;
}
export function DashboardFeatureBoundary({ children }: { children: ReactNode }) {
  const context = useContext(Context);
  const pathname = usePathname();
  const visible = useFeatureVisibility();
  if (!context) return children;
  if (!context.country) return <CountryOnboarding />;
  if (!visible(pathname)) return <div className={styles.page}><section className={styles.card}><h1>This service isn’t available in your country</h1><p>Choose another service from your dashboard. If your country of residence has changed, you can update it in your profile.</p><Link href="/dashboard">Back to dashboard</Link><Link href="/dashboard/profile-update">Update profile</Link></section></div>;
  return children;
}
function CountryOnboarding() {
  const router = useRouter();
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const response = await fetch('/api/account/country', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save country. Please try again.');
      router.refresh();
    } catch (error) { setError((error as Error).message); setSaving(false); }
  }
  return <div className={styles.page}><form className={styles.card} onSubmit={submit}><span className={styles.eyebrow}>Welcome to Sure Imports</span><h1>Where do you live?</h1><p>Select your country of residence so we can show the services available to you. You’ll choose a delivery destination separately when placing an order.</p><label htmlFor="account-country">Country of residence</label><select id="account-country" value={country} onChange={e => setCountry(e.target.value)} required disabled={saving}>{countries.map(c => <option key={c.optionValue} value={c.optionValue}>{c.optionValue ? c.optionName : 'Select your country'}</option>)}</select>{error && <p role="alert">{error}</p>}<button disabled={!country || saving} aria-busy={saving}>{saving ? 'Saving…' : 'Continue to dashboard'}</button><small>You can update your country in your profile.</small></form></div>;
}
