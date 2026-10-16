'use client';
import { useEffect, useState } from 'react';
import styles from './SocialSettingsCard.module.css';

type Connections = { connected: string[]; owner: unknown };
export default function SocialSettingsCard() {
  const [data, setData] = useState<Connections | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/social/config', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw Error('Unable to load sign-in methods');
        const result = await response.json();
        if (!Array.isArray(result.connected)) throw Error('Invalid response');
        setData(result);
      })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);
  return (
    <section className={styles.card} aria-label="Connected sign-in methods">
      <header className={styles.heading}>
        <span className={styles.icon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/></svg></span>
        <div><h2>Connected sign-in methods</h2><p>Use Apple or Google to sign in to your existing account.</p></div>
      </header>
      <ul className={styles.providers} aria-label="Connection status" aria-busy={!data && !failed}>
        {['apple', 'google'].map(provider => {
          const connected = !!data?.owner && data.connected.includes(provider);
          const label = failed ? 'Status unavailable' : !data ? 'Checking…' : !data.owner ? 'Sign in to view' : connected ? 'Connected' : 'Not connected';
          return <li key={provider}>
            <span className={styles.providerName}><span className={styles.providerIcon} aria-hidden="true">{provider === 'apple' ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.54c.03 3.3 2.9 4.4 2.93 4.42-.02.08-.46 1.57-1.51 3.11-.91 1.34-1.86 2.68-3.35 2.71-1.46.03-1.94-.87-3.61-.87-1.66 0-2.19.84-3.56.9-1.44.05-2.53-1.45-3.45-2.78C2.63 17.31 1.2 12.35 3.11 9.02a5.35 5.35 0 0 1 4.5-2.74c1.41-.03 2.74.95 3.61.95.86 0 2.49-1.18 4.19-1.01.71.03 2.71.29 4 2.18-.1.06-2.39 1.39-2.36 4.14ZM14.31 4.42c.77-.93 1.29-2.22 1.15-3.5-1.11.04-2.46.74-3.25 1.67-.71.83-1.33 2.16-1.16 3.44 1.24.1 2.5-.63 3.26-1.61Z"/></svg> : 'G'}</span>{provider === 'apple' ? 'Apple' : 'Google'}</span>
            <span className={`${styles.status} ${connected ? styles.connected : ''}`}>{connected ? <span aria-hidden="true">✓ </span> : null}{label}</span>
          </li>;
        })}
      </ul>
      <footer className={styles.footer}><p>You may be asked to sign in again before making changes.</p><a href="/connect-social">Manage sign-in methods <span aria-hidden="true">→</span></a></footer>
    </section>
  );
}
