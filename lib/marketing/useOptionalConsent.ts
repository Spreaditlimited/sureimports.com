'use client';

import { useSyncExternalStore } from 'react';
import { hasOptionalCookieConsent } from './optionalConsent';

function subscribe(callback: () => void) {
  window.addEventListener('si:consent-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('si:consent-change', callback);
    window.removeEventListener('storage', callback);
  };
}

export function useOptionalConsent() {
  return useSyncExternalStore(
    subscribe,
    () => hasOptionalCookieConsent(),
    () => false,
  );
}
