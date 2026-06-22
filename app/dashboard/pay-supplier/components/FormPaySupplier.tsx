'use client';

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  FileImage,
  Landmark,
  Loader2,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  User,
  WalletCards,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';

interface ApiResponse {
  responsex: {
    message?: string;
    status: string;
  };
  successx: boolean;
  userx: unknown;
}

type FileUploadCardProps = {
  label: string;
  helper: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
};

function FileUploadCard({
  label,
  helper,
  required,
  file,
  onChange,
}: FileUploadCardProps) {
  return (
    <label className="group block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-[#0f1020] dark:hover:border-blue-500 dark:hover:bg-blue-950/20">
      <input
        type="file"
        accept="image/*,.pdf,application/pdf"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm dark:bg-[#161629] dark:text-blue-300">
          <FileImage className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {label}
            </p>
            {required ? (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-600 ring-1 ring-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900">
                Required
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {file ? file.name : helper}
          </p>
        </div>
      </div>
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-500';

function PaySupplierForm() {
  const navigateWithAlert = useNavigationWithAlert();
  const { user } = useAuth();

  const [pidPaySupplier] = useState(() => `PS${Date.now()}`);
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [aliPayAccountQRCodeImage, setAliPayAccountQRCodeImage] =
    useState<File | null>(null);
  const [weChatAccountQRCodeImage, setWeChatAccountQRCodeImage] =
    useState<File | null>(null);
  const [proformaInvoiceImage, setProformaInvoiceImage] = useState<File | null>(
    null,
  );
  const [supplierBankAccountDetails, setSupplierBankAccountDetails] =
    useState('');
  const [amountToPayInYuan, setAmountToPayInYuan] = useState('');
  const [amountToPayInNaira, setAmountToPayInNaira] = useState('');
  const [serviceCharge] = useState(0);
  const [nairaPerYuanRate, setNairaPerYuanRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadExchangeRate = async () => {
      try {
        const response = await fetch('/api/get-data/exchange-rate-data-one', {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Unable to load exchange rate');

        const data = await response.json();
        const rate = Number(data?.getOneRecord?.exNairaToYuan);

        if (!cancelled && Number.isFinite(rate) && rate > 0) {
          setNairaPerYuanRate(rate);
        }
      } catch {
        if (!cancelled) {
          toast.error('Unable to load exchange rate settings right now.');
        }
      } finally {
        if (!cancelled) {
          setLoadingRate(false);
        }
      }
    };

    loadExchangeRate();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedNairaAmount = useMemo(() => {
    const value = Number(amountToPayInNaira);
    if (!Number.isFinite(value) || value <= 0) return '₦0.00';

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
    }).format(value);
  }, [amountToPayInNaira]);

  const handleYuanAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountToPayInYuan(value);

    const yuanAmount = parseFloat(value);
    if (!Number.isFinite(yuanAmount) || !nairaPerYuanRate) {
      setAmountToPayInNaira('');
      return;
    }

    setAmountToPayInNaira((yuanAmount * nairaPerYuanRate).toFixed(2));
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nairaPerYuanRate) {
      toast.warning('Exchange rate settings are still loading. Please try again.');
      return;
    }

    if (!proformaInvoiceImage) {
      toast.warning('Please upload the proforma invoice from your supplier.');
      return;
    }

    const formData = new FormData();
    formData.append('pidUser', user?.pidUser || '');
    formData.append('userEmail', user?.userEmail || '');
    formData.append('pidPaySupplier', pidPaySupplier);
    formData.append('supplierName', supplierName);
    formData.append('supplierPhone', supplierPhone);
    formData.append('supplierEmail', supplierEmail);
    if (aliPayAccountQRCodeImage) {
      formData.append('aliPayAccountQRCodeImage', aliPayAccountQRCodeImage);
    }
    if (weChatAccountQRCodeImage) {
      formData.append('weChatAccountQRCodeImage', weChatAccountQRCodeImage);
    }
    formData.append('proformaInvoiceImage', proformaInvoiceImage);
    formData.append('supplierBankAccountDetails', supplierBankAccountDetails);
    formData.append('amountToPayInYuan', amountToPayInYuan);
    formData.append('amountToPayInNaira', amountToPayInNaira);
    formData.append('serviceCharge', String(serviceCharge));

    setSubmitting(true);
    try {
      toast.info('Processing payment request...');
      const res = await fetch('/api/crud/pay-supplier-create', {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json()) as ApiResponse;

      if (data.responsex.status === 'SUCCESS') {
        navigateWithAlert(
          `/dashboard/bank-payment/?service=pay-supplier&amount=${amountToPayInNaira}&currencyType=NGN&destinationCountry=NONE&serviceID=${pidPaySupplier}&serviceDescription=Pay Supplier Service`,
          'success',
          'We have received your request!',
        );
        return;
      }

      const warningStatuses = [
        'VALUE_NOT_A_NUMBER',
        'ALIPAY_IMAGE_NOT_SELECTED',
        'WECHAT_IMAGE_NOT_SELECTED',
        'PROFORMA_IMAGE_NOT_SELECTED',
        'EMPTY_DETAILS',
        'INVALID_IMAGE_UPLOAD',
        'IMAGE_NOT_SELECTED',
        'IMAGE_UPLOAD_FAILED',
      ];

      if (warningStatuses.includes(data.responsex.status)) {
        toast.warning(data.responsex.message || 'Please check your request.');
        return;
      }

      toast.error(data.responsex.message || 'Unable to create payment request.');
    } catch (error: any) {
      toast.error(error?.message || 'Unable to create payment request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#161629]">
      <div className="border-b border-slate-100 p-6 dark:border-slate-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              New Supplier Payment
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Send us the supplier details and invoice. We will receive Naira
              and pay your supplier in RMB.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
            <p className="text-[10px] font-black uppercase tracking-widest">
              Exchange Rate
            </p>
            <p className="mt-1 font-bold">
              {loadingRate
                ? 'Loading...'
                : nairaPerYuanRate
                  ? `₦${nairaPerYuanRate.toLocaleString()} / ¥1`
                  : 'Unavailable'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submitForm} className="p-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300">
                <User className="h-3.5 w-3.5" />
                Supplier Details
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                    Supplier name
                  </label>
                  <input
                    className={inputClass}
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Supplier or company name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                    Supplier phone
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className={`${inputClass} pl-10`}
                      value={supplierPhone}
                      onChange={(e) => setSupplierPhone(e.target.value)}
                      placeholder="Phone or WeChat number"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                    Supplier email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      className={`${inputClass} pl-10`}
                      value={supplierEmail}
                      onChange={(e) => setSupplierEmail(e.target.value)}
                      placeholder="supplier@example.com"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300">
                <QrCode className="h-3.5 w-3.5" />
                Account Details & Invoice
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <FileUploadCard
                  label="AliPay account image"
                  helper="Optional. Upload QR code or account screenshot."
                  file={aliPayAccountQRCodeImage}
                  onChange={setAliPayAccountQRCodeImage}
                />
                <FileUploadCard
                  label="WeChat account image"
                  helper="Optional. Upload QR code or account screenshot."
                  file={weChatAccountQRCodeImage}
                  onChange={setWeChatAccountQRCodeImage}
                />
                <div className="md:col-span-2">
                  <FileUploadCard
                    label="Proforma invoice"
                    helper="Upload the invoice or payment instruction from the supplier. Images and PDFs are accepted."
                    required
                    file={proformaInvoiceImage}
                    onChange={setProformaInvoiceImage}
                  />
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                  Supplier bank account details
                </label>
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={supplierBankAccountDetails}
                  onChange={(e) => setSupplierBankAccountDetails(e.target.value)}
                  placeholder="Optional. Paste bank account details if the supplier wants a bank transfer."
                />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#0f1020]">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300">
                <WalletCards className="h-3.5 w-3.5" />
                Payment Amount
              </h3>

              <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                    Amount to pay supplier in RMB
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                      ¥
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      className={`${inputClass} pl-9`}
                      value={amountToPayInYuan}
                      onChange={handleYuanAmountChange}
                      placeholder={
                        nairaPerYuanRate
                          ? 'Enter RMB amount'
                          : 'Loading exchange rate...'
                      }
                      disabled={!nairaPerYuanRate}
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-[#161629]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Naira Equivalent
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                    {formattedNairaAmount}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    This amount is calculated from the prevailing market rate.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-bold">How this works</p>
                  <p className="mt-1 text-xs leading-6">
                    Submit the request, pay the Naira equivalent by bank deposit,
                    and we process the RMB payment to your supplier after
                    confirmation.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !nairaPerYuanRate}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-blue-500"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Landmark className="h-4 w-4" />
              )}
              Continue to Bank Deposit
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Banknote className="h-4 w-4" />
              Payments are reviewed before supplier transfer.
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

export default PaySupplierForm;
