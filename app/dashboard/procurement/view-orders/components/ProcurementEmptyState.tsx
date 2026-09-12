'use client';
import { Search } from 'lucide-react';
/** Shared with the original Sure Imports order tracker. */
export default function ProcurementEmptyState({
  status,
  action,
}: {
  status: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/50 px-6 py-24 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Search className="h-10 w-10 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        No {status.charAt(0).toUpperCase() + status.slice(1)} Orders
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        You currently don&apos;t have any procurement requests in this state.
      </p>
      <div className="mt-8">{action}</div>
    </div>
  );
}
