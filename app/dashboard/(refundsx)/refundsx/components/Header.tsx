import { AddIcon } from "./Icons";

export function Header() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-semibold text-slate-800">Refunds</h1>
          <span className="text-lg text-slate-600">Refunds (Transactions)</span>
        </div>
        <p className="text-lg font-semibold text-slate-800">
          Track Refunds & Requests across all services
        </p>
      </div>
      
      <button className="flex items-center gap-2.5 bg-indigo-800 text-white px-7 py-2.5 rounded-lg hover:bg-indigo-900 transition-colors">
        <AddIcon />
        <span className="text-lg font-medium">Request Refund</span>
      </button>
    </div>
  );
}