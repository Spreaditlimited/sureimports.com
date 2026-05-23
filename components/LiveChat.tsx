'use client';

import Script from 'next/script';
import { useMemo } from 'react';

declare global {
  interface Window {
    _lc?: unknown;
    __lc?: {
      license: number;
      integration_name: string;
      product_name: string;
    };
    LiveChatWidget?: {
      _q: unknown[];
      _h: null | { apply: (context: unknown, args: unknown[]) => unknown };
      _v: string;
      on: (...args: unknown[]) => unknown;
      once: (...args: unknown[]) => unknown;
      off: (...args: unknown[]) => unknown;
      get: (...args: unknown[]) => unknown;
      call: (...args: unknown[]) => unknown;
      init: () => void;
    };
  }
}

export default function LiveChat() {
  const shouldLoad = useMemo(
    () => process.env.NODE_ENV === 'production',
    [],
  );

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        id="livechat-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.__lc = window.__lc || {};
            window.__lc.license = 19117465;
            window.__lc.integration_name = "manual_onboarding";
            window.__lc.product_name = "livechat";
            window.__lc.asyncInit = true;
          `,
        }}
      />
      <Script
        id="livechat-script"
        src="https://cdn.livechatinc.com/tracking.js"
        strategy="afterInteractive"
        onError={() => {
          console.warn('LiveChat script failed to load.');
        }}
      />
      <noscript>
        <a href="https://www.livechat.com/chat-with/19117465/" rel="nofollow">
          Chat with us
        </a>
        , powered by{' '}
        <a
          href="https://www.livechat.com/?welcome"
          rel="noopener nofollow"
          target="_blank"
        >
          LiveChat
        </a>
      </noscript>
    </>
  );
}
