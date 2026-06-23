'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Globe, 
  Loader2, 
  Ship, 
  User, 
  FileText, 
  CheckCircle2, 
  Weight, 
  Hash, 
  MessageSquare,
  ShieldCheck,
  PackageCheck,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { convertToTitleCase } from '@/app/utils/stringUtils';
import {
  buildFacebookLeadMeta,
  trackBrowserLeadEvent,
} from '@/lib/marketing/facebookLeadMeta';

type ShippingPlan = {
  pidShippingPlan: string;
  shippingPlanName: string;
};

type Country = {
  pidCountry: string;
  countryName: string;
  shippingPlans: ShippingPlan[];
};

export default function PublicShippingOnlyFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldResumeCheckout = searchParams.get('resumeCheckout') === '1';
  const PENDING_KEY = 'sureimports:pendingShippingOnlyCheckout';

  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resuming, setResuming] = useState(false);

  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [request, setRequest] = useState({
    whatsappNumber: '',
    shippingName: '',
    shippingTo: '',
    grossWeight: '',
    trackingNumber: '',
    shippingPlan: '',
    expectedShipments: '',
    wantProductVerification: false,
    wantConsolidation: false,
    multipleSuppliers: false,
  });

  useEffect(() => {
    let cancelled = false;
    const loadCountries = async () => {
      try {
        const response = await fetch('/api/get-data/countries-shipping-plan', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = (await response.json()) as Country[];
        if (!cancelled) setCountries(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) toast.error('Unable to load destination countries.');
      } finally {
        if (!cancelled) setCountriesLoading(false);
      }
    };
    loadCountries();
    return () => { cancelled = true; };
  }, []);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.pidCountry === request.shippingTo),
    [countries, request.shippingTo],
  );

  // Resume Checkout Logic
  useEffect(() => {
    if (!shouldResumeCheckout || resuming) return;
    const pendingRaw = window.localStorage.getItem(PENDING_KEY);
    if (!pendingRaw) return;

    setResuming(true);
    const resumeCheckout = async () => {
      try {
        const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!authResponse.ok) { setResuming(false); return; }

        const pendingPayload = JSON.parse(pendingRaw);
        const response = await fetch('/api/public/shipping-only/bootstrap-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pendingPayload),
        });
        const data = await response.json();

        if (data?.statusx === 'SUCCESS') {
          window.localStorage.removeItem(PENDING_KEY);
          toast.success('Resuming your request...');
          router.push(data.redirectTo);
          return;
        }
      } catch (e) {
        toast.error('Unable to resume draft.');
      } finally {
        setResuming(false);
      }
    };
    resumeCheckout();
  }, [shouldResumeCheckout, resuming, router]);

  const submitRequest = async () => {
    if (!request.shippingName.trim() || !request.shippingTo || !request.shippingPlan || !request.grossWeight.trim() || !request.expectedShipments.trim()) {
      toast.error('Please complete all required shipment fields.');
      return;
    }
    if (!account.email.trim()) {
      toast.error('Email is required.');
      return;
    }

    const leadMeta = buildFacebookLeadMeta();
    const payload = { account, request, ...leadMeta };
    setSubmitting(true);
    try {
      const response = await fetch('/api/public/shipping-only/bootstrap-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.statusx === 'SUCCESS') {
        trackBrowserLeadEvent({
          eventId: leadMeta.fbEventId,
          contentName: 'Shipping Only Submission',
          contentCategory: 'Shipping Only',
          value: 1,
          currency: 'NGN',
        });
        window.localStorage.removeItem(PENDING_KEY);
        toast.success('Shipment created successfully!');
        router.push(data.redirectTo);
        return;
      }

      if (data?.statusx === 'ACCOUNT_EXISTS_LOGIN_REQUIRED') {
        window.localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
        toast.info('Account found. Please sign in to finalize.');
        router.push(`/auth/login?next=${encodeURIComponent('/ship-with-us?resumeCheckout=1')}`);
        return;
      }

      toast.error(data?.message || 'Submission failed.');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (resuming) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfd] dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm font-bold text-slate-600 dark:text-slate-400">Restoring your session...</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {/* Main Grid */}
      <section className="w-full">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,380px)] 2xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
          
          {/* Form Side */}
          <div className="space-y-6">
            
            {/* 1. Contact */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Contact Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Personal details for tracking and alerts.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">First Name</label>
                  <Input placeholder="John" value={account.firstName} onChange={(e) => setAccount(p => ({ ...p, firstName: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                  <Input placeholder="Doe" value={account.lastName} onChange={(e) => setAccount(p => ({ ...p, lastName: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                  <Input type="email" placeholder="john@company.com" value={account.email} onChange={(e) => setAccount(p => ({ ...p, email: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">WhatsApp Number</label>
                  <Input
                    placeholder="+234..."
                    value={request.whatsappNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRequest(p => ({ ...p, whatsappNumber: value }));
                      setAccount(p => ({ ...p, phone: value }));
                    }}
                    className="h-12 rounded-xl dark:bg-slate-800/50"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipment details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Shipment Particulars</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">What are we expecting at the warehouse?</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Name on Shipment</label>
                  <Input placeholder="Package label name" value={request.shippingName} onChange={(e) => setRequest(p => ({ ...p, shippingName: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Destination</label>
                  <select
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
                    value={request.shippingTo}
                    onChange={(e) => setRequest(p => ({ ...p, shippingTo: e.target.value, shippingPlan: '' }))}
                  >
                    <option value="" className="dark:bg-slate-900">Select country</option>
                    {countriesLoading ? (
                      <option className="dark:bg-slate-900">Loading...</option>
                    ) : (
                      countries.map((c) => <option key={c.pidCountry} value={c.pidCountry} className="dark:bg-slate-900">{c.countryName}</option>)
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Shipping Mode</label>
                  <select
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
                    value={request.shippingPlan}
                    onChange={(e) => setRequest(p => ({ ...p, shippingPlan: e.target.value }))}
                    disabled={!selectedCountry}
                  >
                    <option value="" className="dark:bg-slate-900">{selectedCountry ? 'Select Plan' : 'Select Country First'}</option>
                    {(selectedCountry?.shippingPlans || []).map((p) => (
                      <option key={p.pidShippingPlan} value={p.pidShippingPlan} className="dark:bg-slate-900">
                        {convertToTitleCase(p.shippingPlanName)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1"><Weight className="h-3 w-3" /> Est. Gross Weight (kg)</label>
                  <Input placeholder="e.g. 15" value={request.grossWeight} onChange={(e) => setRequest(p => ({ ...p, grossWeight: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1"><Hash className="h-3 w-3" /> Tracking ID (Optional)</label>
                  <Input placeholder="Supplier's tracking number" value={request.trackingNumber} onChange={(e) => setRequest(p => ({ ...p, trackingNumber: e.target.value }))} className="h-12 rounded-xl dark:bg-slate-800/50" />
                </div>
              </div>

              {/* Service Selection Tiles - Corrected to Brand Indigo */}
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { key: 'wantProductVerification', label: 'Verify Quality', icon: ShieldCheck },
                  { key: 'wantConsolidation', label: 'Consolidate', icon: PackageCheck },
                  { key: 'multipleSuppliers', label: 'Multi-Supplier', icon: Ship }
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setRequest(p => ({ ...p, [s.key]: !p[s.key as keyof typeof p] }))}
                    className={`flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all active:scale-95 ${
                      request[s.key as keyof typeof request]
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400'
                    }`}
                  >
                    <s.icon className={`h-6 w-6 ${request[s.key as keyof typeof request] ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-black uppercase tracking-widest">{s.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Expected Shipment (Notes)</label>
                <Textarea 
                  placeholder="What's inside? Batteries, liquids, powders? Please be detailed." 
                  value={request.expectedShipments}
                  onChange={(e) => setRequest(p => ({ ...p, expectedShipments: e.target.value }))}
                  className="min-h-[140px] rounded-2xl dark:bg-slate-800/50" 
                />
              </div>
            </div>
          </div>

          {/* Sticky Summary - Corrected to Brand Indigo */}
          <div className="space-y-6 xl:sticky xl:top-28">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
              <div className="mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-orange-500" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Shipment Summary</h3>
              </div>

              <div className="space-y-4 text-sm font-medium">
                {[
                  { label: 'Shipment Label', val: request.shippingName },
                  { label: 'Destination', val: selectedCountry?.countryName },
                  {
                    label: 'Plan',
                    val: convertToTitleCase(
                      selectedCountry?.shippingPlans.find(p => p.pidShippingPlan === request.shippingPlan)?.shippingPlanName || '',
                    ),
                  },
                  { label: 'Est. Weight', val: request.grossWeight ? `${request.grossWeight} kg` : null }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase">{item.label}</span>
                    <span className="text-slate-900 dark:text-white font-black">{item.val || '—'}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={submitRequest}
                  disabled={submitting || resuming}
                  className="h-14 w-full rounded-2xl bg-indigo-600 text-base font-black text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.98] border-0"
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing...</>
                  ) : (
                    <>Submit Request <ChevronRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Secured by Sure Imports Cloud
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
