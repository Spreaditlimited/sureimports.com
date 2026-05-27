'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { 
  Plus, 
  RefreshCcw, 
  Building2, 
  CalendarDays, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type CorporateGiftRequest = {
  id: number;
  pidRequest: string;
  businessName: string;
  contactPersonFullName: string;
  productOrItemNeeded: string;
  detailedSpecifications: string;
  quantityNeeded: number;
  preferredQualityLevel: string;
  expectedDeliveryDate: string;
  finalDeliveryLocationNigeria: string;
  contactEmail: string;
  whatsappNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_STEPS = [
  'Pending',
  'Sourced',
  'Invoiced',
  'Production Started',
  'Ready for Shipping',
  'Shipped',
  'Arrived',
  'Delivered',
] as const;

const QUALITY_LEVELS = ['Basic', 'Mid-range corporate quality', 'Premium executive gift'];
const BRANDING_OPTIONS = ['Yes', 'No', 'Not sure yet'];
const PROCEED_OPTIONS = [
  'Immediately (within 1-3 days)',
  'Within 1 week',
  'Within 2-4 weeks',
  'Within 1-2 months',
  'Undecided / Need internal approval',
];
const SOURCE_OPTIONS = [
  'Google Search',
  'Instagram',
  'LinkedIn',
  'Referral',
  'YouTube',
  'Returning Customer',
  'Other',
];

export default function CorporateGiftsDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CorporateGiftRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactPersonFullName: '',
    productOrItemNeeded: '',
    detailedSpecifications: '',
    quantityNeeded: 100,
    preferredQualityLevel: 'Mid-range corporate quality',
    brandingCustomizationRequired: 'Yes',
    expectedDeliveryDate: '',
    finalDeliveryLocationNigeria: '',
    contactEmail: '',
    whatsappNumber: '',
    proceedTimeline: '',
    hearAboutSureImports: 'Dashboard',
    additionalNotes: '',
  });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [deliveryDateInputFocused, setDeliveryDateInputFocused] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/corporate-gifts/user', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch your projects');
      const data = await res.json();
      setRequests(data?.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch corporate gift projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      contactEmail: prev.contactEmail || user.userEmail || '',
      contactPersonFullName: prev.contactPersonFullName || user.userFirstname || '',
    }));
  }, [user]);

  const stats = useMemo(() => {
    return [
      { label: 'Total Projects', count: requests.length, icon: Layers, color: 'text-blue-600' },
      { label: 'In Progress', count: requests.filter(r => r.status !== 'Delivered' && r.status !== 'Pending').length, icon: Clock, color: 'text-amber-600' },
      { label: 'Completed', count: requests.filter(r => r.status === 'Delivered').length, icon: CheckCircle2, color: 'text-emerald-600' },
    ];
  }, [requests]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        payload.append(snakeKey, String(value));
      });
      payload.append('page_url', window.location.href);
      payload.append('submitted_at', new Date().toISOString());
      if (referenceImage) payload.append('reference_image_upload', referenceImage);
      if (companyLogo) payload.append('company_logo_upload', companyLogo);

      const res = await fetch('/api/corporate-gifts', { method: 'POST', body: payload });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Submission failed');

      toast.success('Project submitted successfully');
      setShowForm(false);
      setReferenceImage(null);
      setCompanyLogo(null);
      setForm((prev) => ({
        ...prev,
        businessName: '',
        productOrItemNeeded: '',
        detailedSpecifications: '',
        quantityNeeded: 100,
        expectedDeliveryDate: '',
        finalDeliveryLocationNigeria: '',
        proceedTimeline: '',
        additionalNotes: '',
      }));
      await fetchRequests();
    } catch (error: any) {
      toast.error(error.message || 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-black">
      {/* Hero Section */}
      <div className="bg-slate-900 pb-32 pt-12 text-white dark:bg-[#0b0c16]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Corporate Sourcing</h1>
              <p className="mt-2 text-slate-400">Manage your bulk orders and corporate gifting projects in real-time.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchRequests}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-slate-700 dark:bg-[#161629] dark:hover:bg-[#1d1f36]"
              >
                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Sync
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold transition hover:bg-blue-500 shadow-lg shadow-blue-900/20 dark:shadow-blue-950/40"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>

          {/* Quick Stats Overlapping */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-[#161629]/70">
                <div className={`rounded-lg bg-slate-800 p-3 dark:bg-[#0f1020] ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Form Modal/Overlay Style */}
        {showForm && (
          <div className="mb-12 rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-700 dark:bg-[#161629]">
            <div className="border-b border-slate-100 p-6 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Start New Project</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Provide details about your corporate needs.</p>
            </div>
            <form onSubmit={onSubmit} className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300"><Building2 className="h-3 w-3" /> Company Information</h3>
                  <div className="space-y-3">
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Business Name" value={form.businessName} onChange={(e) => setForm(p => ({ ...p, businessName: e.target.value }))} required />
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Contact Person" value={form.contactPersonFullName} onChange={(e) => setForm(p => ({ ...p, contactPersonFullName: e.target.value }))} required />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Email" value={form.contactEmail} onChange={(e) => setForm(p => ({ ...p, contactEmail: e.target.value }))} required />
                      <input className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="WhatsApp" value={form.whatsappNumber} onChange={(e) => setForm(p => ({ ...p, whatsappNumber: e.target.value }))} required />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300"><Package className="h-3 w-3" /> Product Specs</h3>
                  <div className="space-y-3">
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="What items do you need?" value={form.productOrItemNeeded} onChange={(e) => setForm(p => ({ ...p, productOrItemNeeded: e.target.value }))} required />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Quantity" value={form.quantityNeeded} onChange={(e) => setForm(p => ({ ...p, quantityNeeded: Number(e.target.value) }))} required />
                      <Select
                        value={form.preferredQualityLevel}
                        onValueChange={(value) => setForm((p) => ({ ...p, preferredQualityLevel: value }))}
                      >
                        <SelectTrigger className="h-[46px] rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100">
                          <SelectValue placeholder="Preferred quality level" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUALITY_LEVELS.map((q) => (
                            <SelectItem key={q} value={q}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                          Expected delivery date
                        </label>
                        <div className="relative">
                          <input
                            type={
                              deliveryDateInputFocused || form.expectedDeliveryDate
                                ? 'date'
                                : 'text'
                            }
                            placeholder="Tap to select expected delivery date"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-10 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400"
                            value={form.expectedDeliveryDate}
                            onFocus={() => setDeliveryDateInputFocused(true)}
                            onBlur={() => setDeliveryDateInputFocused(false)}
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                expectedDeliveryDate: e.target.value,
                              }))
                            }
                            required
                          />
                          <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                          Final delivery location in Nigeria
                        </label>
                        <input className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="City and state (e.g. Lekki, Lagos)" value={form.finalDeliveryLocationNigeria} onChange={(e) => setForm(p => ({ ...p, finalDeliveryLocationNigeria: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="md:col-span-2 space-y-3">
                  <textarea className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Detailed Specifications..." value={form.detailedSpecifications} onChange={(e) => setForm(p => ({ ...p, detailedSpecifications: e.target.value }))} required />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                        Is branding/customization required?
                      </label>
                      <Select
                        value={form.brandingCustomizationRequired}
                        onValueChange={(value) => setForm((p) => ({ ...p, brandingCustomizationRequired: value }))}
                      >
                        <SelectTrigger className="h-[46px] rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRANDING_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                        When do you plan to proceed if the quote is acceptable?
                      </label>
                      <Select
                        value={form.proceedTimeline}
                        onValueChange={(value) => setForm((p) => ({ ...p, proceedTimeline: value }))}
                      >
                        <SelectTrigger className="h-[46px] rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-100">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROCEED_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700 dark:bg-[#0f1020]">
                      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-300">Reference Image</p>
                      <input type="file" accept="image/*" onChange={(e) => setReferenceImage(e.target.files?.[0] || null)} className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500 dark:border-slate-700 dark:bg-[#161629] dark:text-slate-200" />
                    </div>
                    <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700 dark:bg-[#0f1020]">
                      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-300">Company Logo</p>
                      <input type="file" accept="image/*" onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)} className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500 dark:border-slate-700 dark:bg-[#161629] dark:text-slate-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white">Cancel</button>
                <button disabled={submitting} type="submit" className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50 dark:hover:bg-blue-500">
                  {submitting ? 'Processing...' : 'Launch Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Projects</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Updates
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#161629]">
              <RefreshCcw className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-slate-500">Loading your dashboard...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-[#161629]">
              <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No projects found</h3>
              <p className="mt-1 text-slate-500">Start a new request to see it appear here.</p>
              <button onClick={() => setShowForm(true)} className="mt-6 font-semibold text-blue-600 hover:underline">Start your first project &rarr;</button>
            </div>
          ) : (
            requests.map((request) => {
              const activeIndex = STATUS_STEPS.indexOf(request.status as any);
              return (
                <div key={request.pidRequest} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md dark:border-slate-700 dark:bg-[#161629]">
                  <div className="flex flex-col p-6 lg:flex-row lg:items-center lg:gap-8">
                    {/* ID & Basic Info */}
                    <div className="mb-4 lg:mb-0 lg:w-1/4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{request.pidRequest}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-medium text-slate-400">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">{request.businessName}</h3>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-300">{request.productOrItemNeeded}</p>
                    </div>

                    {/* Meta Data Grid */}
                    <div className="grid flex-1 grid-cols-2 gap-4 border-slate-100 py-4 lg:grid-cols-3 lg:border-l lg:border-r lg:px-8 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><Package className="h-4 w-4 text-slate-500" /></div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Quantity</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{request.quantityNeeded} units</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><CalendarDays className="h-4 w-4 text-slate-500" /></div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Deadline</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{request.expectedDeliveryDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><MapPin className="h-4 w-4 text-slate-500" /></div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Destination</p>
                          <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{request.finalDeliveryLocationNigeria}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between pt-4 lg:pt-0 lg:w-48">
                      <div className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${
                        request.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-300'
                      }`}>
                        {request.status}
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Progress Track */}
                  <div className="bg-slate-50 px-6 py-4 dark:bg-[#0f1020]">
                    <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                      {STATUS_STEPS.map((step, idx) => {
                        const isPast = idx < activeIndex;
                        const isCurrent = idx === activeIndex;
                        return (
                          <div key={step} className="flex flex-1 items-center gap-2 min-w-[100px]">
                            <div className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                              isPast ? 'bg-blue-600 text-white' : isCurrent ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600 dark:bg-blue-900 dark:text-blue-200' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              {isPast ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                            </div>
                            <span className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-tight ${
                              isCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {step}
                            </span>
                            {idx !== STATUS_STEPS.length - 1 && (
                              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800 mx-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
