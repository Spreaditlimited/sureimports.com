export default function Loading() {
  return (
    <div className="si-workspace-plain" role="status" aria-live="polite">
      <p className="text-sm text-slate-500">Loading your workspace…</p>
      <div aria-hidden="true" className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        <div className="h-28 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      </div>
    </div>
  );
}
