'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './SocialAuth.module.css';

type GoogleSDK = {
  accounts: {
    id: {
      initialize(options: {
        client_id: string;
        nonce: string;
        callback: (data: { credential?: string }) => void;
        auto_select: boolean;
      }): void;
      renderButton(
        element: HTMLElement,
        options: Record<string, unknown>,
      ): void;
    };
  };
};
function sdk() {
  return (window as unknown as { google?: GoogleSDK }).google;
}
async function post(action: string, body: object) {
  const r = await fetch('/api/auth/social/' + action, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw Error(data.message || 'Please try again.');
  return data;
}
export default function SocialButtons({
  mode = 'signin',
  next,
  rememberMe = false,
}: {
  mode?: 'signin' | 'link';
  next?: string;
  rememberMe?: boolean;
}) {
  const [cfg, setCfg] = useState<{
    apple: boolean;
    googleClientId: string;
    login: string;
    connected: string[];
  } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const destination = () =>
    next || new URLSearchParams(window.location.search).get('next') || '';
  useEffect(() => {
    let active = true;
    fetch('/api/auth/social/config', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (active) setCfg(data);
      })
      .catch(() => {});
    const reason = new URLSearchParams(window.location.search).get('social');
    const errors: Record<string, string> = {
      account_not_linked:
        'You already have an account with this email. Sign in using your existing method, then open Connected sign-in methods to connect this provider.',
      cancelled: 'Sign-in was cancelled. You can try again.',
      expired: 'Your sign-in session expired. Please try again.',
      failed: 'Sign-in could not be completed. Please try again.',
      unavailable: 'This account is not available. Contact support.',
      linked: 'This sign-in method is already connected to another account.',
    };
    if (reason) setError(errors[reason] || errors.failed);
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (
      !cfg?.googleClientId ||
      !ref.current ||
      (mode === 'link' && (!consent || cfg.connected.includes('google')))
    )
      return;
    let active = true;
    let observer: ResizeObserver | undefined;
    const render = async () => {
      if (!sdk() || !ref.current || !active) return;
      try {
        const flow = await post('start', {
          provider: 'google',
          mode,
          consent: mode === 'link' ? 'google' : undefined,
          next: destination(),
          rememberMe,
        });
        if (!active || !ref.current) return;
        sdk()!.accounts.id.initialize({
          client_id: cfg.googleClientId,
          nonce: flow.nonce,
          auto_select: false,
          callback: async ({ credential }) => {
            if (!credential) return;
            setBusy(true);
            setError('');
            try {
              const result = await post('google', {
                credential,
                state: flow.state,
              });
              window.location.assign(result.next);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Sign-in failed.');
              setBusy(false);
            }
          },
        });
        const element = ref.current;
        let previousWidth = 0;
        const renderButton = () => {
          if (!active || !element.isConnected) return;
          const width = Math.min(400, Math.floor(element.clientWidth));
          if (!width || width === previousWidth) return;
          previousWidth = width;
          element.replaceChildren();
          sdk()!.accounts.id.renderButton(element, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            width,
          });
        };
        renderButton();
        observer?.disconnect();
        observer = new ResizeObserver(renderButton);
        observer.observe(element);
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : 'Google sign-in is unavailable.',
          );
      }
    };
    if (sdk()) void render();
    else {
      let script = document.querySelector<HTMLScriptElement>(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', render, { once: true });
    }
    return () => {
      active = false;
      observer?.disconnect();
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [cfg, mode, consent, next, rememberMe]);
  async function apple() {
    setBusy(true);
    setError('');
    try {
      const data = await post('start', {
        provider: 'apple',
        mode,
        consent: mode === 'link' ? 'apple' : undefined,
        next: destination(),
        rememberMe,
      });
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed.');
      setBusy(false);
    }
  }
  if (!cfg) return null;
  return (
    <div className={styles.buttons}>
      {error ? (
        <div role="alert" className={styles.error}>
          {error} <a href="/connect-social">Connected sign-in methods</a>
        </div>
      ) : null}
      {mode === 'link' ? (
        <section
          className={styles.consentStep}
          aria-label="Permission to connect your account"
        >
          <h2 className={styles.stepHeading}>
            <span>1</span> Confirm your permission
          </h2>
          <label
            className={`${styles.consentCard} ${consent ? styles.consentSelected : ''}`}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={busy}
            />
            <span>
              <strong>Allow Apple or Google to connect to my account</strong>
              <small>
                I’ll choose a provider below. My existing account and saved
                details will stay together.
              </small>
            </span>
          </label>
          <h2 className={styles.stepHeading}>
            <span>2</span> Choose a sign-in method
          </h2>
          <p className={styles.consentStatus} role="status">
            {consent
              ? 'Permission confirmed. Choose Apple or Google below.'
              : 'Select the checkbox above to enable the connection buttons.'}
          </p>
        </section>
      ) : null}
      {cfg.apple && !(mode === 'link' && cfg.connected.includes('apple')) ? (
        <button
          className={styles.apple}
          type="button"
          disabled={busy || (mode === 'link' && !consent)}
          onClick={apple}
        >
          <svg
            width="18"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.05 12.54c.03 3.3 2.9 4.4 2.93 4.42-.02.08-.46 1.57-1.51 3.11-.91 1.34-1.86 2.68-3.35 2.71-1.46.03-1.94-.87-3.61-.87-1.66 0-2.19.84-3.56.9-1.44.05-2.53-1.45-3.45-2.78C2.63 17.31 1.2 12.35 3.11 9.02a5.35 5.35 0 0 1 4.5-2.74c1.41-.03 2.74.95 3.61.95.86 0 2.49-1.18 4.19-1.01.71.03 2.71.29 4 2.18-.1.06-2.39 1.39-2.36 4.14ZM14.31 4.42c.77-.93 1.29-2.22 1.15-3.5-1.11.04-2.46.74-3.25 1.67-.71.83-1.33 2.16-1.16 3.44 1.24.1 2.5-.63 3.26-1.61Z" />
          </svg>
          {mode === 'link' ? 'Connect Apple' : 'Continue with Apple'}
        </button>
      ) : null}
      {cfg.googleClientId &&
      !(mode === 'link' && cfg.connected.includes('google')) ? (
        <>
          {mode === 'link' && !consent ? (
            <button type="button" disabled className={styles.googlePending}>
              Connect Google
            </button>
          ) : null}
          <div
            ref={ref}
            className={styles.google}
            style={
              mode === 'link' && !consent ? { display: 'none' } : undefined
            }
          />
        </>
      ) : null}
      {mode === 'signin' && (cfg.apple || cfg.googleClientId) ? (
        <aside className={styles.connectNotice} aria-label="Existing account">
          <span>Already have an account?</span>
          <a href="/connect-social">
            Connect Apple or Google <span aria-hidden="true">→</span>
          </a>
        </aside>
      ) : null}
      {mode === 'link' && cfg.connected.length ? (
        <p className={styles.connected}>
          Connected:{' '}
          {cfg.connected
            .map((x) => (x === 'apple' ? 'Apple' : 'Google'))
            .join(', ')}
        </p>
      ) : null}
    </div>
  );
}
