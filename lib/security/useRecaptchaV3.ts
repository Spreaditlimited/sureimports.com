'use client';

import { useCallback } from 'react';
import { shouldBypassLocalCaptcha } from './localCaptchaBypass';

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
let scriptPromise: Promise<void> | null = null;

function loadScript(key: string): Promise<void> {
  if (window.grecaptcha) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  if (!/^[A-Za-z0-9_-]+$/.test(key))
    return Promise.reject(new Error('Security verification is unavailable.'));
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      reject(
        new Error('Security verification could not load. Please try again.'),
      );
    };
    const timer = setTimeout(fail, 15000);
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch((error) => {
    scriptPromise = null;
    throw error;
  });
  return scriptPromise;
}

export async function executePublicCaptcha(
  action: string,
): Promise<string | undefined> {
  if (
    typeof window === 'undefined' ||
    shouldBypassLocalCaptcha(window.location.hostname)
  )
    return undefined;
  if (!siteKey)
    throw new Error(
      'Security verification is temporarily unavailable. Please try again shortly.',
    );
  await loadScript(siteKey);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(new Error('Security verification timed out. Please try again.')),
      15000,
    );
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) {
      clearTimeout(timer);
      reject(new Error('Security verification is unavailable.'));
      return;
    }
    grecaptcha.ready(() => {
      grecaptcha
        .execute(siteKey, { action })
        .then((token) => {
          clearTimeout(timer);
          resolve(token);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  });
}

export function useRecaptchaV3() {
  return useCallback(executePublicCaptcha, []);
}
