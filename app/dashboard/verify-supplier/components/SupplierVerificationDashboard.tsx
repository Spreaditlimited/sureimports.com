'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Layers3,
  Loader2,
  MapPin,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { toast } from 'sonner';
import countries from '@/lib/data/countries';

type Payment = {
  pidPayment: string;
  paymentProvider: string;
  amountMinor: number;
  currency: string;
  status: string;
  paymentPurpose: 'VERIFICATION' | 'PHYSICAL_VISIT' | 'LEGACY_COMBINED';
};
type Activity = { pidEvent: string; message: string | null; createdAt: string };
type VerificationRequest = {
  pidVerifySupplier: string;
  supplierName: string | null;
  supplierNameChinese: string | null;
  supplierProduct: string | null;
  billingCountry: string | null;
  verificationType: 'ONLINE' | 'PHYSICAL';
  status: string | null;
  transportQuoteStatus: string | null;
  transportFeeNgnKobo: number | null;
  transportFeeUsdCents: number | null;
  travelEstimate: {
    recommendedMode: string | null;
    roundTripDistanceKm: number | null;
    lodgingNights: number | null;
    estimatedTotalCny: number | null;
    pricingAsOf: string | null;
  } | null;
  reportOutcome: string | null;
  reportSummary: string | null;
  reportUrl: string | null;
  customerMessage: string | null;
  payments: Payment[];
  events: Activity[];
};
type Pricing = {
  feeNaira: number;
  feeUsdCents: number;
  onlineEnabled: boolean;
  physicalEnabled: boolean;
};

const initialForm = {
  supplierName: '',
  supplierNameChinese: '',
  registrationNumber: '',
  supplierPhone: '',
  supplierEmail: '',
  supplierWechat: '',
  supplierAddress: '',
  supplierAddressChinese: '',
  supplierProduct: '',
  supplierWebsite: '',
  marketplaceUrls: '',
  supplierDetails: '',
  verificationType: 'ONLINE' as 'ONLINE' | 'PHYSICAL',
  billingCountry: 'Nigeria',
  termsAccepted: false,
};

const statusLabels: Record<string, string> = {
  AWAITING_TRAVEL_QUOTE: 'Travel & lodging quote pending',
  QUOTE_READY: 'Quote ready',
  AWAITING_PAYMENT: 'Awaiting payment',
  PAYMENT_PENDING: 'Payment pending',
  PAID: 'Paid — queued for review',
  IN_REVIEW: 'Verification in progress',
  VISIT_SCHEDULED: 'Physical visit scheduled',
  REPORT_READY: 'Report ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  DISPUTED: 'Payment under review',
};

function money(minor: number, currency: string) {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(minor / 100);
}

function hasPaidPurpose(
  item: VerificationRequest,
  purposes: Payment['paymentPurpose'][],
) {
  return item.payments.some(
    (payment) =>
      payment.status === 'paid' && purposes.includes(payment.paymentPurpose),
  );
}

