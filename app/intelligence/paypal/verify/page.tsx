'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/components/home/PaymentStatus.module.css';
function PaymentResult() {
  const checkout = useSearchParams().get('checkout');
  const [message, setMessage] = useState('Confirming your PayPal payment…');
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function verify() {
      setBusy(true);
      try {
        if (!checkout) throw Error('The checkout reference is missing.');
        const response = await fetch('/api/intelligence/paypal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'verify', checkout }), signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw Error(data.message || 'Unable to confirm your payment.');
        setPaid(data.paid); setMessage(data.message);
      } catch (error) { if (!controller.signal.aborted) setMessage((error as Error).message); }
      finally { if (!controller.signal.aborted) setBusy(false); }
    }
    void verify(); return () => controller.abort();
  }, [checkout, attempt]);
  return <main className={styles.page}><section className={styles.card}><h1>{busy ? 'Checking payment' : paid ? 'Payment confirmed' : 'Payment update'}</h1><p className="mt-4" role="status">{message}</p>{!paid && !busy && <button className="mt-6 min-h-12 rounded-lg border px-6" onClick={() => setAttempt(value => value + 1)}>Check payment again</button>}<Link className="mt-6 flex px-5 py-3" href="/dashboard/intelligence">Go to Supplier Intelligence</Link><p className="mt-4 text-sm">If you approved a payment, check its status before starting another checkout.</p></section></main>;
}
export default function Page() { return <Suspense fallback={<main className={styles.page}>Loading payment status…</main>}><PaymentResult /></Suspense>; }
