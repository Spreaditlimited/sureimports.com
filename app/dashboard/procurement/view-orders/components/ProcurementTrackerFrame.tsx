'use client';
import { useEffect, useRef } from 'react';
import { PROCUREMENT_STATUS_ITEMS } from '@/app/dashboard/procurement/constants/order-statuses';
import styles from './Orders.module.css';

export default function ProcurementTrackerFrame({ status, onStatusChange, count, counts, loading = false, createControl, children, partner = false }: {
  status: string;
  onStatusChange: (status: string) => void;
  count: number;
  counts?: Record<string, number>;
  loading?: boolean;
  createControl: React.ReactNode;
  children: React.ReactNode;
  partner?: boolean;
}) {
  const statuses = PROCUREMENT_STATUS_ITEMS.filter(item => !partner || !item.value.startsWith('bank-pending'));
  const selected = statuses.find(item => item.value === status);
  const activeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const button = activeButton.current;
    const rail = button?.parentElement;
    if (!button || !rail) return;
    rail.scrollLeft = Math.max(0, button.offsetLeft - rail.offsetLeft - (rail.clientWidth - button.clientWidth) / 2);
  }, [status]);
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>Procurement</p><h1>Your orders</h1><p className={styles.description}>Open an order to review its products, costs and next steps.</p></div>
        <div>{createControl}</div>
      </header>
      <section className={styles.statusSection} aria-label="Filter orders by status">
        <div className={styles.statusTabs}>
          {statuses.map(item => <button
            key={item.value}
            type="button"
            ref={status === item.value ? activeButton : undefined}
            aria-pressed={status === item.value}
            aria-controls="procurement-order-results"
            className={styles.statusTab}
            onClick={() => onStatusChange(item.value)}
          >
            {item.title}
            {counts?.[item.countKey] !== undefined && <span className={styles.statusBadge}>{counts[item.countKey]}</span>}
          </button>)}
        </div>
        <div className={styles.statusSummary}>
          <div><h2>{selected?.title}</h2><p>{selected?.description}</p></div>
          <span className={styles.count} aria-live="polite">{loading ? 'Loading…' : `${count} ${count === 1 ? 'order' : 'orders'}`}</span>
        </div>
      </section>
      <div id="procurement-order-results" aria-busy={loading}>{children}</div>
    </div>
  );
}
