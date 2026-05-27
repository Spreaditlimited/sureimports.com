import React from 'react';
import Link from 'next/link';
import BankPaymentForm from '@/app/dashboard/bank-payment/components/bank-payment-form';
import { 
  ArrowLeft, 
  Building2, 
  Landmark, 
  Info, 
  ShieldCheck,
  Receipt
} from 'lucide-react';

type AdminBankAccount = {
  pidBankAccount?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  sortCode?: string | null;
  currency?: string;
  country?: string | null;
  notes?: string | null;
  status?: string;
};

type BankOption = {
  optionName: string;
  optionValue: string;
};

const ADMIN_BASE_URL =
  process.env.ADMIN_INVOICING_API_BASE_URL || 'https://admin.sureimports.com';

async function getPaymentChannels(): Promise<AdminBankAccount[]> {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/api/invoicing/bank-accounts`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];

    return data.filter(
      (channel: AdminBankAccount) => channel?.status !== 'INACTIVE',
    );
  } catch {
    return [];
  }
}

export default async function BankPayment({
  searchParams,
}: {
  searchParams?: Promise<{ returnTo?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const backHref =
    resolvedSearchParams?.returnTo &&
    resolvedSearchParams.returnTo.startsWith('/dashboard/')
      ? resolvedSearchParams.returnTo
      : '/dashboard/procurement';

  const channels = await getPaymentChannels();
  
  const bankOptions: BankOption[] = [
    { optionName: '- Select Bank Used -', optionValue: '__SELECT_BANK__' },
    ...channels.map((channel, index) => {
      const labelParts = [
        channel.bankName || 'Bank Channel',
        channel.country || undefined,
        channel.accountNumber ? `: ${channel.accountNumber}` : undefined,
      ].filter(Boolean);

      return {
        optionName: labelParts.join(', '),
        optionValue:
          channel.pidBankAccount ||
          `${channel.bankName || 'BANK'}_${channel.accountNumber || index}`,
      };
    }),
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Deep Slate Hero Section */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <Link 
            href={backHref}
            className="group mb-8 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Secure Checkout
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Bank Transfer
              </h1>
              <p className="mt-3 text-sm font-medium text-slate-400 md:text-base max-w-lg">
                Send funds directly to any of our official bank accounts, then upload your receipt below to begin processing.
              </p>
            </div>
            
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                <Building2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Payment Channels</p>
                <p className="text-xs text-slate-400">Official Corporate Accounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        
        {/* Main Content Card Container */}
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          
          <div className="p-6 sm:p-10">
            
            {/* Premium Alert Notice */}
            <div className="mb-10 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">Action Required</h3>
                <p className="mt-1 text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                  After completing your transfer to one of the accounts below, you <strong>must</strong> scroll down and submit your payment details (amount, date, and receipt). Your order will not be processed until this is submitted.
                </p>
              </div>
            </div>

            {/* Bank Accounts Section */}
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <Landmark className="h-5 w-5 text-slate-400" /> Available Bank Accounts
            </h2>

            {channels.length === 0 ? (
              <div className="mb-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-800 dark:bg-slate-800/50">
                <Building2 className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No payment channels are currently available. Please contact support.
                </p>
              </div>
            ) : (
              <div className="mb-12 grid gap-6 sm:grid-cols-2">
                {channels.map((channel, index) => (
                  <div 
                    key={channel.pidBankAccount || `${channel.bankName}-${index}`} 
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {channel.bankName || 'Bank Channel'}
                        </h3>
                        {channel.currency && (
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {channel.currency}
                          </span>
                        )}
                      </div>

                      <div className="space-y-4">
                        {channel.accountName && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Name</p>
                            <p className="font-medium text-slate-900 dark:text-white">{channel.accountName}</p>
                          </div>
                        )}
                        
                        {channel.accountNumber && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Number</p>
                            <p className="font-mono text-lg font-black tracking-wider text-blue-600 dark:text-blue-400">{channel.accountNumber}</p>
                          </div>
                        )}

                        {channel.sortCode && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sort/Routing Code</p>
                            <p className="font-medium text-slate-900 dark:text-white">{channel.sortCode}</p>
                          </div>
                        )}
                        
                        {channel.country && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Country</p>
                            <p className="font-medium text-slate-900 dark:text-white">{channel.country}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {channel.notes && (
                      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 dark:bg-amber-900/10 dark:text-amber-300">
                        <strong>Note:</strong> {channel.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submission Form Section */}
            <div className="border-t border-slate-100 pt-10 dark:border-slate-800">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <Receipt className="h-5 w-5 text-slate-400" /> Submit Payment Proof
              </h2>
              <BankPaymentForm bankOptions={bankOptions} />
            </div>

          </div>
          
          {/* Minimalist Trust Footer */}
          <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/50 p-6 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            Your payment details will be manually verified by our team within 24 hours.
          </div>
          
        </div>
      </main>
    </div>
  );
}
