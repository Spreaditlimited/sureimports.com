'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PROCUREMENT_STATUS_ITEMS } from '@/app/dashboard/procurement/constants/order-statuses';
import styles from './Orders.module.css';

export default function ProcurementTrackerFrame({ status, onStatusChange, count, createControl, children, partner = false }: {
  status: string;
  onStatusChange: (status: string) => void;
  count: number;
  createControl: React.ReactNode;
  children: React.ReactNode;
  partner?: boolean;
}) {
  const statuses = PROCUREMENT_STATUS_ITEMS.filter(item => !partner || !item.value.startsWith('bank-pending'));
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>Procurement</p><h1>Your orders</h1><p className={styles.description}>Open an order to review its products, costs and next steps.</p></div>
        <div>{createControl}</div>
      </header>
      <div className={styles.toolbar}>
        <label htmlFor="procurement-status">Order status</label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="procurement-status" className={styles.select}><SelectValue /></SelectTrigger>
          <SelectContent>{statuses.map(item => <SelectItem key={item.value} value={item.value}>{item.title}</SelectItem>)}</SelectContent>
        </Select>
        <span className={styles.count}>{count} {count === 1 ? 'order' : 'orders'}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
