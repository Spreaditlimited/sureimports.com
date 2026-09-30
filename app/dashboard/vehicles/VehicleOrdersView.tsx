'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  RefreshCcw,
  Package,
  CalendarDays,
  MapPin,
  Layers,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from 'lucide-react';
import darkHeader from '@/components/dashboard/DarkHeader.module.css';
import { STAGE_LABELS, VEHICLE_STAGES } from '@/lib/vehicles/policy';

type Order = {
  paySmallSmall?: boolean;
  id: string;
  vehicleName: string;
  quantity: number;
  status: string;
  createdAt: Date;
  eta: string | null;
  destination: string;
};

export default function VehicleOrdersView({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const stats = [
    {
      label: 'Total Orders',
      count: orders.length,
      icon: Layers,
      color: 'text-blue-600',
    },
    {
      label: 'In Progress',
      count: orders.filter(
        (o) => !['ENQUIRY', 'DELIVERED', 'CANCELLED'].includes(o.status),
      ).length,
      icon: Clock,
      color: 'text-amber-600',
    },
    {
      label: 'Completed',
      count: orders.filter((o) => o.status === 'DELIVERED').length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
    },
  ];
  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-black">
      <div className="bg-slate-900 pb-32 pt-12 text-white dark:bg-[#0b0c16]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                My Vehicle Orders
              </h1>
              <p className="mt-2 text-slate-400">
                Manage your vehicle quotations, payments and shipping updates.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={refreshing}
                onClick={() => startTransition(() => router.refresh())}
                className={`${darkHeader.sync} si-dashboard-sync flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-slate-700 dark:bg-[#161629] dark:hover:bg-[#1d1f36]`}
              >
                <RefreshCcw
                  className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                Sync
              </button>
              <Link
                href="/cars"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 dark:shadow-blue-950/40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                New Request
              </Link>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-[#161629]/70"
              >
                <div
                  className={`${darkHeader.tile} rounded-lg bg-slate-800 p-3 dark:bg-[#0f1020] ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section
        className={`${darkHeader.overlap} mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8`}
        aria-label="Vehicle orders"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${darkHeader.heading}`}>
              Your Orders
            </h2>
            <span
              className={`flex items-center gap-2 text-sm ${darkHeader.copy}`}
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              Order Tracking
            </span>
          </div>
          {orders.length === 100 && (
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Showing your latest 100 orders. Summary counts reflect these
              orders.
            </p>
          )}
          {!orders.length ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-20 text-center dark:border-slate-700 dark:bg-[#161629]">
              <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <Package
                  className="h-8 w-8 text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                No vehicle orders found
              </h3>
              <p className="mt-1 text-slate-500">
                Start a new request to see it appear here.
              </p>
              <Link
                href="/cars"
                className="mt-6 font-semibold text-blue-600 hover:underline"
              >
                Request your first vehicle →
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = !!expanded[order.id];
              const activeIndex = VEHICLE_STAGES.indexOf(
                order.status as (typeof VEHICLE_STAGES)[number],
              );
              return (
                <article
                  key={order.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md dark:border-slate-700 dark:bg-[#161629]"
                >
                  <div className="flex flex-col p-6 lg:flex-row lg:items-center lg:gap-8">
                    <div className="mb-4 min-w-0 lg:mb-0 lg:w-1/4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="break-all text-[10px] font-black uppercase tracking-widest text-blue-600">
                          {order.id}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-medium text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-GB',
                            { timeZone: 'Africa/Lagos' },
                          )}
                        </span>
                      </div>
                      <h3 className="mt-1 break-words text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                        {order.vehicleName}
                        {order.paySmallSmall && (
                          <span className="ml-2 text-xs font-medium text-violet-600 dark:text-violet-300">
                            Pay Small Small
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="grid min-w-0 flex-1 grid-cols-2 gap-4 border-slate-100 py-4 dark:border-slate-800 lg:grid-cols-3 lg:border-l lg:border-r lg:px-8">
                      {[
                        {
                          label: 'Quantity',
                          value: `${order.quantity} units`,
                          Icon: Package,
                        },
                        {
                          label: 'Lagos arrival',
                          value: order.eta || 'To be confirmed',
                          Icon: CalendarDays,
                        },
                        {
                          label: 'Arrival location',
                          value: 'Lagos',
                          Icon: MapPin,
                        },
                      ].map(({ label, value, Icon }) => (
                        <div
                          key={label}
                          className="flex min-w-0 items-center gap-3"
                        >
                          <div className="shrink-0 rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                            <Icon
                              className="h-4 w-4 text-slate-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                              {label}
                            </p>
                            <p className="break-words text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-4 lg:w-56 lg:justify-end lg:pt-0">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'}`}
                      >
                        {STAGE_LABELS[order.status] || order.status}
                      </span>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`details-${order.id}`}
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [order.id]: !prev[order.id],
                          }))
                        }
                        aria-label={
                          isExpanded ? 'Hide details' : 'View details'
                        }
                        className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div id={`details-${order.id}`}>
                      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-[#0f1020]">
                        {order.status === 'CANCELLED' ? (
                          <p className="text-sm text-rose-600 dark:text-rose-300">
                            This order has been cancelled. View the order for
                            its recorded updates.
                          </p>
                        ) : (
                          <ol
                            className="flex gap-4 overflow-x-auto pb-2"
                            aria-label="Order progress"
                          >
                            {VEHICLE_STAGES.map((stage, index) => (
                              <li
                                key={stage}
                                aria-current={
                                  index === activeIndex ? 'step' : undefined
                                }
                                className="flex min-w-28 items-center gap-2"
                              >
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${index < activeIndex ? 'bg-blue-600 text-white' : index === activeIndex ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600 dark:bg-blue-900 dark:text-blue-200' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}
                                >
                                  {index < activeIndex ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    index + 1
                                  )}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-300">
                                  {STAGE_LABELS[stage]}
                                </span>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-300">
                          View your quotation, payments and full delivery
                          timeline.
                        </p>
                        <Link
                          href={`/dashboard/vehicles/${order.id}`}
                          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                        >
                          Open Order <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
