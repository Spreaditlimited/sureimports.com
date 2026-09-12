'use client';
import { LayoutList } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROCUREMENT_STATUS_ITEMS } from '@/app/dashboard/procurement/constants/order-statuses';
export default function ProcurementTrackerFrame({
  status,
  onStatusChange,
  count,
  createControl,
  children,
  partner = false,
}: {
  status: string;
  onStatusChange: (status: string) => void;
  count: number;
  createControl: React.ReactNode;
  children: React.ReactNode;
  partner?: boolean;
}) {
  const statuses = PROCUREMENT_STATUS_ITEMS.filter(
    (item) => !partner || !item.value.startsWith('bank-pending'),
  );
  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Deep Slate Hero Section */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Procurement Tracker
                </span>
              </div>

              {/* Inline Status Navigation */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  Viewing
                </h1>
                <Select value={status} onValueChange={onStatusChange}>
                  <SelectTrigger className="h-10 w-40 rounded-xl border-white/20 bg-white/10 px-4 text-lg font-bold text-white shadow-none backdrop-blur-md focus:ring-0 focus:ring-offset-0 dark:border-slate-700 dark:bg-slate-800 sm:h-12 sm:w-56 sm:text-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                    {statuses.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  Orders
                </h1>
              </div>

              <p className="mt-4 text-sm font-medium text-slate-400 md:text-base">
                View, track, and manage your sourcing requests.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
              {createControl}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                  <LayoutList className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Total Count
                  </p>
                  <p className="text-sm font-black text-indigo-400">
                    {count} Items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
