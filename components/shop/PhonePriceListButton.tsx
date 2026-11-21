'use client';

import { useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import styles from './PhonePriceListButton.module.css';

export default function PhonePriceListButton({ className = '' }: { className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  async function download() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/shop/phone-price-list', { cache: 'no-store' });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Could not prepare the price list. Please try again.');
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Sure-Imports-Phone-Price-List.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not download the price list. Please try again.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return <div className={`${styles.wrap} ${className}`}>
    <button type="button" className={styles.button} onClick={download} disabled={busy} aria-busy={busy}>
      {busy ? <Loader2 size={18} className={styles.spinner} aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
      <span>{busy ? 'Preparing price list…' : 'Download phone price list'}</span>
      <span className={styles.format}>PDF</span>
    </button>
    {error && <p className={styles.error} role="alert">{error}</p>}
  </div>;
}
