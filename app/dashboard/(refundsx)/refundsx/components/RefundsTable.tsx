import { StatusBadge } from "./StatusBadge";

interface RefundData {
  id: string;
  orderId: string;
  amount: string;
  status: 'approved' | 'pending' | 'rejected';
  serviceType: string;
}

const refundsData: RefundData[] = [
  {
    id: '#REF-2025-001',
    orderId: '#ORD-2025-001',
    amount: '$150.00',
    status: 'approved',
    serviceType: 'Buy from Chinese Websites'
  },
  {
    id: '#REF-2025-002',
    orderId: '#ORD-2025-002',
    amount: '$200.00',
    status: 'pending',
    serviceType: 'Buy Phones & Laptops'
  },
  {
    id: '#REF-2025-003',
    orderId: '#ORD-2025-003',
    amount: '$75.00',
    status: 'rejected',
    serviceType: 'Special Sourcing'
  },
  {
    id: '#REF-2025-004',
    orderId: '#ORD-2025-004',
    amount: '$300.00',
    status: 'approved',
    serviceType: 'Buy from Chinese Websites'
  },
  {
    id: '#REF-2025-005',
    orderId: '#ORD-2025-005',
    amount: '$125.00',
    status: 'pending',
    serviceType: 'Buy Phones & Laptops'
  },
  {
    id: '#REF-2025-006',
    orderId: '#ORD-2025-006',
    amount: '$100.00',
    status: 'rejected',
    serviceType: 'Buy Phones & Laptops'
  }
];

export function RefundsTable() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
      {/* Desktop Table Header */}
      <div className="hidden lg:block bg-neutral-50 border-b border-black/5">
        <div className="grid grid-cols-5 gap-8 p-8 text-lg font-semibold text-slate-800">
          <div>Refund ID</div>
          <div>Order ID</div>
          <div>Amount (USD)</div>
          <div>Status</div>
          <div>Service Type</div>
        </div>
      </div>

      {/* Table Content */}
      <div className="divide-y divide-black/10">
        {refundsData.map((refund, index) => (
          <div key={refund.id} className="p-4 lg:p-8">
            {/* Desktop Row */}
            <div className="hidden lg:grid lg:grid-cols-5 lg:gap-8 lg:items-center">
              <div className="text-base text-slate-800">{refund.id}</div>
              <div className="text-base text-slate-800">{refund.orderId}</div>
              <div className="text-base font-medium text-slate-800">{refund.amount}</div>
              <div>
                <StatusBadge status={refund.status} />
              </div>
              <div className="text-base text-slate-800">{refund.serviceType}</div>
            </div>

            {/* Mobile Card */}
            <div className="lg:hidden space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-slate-800">{refund.id}</div>
                  <div className="text-sm text-slate-600">{refund.orderId}</div>
                </div>
                <StatusBadge status={refund.status} />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-slate-800">{refund.amount}</div>
                <div className="text-sm text-slate-600">{refund.serviceType}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}