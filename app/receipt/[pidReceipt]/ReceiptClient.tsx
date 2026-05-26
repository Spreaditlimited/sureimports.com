'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReceiptClient({ pidReceipt }: { pidReceipt: string }) {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('accessToken') || '';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        if (!accessToken) throw new Error('Missing receipt access token');
        const res = await fetch(`/api/invoicing/public/receipt/${pidReceipt}?accessToken=${encodeURIComponent(accessToken)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Failed to load receipt');
        setData(json.data);
      } catch (e: any) {
        setError(e.message || 'Failed to load receipt');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [pidReceipt, accessToken]);

  const receipt = data?.receipt;
  const invoice = receipt?.invoice;

  const totals = useMemo(() => {
    if (!receipt || !invoice) return null;
    return {
      amount: Number(receipt.amount || 0),
      balanceAfter: Number(receipt.balanceAfter || 0),
      invoiceTotal: Number(invoice.grandTotal || 0),
      amountPaid: Number(invoice.amountPaid || 0),
    };
  }, [receipt, invoice]);

  if (loading) return <div className="p-8">Loading receipt...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!receipt || !invoice || !totals) return <div className="p-8">Receipt not found.</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 md:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-sm print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Sure Imports" width={120} height={30} className="h-7 w-auto" priority />
            <span className="text-xs uppercase tracking-wider text-slate-500">Payment Receipt</span>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-[#0b3b88] px-4 py-2 text-sm font-semibold text-white"
          >
            Download Receipt (PDF)
          </button>
        </div>

        <div className="px-6 py-6 md:px-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-bold">Receipt {receipt.receiptNumber}</h1>
              <p className="mt-1 text-sm text-slate-600">Invoice: {invoice.invoiceNumber}</p>
              <p className="text-sm text-slate-600">Customer: {invoice.customerName || invoice.customerEmail || 'Customer'}</p>
              {invoice.customerEmail ? <p className="text-sm text-slate-600">Email: {invoice.customerEmail}</p> : null}
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500">Issued</p>
              <p className="font-semibold">{new Date(receipt.issuedAt).toLocaleString('en-NG')}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Payment Date</p>
              <p className="font-semibold">{new Date(receipt.payment.paidAt).toLocaleString('en-NG')}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr>
                  <td className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Payment Method</td>
                  <td className="border border-slate-200 px-3 py-2">{receipt.payment.paymentMethod}</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Reference</td>
                  <td className="border border-slate-200 px-3 py-2">{receipt.payment.reference || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Amount Received</td>
                  <td className="border border-slate-200 px-3 py-2">{invoice.currency} {totals.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Total Paid</td>
                  <td className="border border-slate-200 px-3 py-2">{invoice.currency} {totals.amountPaid.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">Balance Due</td>
                  <td className="border border-slate-200 px-3 py-2 font-semibold">{invoice.currency} {totals.balanceAfter.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-slate-500">This receipt was generated by Sure Imports.</p>
        </div>
      </div>
    </div>
  );
}
