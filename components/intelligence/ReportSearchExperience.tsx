'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  FileSearch,
  Flame,
  Loader2,
  Search,
  Sparkles,
  ThumbsUp,
  X,
} from 'lucide-react';

import PublicHeroBackground from '@/components/home/PublicHeroBackground';
import ReportCover from '@/components/intelligence/ReportCover';
import { formatReportPrice } from '@/lib/intelligence/reports';

type ReportResult = {
  pidReport: string;
  slug: string;
  title: string;
  description: string | null;
  editionLabel: string;
  coverImageUrl: string | null;
  supplierCount: number;
  priceUsdCents: number;
  searchableText: string;
};

type DemandItem = {
  pidRequest: string;
  query: string;
  status: string;
  weeklyVotes: number;
  totalVotes: number;
  selectedWeek: string | null;
  publishedReportSlug: string | null;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function statusLabel(status: string) {
  if (status === 'researching') return 'Research in progress';
  if (status === 'shortlisted') return 'Selected for research';
  if (status === 'published') return 'Published';
  return 'Collecting votes';
}

function statusClass(status: string) {
  if (status === 'researching') return 'bg-blue-50 text-blue-700';
  if (status === 'shortlisted') return 'bg-violet-50 text-violet-700';
  if (status === 'published') return 'bg-emerald-50 text-emerald-700';
  return 'bg-orange-50 text-orange-700';
}

export default function ReportSearchExperience({
  reports,
}: {
  reports: ReportResult[];
}) {
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [demand, setDemand] = useState<DemandItem[]>([]);
  const [loadingDemand, setLoadingDemand] = useState(true);
  const [submittingKey, setSubmittingKey] = useState('');
  const [message, setMessage] = useState<{
    tone: 'success' | 'error';
    text: string;
  } | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const normalizedQuery = normalize(query);

  useEffect(() => {
    fetch('/api/intelligence/report-requests', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => {
        if (payload?.success) setDemand(payload.data || []);
      })
      .finally(() => setLoadingDemand(false));
  }, []);

  const filteredReports = useMemo(() => {
    if (!normalizedQuery) return reports;
    const terms = normalizedQuery.split(' ').filter(Boolean);
    return reports
      .map((report) => {
        const title = normalize(report.title);
        const haystack = normalize(report.searchableText);
        const matched = terms.filter((term) => haystack.includes(term));
        const exactTitleBonus = title.includes(normalizedQuery) ? 5 : 0;
        const startsWithBonus = title.startsWith(normalizedQuery) ? 3 : 0;
        return {
          report,
          score: matched.length * 2 + exactTitleBonus + startsWithBonus,
          complete: matched.length === terms.length,
        };
      })
      .filter((item) => item.complete)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.report);
  }, [normalizedQuery, reports]);

  const visibleReports = normalizedQuery
    ? filteredReports
    : showAll
      ? filteredReports
      : filteredReports.slice(0, 9);
  const topVotes = Math.max(1, ...demand.map((item) => item.weeklyVotes));
  const quickSearches = [
    'Makeup',
    'Diesel generators',
    'Activewear',
    'Human hair',
    'Phone accessories',
  ];

  function runSearch(event?: FormEvent) {
    event?.preventDefault();
    setMessage(null);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function vote(input: { pidRequest?: string; query?: string }) {
    if (!email.trim()) {
      setMessage({
        tone: 'error',
        text: 'Enter your email so we can count your vote and notify you when the report is ready.',
      });
      document
        .querySelector<HTMLInputElement>('[data-report-voting-email]')
        ?.focus();
      return;
    }
    const key = input.pidRequest || 'new';
    setSubmittingKey(key);
    setMessage(null);
    try {
      const response = await fetch('/api/intelligence/report-requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          pidRequest: input.pidRequest,
          query: input.query,
          email,
          companyWebsite: '',
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || 'Your vote could not be recorded.');
      }
      if (payload.availableReport?.slug) {
        window.location.href = `/supplier-intelligence/reports/${payload.availableReport.slug}`;
        return;
      }
      setDemand(payload.data || demand);
      setMessage({
        tone: 'success',
        text: payload.duplicate
          ? 'You already voted for this report this week. Your earlier vote is still counted.'
          : 'Vote counted. You just moved this report up the Research Radar.',
      });
    } catch (error) {
      setMessage({
        tone: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Your vote could not be recorded.',
      });
    } finally {
      setSubmittingKey('');
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#020617] pb-20 pt-36 text-white md:pb-24 md:pt-44">
        <PublicHeroBackground />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-orange-400 backdrop-blur">
            <Search className="h-4 w-4" />
            Supplier Intelligence Search
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl md:text-7xl">
            What product are you trying to source?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Search our ready-to-buy manufacturer reports. If yours does not
            exist yet, put it on the Research Radar and let buyer demand move it
            into production.
          </p>

          <form
            onSubmit={runSearch}
            className="mx-auto mt-9 flex w-full min-w-0 max-w-4xl flex-col gap-3 rounded-3xl bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:flex-row"
          >
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search supplier reports</span>
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setMessage(null);
                }}
                placeholder="Try “makeup”, “solar panels” or “restaurant equipment”"
                className="h-16 w-full min-w-0 rounded-2xl bg-white py-4 pl-14 pr-12 text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400 sm:text-lg"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>
            <button
              type="submit"
              className="inline-flex h-16 items-center justify-center gap-2 rounded-2xl bg-brand-orange-500 px-8 text-base font-black text-white transition hover:bg-brand-orange-600"
            >
              Search reports <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="mr-1 text-slate-500">Popular:</span>
            {quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  setTimeout(() => runSearch(), 0);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-slate-300 transition hover:border-brand-orange-500/40 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={resultsRef}
        className="scroll-mt-24 bg-slate-50 py-16 md:py-20"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange-600">
                {normalizedQuery ? 'Search results' : 'Ready now'}
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {normalizedQuery
                  ? filteredReports.length
                    ? `${filteredReports.length} matching report${filteredReports.length === 1 ? '' : 's'}`
                    : `No report for “${query.trim()}” yet`
                  : 'Recently published reports'}
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {reports.length} researched categories available
            </p>
          </div>

          {visibleReports.length ? (
            <div className="mt-9 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {visibleReports.map((report) => (
                <article
                  key={report.pidReport}
                  className="group min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <ReportCover
                    title={report.title}
                    editionLabel={report.editionLabel}
                    supplierCount={report.supplierCount}
                    coverImageUrl={report.coverImageUrl}
                    compact
                  />
                  <div className="px-2 pb-3 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                        {report.editionLabel}
                      </p>
                      <span className="text-xs font-bold text-slate-500">
                        {report.supplierCount} manufacturers
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-black leading-tight text-slate-950">
                      {report.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {report.description}
                    </p>
                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          One-time purchase
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          From {formatReportPrice(report.priceUsdCents, 'USD')}
                        </p>
                      </div>
                      <Link
                        href={`/supplier-intelligence/reports/${report.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-orange-600"
                      >
                        Open <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-9 overflow-hidden rounded-[2rem] border border-brand-orange-200 bg-white shadow-xl shadow-orange-950/5">
              <div className="grid gap-8 p-6 md:grid-cols-[1fr_0.8fr] md:p-10">
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange-100 text-brand-orange-600">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-slate-950 sm:text-3xl">
                    Put it on the Research Radar
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-slate-600">
                    Your search can become the next Supplier Intelligence
                    report. Add your vote; if other buyers want it too, it rises
                    in the weekly ranking.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ['1', 'Request it'],
                      ['2', 'Buyers vote'],
                      ['3', 'Top ideas get researched'],
                    ].map(([number, text]) => (
                      <div key={number} className="rounded-2xl bg-slate-50 p-4">
                        <span className="text-xs font-black text-brand-orange-600">
                          {number.padStart(2, '0')}
                        </span>
                        <p className="mt-2 text-sm font-black text-slate-900">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Requested report
                    </span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold outline-none focus:border-brand-orange-500"
                    />
                  </label>
                  <label className="mt-4 block">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Email for updates
                    </span>
                    <input
                      id="missing-report-email"
                      data-report-voting-email
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold outline-none placeholder:text-slate-600 focus:border-brand-orange-500"
                    />
                  </label>
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    name="companyWebsite"
                  />
                  <button
                    type="button"
                    onClick={() => vote({ query })}
                    disabled={submittingKey === 'new'}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3.5 font-black transition hover:bg-brand-orange-600 disabled:opacity-60"
                  >
                    {submittingKey === 'new' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    Add my vote
                  </button>
                </div>
              </div>
            </div>
          )}

          {!normalizedQuery && reports.length > 9 ? (
            <div className="mt-9 text-center">
              <button
                type="button"
                onClick={() => setShowAll((current) => !current)}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 transition hover:border-slate-950"
              >
                {showAll
                  ? 'Show fewer reports'
                  : `See all ${reports.length} reports`}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section
        id="research-radar"
        className="scroll-mt-24 bg-white py-16 md:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-orange-600">
                <Flame className="h-4 w-4" /> Live buyer demand
              </div>
              <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
                The Research Radar
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                This is where the market tells us what to publish next. One
                email gets one vote per report each week. Every Monday, the
                highest-ranked requests enter the Sure Imports research queue.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <label
                  htmlFor="radar-voting-email"
                  className="text-xs font-black uppercase tracking-widest text-slate-500"
                >
                  Your voting email
                </label>
                <input
                  id="radar-voting-email"
                  data-report-voting-email
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-950 outline-none focus:border-brand-orange-400 focus:ring-4 focus:ring-orange-100"
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  We keep your email private and use it to prevent duplicate
                  votes and notify you when a requested report is published.
                </p>
              </div>
              {message ? (
                <div
                  className={`mt-4 flex items-start gap-3 rounded-2xl p-4 text-sm font-semibold ${message.tone === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}
                >
                  {message.tone === 'success' ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  {message.text}
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="flex items-center justify-between px-2 pb-5">
                <div>
                  <p className="text-sm font-black text-slate-950">
                    This week’s ranking
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Updated whenever a buyer votes
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                  <Clock3 className="h-3.5 w-3.5 text-brand-orange-500" />
                  Selection every Monday
                </div>
              </div>

              {loadingDemand ? (
                <div className="flex min-h-48 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading the
                  radar…
                </div>
              ) : demand.length ? (
                <div className="space-y-3">
                  {demand.map((item, index) => (
                    <article
                      key={item.pidRequest}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${index < 3 ? 'bg-brand-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-black leading-snug text-slate-950">
                                {item.query}
                              </h3>
                              <span
                                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusClass(item.status)}`}
                              >
                                {statusLabel(item.status)}
                              </span>
                            </div>
                            {item.publishedReportSlug ? (
                              <Link
                                href={`/supplier-intelligence/reports/${item.publishedReportSlug}`}
                                className="inline-flex shrink-0 items-center gap-1 text-sm font-black text-emerald-700"
                              >
                                Open report{' '}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  vote({ pidRequest: item.pidRequest })
                                }
                                disabled={submittingKey === item.pidRequest}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-orange-600 disabled:opacity-60"
                              >
                                {submittingKey === item.pidRequest ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ThumbsUp className="h-4 w-4" />
                                )}
                                Vote
                              </button>
                            )}
                          </div>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-orange-500 to-amber-400 transition-all"
                              style={{
                                width: `${Math.max(6, (item.weeklyVotes / topVotes) * 100)}%`,
                              }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                            <span>
                              {item.weeklyVotes} vote
                              {item.weeklyVotes === 1 ? '' : 's'} this week
                            </span>
                            <span>{item.totalVotes} total</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <BarChart3 className="mx-auto h-8 w-8 text-brand-orange-500" />
                  <h3 className="mt-4 font-black text-slate-950">
                    The board is wide open
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                    Search for a report that does not exist and cast the first
                    vote. The first weekly ranking starts with buyer number one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            [
              FileSearch,
              'Search before you buy',
              'Find the exact category and see what every edition covers.',
            ],
            [
              ThumbsUp,
              'Vote with the market',
              'Missing categories rise according to real buyer demand.',
            ],
            [
              BarChart3,
              'Research follows demand',
              'The weekly leaders move into our existing specialist workflow.',
            ],
          ].map(([Icon, title, text]) => {
            const FeatureIcon = Icon as typeof FileSearch;
            return (
              <div
                key={String(title)}
                className="flex gap-4 rounded-2xl bg-white p-5"
              >
                <FeatureIcon className="h-5 w-5 shrink-0 text-brand-orange-500" />
                <div>
                  <h2 className="text-sm font-black text-slate-950">
                    {String(title)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{String(text)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
