'use client';

import Link from 'next/link';
import { useSupportEnabled } from '@/components/support/SupportProvider';
import DeliveryDetails from './DeliveryDetails';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MoreOrders from '../../view-orders/components/products-table/orders-view-more';
import Loader from '@/components/uix/Loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import styles from '../../view-orders/components/Orders.module.css';

interface ProductData {
  id: number;
  pidUser: string;
  pidProduct: string;
  pidOrder: string;
  productName: string;
  productLink: string;
  productCategory: string;
  productPrice: string;
  productWeight: string;
  shippingMeasurePerUnit?: string;
  productQuantity: string;
  productInfo: string;
  createdAt: string;
}

export default function ViewOrderPage() {
  const supportEnabled = useSupportEnabled();
  const router = useRouter();
  const params = useParams<{ pidOrder: string }>();
  const searchParams = useSearchParams();

  const pidOrder = params?.pidOrder || '';
  const returnStatus = searchParams.get('statusx') || 'saved';

  const [products, setProducts] = useState<ProductData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [deliveryReady, setDeliveryReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    setDeliveryReady(false);
    const fetchProducts = async () => {
      if (!pidOrder) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/get-data/procurement-product-data?pidOrder=${pidOrder}`,
          { cache: 'no-store', signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error('Failed to fetch order products');
        }

        const data = await res.json();
        if (!controller.signal.aborted) setProducts(data?.productsGetAll || []);
      } catch (error) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchProducts();
    return () => controller.abort();
  }, [pidOrder, retry]);

  return (
    <div className={`${styles.detail} space-y-5`}>
      <Button
        variant="outline"
        className="rounded-xl"
        onClick={() =>
          router.push(`/dashboard/procurement/view-orders/${returnStatus}`)
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      {loading ? <div className={styles.feedback} role="status">Loading order details…</div> : error ? <div className={styles.feedback} role="alert">Unable to load this order.<br /><button onClick={() => setRetry(value => value + 1)}>Try again</button></div> : <>
      {supportEnabled && <Button asChild variant="outline"><Link href={`/dashboard/support?order=${encodeURIComponent(pidOrder)}`}>Get help with this order</Link></Button>}
      <DeliveryDetails pidOrder={pidOrder} onReady={setDeliveryReady} />
      {deliveryReady && (
        <MoreOrders products={products || []} statusOverride={returnStatus} />
      )}
      </>}
    </div>
  );
}
