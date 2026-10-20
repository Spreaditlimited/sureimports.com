'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SupportWhatsApp from './SupportWhatsApp';
import SupportWorkspace from './SupportWorkspace';
import styles from './support.module.css';
export default function PublicSupport({ embedded = false, onSignIn }: { embedded?: boolean; onSignIn?: () => void }) {
  const [session, setSession] = useState<{
    signedIn: boolean;
    hasGuest: boolean;
  } | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [claiming, setClaiming] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    async function start() {
      try {
        const response = await fetch('/api/support/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setSession(data);
        setError('');
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message);
      }
    }
    void start();
    return () => controller.abort();
  }, [retry]);
  async function claim() {
    setClaiming(true);
    try {
      const response = await fetch('/api/support/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSession(null);
      setRetry((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setClaiming(false);
    }
  }
  return (
    <div className={embedded ? styles.embedded : undefined}>
      {error && (
        <div className={styles.error} role="alert">
          {error} <button onClick={() => setRetry((v) => v + 1)}>Retry</button>{' '}
          {!embedded && <>· <SupportWhatsApp /></>}
        </div>
      )}
      {!session && !error && (
        <p className={styles.notice} role="status">
          Opening support…
        </p>
      )}
      {session && (
        <>
          {!session.signedIn && (
            <p className={styles.notice}>
              Chat as a guest. Return in this browser for up to 30 days to read
              replies.{' '}
              <Link href="/auth/login?next=/dashboard/support" onClick={onSignIn} target={embedded ? "_blank" : undefined} rel={embedded ? "noopener noreferrer" : undefined}>Sign in to Sure Imports</Link> to
              keep the conversation in your account and receive email updates.
            </p>
          )}
          {session.signedIn && session.hasGuest && (
            <div className={styles.notice}>
              There is a guest chat in this browser.{' '}
              <button
                className={styles.primary}
                disabled={claiming}
                onClick={() => void claim()}
              >
                Save guest conversations to my account
              </button>
            </div>
          )}
          <SupportWorkspace key={retry} whatsappAction={embedded ? undefined : <SupportWhatsApp />} />
        </>
      )}
    </div>
  );
}
