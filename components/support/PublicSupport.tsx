'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SupportWhatsApp from './SupportWhatsApp';
import SupportWorkspace from './SupportWorkspace';
import styles from './support.module.css';
export default function PublicSupport({
  embedded = false,
  onSignIn,
}: {
  embedded?: boolean;
  onSignIn?: () => void;
}) {
  const [session, setSession] = useState<{
    signedIn: boolean;
    hasGuest: boolean;
    guestContact: { name: string; email: string } | null;
  } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingContact, setSavingContact] = useState(false);
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
  async function saveContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingContact(true);
    setError('');
    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save your details.');
      setSession((current) => current ? { ...current, guestContact: data } : current);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setSavingContact(false);
    }
  }
  return (
    <div className={embedded ? styles.embedded : undefined}>
      {error && (
        <div className={styles.error} role="alert">
          {error} <button onClick={() => setRetry((v) => v + 1)}>Retry</button>{' '}
          {!embedded && (
            <>
              · <SupportWhatsApp />
            </>
          )}
        </div>
      )}
      {!session && !error && (
        <p className={styles.notice} role="status">
          Opening support…
        </p>
      )}
      {session && (
        <>
          {!session.signedIn && !session.guestContact && (
            <form className={styles.contactForm} onSubmit={(event) => void saveContact(event)}>
              <h2>Before we chat</h2>
              <p>Enter your name and email so we can let you know when our team replies.</p>
              <label>Your name<input required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label>Email address<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <button className={styles.primary} disabled={savingContact} type="submit">{savingContact ? 'Saving…' : 'Continue to chat'}</button>
            </form>
          )}
          {!session.signedIn && session.guestContact && (
            <p className={styles.notice}>
              We’ll email {session.guestContact.email} when support replies. You can return to this chat from your email.{' '}
              <Link
                href="/auth/login?next=/dashboard/support"
                onClick={onSignIn}
                target={embedded ? '_blank' : undefined}
                rel={embedded ? 'noopener noreferrer' : undefined}
              >
                Sign in to Sure Imports
              </Link>{' '}
              to keep the conversation in your account.
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
          {(session.signedIn || session.guestContact) && <SupportWorkspace
            key={retry}
            whatsappAction={embedded ? undefined : <SupportWhatsApp />}
          />}
        </>
      )}
    </div>
  );
}
