'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../checkout.module.css';

function ReturnContent() {
  const params = useSearchParams();
  const reference = params.get('token');
  const [message, setMessage] = useState('Confirming your payment…');
  const [destination, setDestination] = useState(
    '/dashboard/procurement/view-orders/pending',
  );
  useEffect(() => {
    let active = true;
    if (!reference) {
      setMessage('Payment reference is missing. Please check your order.');
      return;
    }
    fetch('/api/paypal/procurement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', reference }),
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message);
        return body;
      })
      .then((body) => {
        if (active) {
          setMessage(
            'Payment confirmed. Your procurement order has been updated.',
          );
          setDestination(
            `/dashboard/procurement/view-orders/${body.nextStatus}`,
          );
        }
      })
      .catch((error) => {
        if (active)
          setMessage(
            error.message ||
              'Unable to confirm payment. Check your order before paying again.',
          );
      });
    return () => {
      active = false;
    };
  }, [reference]);
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>SURE IMPORTS</p>
        <h1>Payment status</h1>
        <p role="status">{message}</p>
        <Link className={styles.back} href={destination}>
          View your orders
        </Link>
      </section>
    </main>
  );
}
export default function ProcurementPayPalReturn() {
  return (
    <Suspense>
      <ReturnContent />
    </Suspense>
  );
}
