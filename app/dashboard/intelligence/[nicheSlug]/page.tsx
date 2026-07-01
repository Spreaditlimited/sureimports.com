import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Database,
  ExternalLink,
  Globe,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { checkAuth } from '@/lib/auth/checkAuth';
import {
  getActiveIntelligenceSubscription,
  hasApprovedSearchResultAccess,
} from '@/lib/intelligence/access';
import { getCompanyContactSettings } from '@/lib/intelligence/companyContacts';
import {
  getNicheBySlugWithDb,
  getSupplierCheckSummary,
} from '@/lib/intelligence/data';
import { supplierEnquiryTemplate } from '@/lib/intelligence/warehouse';

type NichePageProps = {
  params: Promise<{ nicheSlug: string }>;
};

function parseProductsMade(value: unknown) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return String(value)
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function emailHref(value: string) {
  return `mailto:${value.trim()}`;
}

function whatsappHref(value: string) {
  const digits = value.replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export default async function DashboardIntelligenceNichePage({
  params,
}: NichePageProps) {
  const user = await checkAuth();
  const subscription = await getActiveIntelligenceSubscription(user?.pidUser);
  const { nicheSlug } = await params;
  const niche = await getNicheBySlugWithDb(nicheSlug);
  const companyContacts = await getCompanyContactSettings();
  const hasSearchResultAccess = await hasApprovedSearchResultAccess(
    user?.pidUser,
    nicheSlug,
  );

  if (!subscription && !hasSearchResultAccess) {
    redirect('/dashboard/intelligence');
  }

  const isPro = subscription?.plan === 'pro';
  const hasFullSupplierAccess = Boolean(subscription);
  const visibleSuppliers = hasFullSupplierAccess
    ? niche?.suppliers || []
    : (niche?.suppliers || []).slice(0, 1);
  const lockedSupplierCount = Math.max(
    0,
    (niche?.suppliers.length || 0) - visibleSuppliers.length,
  );

  if (!niche) notFound();

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* --- Top Navigation --- */}
        <div className="mb-8">
          <Link
            href="/dashboard/intelligence"
            className="group inline-flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors group-hover:bg-slate-100">
              <ChevronLeft className="h-4 w-4" />
            </span>
            Back to Directory
          </Link>
        </div>

        {/* --- Niche Header --- */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-8 sm:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-600">
              <Database className="h-3.5 w-3.5" />
              Verified Category
            </div>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {niche.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              These suppliers have been reviewed using multiple data points,
              including official company information and China-side context.
              <strong>
                {' '}
                You must still confirm samples, invoice recipients, warranty
                routes, and shipping terms before paying.
              </strong>
            </p>
          </div>

          {/* Methodology Banner */}
          <div className="border-t border-amber-100 bg-amber-50/50 p-6 sm:px-10">
            <div className="flex gap-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-amber-900">
                  How we verify
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
                  Company profile, product fit, contact paths, category
                  relevance, location consistency, buyer risks, export clues,
                  and Nigeria-use compatibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        {isPro ? (
          <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 text-white shadow-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-300">
                <Sparkles className="h-3.5 w-3.5" />
                Pro importer tools
              </div>
              <h2 className="mt-5 text-xl font-extrabold">
                Supplier enquiry template
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Start like a serious buyer. Mention the exact product, ask for
                MOQ and FOB price in RMB to Guangzhou, then ask for CBM or total
                weight based on how you plan to ship.
              </p>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
                <p className="whitespace-pre-line">{supplierEnquiryTemplate}</p>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Freight forwarder address
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    {companyContacts.chinaAddress}
                  </p>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    China contact
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    {companyContacts.chinaContact}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-brand-orange-200 bg-brand-orange-50 p-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Need another category?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  Pro users can request supplier research for a product category
                  Sure Imports should prioritize next.
                </p>
              </div>
              <Link
                href={`/dashboard/intelligence/reviews?type=category_request&nicheSlug=${encodeURIComponent(
                  niche.slug,
                )}&nicheName=${encodeURIComponent(niche.name)}`}
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600"
              >
                <Sparkles className="h-4 w-4" />
                Request research
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-brand-orange-200 bg-brand-orange-50 p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {hasSearchResultAccess
                    ? 'Upgrade to unlock every supplier in this result'
                    : 'Pro adds buying templates'}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {hasSearchResultAccess
                    ? 'Your free search shows one supplier lead. Upgrade to see all suppliers in this result plus the entire Sure Imports Supplier Intelligence database.'
                    : 'Upgrade to get supplier enquiry prompts and priority category requests inside each supplier category.'}
                </p>
              </div>
              <Link
                href="/dashboard/intelligence/manage"
                className="inline-flex w-fit max-w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-brand-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-orange-500/15 transition hover:bg-brand-orange-600"
              >
                {hasSearchResultAccess ? 'Upgrade' : 'Upgrade plan'}
              </Link>
            </div>
          </section>
        )}

        {/* --- Supplier List --- */}
        <div className="mt-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-900">
              Approved Suppliers ({niche.suppliers.length})
            </h2>
            {!hasFullSupplierAccess ? (
              <span className="rounded-full border border-brand-orange-200 bg-brand-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-700">
                1 free result shown
              </span>
            ) : null}
          </div>

          {visibleSuppliers.map((supplier) => {
            const productsMade = parseProductsMade(
              (supplier as any).productsMade,
            );
            return (
              <article
                key={`${supplier.niche}-${supplier.supplierName}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
              >
                {/* Supplier Header */}
                <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Sure Imports Checked
                    </div>
                    <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
                      <Building2 className="h-5 w-5 text-slate-400" />
                      {supplier.supplierName}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                      {supplier.productFit}
                    </p>
                    {productsMade.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {productsMade.map((product) => (
                          <span
                            key={product}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <a
                    href={supplier.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-orange-500 hover:shadow-lg hover:shadow-brand-orange-500/20"
                  >
                    <Globe className="h-4 w-4 text-slate-400 transition-colors group-hover:text-white" />
                    Official Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Contact Grid */}
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Contact Directory
                  </h3>
                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    {supplier.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Email
                          </p>
                          <a
                            href={emailHref(supplier.email)}
                            className="block truncate text-sm font-semibold text-brand-orange-600 hover:text-brand-orange-700 hover:underline"
                          >
                            {supplier.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Phone
                          </p>
                          <p className="text-sm text-slate-600">
                            {supplier.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {supplier.whatsapp && (
                      <div className="flex items-start gap-3">
                        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            WhatsApp
                          </p>
                          <a
                            href={whatsappHref(supplier.whatsapp)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            {supplier.whatsapp}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                    {supplier.countryRegion && (
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Region
                          </p>
                          <p className="text-sm text-slate-600">
                            {supplier.countryRegion}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Full width items */}
                    {supplier.address && (
                      <div className="flex items-start gap-3 pt-2 sm:col-span-2 lg:col-span-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Full Address
                          </p>
                          <p className="text-sm text-slate-600">
                            {supplier.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {supplier.officialContactPage && (
                      <div className="flex items-start gap-3 pt-2 sm:col-span-2 lg:col-span-3">
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-500" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Verification Link
                          </p>
                          <a
                            href={supplier.officialContactPage}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-brand-orange-600 hover:text-brand-orange-700 hover:underline"
                          >
                            Open Supplier Contact Page
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Intelligence Analysis */}
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-blue-900">
                        Sure Imports Assessment
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-blue-900/80">
                      {getSupplierCheckSummary(supplier)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-amber-900">
                        Buyer Notes & Risks
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-amber-900/80">
                      {supplier.buyerNotes}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}

          {!hasFullSupplierAccess && lockedSupplierCount > 0 ? (
            <LockedSupplierResults count={lockedSupplierCount} />
          ) : null}
        </div>
      </div>
    </main>
  );
}

function LockedSupplierResults({ count }: { count: number }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 px-3 backdrop-blur-[3px] sm:px-5">
        <div className="w-full max-w-lg rounded-2xl border border-brand-orange-200 bg-white p-4 text-center shadow-2xl shadow-slate-200/80 sm:p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-600">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-slate-900">
            {count} more supplier {count === 1 ? 'result is' : 'results are'}{' '}
            locked
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Upgrade to see every supplier in this search result plus the full
            Sure Imports Supplier Intelligence database.
          </p>
          <Link
            href="/dashboard/intelligence/manage"
            className="mt-5 inline-flex w-full min-w-0 items-center justify-center rounded-lg bg-brand-orange-500 px-4 py-2.5 text-center text-sm font-bold leading-tight text-white shadow-md shadow-brand-orange-500/15 transition hover:bg-brand-orange-600 sm:w-auto sm:whitespace-nowrap"
          >
            Upgrade to unlock all suppliers
          </Link>
        </div>
      </div>

      <div className="grid gap-5 blur-[3px]">
        {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex items-start justify-between gap-5 border-b border-slate-200 pb-5">
              <div className="space-y-3">
                <div className="h-5 w-48 rounded-full bg-slate-300" />
                <div className="h-4 w-72 max-w-full rounded-full bg-slate-200" />
                <div className="h-4 w-56 max-w-full rounded-full bg-slate-200" />
              </div>
              <div className="hidden h-10 w-36 rounded-xl bg-slate-300 sm:block" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="h-20 rounded-xl bg-white" />
              <div className="h-20 rounded-xl bg-white" />
              <div className="h-20 rounded-xl bg-white" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
