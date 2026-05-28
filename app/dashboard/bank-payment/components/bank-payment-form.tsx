'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Landmark, 
  User, 
  Loader2, 
  CheckCircle2,
  Wallet
} from 'lucide-react';

import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from '@/lib/AuthContext';
import Loader from '@/components/uix/Loader';

type BankOption = {
  optionName: string;
  optionValue: string;
};

interface BankPaymentFormProps {
  bankOptions?: BankOption[];
}

export default function BankPaymentForm({ bankOptions = [] }: BankPaymentFormProps) {
  const SELECT_BANK_SENTINEL = '__SELECT_BANK__';
  const searchParams = useSearchParams();
  const navigateWithAlert = useNavigationWithAlert();
  const { user } = useAuth();

  const [pidUser] = useState(user?.pidUser || '');
  const [pidBankPayment] = useState('BANK' + new Date().getTime().toString());
  
  const service = searchParams.get('service') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const exNairaToDollar = parseFloat(searchParams.get('exNairaToDollar') || '0');
  
  const newTotalAmount = searchParams.get('newTotalAmount') || '';
  const newTotalWeight = searchParams.get('newTotalWeight') || '';
  const newEstimatedTotalShippingCost = searchParams.get('newEstimatedTotalShippingCost') || '';
  const currencyType = searchParams.get('currencyType') || '';
  const destinationCountry = searchParams.get('destinationCountry') || '';
  const serviceID = searchParams.get('serviceID') || '';
  const serviceDescription = searchParams.get('serviceDescription') || '';
  const currentStatus = searchParams.get('status') || '';

  const [bank, setBank] = useState(SELECT_BANK_SENTINEL);
  const [depositor, setDepositor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bank || bank === SELECT_BANK_SENTINEL) {
      toast.error('Please select the bank you paid into.');
      return;
    }
    if (!depositor || depositor.trim().length < 3) {
      toast.error('Please enter the full name of the depositor.');
      return;
    }

    setIsSubmitting(true);
    toast.loading('Submitting payment details...', { id: 'submit-payment' });

    const formData = new FormData();
    formData.append('pidUser', pidUser);
    formData.append('userEmail', user?.userEmail || '');
    formData.append('pidBankPayment', pidBankPayment);
    formData.append('amount', amount.toString());
    formData.append('currencyType', currencyType);
    formData.append('destinationCountry', destinationCountry);
    formData.append('bank', bank === SELECT_BANK_SENTINEL ? '' : bank);
    formData.append('depositor', depositor);
    formData.append('newTotalAmount', newTotalAmount);
    formData.append('newTotalWeight', newTotalWeight);
    formData.append('newEstimatedTotalShippingCost', newEstimatedTotalShippingCost);
    formData.append('serviceID', serviceID);
    formData.append('serviceDescription', serviceDescription);
    formData.append('currentStatus', currentStatus);

    try {
      const res = await fetch('/api/bank-payment/' + service, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.statusx === 'SUCCESS') {
        toast.success('Payment details submitted successfully.', { id: 'submit-payment' });
        navigateWithAlert(
          '/dashboard',
          'success',
          'Payment details successfully submitted! Awaiting payment status confirmation.'
        );
      } else if (data.statusx === 'ACTION_FAILED' || data.statusx === 'EMPTY_BANK_PAYMENT_DETAILS') {
        toast.warning(data.message || data.responsex?.message, { id: 'submit-payment' });
      } else {
        toast.error('Failed to submit details. Please try again.', { id: 'submit-payment' });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown network error';
      console.error(message);
      toast.error('A network error occurred.', { id: 'submit-payment' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!amount) return <Loader />;

  return (
    <div className="w-full">
      
      {/* Amount Due Highlight Card */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400/70">
                Amount Expected
              </p>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {serviceDescription || 'Service Payment'}
              </h3>
            </div>
          </div>
          
          <div className="text-left sm:text-right">
            {destinationCountry === 'Nigeria' && exNairaToDollar > 0 ? (
              <>
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  ₦{formatCurrency(amount * exNairaToDollar)}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  ≈ ${formatCurrency(amount)}
                </div>
              </>
            ) : (
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                ${formatCurrency(amount)}
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={submitForm} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Bank Selection */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Bank You Transferred To <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger className="h-14 w-full rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white">
                  <SelectValue placeholder="Select the receiving account" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                  {bankOptions.map((opt, i) => (
                    <SelectItem 
                      key={i} 
                      value={opt.optionValue}
                      disabled={opt.optionValue === SELECT_BANK_SENTINEL}
                    >
                      {opt.optionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Depositor Name */}
          <div className="space-y-3 md:col-span-2">
            <label htmlFor="depositor" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Depositor / Sender Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="depositor"
                placeholder="Enter the name on the account you sent money from"
                value={depositor}
                onChange={(e) => setDepositor(e.target.value)}
                className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
              />
            </div>
            <p className="text-xs text-slate-500">
              Please enter the exact name associated with the sending bank account so we can trace your payment.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-rose-500 dark:text-rose-400">
            Please DO NOT submit the same payment details twice.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting || !bank || bank === SELECT_BANK_SENTINEL || depositor.length < 3}
            className="w-full sm:w-auto h-14 rounded-xl bg-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
            ) : (
              <><CheckCircle2 className="mr-2 h-5 w-5" /> Submit Deposit Details</>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
