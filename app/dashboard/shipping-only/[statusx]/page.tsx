'use client';

import React, { useEffect, useState, use } from 'react';
import { PackageX, RefreshCcw } from 'lucide-react';

import Orders from '@/app/dashboard/shipping-only/components/orders';
import { useAuth } from '@/app/context/AuthContext';
import { useRecord } from '@/app/context/RecordCountShippingOnlyContext';

interface ProductData {
  id: any;
  pidShippingOnly: string;
  pidUser: string;
  whatsappNumber: string;
  shippingName: string;
  shippingTo: string;
  grossWeight: string;
  trackingNumber: string;
  shippingPlan: string;
  wantProductVerification: string;
  wantConsolidation: string;
  multipleSuppliers: string;
  description: string;
  status: string;
  createdAt: string;
  invoices?: Array<{
    pidPayment: string;
    pidInvoice?: string;
    amount?: string;
    currency_type?: string;
    payment_status?: string;
    payment_type?: string;
    invoiceNumber?: string;
    accessToken?: string | null;
    source?: string;
    createdAt?: string | null;
    issuedAt?: string | null;
  }>;
}

interface OrderStatusProps {
  params: Promise<{ statusx: string }>;
}

export default function OrderList({ params }: OrderStatusProps) {
  const { statusx } = use(params);
  const { user } = useAuth();
  const { recordx } = useRecord(); 

  const [productData, setProductData] = useState<Record<string, ProductData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pidUser = user?.pidUser;

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!pidUser) return;
      setIsLoading(true);
      try {
        const [ordersRes, invoicesRes] = await Promise.all([
          fetch(`/api/get-data/shipping-only/${pidUser}/${statusx}`),
          fetch('/api/invoicing/user/invoices', { cache: 'no-store' }),
        ]);

        if (!ordersRes.ok) {
          const errorData = await ordersRes.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const ordersData = await ordersRes.json();
        const invoicesJson = invoicesRes.ok ? await invoicesRes.json() : null;
        const invoices = Array.isArray(invoicesJson?.data) ? invoicesJson.data : [];
        const normalize = (value: unknown) =>
          String(value || '')
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '');

        const invoicesByRequest = new Map<string, any[]>();
        for (const inv of invoices) {
          const linkedRequestId = String(inv?.linkedRequestId || '').trim();
          if (!linkedRequestId) continue;
          const existing = invoicesByRequest.get(linkedRequestId) || [];
          existing.push(inv);
          invoicesByRequest.set(linkedRequestId, existing);
        }

        const merged = Array.isArray(ordersData)
          ? ordersData.map((order: any) => {
              const orderId = String(order.pidShippingOnly || '').trim();
              const normalizedOrderId = normalize(orderId);
              const directMatches = invoicesByRequest.get(orderId) || [];
              const fuzzyMatches = invoices.filter((inv: any) => {
                const linked = String(inv?.linkedRequestId || '').trim();
                if (!linked) return false;
                const normalizedLinked = normalize(linked);
                return (
                  linked === orderId ||
                  normalizedLinked === normalizedOrderId ||
                  normalizedLinked.includes(normalizedOrderId) ||
                  normalizedOrderId.includes(normalizedLinked)
                );
              });
              const mergedInvoices = [...directMatches, ...fuzzyMatches];
              const uniqueInvoices = mergedInvoices.filter(
                (inv: any, idx: number, arr: any[]) =>
                  idx ===
                  arr.findIndex(
                    (it: any) =>
                      String(it?.pidInvoice || '') === String(inv?.pidInvoice || ''),
                  ),
              );

              return {
                ...order,
                invoices: uniqueInvoices.map((inv: any) => ({
                  pidPayment: String(inv.pidInvoice || ''),
                  pidInvoice: String(inv.pidInvoice || ''),
                  amount: String(inv.grandTotal || '0'),
                  currency_type: String(inv.currency || 'NGN'),
                  payment_status: String(inv.status || 'ISSUED'),
                  payment_type: 'INVOICE',
                  invoiceNumber: inv.invoiceNumber || null,
                  accessToken: inv.accessToken || null,
                  createdAt: inv.createdAt || null,
                  issuedAt: inv.issuedAt || null,
                  source: 'INVOICING_SYSTEM',
                })),
              };
            })
          : ordersData;

        if (isMounted) setProductData(merged);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProduct();

    return () => { isMounted = false; };
  }, [pidUser, statusx]);

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#161629]">
        <RefreshCcw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-slate-500">Loading your shipping requests...</p>
      </div>
    );
  }

  // Safely extract the object values into an array
  const countRecords: ProductData[] = productData ? Object.values(productData) : [];
  const statusLabel =
    statusx === 'all' ? 'all statuses' : `"${statusx.replace(/-/g, ' ')}"`;

  if (countRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-[#161629]">
        <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
          <PackageX className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No requests found</h3>
        <p className="mt-1 text-slate-500">You currently have no shipping requests with {statusLabel}.</p>
      </div>
    );
  }

  return (
    <div>
      <Orders initialOrders={countRecords as any} statusx={statusx} />
    </div>
  );
}
