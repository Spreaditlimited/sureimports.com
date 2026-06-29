import Link from 'next/link';
import {
  AlertTriangle,
  ChevronLeft,
  CheckCircle2,
  Clock,
  FileText,
  LockKeyhole,
  Sparkles,
  Link as LinkIcon,
  Package,
  Paperclip
} from 'lucide-react';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import SubscribeButton from '@/components/intelligence/SubscribeButton';
import IntelligenceReviewForm from '@/components/intelligence/IntelligenceReviewForm';
import {
  createIntelligenceReviewRequest,
  getUserIntelligenceReviewRequests,
} from './actions';

type PageProps = {
  searchParams?: Promise<{
    created?: string;
    type?: string;
    nicheSlug?: string;
    nicheName?: string;
  }>;
};

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

function statusBadge(status: string) {
  switch (status) {
    case 'answered':
      return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm"><CheckCircle2 className="w-3 h-3" /> Answered</span>;
    case 'in_review':
      return <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 shadow-sm"><Clock className="w-3 h-3" /> In Review</span>;
    case 'closed':
      return <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm"><LockKeyhole className="w-3 h-3" /> Closed</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 shadow-sm"><AlertTriangle className="w-3 h-3" /> Pending</span>;
  }
}

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

type ReviewAttachment = {
  name?: string;
  url?: string;
  type?: string;
  size?: number;
};

function parseAttachments(value: string | null): ReviewAttachment[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.url === 'string')
      : [];
  } catch {
    return [];
  }
}

function formatFileSize(size?: number) {
  if (!size) return '';
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

export default async function IntelligenceReviewsPage({ searchParams }: PageProps) {
  const user = await checkAuth();
  const params = await searchParams;
  const subscription = await getActiveIntelligenceSubscription(user?.pidUser);
  const isPro = subscription?.plan === 'pro';
  const requests = isPro && user?.pidUser
    ? await getUserIntelligenceReviewRequests(user.pidUser)
    : [];

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
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

        {/* --- Header --- */}
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-600">
              Expert Decision Support
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Supplier & Quote Reviews
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Submit a supplier link, quote, or invoice before you pay. Sure Imports will review the risk points and provide actionable next steps.
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange-500/20 bg-brand-orange-50 px-4 py-2 text-sm font-bold text-brand-orange-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Pro Plan Feature
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STATE 1: LOCKED / NOT PRO */}
        {/* ------------------------------------------------------------------------- */}
        {!isPro ? (
          <section className="mt-12 relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-8 shadow-2xl sm:p-16 text-center">
            {/* Ambient Glow */}
            <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[100px] pointer-events-none" />
            
            <div className="relative flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.03] border border-white/10 shadow-sm text-brand-orange-400">
                <LockKeyhole className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Upgrade to unlock expert reviews
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
                The Starter plan gives you access to the verified supplier directory. Upgrading to <strong>Pro</strong> unlocks hands-on supplier vetting and quote review support before you commit money.
              </p>
              
              <div className="mt-10">
                <SubscribeButton
                  plan="pro"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/40"
                >
                  Upgrade to Pro <Sparkles className="h-4 w-4" />
                </SubscribeButton>
              </div>
            </div>
          </section>
        ) : (
          
        /* ------------------------------------------------------------------------- */
        /* STATE 2: ACTIVE PRO - REVIEW DASHBOARD */
        /* ------------------------------------------------------------------------- */
          <div className="mt-8 grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-10">
            
            {/* --- LEFT COLUMN: Form --- */}
            <aside className="h-fit">
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-slate-900">
                  New Review Request
                </h2>
                <p className="mt-2 mb-6 text-sm leading-relaxed text-slate-500">
                  Provide enough context for a useful answer: supplier links, quantities, and the specific decision you're struggling with.
                </p>

                {params?.created && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-emerald-900">
                      Request submitted successfully. Our team will review this shortly.
                    </p>
                  </div>
                )}

                <IntelligenceReviewForm
                  action={createIntelligenceReviewRequest}
                  defaultType={params?.type}
                  nicheSlug={params?.nicheSlug || ''}
                  nicheName={params?.nicheName || ''}
                />
              </section>
            </aside>

            {/* --- RIGHT COLUMN: Request List --- */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Review History
                </h2>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                  {requests.length} total
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    No requests yet
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Submit your first supplier or quote review using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {requests.map((request) => (
                    <ReviewCard key={request.pidRequest} request={request} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function ReviewCard({ request }: { request: Awaited<ReturnType<typeof getUserIntelligenceReviewRequests>>[number] }) {
  const attachments = parseAttachments(request.attachmentsJson);

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 transition-shadow hover:shadow-md">
                      {/* Request Header */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-6">
                        <div>
                          <div className="mb-3 flex items-center gap-3">
                            {statusBadge(request.status)}
                            <span className="font-mono text-[10px] font-bold text-slate-400">
                              REF: {request.pidRequest.split('-')[0]}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {request.supplierName || request.nicheName || 'General Review Request'}
                          </h3>
                          <p className="mt-1.5 text-sm text-slate-500 capitalize flex items-center gap-2">
                            {request.requestType.replace(/_/g, ' ')} 
                            <span className="text-slate-300">•</span> 
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Request Details Grid */}
                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        {request.supplierWebsite && (
                          <div className="flex items-start gap-3">
                             <LinkIcon className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                             <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Supplier Link</p>
                                <p className="mt-1 text-sm text-slate-700 break-all">{request.supplierWebsite}</p>
                             </div>
                          </div>
                        )}
                        {request.targetQuantity && (
                          <div className="flex items-start gap-3">
                             <Package className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                             <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quantity</p>
                                <p className="mt-1 text-sm text-slate-700">{request.targetQuantity}</p>
                             </div>
                          </div>
                        )}
                      </div>

                      {/* User's Decision Needed */}
                      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                          Decision Needed
                        </p>
                        <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                          {request.decisionNeeded}
                        </p>
                      </div>

                      {attachments.length > 0 ? (
                        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
                          <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <Paperclip className="h-3.5 w-3.5" />
                            Supporting Files
                          </p>
                          <div className="grid gap-2">
                            {attachments.map((file) => (
                              <a
                                key={file.url}
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-orange-200 hover:bg-brand-orange-50"
                              >
                                <span className="min-w-0 truncate">{file.name || 'Attachment'}</span>
                                <span className="shrink-0 text-xs text-slate-400">
                                  {formatFileSize(file.size)}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {/* --- ADMIN RESPONSE AREA --- */}
                      {request.adminResponse ? (
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-900">
                                Sure Imports Analysis
                              </p>
                            </div>
                            {request.adminRiskLevel && (
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                                request.adminRiskLevel.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                                request.adminRiskLevel.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-emerald-100 text-emerald-700'
                              }`}>
                                Risk: {request.adminRiskLevel}
                              </span>
                            )}
                          </div>
                          
                          <p className="whitespace-pre-line text-sm leading-relaxed text-blue-900/90">
                            {request.adminResponse}
                          </p>

                          {request.adminRecommendations && (
                            <div className="mt-5 border-t border-blue-200/50 pt-5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-900 mb-2">
                                Recommended Next Steps
                              </p>
                              <p className="whitespace-pre-line text-sm leading-relaxed text-blue-900/90 font-medium">
                                {request.adminRecommendations}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                          <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <p className="text-sm leading-relaxed text-amber-900">
                              This request is awaiting review. <strong>Do not treat this as clearance to pay the supplier yet.</strong>
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
  );
}
