'use client';

import { usePathname } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Mail, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  buildFacebookLeadMeta,
  trackBrowserLeadEvent,
} from '@/lib/marketing/facebookLeadMeta';

const FIRST_SEEN_KEY = 'sureimports_lead_first_seen_at';
const SUBSCRIBED_KEY = 'sureimports_lead_subscribed';
const DISMISS_COUNT_KEY = 'sureimports_lead_dismiss_count';
const LAST_DISMISSED_KEY = 'sureimports_lead_last_dismissed_at';
const SESSION_DISMISSED_KEY = 'sureimports_lead_dismissed_this_session';
const LEAD_SEGMENT_ID = '67699403ee348d7f8cb68f3a';

const excludedPathPrefixes = [
  '/auth',
  '/dashboard',
  '/login',
  '/shop/checkout',
  '/shop/order-success',
  '/receipt',
  '/invoice',
];

function isExcludedPath(pathname: string) {
  return excludedPathPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function getMessage(pathname: string) {
  if (pathname.startsWith('/blog')) {
    return 'Get practical China import insights sent directly to your inbox.';
  }
  return 'Join over 40,000 readers who trust us for raw, practical import execution insights every week.';
}

function getPageType(pathname: string) {
  return pathname.startsWith('/blog') ? 'blog' : 'site';
}

function getAttribution(pathname: string) {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const getParam = (key: string) => params.get(key);

  return {
    page_type: getPageType(pathname),
    pathname,
    page_url: window.location.href,
    referrer: document.referrer || null,
    utm_source: getParam('utm_source'),
    utm_medium: getParam('utm_medium'),
    utm_campaign: getParam('utm_campaign'),
    utm_content: getParam('utm_content'),
    utm_term: getParam('utm_term'),
    fbclid: getParam('fbclid'),
    first_seen_at: window.localStorage.getItem(FIRST_SEEN_KEY),
    dismiss_count: Number(window.localStorage.getItem(DISMISS_COUNT_KEY) || '0'),
  };
}

export default function LeadCapturePopup() {
  const pathname = usePathname() || '/';
  const [isVisible, setIsVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successTitle, setSuccessTitle] = useState("You're on the list.");
  const [successMessage, setSuccessMessage] = useState(
    'Your practical logistics briefing will arrive shortly.',
  );

  const message = useMemo(() => getMessage(pathname), [pathname]);

  useEffect(() => {
    if (isExcludedPath(pathname)) {
      setIsVisible(false);
      return;
    }

    if (typeof window === 'undefined') return;

    const hasSubscribed = window.localStorage.getItem(SUBSCRIBED_KEY) === 'true';
    const dismissedThisSession =
      window.sessionStorage.getItem(SESSION_DISMISSED_KEY) === 'true';

    if (hasSubscribed || dismissedThisSession) {
      setIsVisible(false);
      return;
    }

    if (!window.localStorage.getItem(FIRST_SEEN_KEY)) {
      window.localStorage.setItem(FIRST_SEEN_KEY, new Date().toISOString());
    }

    let hasTriggered = false;
    const showPopup = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      setIsVisible(true);
    };

    const timer = window.setTimeout(showPopup, 7000);

    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrollDepth = window.scrollY / scrollableHeight;
      if (scrollDepth >= 0.35) {
        showPopup();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const closePopup = () => {
    if (typeof window !== 'undefined') {
      const dismissCount = Number(
        window.localStorage.getItem(DISMISS_COUNT_KEY) || '0',
      );
      window.localStorage.setItem(DISMISS_COUNT_KEY, String(dismissCount + 1));
      window.localStorage.setItem(LAST_DISMISSED_KEY, new Date().toISOString());
      window.sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
    }
    setIsVisible(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const pageType = getPageType(pathname);
      const leadMeta = buildFacebookLeadMeta();
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          first_name: firstName.trim(),
          segment_ids: [LEAD_SEGMENT_ID],
          source: 'lead_capture_popup',
          message_variant: pageType,
          ...getAttribution(pathname),
          ...leadMeta,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || 'Unable to subscribe right now. Please try again.',
        );
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SUBSCRIBED_KEY, 'true');
      }

      trackBrowserLeadEvent({
        eventId: leadMeta.fbEventId,
        value: 1,
        currency: 'NGN',
        contentName: 'Website Lead Capture Popup',
        contentCategory: pageType,
        numItems: 1,
      });

      if (data?.alreadySubscribed) {
        setSuccessTitle("You're already subscribed.");
        setSuccessMessage(
          'This email is already on the Sure Imports insights list.',
        );
      } else {
        setSuccessTitle("You're on the list.");
        setSuccessMessage(
          'Your practical logistics briefing will arrive shortly.',
        );
      }

      setHasSubmitted(true);
      window.setTimeout(() => setIsVisible(false), 2600);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to subscribe right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px] sm:px-0 sm:pb-0">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900">
        
        {/* Subtle top indicator bar */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-orange-500/80" />

        {/* Minimal Close Button */}
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {hasSubmitted ? (
          <div className="flex min-h-[220px] flex-col justify-center text-center items-center py-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              {successTitle}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-[260px]">
              {successMessage}
            </p>
          </div>
        ) : (
          <>
            {/* Context Badge */}
            <div className="text-[11px] font-bold uppercase tracking-widest text-brand-orange-600 dark:text-brand-orange-400 mb-2">
              Weekly Dispatch
            </div>

            {/* Typography Overhaul */}
            <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              Practical China import strategy, minus the noise.
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {message}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                <Input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus-visible:ring-brand-orange-500/40"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus-visible:ring-brand-orange-500/40"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-medium text-rose-600 dark:bg-rose-500/5 dark:text-rose-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg bg-brand-orange-500 text-xs font-semibold text-white shadow-md shadow-brand-orange-500/10 transition-all hover:bg-brand-orange-600 hover:shadow-none"
              >
                <Mail className="mr-2 h-3.5 w-3.5" />
                {isSubmitting ? 'Subscribing...' : 'Subscribe to Insights'}
              </Button>
            </form>

            {/* Integrated, Elegant Sign-off */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] tracking-wide text-slate-400 dark:text-slate-500">
                Zero spam. Value only.
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 italic">
                — Tochukwu Nkwocha, <span className="not-italic text-[9px] uppercase tracking-wider font-bold opacity-70">CEO</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