export default function SupplierVerificationDashboard({
  mode = 'list',
}: {
  mode?: 'list' | 'create';
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);
  const [declining, setDeclining] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/supplier-verifications', {
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Unable to load requests.');
      setRequests(data.requests || []);
      setPricing(data.pricing);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to load requests.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);
  const update = (name: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [name]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/supplier-verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          marketplaceUrls: form.marketplaceUrls
            .split(/\n|,/)
            .map((value) => value.trim())
            .filter(Boolean),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Unable to submit request.');
      toast.success('Supplier Verification request created.');
      setForm(initialForm);
      setOpenId(data.request.pidVerifySupplier);
      if (mode === 'create') {
        router.push('/dashboard/verify-supplier');
        router.refresh();
      } else {
        await load();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to submit request.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const checkout = async (
    requestId: string,
    provider: 'paystack' | 'paypal',
  ) => {
    setPaying(`${requestId}:${provider}`);
    try {
      const response = await fetch(
        `/api/supplier-verifications/${encodeURIComponent(requestId)}/checkout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.authorizationUrl)
        throw new Error(data.message || 'Unable to start checkout.');
      window.location.assign(data.authorizationUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to start checkout.',
      );
      setPaying(null);
    }
  };

  const basePaid = (item: VerificationRequest) =>
    hasPaidPurpose(item, ['VERIFICATION', 'LEGACY_COMBINED']);
  const physicalVisitPaid = (item: VerificationRequest) =>
    hasPaidPurpose(item, ['PHYSICAL_VISIT', 'LEGACY_COMBINED']);
  const canPayBase = (item: VerificationRequest) =>
    !basePaid(item) &&
    ['AWAITING_PAYMENT', 'PAYMENT_PENDING'].includes(item.status || '');
  const canPayPhysicalVisit = (item: VerificationRequest) =>
    item.verificationType === 'PHYSICAL' &&
    basePaid(item) &&
    !physicalVisitPaid(item) &&
    item.transportQuoteStatus === 'READY';

  const declinePhysicalVisit = async (requestId: string) => {
    setDeclining(requestId);
    try {
      const response = await fetch(
        `/api/supplier-verifications/${encodeURIComponent(requestId)}/physical-visit/decline`,
        { method: 'POST' },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || 'Unable to decline the physical visit.',
        );
      toast.success(
        'Physical visit declined. Online verification will continue.',
      );
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to decline the physical visit.',
      );
    } finally {
      setDeclining(null);
    }
  };

  const completedCount = requests.filter((item) =>
    ['REPORT_READY', 'COMPLETED'].includes(item.status || ''),
  ).length;
  const awaitingActionCount =
    requests.filter((item) =>
      [
        'AWAITING_TRAVEL_QUOTE',
        'QUOTE_READY',
        'AWAITING_PAYMENT',
        'PAYMENT_PENDING',
      ].includes(item.status || ''),
    ).length + requests.filter(canPayPhysicalVisit).length;
  const inProgressCount = requests.filter((item) =>
    ['PAID', 'IN_REVIEW', 'VISIT_SCHEDULED'].includes(item.status || ''),
  ).length;
  const stats = [
    {
      label: 'Total Requests',
      count: requests.length,
      icon: Layers3,
      color: 'text-blue-400',
    },
    {
      label: 'In Progress',
      count: inProgressCount,
      icon: Timer,
      color: 'text-amber-400',
    },
    {
      label: 'Ready / Complete',
      count: completedCount,
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-black">
      <header className="bg-slate-900 pb-32 pt-12 text-white dark:bg-[#0b0c16]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {mode === 'create' ? (
            <div className="flex flex-col items-start">
              <Link
                href="/dashboard/verify-supplier"
                className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Supplier Verification
              </Link>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Request Supplier Verification
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Provide the supplier’s legal identity, contact information and
                transaction details, then choose online checks or a physical
                visit in China.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Supplier Verification
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Request online company checks or a physical visit in China,
                  complete payment, and track the verification report.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    void load();
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-[#161629] dark:hover:bg-[#1d1f36]"
                >
                  <RefreshCcw
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  Sync
                </button>
                <Link
                  href="/dashboard/verify-supplier/create"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 dark:shadow-blue-950/40"
                >
                  <Plus className="h-4 w-4" />
                  New Verification
                </Link>
              </div>
            </div>
          )}

          {mode === 'list' ? (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-5 backdrop-blur-sm dark:bg-[#161629]/70"
                >
                  <div
                    className={`rounded-lg bg-slate-800 p-3 dark:bg-[#0f1020] ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {loading ? '—' : stat.count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {mode === 'list' ? (
            <div className="mt-10 flex items-center justify-end gap-2 text-sm text-slate-400">
              <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
              <span>
                {awaitingActionCount > 0
                  ? `${awaitingActionCount} request${awaitingActionCount === 1 ? '' : 's'} awaiting action`
                  : 'Live Updates'}
              </span>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto -mt-16 max-w-7xl space-y-6 px-4 pb-20 sm:px-6 lg:px-8">
        {mode === 'create' ? (
          <form
            onSubmit={submit}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#161629] sm:p-8"
          >
            <div className="flex items-start gap-3 border-b border-slate-200 pb-6 dark:border-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  New Supplier Verification
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Use the registered Chinese name and address where possible.
                  They produce the strongest registry match.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Supplier details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Enter the company and contact information shared by the
                supplier.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Supplier/trading name (English)"
                required
                value={form.supplierName}
                onChange={(v) => update('supplierName', v)}
              />
              <Field
                label="Registered company name (Chinese)"
                value={form.supplierNameChinese}
                onChange={(v) => update('supplierNameChinese', v)}
                placeholder="例如：广州…有限公司"
              />
              <Field
                label="Unified Social Credit Code"
                value={form.registrationNumber}
                onChange={(v) => update('registrationNumber', v)}
              />
              <Field
                label="Product or service supplied"
                required
                value={form.supplierProduct}
                onChange={(v) => update('supplierProduct', v)}
              />
              <Field
                label="Phone"
                value={form.supplierPhone}
                onChange={(v) => update('supplierPhone', v)}
              />
              <Field
                label="Email"
                type="email"
                value={form.supplierEmail}
                onChange={(v) => update('supplierEmail', v)}
              />
              <Field
                label="WeChat ID"
                value={form.supplierWechat}
                onChange={(v) => update('supplierWechat', v)}
              />
              <Field
                label="Website"
                type="url"
                value={form.supplierWebsite}
                onChange={(v) => update('supplierWebsite', v)}
                placeholder="https://"
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Area
                label="Supplier address (English)"
                required
                value={form.supplierAddress}
                onChange={(v) => update('supplierAddress', v)}
              />
              <Area
                label="Registered address (Chinese)"
                value={form.supplierAddressChinese}
                onChange={(v) => update('supplierAddressChinese', v)}
                placeholder="Used for registry matching and travel estimation"
              />
            </div>
            <Area
              label="Marketplace links"
              value={form.marketplaceUrls}
              onChange={(v) => update('marketplaceUrls', v)}
              placeholder="One Alibaba, 1688 or Made-in-China URL per line"
            />
            <Area
              label="What should we investigate?"
              required
              value={form.supplierDetails}
              onChange={(v) => update('supplierDetails', v)}
              placeholder="Describe the proposed transaction, concerns, quotations or payment details that should be compared."
            />
            <fieldset>
              <legend className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Verification method
              </legend>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <Choice
                  selected={form.verificationType === 'ONLINE'}
                  disabled={pricing?.onlineEnabled === false}
                  onClick={() => update('verificationType', 'ONLINE')}
                  icon={ClipboardCheck}
                  title="Online checks in China"
                  description="Company identity, registry, contact and transaction consistency checks."
                />
                <Choice
                  selected={form.verificationType === 'PHYSICAL'}
                  disabled={pricing?.physicalEnabled === false}
                  onClick={() => update('verificationType', 'PHYSICAL')}
                  icon={MapPin}
                  title="Physical visit"
                  description="Pay for standard online checks first. We then research the optional visit cost for your approval."
                />
              </div>
            </fieldset>
            <div className="grid gap-5 md:grid-cols-2">
              <CountrySelect
                value={form.billingCountry}
                onChange={(value) => update('billingCountry', value)}
              />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Verification fee
                </p>
                <p className="mt-2 font-black text-slate-950 dark:text-white">
                  {pricing
                    ? !form.billingCountry
                      ? 'Select a billing country'
                      : form.billingCountry.toLowerCase() === 'nigeria'
                        ? `₦${pricing.feeNaira.toLocaleString()} via Paystack`
                        : `$${(pricing.feeUsdCents / 100).toFixed(2)} via PayPal`
                    : 'Loading price…'}
                </p>
                {form.verificationType === 'PHYSICAL' ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Travel and lodging are added after the China team confirms
                    the route.
                  </p>
                ) : null}
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(event) =>
                  update('termsAccepted', event.target.checked)
                }
                className="mt-1 h-4 w-4"
              />
              <span>
                I understand that verification reports findings available at the
                time of the checks and is not a guarantee of future supplier
                performance.
              </span>
            </label>
            <button
              type="submit"
              disabled={submitting || !form.termsAccepted}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 disabled:opacity-50 sm:w-auto"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        ) : null}

        {mode === 'list' ? (
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#161629] sm:p-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">
                  Your requests
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quotes, payments, progress and reports in one place.
                </p>
              </div>
              <Link
                href="/supplier-verification"
                className="text-sm font-bold text-blue-600 dark:text-blue-400"
              >
                About the service
              </Link>
            </div>
            {loading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : null}
            {!loading && requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-[#0f1020]">
                <Building2 className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-4 font-black">
                  No verification requests yet
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Submit a supplier before sending money or placing a large
                  order.
                </p>
              </div>
            ) : null}
            {requests.map((item) => {
              const expanded = openId === item.pidVerifySupplier;
              const verificationPaid = basePaid(item);
              const payingForVisit = canPayPhysicalVisit(item);
              const paysInNaira =
                (item.billingCountry || '').trim().toLowerCase() === 'nigeria';
              return (
                <article
                  key={item.pidVerifySupplier}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0f1020]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenId(expanded ? null : item.pidVerifySupplier)
                    }
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-black text-slate-950 dark:text-white">
                        {item.supplierName}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {item.pidVerifySupplier} ·{' '}
                        {item.verificationType === 'PHYSICAL'
                          ? 'Physical visit'
                          : 'Online checks'}
                      </span>
                    </span>
                    <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:block">
                      {statusLabels[item.status || ''] || item.status}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expanded ? (
                    <div className="space-y-5 border-t border-slate-200 p-5 dark:border-slate-800">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Info
                          label="Status"
                          value={
                            statusLabels[item.status || ''] ||
                            item.status ||
                            'Submitted'
                          }
                        />
                        <Info
                          label="Supplier"
                          value={[item.supplierName, item.supplierNameChinese]
                            .filter(Boolean)
                            .join(' / ')}
                        />
                        <Info
                          label="Product"
                          value={item.supplierProduct || '—'}
                        />
                      </div>
                      {item.verificationType === 'PHYSICAL' &&
                      item.transportQuoteStatus ===
                        'LOCKED_UNTIL_VERIFICATION_PAID' ? (
                        <Notice>
                          Pay the standard verification fee to begin online
                          checks. We will research the optional physical-visit
                          cost only after that payment is confirmed.
                        </Notice>
                      ) : null}
                      {item.verificationType === 'PHYSICAL' &&
                      verificationPaid &&
                      item.transportQuoteStatus === 'PENDING' ? (
                        <Notice>
                          Your standard verification is paid. Our China team can
                          now research and prepare the optional physical-visit
                          quote.
                        </Notice>
                      ) : null}
                      {item.transportQuoteStatus === 'DECLINED' ? (
                        <Notice>
                          You declined the optional physical visit. Online
                          verification will continue.
                        </Notice>
                      ) : null}
                      {item.transportQuoteStatus === 'PAID' ? (
                        <Notice>
                          Your physical visit is paid and ready for scheduling.
                        </Notice>
                      ) : null}
                      {item.travelEstimate ? (
                        <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:grid-cols-3">
                          <Info
                            label="Recommended travel"
                            value={(
                              item.travelEstimate.recommendedMode || 'Pending'
                            )
                              .toLowerCase()
                              .replaceAll('_', ' ')}
                          />
                          <Info
                            label="Round-trip route"
                            value={
                              item.travelEstimate.roundTripDistanceKm
                                ? `${item.travelEstimate.roundTripDistanceKm.toLocaleString()} km`
                                : 'Pending'
                            }
                          />
                          <Info
                            label="Lodging"
                            value={
                              item.travelEstimate.lodgingNights == null
                                ? 'Pending'
                                : `${item.travelEstimate.lodgingNights} night(s)`
                            }
                          />
                        </div>
                      ) : null}
                      {item.customerMessage ? (
                        <Notice>{item.customerMessage}</Notice>
                      ) : null}
                      {canPayBase(item) || payingForVisit ? (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-black text-slate-950 dark:text-white">
                                {payingForVisit
                                  ? 'Optional physical-visit quote'
                                  : 'Pay standard verification fee'}
                              </p>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                {payingForVisit &&
                                item.transportFeeNgnKobo != null &&
                                item.transportFeeUsdCents != null
                                  ? paysInNaira
                                    ? `${money(item.transportFeeNgnKobo, 'NGN')} via Paystack. This optional payment covers travel and lodging only.`
                                    : `${money(item.transportFeeUsdCents, 'USD')} via PayPal. This optional payment covers travel and lodging only.`
                                  : pricing
                                    ? paysInNaira
                                      ? `${money(Math.round(pricing.feeNaira * 100), 'NGN')} via Paystack. This starts the standard online verification.`
                                      : `${money(pricing.feeUsdCents, 'USD')} via PayPal. This starts the standard online verification.`
                                    : 'The final amount is calculated on the server.'}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                              {paysInNaira ? (
                                <PayButton
                                  label="Pay with Paystack"
                                  busy={
                                    paying ===
                                    `${item.pidVerifySupplier}:paystack`
                                  }
                                  onClick={() =>
                                    checkout(item.pidVerifySupplier, 'paystack')
                                  }
                                />
                              ) : (
                                <PayButton
                                  label="Pay USD with PayPal"
                                  busy={
                                    paying ===
                                    `${item.pidVerifySupplier}:paypal`
                                  }
                                  onClick={() =>
                                    checkout(item.pidVerifySupplier, 'paypal')
                                  }
                                />
                              )}
                              {payingForVisit ? (
                                <button
                                  type="button"
                                  disabled={
                                    declining === item.pidVerifySupplier
                                  }
                                  onClick={() =>
                                    void declinePhysicalVisit(
                                      item.pidVerifySupplier,
                                    )
                                  }
                                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                                >
                                  {declining === item.pidVerifySupplier
                                    ? 'Declining…'
                                    : 'Decline physical visit'}
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {item.payments.length ? (
                        <div className="space-y-1 text-xs text-slate-500">
                          {item.payments.map((payment) => (
                            <p key={payment.pidPayment}>
                              {payment.paymentPurpose === 'PHYSICAL_VISIT'
                                ? 'Physical visit'
                                : payment.paymentPurpose === 'LEGACY_COMBINED'
                                  ? 'Verification + physical visit'
                                  : 'Standard verification'}
                              : {money(payment.amountMinor, payment.currency)} ·{' '}
                              {payment.status}
                            </p>
                          ))}
                        </div>
                      ) : null}
                      {item.reportSummary || item.reportUrl ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
                          <div className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                            <div>
                              <p className="font-black">
                                Verification report{' '}
                                {item.reportOutcome
                                  ? `· ${item.reportOutcome}`
                                  : ''}
                              </p>
                              {item.reportSummary ? (
                                <p className="mt-2 text-sm leading-6">
                                  {item.reportSummary}
                                </p>
                              ) : null}
                              {item.reportUrl ? (
                                <a
                                  href={item.reportUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-flex font-bold text-emerald-700 underline"
                                >
                                  Open report
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {item.events.length ? (
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Activity
                          </p>
                          <ol className="mt-3 space-y-3">
                            {item.events.slice(0, 6).map((entry) => (
                              <li
                                key={entry.pidEvent}
                                className="border-l-2 border-slate-200 pl-4 text-sm dark:border-slate-700"
                              >
                                <p>{entry.message}</p>
                                <time className="mt-1 block text-xs text-slate-400">
                                  {new Date(entry.createdAt).toLocaleString()}
                                </time>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        ) : null}
      </main>
    </div>
  );
}

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
        Billing country *
      </span>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-[#0f1020] dark:focus:ring-blue-900/30"
      >
        <option value="">Select billing country</option>
        {countries
          .filter((country) => country.optionValue)
          .map((country) => (
            <option key={country.optionValue} value={country.optionValue}>
              {country.optionName}
            </option>
          ))}
      </select>
      <span className="mt-1 block text-xs text-slate-500">
        Nigeria pays in NGN. Every other country pays in USD.
      </span>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-[#0f1020] dark:focus:ring-blue-900/30"
      />
    </label>
  );
}
function Area({
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        {required ? ' *' : ''}
      </span>
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-[#0f1020] dark:focus:ring-blue-900/30"
      />
    </label>
  );
}
function Choice({
  selected,
  disabled,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: typeof ClipboardCheck;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition disabled:opacity-40 ${selected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900/30' : 'border-slate-200 hover:border-slate-400 dark:border-slate-700'}`}
    >
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <span className="mt-3 block font-black">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-slate-500">
        {description}
      </span>
    </button>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
      {children}
    </div>
  );
}
function PayButton({
  label,
  busy,
  onClick,
  secondary = false,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition disabled:opacity-60 ${secondary ? 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {label}
    </button>
  );
}
