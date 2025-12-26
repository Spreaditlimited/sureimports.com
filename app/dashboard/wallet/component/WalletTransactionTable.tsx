// components/WalletTransactionTable.tsx
//import { Transaction } from '@/types/transaction';

// interface WalletTransactionTableProps {
//   transactions: Transaction[];
// }

const WalletTransactionTable: React.FC<any> = ({ transactions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount / 100); // Assuming amount is in kobo
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      abandoned: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="dark:text-black-100 overflow-x-auto rounded-lg bg-white shadow">
      <table className="divide-dark-200 dark:text-black-100 min-w-full divide-y">
        <thead className="text-black-800 dark:text-black-200 dark:bg-black">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Transaction
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Channel
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Date
            </th>
          </tr>
        </thead>

        <tbody className="dark:bg-black-600 divide-y divide-gray-200 dark:bg-black dark:text-gray-100">
          {transactions.map((transaction: any) => (
            <tr
              key={transaction.id}
              className="hover:bg-slate-200 dark:text-gray-100 dark:hover:bg-black"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium">
                      {transaction.reference}
                    </div>

                    <div className="text-sm">
                      {transaction.customer.first_name}{' '}
                      {transaction.customer.last_name}
                    </div>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </div>
                {transaction.fees > 0 && (
                  <div className="text-xs">
                    Fee:{' '}
                    {formatCurrency(transaction.fees, transaction.currency)}
                  </div>
                )}
              </td>

              <td className="whitespace-nowrap px-6 py-4">
                {getStatusBadge(transaction.status)}
                <div className="mt-1 text-xs">
                  {transaction.gateway_response}
                </div>
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {transaction.channel.replace(/_/g, ' ')}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {formatDate(transaction.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletTransactionTable;
