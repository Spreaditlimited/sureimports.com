'use client';
import { FormEvent, useEffect, useState } from 'react';
import SocialShell from './SocialShell';
import SocialButtons from './SocialButtons';
import styles from './SocialAuth.module.css';
type Status = {
  ready: boolean;
  email: string;
  provider: string;
  mode: string;
  brand: string;
  terms: string;
  affiliate: boolean;
  login: string;
  home: string;
  owner?: { email: string; fresh: boolean };
};
export default function SocialComplete({
  connect = false,
}: {
  connect?: boolean;
}) {
  const [connectedNext, setConnectedNext] = useState<string | null>(null);
  useEffect(() => {
    if (!connectedNext) return;
    const timer = window.setTimeout(() => window.location.replace(connectedNext), 1600);
    return () => window.clearTimeout(timer);
  }, [connectedNext]);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch('/api/auth/social/' + (connect ? 'config' : 'status'), {
      cache: 'no-store',
    })
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setError('Unable to load. Please refresh.'));
  }, [connect]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch('/api/auth/social/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          phone: form.get('phone'),
          country: form.get('country'),
          acceptedTerms: form.get('acceptedTerms') === 'on',
          consent: form.get('consent') === 'on' ? status?.provider : undefined,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.message);
      if (status?.mode === 'link') setConnectedNext(data.next);
      else window.location.assign(data.next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please try again.');
      setBusy(false);
    }
  }
  const provider = status?.provider === 'apple' ? 'Apple' : 'Google';
  if (connectedNext) return (
    <SocialShell>
      <section className={styles.content} aria-labelledby="connection-success-title">
        <p className={styles.brand}>{status?.brand || 'Sure Imports'}</p>
        <div role="status">
          <h1 id="connection-success-title">{provider} connected</h1>
          <p>You can now sign in to your existing account with {provider}.</p>
          <p>Taking you to your dashboard…</p>
        </div>
        <a className={styles.primaryLink} href={connectedNext}>Continue to dashboard</a>
      </section>
    </SocialShell>
  );
  return (
    <SocialShell>
      <section className={styles.content}>
        <p className={styles.brand}>{status?.brand || 'Sure Imports'}</p>
        <h1>
          {connect
            ? 'Connected sign-in methods'
            : status?.mode === 'link'
              ? `Connect ${provider}`
              : 'Finish creating your account'}
        </h1>
        {error ? (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        ) : null}
        {!status ? (
          <p>Loading…</p>
        ) : connect ? (
          <>
            <p>
              Connect Apple or Google to keep using your existing account and
              everything saved in it.
            </p>
            {status.owner?.fresh ? (
              <>
                <p>
                  Signed in as <strong>{status.owner.email}</strong>. Use the
                  same email with the provider. For Apple, choose Share My
                  Email.
                </p>
                <SocialButtons mode="link" next={status.home} />
              </>
            ) : (
              <>
                <p>
                  Sign in with your current email and password first. We’ll bring
                  you back here to choose Apple or Google.
                </p>
                <a
                  className={styles.primaryLink}
                  href={`${status.login}?next=${encodeURIComponent('/connect-social')}`}
                >
                  Sign in to connect a provider
                </a>
              </>
            )}
            <p>
              <a href={status.home}>Back to your dashboard</a>
            </p>
          </>
        ) : !status.ready ? (
          <p>
            This sign-in session has expired.{' '}
            <a href={status.login}>Start again</a>.
          </p>
        ) : (
          <>
            <p>
              {status.mode === 'link'
                ? `Confirm that you want to connect ${provider} (${status.email}) to your existing account.`
                : `Continue with ${status.email}. Tell us your name to finish setting up your account.`}
            </p>
            <form className={styles.form} onSubmit={submit}>
              {status.mode === 'link' ? (
                <label className={styles.consentCard}>
                  <input name="consent" type="checkbox" required />
                  <span>
                    <strong>Connect {provider} to my existing account</strong><small>Select this checkbox to confirm, then use the button below.</small>
                  </span>
                </label>
              ) : (
                <>
                  <div className={styles.fieldGrid}>
                    <label>First name<div className={styles.inputWrap}><input name="firstName" autoComplete="given-name" placeholder="First name" required minLength={2} maxLength={60} /></div></label>
                    <label>Last name<div className={styles.inputWrap}><input name="lastName" autoComplete="family-name" placeholder="Last name" required minLength={2} maxLength={60} /></div></label>
                  </div>
                  {status.affiliate ? (
                    <>
                      <label>
                        Phone number
                        <input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          minLength={7}
                          maxLength={24}
                        />
                      </label>
                      <label>
                        Country
                        <input
                          name="country"
                          autoComplete="country-name"
                          placeholder="e.g. Nigeria"
                          required
                          maxLength={100}
                        />
                      </label>
                    </>
                  ) : null}
                  <label className={styles.check}>
                    <input type="checkbox" name="acceptedTerms" required />
                    <span>
                      I agree to the{' '}
                      <a href={status.terms} target="_blank" rel="noreferrer">
                        terms
                      </a>{' '}
                      and{' '}
                      <a
                        href="https://www.sureimports.com/privacy-policy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        privacy policy
                      </a>
                      .
                    </span>
                  </label>
                </>
              )}
              <button type="submit" className={styles.primary} disabled={busy}>
                {busy
                  ? 'Please wait…'
                  : status.mode === 'link'
                    ? `Connect ${provider}`
                    : 'Create account'}
              </button>
            </form>
            {status.mode !== 'link' ? (
              <p className={styles.hint}>
                Already have an account with a different email?{' '}
                <a href="/connect-social">
                  Sign in to your existing account first
                </a>
                .
              </p>
            ) : null}
          </>
        )}
      </section>
    </SocialShell>
  );
}
