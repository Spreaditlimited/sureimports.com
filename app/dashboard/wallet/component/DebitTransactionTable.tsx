// components/DebitTransactionTable.tsx

const DebitTransactionTable: React.FC<any> = ({ debits }) => {
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
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
    }).format(amount); // Amount is already in Naira (not kobo)
  };

  const getStatusBadge = (status: string | null | undefined) => {
    const statusValue = status?.toLowerCase() || 'unknown';
    const statusClasses = {
      debited: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      unknown:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses[statusValue as keyof typeof statusClasses] || statusClasses.unknown}`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
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
              Service
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
          {debits.map((debit: any) => (
            <tr
              key={debit.id}
              className="hover:bg-slate-200 dark:text-gray-100 dark:hover:bg-black"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium">
                      {debit.txRef || debit.txID || 'N/A'}
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {debit.payerName || debit.email}
                    </div>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(debit.amount || 0, debit.currency || 'NGN')}
                </div>
                {debit.serviceDescription && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {debit.serviceDescription}
                  </div>
                )}
              </td>

              <td className="whitespace-nowrap px-6 py-4">
                {getStatusBadge(debit.paymentStatus)}
                {debit.xStatus && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {debit.xStatus}
                  </div>
                )}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <div className="font-medium">{debit.serviceName || 'N/A'}</div>
                {debit.paymentType && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {debit.paymentType}
                  </div>
                )}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {formatDate(debit.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DebitTransactionTable;
