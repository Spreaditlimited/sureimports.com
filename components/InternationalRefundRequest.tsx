'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './InternationalRefundRequest.module.css';
import { refundProgressMessage } from '@/lib/refunds/customer-copy';

type Quote = {
  sourceCurrency: string;
  sourceAmount: string;
  settlementCurrency: string;
  settlementAmount: string;
  exchangeRate: string;
};
export default function InternationalRefundRequest({
  refundId,
}: {
  refundId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (open && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [open]);
  const [busy, setBusy] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [token, setToken] = useState('');
  const [notice, setNotice] = useState('');
  const [success, setSuccess] = useState(false);
  const [originalPayment, setOriginalPayment] = useState<{
    amount: string;
    currency: string;
  } | null>(null);
  async function load() {
    setOpen(true);
    setBusy(true);
    setNotice('');
    setQuote(null);
    setSuccess(false);
    setOriginalPayment(null);
    try {
      const response = await fetch(
        `/api/refunds/${encodeURIComponent(refundId)}/settlement`,
      );
      const data = await response.json();
      if (!response.ok) {
        setNotice(data.message || 'We could not load your refund details. Please refresh and try again.');
        return;
      }
      if (data.originalPayment) {
        setOriginalPayment(data.originalPayment);
        setNotice(data.message);
        return;
      }
      if (data.settlement) {
        setSuccess(true);
        setNotice(
          `${refundProgressMessage(data.settlement.status, data.settlement.method)} Refund amount: ${data.settlement.settlementCurrency} ${data.settlement.settlementAmount}.`,
        );
        return;
      }
      if (data.message && !data.quote) { setNotice(data.message); setSuccess(true); return; }
      setQuote(data.quote);
      setToken(data.quoteToken);
    } catch {
      setNotice(
        'We could not load your refund details. Please refresh this page, or contact support if this continues.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function requestPayPal() {
    setBusy(true);
    try {
      const response = await fetch(
        `/api/refunds/${encodeURIComponent(refundId)}/settlement`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'PAYPAL' }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setNotice(data.message || 'We could not confirm your request. Refresh to check its status before trying again.');
        return;
      }
      setSuccess(true);
      setOriginalPayment(null);
      setNotice(data.message);
      router.refresh();
    } catch {
      setNotice(
        'We could not confirm your request. Refresh to check its status before trying again.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(
        `/api/refunds/${encodeURIComponent(refundId)}/settlement`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteToken: token,
            destination: {
              accountName: form.get('accountName'),
              bankName: form.get('bankName'),
              accountNumber: form.get('accountNumber'),
              bankCode: form.get('bankCode'),
              bankCountry:
                quote?.settlementCurrency === 'GBP'
                  ? 'GB'
                  : String(form.get('bankCountry') || '').toUpperCase(),
              confirmedOwnAccount: form.get('confirmedOwnAccount') === 'on',
            },
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setNotice(data.message || 'We could not confirm your request. Refresh to check its status before trying again.');
        return;
      }
      setSuccess(true);
      setQuote(null);
      setNotice(data.message);
      router.refresh();
    } catch {
      setNotice(
        'We could not confirm your request. Refresh to check its status before trying again.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        disabled={busy}
        onClick={() => (open ? setOpen(false) : load())}
      >
        {open ? 'Close refund details' : 'Request / track refund'}
      </button>
      {open && createPortal(
        <dialog
          ref={dialogRef}
          className={styles.panel}
          aria-labelledby={titleId}
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
        >
          <header className={styles.header}><h2 id={titleId}>Your refund</h2><button type="button" className={styles.trigger} onClick={() => setOpen(false)}>Close</button></header>
          {busy && <p role="status">Please wait…</p>}
          {notice && (
            <p
              role={success ? 'status' : 'alert'}
              className={success ? styles.success : styles.notice}
            >
              {notice}
            </p>
          )}
          {originalPayment && (
            <div>
              <p>
                Refund requested:{' '}
                <strong>
                  {originalPayment.currency} {originalPayment.amount}
                </strong>
              </p>
              <button
                type="button"
                className={styles.trigger}
                disabled={busy}
                onClick={requestPayPal}
              >
                Request refund through PayPal
              </button>
            </div>
          )}
          {quote && (
            <form onSubmit={submit}>
              <h3>Request your refund</h3>
              <p>
                Refund balance:{' '}
                <strong>
                  {quote.sourceCurrency} {quote.sourceAmount}
                </strong>
              </p>
              <p>
                Amount to your bank:{' '}
                <strong>
                  {quote.settlementCurrency} {quote.settlementAmount}
                </strong>
                {quote.settlementCurrency === 'GBP' && (
                  <> · £{quote.exchangeRate} per US$1</>
                )}
              </p>
              <p>
                This quote is valid for 30 minutes. The rate and amount are
                locked when your request is accepted.
              </p>
              <div className={styles.fields}>
                <label>
                  Account holder name
                  <input
                    name="accountName"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                  />
                </label>
                <label>
                  Bank name
                  <input
                    name="bankName"
                    required
                    minLength={2}
                    maxLength={120}
                  />
                </label>
                <label>
                  Account number / IBAN
                  <input
                    name="accountNumber"
                    required
                    maxLength={34}
                    autoComplete="off"
                  />
                </label>
                <label>
                  {quote.settlementCurrency === 'GBP'
                    ? 'Sort code'
                    : 'SWIFT / routing code'}
                  <input
                    name="bankCode"
                    required
                    maxLength={34}
                    autoComplete="off"
                  />
                </label>
                {quote.settlementCurrency !== 'GBP' && (
                  <label>
                    Bank country code
                    <input
                      name="bankCountry"
                      placeholder="For example, US"
                      required
                      minLength={2}
                      maxLength={2}
                    />
                  </label>
                )}
              </div>
              <label className={styles.confirm}>
                <input name="confirmedOwnAccount" type="checkbox" required />{' '}
                This account is in my name and accepts{' '}
                {quote.settlementCurrency} transfers.
              </label>
              <p>
                Bank details are reviewed before payment. If your original
                payment needs to be returned through its payment provider, our
                team will confirm this before settlement.
              </p>
              <button className={styles.trigger} disabled={busy} type="submit">
                {busy ? 'Submitting…' : 'Request bank refund'}
              </button>
            </form>
          )}
        </dialog>, document.body,
      )}
    </div>
  );
}
