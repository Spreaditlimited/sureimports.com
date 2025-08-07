import { ChevronRightIcon } from "./Icons";

export function Pagination() {
  return (
    <div className="bg-neutral-50 border-t border-black/5 p-6 lg:p-8 rounded-b-2xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="text-base text-slate-800">
          Showing 6 of 150 Refunds
        </div>
        
        <div className="flex items-center">
          <div className="bg-white border border-black/5 rounded-lg p-2.5 flex items-center gap-1">
            {/* Previous button */}
            <button className="p-2 hover:bg-gray-50 rounded">
              <div className="rotate-180">
                <ChevronRightIcon />
              </div>
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 text-indigo-800 font-medium rounded hover:bg-indigo-50">
                01
              </button>
              <button className="px-3 py-1 text-indigo-800/50 rounded hover:bg-indigo-50">
                02
              </button>
              <button className="px-3 py-1 text-indigo-800/50 rounded hover:bg-indigo-50">
                03
              </button>
              <span className="px-3 py-1 text-indigo-800/50">.....</span>
              <button className="px-3 py-1 text-indigo-800/50 rounded hover:bg-indigo-50">
                07
              </button>
            </div>
            
            {/* Next button */}
            <button className="p-2 hover:bg-gray-50 rounded">
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}