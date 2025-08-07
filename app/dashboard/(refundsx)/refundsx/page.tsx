import imgSubtract from "./imports/RefundsPage";
import { Header } from "./components/Header";
import { StatsCard } from "./components/StatsCard";
import { RefundsTable } from "./components/RefundsTable";
import { Pagination } from "./components/Pagination";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Background overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-50 opacity-50" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Header />
          <StatsCard />
          
          <div className="space-y-0">
            <RefundsTable />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
}