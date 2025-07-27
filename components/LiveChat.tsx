'use client';

import Script from 'next/script';
import { useEffect } from 'react';

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
  useEffect(() => {
    // Initialize the LiveChat window objects
    window._lc = window._lc || {};
    window.__lc = {
      license: 19117465,
      integration_name: 'manual_onboarding',
      product_name: 'livechat',
    };
  }, []);

  return (
    <>
      <Script
        id="livechat-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            ;(function(n,t,c){function i(n){return e.h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n._lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
          `,
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
