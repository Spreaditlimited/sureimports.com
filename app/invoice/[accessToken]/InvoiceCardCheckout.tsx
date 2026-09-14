'use client';

import { useEffect, useState } from 'react';

export default function InvoiceCardCheckout({ accessToken, disabled }: { accessToken: string; disabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [failed, setFailed] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const endpoint = `/api/invoicing/public/invoice/${encodeURIComponent(accessToken)}/paypal`;

  useEffect(() => {
    const checkoutId = new URL(window.location.href).searchParams.get('paypalCheckout');
    if (!checkoutId) return;
    let active = true;
    setBusy(true);
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'verify', checkoutId }) })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Payment confirmation is unavailable.');
        if (!active) return;
        setPaymentReceived(['PAID', 'REVIEW', 'SANDBOX_CONFIRMED'].includes(result.status));
        setNotice(result.status === 'PAID' ? 'Payment received. Your invoice will update shortly, and your receipt will be emailed to you.'
          : result.status === 'SANDBOX_CONFIRMED' ? 'Sandbox payment confirmed. No live invoice or earnings were changed.'
          : 'Payment received and awaiting allocation review. Do not pay again. Please contact support.');
        const url = new URL(window.location.href);
        url.searchParams.delete('paypalCheckout'); url.searchParams.delete('token'); url.searchParams.delete('PayerID');
        window.history.replaceState(null, '', url.pathname + url.search);
      }).catch((error) => { if (active) { setFailed(true); setNotice(error.message); } })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [endpoint]);

  async function start() {
    setBusy(true); setNotice(''); setFailed(false);
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create' }) });
      const result = await response.json();
      if (!response.ok || !result.checkoutUrl) throw new Error(result.message || 'Could not open checkout.');
      window.location.assign(result.checkoutUrl);
    } catch (error) { setFailed(true); setNotice(error instanceof Error ? error.message : 'Unable to open checkout.'); setBusy(false); }
  }

  return <section className="mb-8 rounded-2xl border border-[var(--si-border)] bg-[var(--si-surface)] p-6">
    <h2 className="text-lg font-bold text-[var(--si-ink)]">Pay securely by card or PayPal</h2>
    <p className="mt-2 text-sm text-[var(--si-muted)]">Pay the outstanding invoice balance online. Card checkout does not require a PayPal account, where available.</p>
    <button type="button" disabled={disabled || busy || paymentReceived} onClick={start} className="mt-4 min-h-12 rounded-xl bg-[var(--si-primary)] px-6 py-3 font-semibold text-[var(--si-on-primary)] disabled:cursor-not-allowed disabled:opacity-50">
      {busy ? 'Checking payment…' : paymentReceived ? 'Payment received' : 'Pay by card or PayPal'}
    </button>
    {notice ? <p role={failed ? 'alert' : 'status'} className={`mt-4 text-sm ${failed ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{notice}</p> : null}
  </section>;
}
