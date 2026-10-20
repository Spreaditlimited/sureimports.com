'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import ProcurementTrackerFrame from '../components/ProcurementTrackerFrame';
import ProcurementEmptyState from '../components/ProcurementEmptyState';
import OrderSection from '../../view-orders/components/order-section';
import ProcurementDraftTools from '../../view-orders/components/ProcurementDraftTools';
import CreateOrder from '../../create-order/components/createOrder';
import { PROCUREMENT_STATUS_ITEMS } from '@/app/dashboard/procurement/constants/order-statuses';
import styles from '../components/Orders.module.css';

interface OrderData {
  id: any;
  pidOrder: string;
  pidUser: string;
  orderName: string;
  destinationCountry: string;
  currencyType: string;
  shippingPlan: string;
  orderCategory: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

interface orderStatus {
  params: Promise<{ statusx: string }>;
}

export function ViewOrders({ params }: orderStatus) {
  const router = useRouter();
  const { user } = useAuth();

  const { statusx } = use(params);
  const currentStatus = statusx ? statusx.toLowerCase() : 'saved';
  const validStatusValues = new Set(
    PROCUREMENT_STATUS_ITEMS.map((item) => item.value),
  );
  const normalizedStatus = validStatusValues.has(currentStatus)
    ? currentStatus
    : 'saved';

  const pidUser = user?.pidUser;
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [refresh, setRefresh] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>();
  useEffect(() => {
    if (!pidUser) return;
    const controller = new AbortController();
    setCounts(undefined);
    fetch(`/api/get-data/procurement-count/${pidUser}/saved`, { signal: controller.signal, cache: 'no-store' })
      .then(async response => { if (!response.ok) throw new Error('Counts unavailable'); return response.json(); })
      .then(data => { if (!controller.signal.aborted) setCounts(data); })
      .catch(() => { /* Orders remain accessible if counts are unavailable. */ });
    return () => controller.abort();
  }, [pidUser, normalizedStatus, refresh]);

  const [error, setError] = useState('');


  useEffect(() => {
    if (!pidUser) return;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setOrderData(null);
    async function load() {
      try {
        const res = await fetch(`/api/get-data/procurement/${pidUser}/${normalizedStatus}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Unable to load your orders. Please try again.');
        const data = await res.json();
        if (!controller.signal.aborted) setOrderData(data);
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Unable to load your orders.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [pidUser, normalizedStatus, refresh]);

  const countRecords: OrderData[] = orderData ? Object.values(orderData) : [];

  const handleStatusChange = (newStatus: string) => {
    router.push(`/dashboard/procurement/view-orders/${newStatus}`);
  };

  return <ProcurementTrackerFrame status={normalizedStatus} onStatusChange={handleStatusChange} count={countRecords.length} counts={counts} loading={loading} createControl={<CreateOrder className="h-12 rounded-xl bg-[#2E62D9] px-6 text-sm font-semibold text-white" />}>
        {loading ? <div className={styles.feedback} role="status">Loading your orders…</div> : error ? <div className={styles.feedback} role="alert">{error}<br /><button onClick={() => setRefresh(value => value + 1)}>Try again</button></div> : <>


        {countRecords.length === 0 ? (
          <ProcurementEmptyState status={normalizedStatus} action={<button onClick={() => router.push('/dashboard/procurement/create-order')} className="rounded-xl bg-[#2E62D9] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#2E62D9]/30 transition hover:bg-[#2754BC]">Create New Order</button>} />
        ) : (
          /* Order Section Wrapper */
          <div className="rounded-[32px] bg-transparent">
            <OrderSection initialOrders={orderData} onChanged={() => setRefresh(value => value + 1)} />
          </div>
        )}
        {normalizedStatus === 'saved' && (
          <details className={styles.help}>
            <summary>
              <span className={styles.helpTitle}>Order help</span>
              <span className={styles.helpDescription}>Get admin assistance or combine your saved orders.</span>
            </summary>
            <div className={styles.helpContent}>
              <ProcurementDraftTools onChanged={() => setRefresh(value => value + 1)} />
            </div>
          </details>
        )}
        </>}
  </ProcurementTrackerFrame>;
}

export default ViewOrders;
