'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

const siteKey = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY;
let recaptchaScriptPromise: Promise<void> | null = null;

function isValidSiteKey(configuredSiteKey: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(configuredSiteKey);
}

function isLocalhost(): boolean {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '::1'
  );
}

function loadRecaptchaScript(configuredSiteKey: string): Promise<void> {
  if (window.grecaptcha) return Promise.resolve();
  if (recaptchaScriptPromise) return recaptchaScriptPromise;

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    if (!isValidSiteKey(configuredSiteKey)) {
      reject(new Error('Invalid reCAPTCHA site key.'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
      configuredSiteKey,
    )}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load reCAPTCHA.'));
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

export function useRecaptchaV3() {
  return useCallback(async (action: string): Promise<string | undefined> => {
    if (typeof window === 'undefined' || isLocalhost() || !siteKey) {
      return undefined;
    }

    await loadRecaptchaScript(siteKey);

    return new Promise((resolve, reject) => {
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha) {
        reject(new Error('reCAPTCHA is unavailable.'));
        return;
      }

      grecaptcha.ready(() => {
        grecaptcha.execute(siteKey, { action }).then(resolve).catch(reject);
      });
    });
  }, []);
}
