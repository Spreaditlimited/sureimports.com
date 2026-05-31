'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Hash,
  MapPin,
  Phone,
  Scale,
  Trash2,
  Truck,
  Boxes,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/_lib/utils';
import { useAuth } from '@/app/context/AuthContext';

interface ShippingOnlyOrderCardProps {
  serialNumber: number;
  id: number;
  pidShippingOnly: string;
  pidUser: string;
  whatsappNumber: string;
  shippingName: string;
  shippingTo: string;
  grossWeight: string;
  trackingNumber: string;
  shippingPlan: string;
  expectedShipments: string;
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
  onDelete?: (id: number) => void;
}

const STATUS_STEPS = [
  'Request Received',
  'Shipped',
  'Arrived',
  'Invoiced',
  'Paid',
  'Completed',
] as const;

const STATUS_TO_STEP: Record<string, (typeof STATUS_STEPS)[number]> = {
  'request-received': 'Request Received',
  'ready-to-ship': 'Shipped',
  'product-shipped': 'Shipped',
  'product-arrived': 'Arrived',
  invoiced: 'Invoiced',
  paid: 'Paid',
  'product-delivered': 'Completed',
};

export default function OrderCardShippingOnly({
  id,
  pidShippingOnly,
  whatsappNumber,
  shippingName,
  shippingTo,
  grossWeight,
  trackingNumber,
  shippingPlan,
  expectedShipments,
  wantProductVerification,
  wantConsolidation,
  multipleSuppliers,
  description,
  status,
  createdAt,
  invoices,
  onDelete,
}: ShippingOnlyOrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const lowerStatus = String(status || '').toLowerCase();
  const statusClass =
    lowerStatus === 'product-delivered'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300'
      : lowerStatus === 'request-cancelled'
        ? 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300'
        : 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-300';

  const labelFromStatus =
    lowerStatus === 'product-delivered'
      ? 'Completed'
      : String(status || '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
  const normalizedStep = STATUS_TO_STEP[lowerStatus];
  const activeIndex = normalizedStep ? STATUS_STEPS.indexOf(normalizedStep) : -1;

  const boolLabel = (value: string) =>
    String(value).toLowerCase() === 'true' ? 'Yes' : 'No';

  const canDelete = pathname.includes('/request-received');

  const handleDelete = async () => {
    if (!user?.pidUser) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/crud/shipping-only-delete/${user.pidUser}/${pidShippingOnly}`,
      );
      const data = await res.json();
      if (data?.responsex?.status === 'SUCCESS') {
        toast.success('Request deleted successfully.');
        onDelete?.(id);
        router.refresh();
        return;
      }
      toast.error(data?.responsex?.message || 'Unable to delete request.');
    } catch {
      toast.error('Unable to delete request right now.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md dark:border-slate-700 dark:bg-[#161629]">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
        <div className="lg:w-1/4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
              {pidShippingOnly}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-[10px] font-medium text-slate-400">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
            {shippingName || 'Shipping Request'}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-300">
            {description}
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-4 border-slate-100 py-1 lg:grid-cols-3 lg:border-l lg:border-r lg:px-8 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
              <MapPin className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Destination
              </p>
              <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {shippingTo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
              <Truck className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Shipping Plan
              </p>
              <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {shippingPlan}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
              <Scale className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Gross Weight
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {grossWeight}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:w-56 lg:justify-end">
          <div className={cn('rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset', statusClass)}>
            {labelFromStatus}
          </div>
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
              title="Delete request"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title={expanded ? 'Hide details' : 'View details'}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-[#0f1020]">
          {lowerStatus !== 'request-cancelled' && lowerStatus !== 'cancelled-request' && (
            <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#161629]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {STATUS_STEPS.map((step, idx) => {
                  const isPast = idx < activeIndex;
                  const isCurrent = idx === activeIndex;
                  return (
                    <div
                      key={step}
                      className="flex min-w-0 flex-1 basis-0 items-center gap-2"
                    >
                      <div
                        className={cn(
                          'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                          isPast
                            ? 'bg-blue-600 text-white'
                            : isCurrent
                              ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
                        )}
                      >
                        {isPast ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      <span
                        className={cn(
                          'truncate text-[10px] font-bold uppercase tracking-tight',
                          isCurrent
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-slate-400 dark:text-slate-500',
                        )}
                      >
                        {step}
                      </span>
                      {idx !== STATUS_STEPS.length - 1 ? (
                        <div className="mx-1 h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161629]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                WhatsApp Number
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Phone className="h-4 w-4 text-slate-400" />
                {whatsappNumber || 'N/A'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161629]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Tracking Number
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Hash className="h-4 w-4 text-slate-400" />
                {trackingNumber || 'Not provided'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161629]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Expected Shipments
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Boxes className="h-4 w-4 text-slate-400" />
                {expectedShipments || 'Not specified'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161629]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Product Verification
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {boolLabel(wantProductVerification)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161629]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Consolidation
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {boolLabel(wantConsolidation)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161629]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Multiple Suppliers
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {boolLabel(multipleSuppliers)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#161629]">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Notes
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {description || 'No additional details provided.'}
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#161629]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Invoices
            </p>
            {Array.isArray(invoices) && invoices.length > 0 ? (
              <div className="mt-2 space-y-2">
                {invoices.map((invoice) => {
                  const invoiceLink = invoice.accessToken
                    ? `/invoice/${encodeURIComponent(String(invoice.accessToken))}`
                    : null;
                  const invoiceStatus = String(invoice.payment_status || 'PENDING').toUpperCase();
                  return (
                    <div
                      key={`${invoice.pidPayment}-${invoice.pidInvoice || ''}`}
                      className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {invoice.invoiceNumber || invoice.pidPayment} • {invoice.currency_type || 'NGN'} {invoice.amount || '0.00'}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">{invoiceStatus}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {invoiceLink && (
                          <a
                            href={invoiceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                          >
                            View Invoice
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">No invoices yet.</p>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Created on {new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
