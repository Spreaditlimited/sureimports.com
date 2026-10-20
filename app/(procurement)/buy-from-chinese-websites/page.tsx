import ServiceHero from '@/components/home/ServiceHero';
import pageStyles from '@/components/home/PublicServicePage.module.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  CreditCard,
  FileSearch,
  Globe2,
  ShieldCheck,
  Truck,
  ChevronDown,
  Info,
  CheckCircle2,
} from 'lucide-react';
import PublicOrderFlow from './components/PublicOrderFlow';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import { JsonLdScript } from '@/components/seo/JsonLd';
import YouTubeFrame from '@/components/uix/YouTubeFrame';
import {
  LINESCOUT_BULK_SOURCING_URL,
  LINESCOUT_WHITE_LABEL_URL,
} from '@/lib/linescoutLinks';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/buy-from-chinese-websites`;
import { procurementVideo } from '@/lib/website-videos/public';
import { videoSchema } from '@/lib/website-videos/policy';

export const revalidate = 60;

const platforms = [
  '1688',
  'Alibaba',
  'Taobao',
  'Pinduoduo',
  'DHgate',
  'Made-in-China',
  'Tmall',
  'VIP.com',
];

const process = [
  {
    icon: Globe2,
    title: 'Submit product links',
    text: 'Paste the links from 1688, Alibaba, Taobao, Pinduoduo or another Chinese website and add the quantity, price, weight and product notes.',
  },
  {
    icon: FileSearch,
    title: 'We review the order',
    text: 'Your product details help us confirm the item, expected cost, shipping route, product category and any obvious risk before payment.',
  },
  {
    icon: CreditCard,
    title: 'Pay securely',
    text: 'You continue through your Sure Imports dashboard so the order, payment and updates are tied to your account.',
  },
  {
    icon: Truck,
    title: 'We coordinate shipping',
    text: 'Goods are handled through the China-to-destination logistics process with order updates and delivery support.',
  },
];

const useCases = [
  {
    title: 'Mini importation products',
    text: 'Accessories, home items, fashion add-ons, kitchen tools and small products where landed cost must be watched carefully.',
  },
  {
    title: 'Phones, laptops and gadgets',
    text: 'Tech products need more attention to specification, battery, model, warranty and inspection before dispatch.',
  },
  {
    title: 'Business inventory',
    text: 'Repeat stock for retailers, ecommerce sellers and teams that want predictable pricing and procurement records.',
  },
  {
    title: 'Product samples',
    text: 'Small trial orders before committing to higher-volume sourcing, white label or corporate procurement.',
  },
];

const checks = [
  'Product link, variant, color, size and quantity',
  'Supplier price, currency and product category',
  'Estimated unit weight and shipping method',
  'Battery, liquid, powder or restricted-item warning signs',
  'Destination, shipping method and shopping website',
  'Order record before payment and dashboard tracking',
];

const faqs = [
  {
    question: 'Can I buy from 1688 in Nigeria through Sure Imports?',
    answer:
      'Yes. You can submit 1688 product links through the Buy From Chinese Websites flow. Sure Imports helps connect the product purchase, payment flow and shipping process through your account.',
  },
  {
    question: 'Can I buy from Alibaba, Taobao and Pinduoduo too?',
    answer:
      'Yes. The service is built for product links from major Chinese websites including Alibaba, Taobao, Pinduoduo, DHgate, 1688 and similar platforms.',
  },
  {
    question: 'What details do I need before submitting an order?',
    answer:
      'Choose a destination, shipping method and shopping website, then add product links, names, unit prices, quantities and per-item weight or volume. You can add multiple products in one currency. Sign in when you are ready to save your order and add your delivery address.',
  },
  {
    question: 'Is this the same as Pay Supplier?',
    answer:
      'No. Buy From Chinese Websites is for link-based purchases where you want Sure Imports to help process the product order. Pay Supplier is for users who already have a confirmed supplier and mainly need supplier payment support after signing in.',
  },
  {
    question: 'Can I use this service for phones and laptops?',
    answer:
      'Yes, but phones and laptops require careful specification and inspection. You can also browse available products directly from the Sure Imports shop.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Buy From Chinese Websites in Nigeria',
  url: pageUrl,
  provider: {
    '@type': 'Organization',
    name: 'Sure Imports',
    url: baseUrl,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Nigeria',
  },
  serviceType: 'China product buying and procurement support',
  description:
    'Product buying support for Nigerians purchasing from 1688, Alibaba, Taobao, Pinduoduo, DHgate and other Chinese websites.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};


const paySupplierHref = '/auth/login?next=%2Fdashboard%2Fpay-supplier%2Fcreate';
const inlineServiceLinkClass =
  'font-bold text-brand-orange-600 underline decoration-brand-orange-300 underline-offset-4 transition hover:text-brand-orange-700 dark:text-brand-orange-400 dark:decoration-brand-orange-500/60 dark:hover:text-brand-orange-300';

function renderFaqQuestion(question: string) {
  if (question === 'Is this the same as Pay Supplier?') {
    return (
      <>
        Is this the same as{' '}
        <Link href={paySupplierHref} className={inlineServiceLinkClass}>
          Pay Supplier
        </Link>
        ?
      </>
    );
  }

  if (question === 'Can I use this service for phones and laptops?') {
    return (
      <>
        Can I use this service for phones and{' '}
        <Link href="/laptops-for-business" className={inlineServiceLinkClass}>
          laptops
        </Link>
        ?
      </>
    );
  }

  return question;
}

function renderFaqAnswer(question: string, answer: string) {
  if (question === 'Is this the same as Pay Supplier?') {
    return (
      <>
        No. Buy From Chinese Websites is for link-based purchases where you want
        Sure Imports to help process the product order.{' '}
        <Link href={paySupplierHref} className={inlineServiceLinkClass}>
          Pay Supplier
        </Link>{' '}
        is for users who already have a confirmed supplier and mainly need
        supplier payment support after signing in.
      </>
    );
  }

  if (question === 'Can I use this service for phones and laptops?') {
    return (
      <>
        Yes, but phones and{' '}
        <Link href="/laptops-for-business" className={inlineServiceLinkClass}>
          laptops
        </Link>{' '}
        require careful specification and inspection. You can also browse
        available products directly from the{' '}
        <Link href="/shop" className={inlineServiceLinkClass}>
          Sure Imports shop
        </Link>
        .
      </>
    );
  }

  return answer;
}

export default async function BuyFromChineseWebsitesPage() {
  const video = await procurementVideo();
  const currentVideoId = video.videoId;
  const currentVideoSchema = videoSchema(video);
  return (
    <>
      <JsonLdScript data={[serviceSchema, faqSchema, currentVideoSchema]} />
      <Header />
      <main className={pageStyles.page} data-si-page-theme="service">
        {/* --- HERO SECTION --- */}
        <ServiceHero
          eyebrow="Buying from China"
          title="Buy from Chinese websites with confidence."
          description="Paste product links from 1688, Taobao, Alibaba and other Chinese shops. Build one order, then let us handle purchasing and shipping."
          summaryTitle="Many products. One order."
          primary={{ href: '#start-order', label: 'Start your order' }}
          secondary={{ href: '#how-it-works', label: 'See how it works' }}
          steps={[
            {
              title: 'Choose your route',
              description:
                'Select your destination and an available shipping method.',
            },
            {
              title: 'Add your products',
              description:
                'Choose a shop, paste links and add the details you have.',
            },
            {
              title: 'Continue when you’re ready',
              description:
                'Your draft stays in this browser. Sign in to create your order.',
            },
          ]}
        />

        {/* --- SUPPORTED PLATFORMS BAR --- */}
        <section className="overflow-hidden bg-[var(--si-surface)] py-8">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
            <p className="shrink-0 text-xs font-medium uppercase tracking-widest text-slate-400">
              Supported Websites:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {platforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-lg border border-slate-200 bg-[var(--si-surface)] px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand-orange-400 dark:border-slate-800 dark:text-slate-300"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* --- VIDEO WALKTHROUGH --- */}
        <section
          id="how-it-works"
          className="scroll-mt-24 overflow-hidden bg-[var(--si-surface)] py-14 md:py-20"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-brand-orange-400 sm:text-sm">
                Step by Step Video Guide
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[var(--si-surface)] shadow-none dark:border-slate-800">
                <YouTubeFrame
                  videoId={currentVideoId}
                  title={video.title}
                  thumbnailQuality="hqdefault"
                  loadImmediately
                />
              </div>
              <p className="mt-4 text-center"><Link href="/buy-from-chinese-websites/video" className="font-medium text-[var(--si-accent)] underline underline-offset-4">Watch the full buying guide</Link></p>
            </div>
          </div>
        </section>

        {/* --- WHY USE THIS SERVICE --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-brand-orange-500">
                Sourcing made clearer
              </span>
              <h2 className="mt-4 text-3xl font-medium leading-tight tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Stop guessing your way through Chinese shopping websites.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Chinese websites have the best prices, but non Chinese buyers face
                language barriers, RMB payment blocks, and complex logistics. We
                give you a structured way to submit order details, checkout, and
                keep everything tied to a trackable record.
              </p>
            </div>

            {/* PROCESS TIMELINE */}
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {process.map((item, index) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[var(--si-surface)] p-8 shadow-sm transition-all hover:shadow-none dark:border-slate-800"
                >
                  <span className="pointer-events-none absolute -right-4 -top-4 text-8xl font-medium text-slate-100 transition-transform group-hover:scale-110 dark:text-white/[0.02]">
                    {index + 1}
                  </span>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500 dark:bg-brand-orange-500/10">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative text-xl font-medium text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order builder */}
        <section
          id="start-order"
          className="relative overflow-hidden border-y border-slate-200 bg-[var(--si-canvas)] py-12 dark:border-slate-800 md:py-20"
        >
          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className={pageStyles.formFrame}>
              <div className="p-4 sm:p-6 lg:p-8">
                <Suspense fallback={null}>
                  <PublicOrderFlow />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* --- CHECKS & USE CASES BENTO --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {/* Checklist Box */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[var(--si-surface)] p-8 shadow-sm dark:border-slate-800 md:p-12">
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-500 dark:bg-slate-800">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-medium tracking-tight text-slate-950 dark:text-white">
                  What to confirm before submitting
                </h2>
                <p className="mb-8 mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  The better your product information, the easier it is to avoid
                  wrong variants, incorrect quantities, and surprise shipping
                  fees.
                </p>
              </div>
              <ul className="space-y-4">
                {checks.map((check) => (
                  <li
                    key={check}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {check}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases Box */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[var(--si-surface)] p-8 shadow-sm dark:border-slate-800 md:p-12">
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-[var(--si-surface)] text-brand-orange-500 dark:border-slate-700">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-medium tracking-tight text-slate-950 dark:text-white">
                  Best use cases for this service
                </h2>
                <p className="mb-8 mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Buy From Chinese Websites works best when you already have
                  product links. If you still need suppliers for white-label
                  products or bulk stock, use{' '}
                  <Link
                    href={LINESCOUT_BULK_SOURCING_URL}
                    className={inlineServiceLinkClass}
                  >
                    LineScout
                  </Link>
                  .
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {useCases.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-[var(--si-surface)] p-5 shadow-sm dark:border-slate-700"
                  >
                    <h3 className="mb-2 text-sm font-medium text-slate-950 dark:text-white">
                      {item.title === 'Phones, laptops and gadgets' ? (
                        <Link
                          href="/shop"
                          className="transition hover:text-brand-orange-500"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.title === 'Product samples' ? (
                        <>
                          Small trial orders before committing to higher-volume
                          sourcing or{' '}
                          <Link
                            href={LINESCOUT_WHITE_LABEL_URL}
                            className={inlineServiceLinkClass}
                          >
                            white-label production
                          </Link>
                          .
                        </>
                      ) : (
                        item.text
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- EDUCATION & BLOG LINKS --- */}
        <section className="si-dark-surface relative overflow-hidden bg-[#15171c] py-20 text-white md:py-28">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 bg-brand-orange-500/20 blur-[100px]" />

          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-brand-orange-500">
                  <Info className="h-4 w-4" /> Buyer Education
                </span>
                <h2 className="text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                  1688, Alibaba and Taobao are not the same experience.
                </h2>
                <div className="mt-6 space-y-6 text-lg leading-relaxed text-slate-400">
                  <p>
                    Alibaba is usually easier for export buyers because
                    suppliers understand international orders. 1688 offers
                    stronger domestic wholesale pricing but is harder for
                    Nigerian buyers due to language barriers and RMB payments.
                  </p>
                  <p>
                    The platform is only one part of the decision. A profitable
                    import still needs correct product details, realistic landed
                    cost calculations, and a structured shipping plan.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[var(--si-surface)] p-8 backdrop-blur-sm md:p-10">
                <BadgeCheck className="mb-6 h-10 w-10 text-brand-orange-400" />
                <h3 className="mb-6 text-2xl font-medium">
                  Useful guides before you buy
                </h3>
                <div className="grid gap-4">
                  {[
                    [
                      'How to buy from 1688 safely',
                      '/blog/how-to-buy-from-1688-and-ship-to-nigeria-safely',
                    ],
                    [
                      'How to buy from Alibaba safely',
                      '/blog/how-to-buy-from-alibaba-and-ship-to-nigeria-safely-in-2026',
                    ],
                    [
                      'Alibaba vs 1688 for Nigerians',
                      '/blog/alibaba-vs-1688-which-is-better-for-nigerian-importers-in-2026',
                    ],
                    [
                      'Paying Chinese suppliers safely',
                      '/blog/how-to-pay-chinese-suppliers-from-nigeria-safely-in-2026',
                    ],
                    [
                      'Cost of shipping to Nigeria',
                      '/blog/cost-of-shipping-from-china-to-nigeria-in-2026-air-sea-express-breakdown',
                    ],
                  ].map(([title, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-[var(--si-surface)] p-4 transition hover:border-brand-orange-500/50 hover:bg-white/10"
                    >
                      <span className="font-medium text-slate-200 transition-colors group-hover:text-brand-orange-300">
                        {title}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-orange-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- NATIVE ACCORDION FAQS --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-medium tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Buying from China FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200 bg-[var(--si-surface)] shadow-sm dark:border-slate-800 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium text-slate-950 outline-none transition hover:text-brand-orange-500 dark:text-white dark:hover:text-brand-orange-400">
                    <span>{renderFaqQuestion(faq.question)}</span>
                    <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--si-surface)] transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 leading-relaxed text-slate-600 dark:text-slate-400">
                    <p>{renderFaqAnswer(faq.question, faq.answer)}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
