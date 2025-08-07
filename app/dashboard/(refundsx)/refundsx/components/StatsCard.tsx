import { FilterIcon, ChevronDownIcon } from "./Icons";

export function StatsCard() {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl border border-black/5 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-base text-slate-800">Total Amount</p>
          <p className="text-3xl font-semibold text-slate-800">$950.00</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <span className="text-lg text-slate-800">Search By</span>
          <button className="flex items-center gap-2.5 bg-neutral-50 border border-black/5 px-5 py-2.5 rounded-lg hover:bg-neutral-100 transition-colors">
            <FilterIcon />
            <span className="text-lg font-medium text-slate-800">Pending</span>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}