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
  ShoppingCart,
  Truck,
  ChevronDown,
  Info,
  CheckCircle2,
  Link as LinkIcon,
  Lock
} from 'lucide-react';
import PublicOrderFlow from './components/PublicOrderFlow';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import { JsonLdScript } from '@/components/seo/JsonLd';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/buy-from-chinese-websites`;

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
  'Shipping plan, destination and delivery address',
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
      'You should provide product name, link, unit price, estimated weight, quantity, variants or notes, destination country, shipping plan and delivery address.',
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
        No. Buy From Chinese Websites is for link-based purchases where you want Sure Imports to help process the product order.{' '}
        <Link href={paySupplierHref} className={inlineServiceLinkClass}>
          Pay Supplier
        </Link>{' '}
        is for users who already have a confirmed supplier and mainly need supplier payment support after signing in.
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
        require careful specification and inspection. You can also browse available products directly from the{' '}
        <Link href="/shop" className={inlineServiceLinkClass}>
          Sure Imports shop
        </Link>
        .
      </>
    );
  }

  return answer;
}

export default function BuyFromChineseWebsitesPage() {
  return (
    <>
      <JsonLdScript data={[serviceSchema, faqSchema]} />
      <Header />
      <main className="min-h-screen bg-[#fcfcfd] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-brand-orange-500/30">
        
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-slate-950 pb-20 pt-36 text-white md:pb-28 md:pt-44">
          <PublicHeroBackground />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px]" />
          
          <div className="relative mx-auto flex max-w-[1440px] items-center justify-center px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center">
              <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-md">
                <ShoppingCart className="h-4 w-4" />
                Trusted China buying support
              </div>

              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
                Buy from Chinese websites with{' '}
                <span className="text-white">
                  confidence
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-300">
                Paste links from 1688, Alibaba, Taobao, and Pinduoduo. We handle the checkout, RMB supplier payments, shipping routes, and door-to-door delivery.
              </p>

              <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                <a
                  href="#start-order"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-brand-orange-500 px-8 text-base font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] hover:bg-brand-orange-600"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Order <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
                <Link
                  href="/blog/1688-vs-taobao-vs-alibaba-vs-aliexpress-best-china-website-for-nigerians"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10"
                >
                  Compare China Websites
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- SUPPORTED PLATFORMS BAR --- */}
        <section className="border-b border-slate-200 bg-white py-8 dark:border-slate-800/50 dark:bg-slate-900/50 overflow-hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
            <p className="shrink-0 text-xs font-black uppercase tracking-widest text-slate-400">
              Supported Websites:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {platforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 transition-colors hover:border-brand-orange-400"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* --- WHY USE THIS SERVICE --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Sourcing made clearer
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                Stop guessing your way through Chinese shopping websites.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Chinese websites have the best prices, but Nigerian buyers face language barriers, 
                RMB payment blocks, and complex logistics. We give you a structured way to submit 
                order details, checkout, and keep everything tied to a trackable record.
              </p>
            </div>

            {/* PROCESS TIMELINE */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
              {process.map((item, index) => (
                <div key={item.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 hover:-translate-y-1">
                  <span className="absolute -top-4 -right-4 text-8xl font-black text-slate-100 dark:text-white/[0.02] pointer-events-none transition-transform group-hover:scale-110">
                    {index + 1}
                  </span>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 dark:bg-brand-orange-500/10 text-brand-orange-500">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative text-xl font-bold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- APP-LIKE ORDER FORM WIDGET --- */}
        <section
          id="start-order"
          className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-[#080b14]"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-orange-500/5 blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
               <div>
                 <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/20 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-600 dark:text-brand-orange-400">
                    <LinkIcon className="h-4 w-4" />
                    Secure Submission Portal
                 </div>
                 <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                   Paste your product links here.
                 </h2>
                 <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                   Drop your links from 1688, Alibaba, or Taobao below. We'll verify the products, calculate shipping, and handle the RMB payments.
                 </p>
               </div>

               <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950 dark:text-white">
                        Secure checkout handoff
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Your submitted links move into a dashboard order record before payment.
                      </p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Secure App Wrapper */}
            <div className="mx-auto overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60 dark:shadow-none">
              <div className="border-b border-slate-200/80 bg-slate-100/60 px-5 py-4 dark:border-slate-800/50 dark:bg-slate-950/50 sm:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-300 dark:bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-amber-300 dark:bg-amber-500/70" />
                    <span className="h-3 w-3 rounded-full bg-emerald-300 dark:bg-emerald-500/70" />
                  </div>
                  <div className="inline-flex max-w-full items-center gap-2 rounded-lg bg-white/90 px-4 py-1.5 text-xs font-mono font-medium text-slate-500 shadow-sm dark:bg-slate-800/80 dark:text-slate-400">
                    <Lock className="h-3 w-3 shrink-0 text-emerald-500" />
                    <span className="truncate">my.sureimports.com/order</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <Suspense fallback={null}>
                  <PublicOrderFlow />
                </Suspense>
              </div>
              
              <div className="border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 dark:border-slate-800/50 dark:bg-slate-950/50">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500"/> Verified Suppliers</span>
                  <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-blue-500"/> Secure NGN Payment</span>
                  <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-brand-orange-500"/> End-to-End Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CHECKS & USE CASES BENTO --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            
            {/* Checklist Box */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-50 dark:bg-slate-800 text-brand-orange-500 mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  What to confirm before submitting
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  The better your product information, the easier it is to avoid wrong variants, incorrect quantities, and surprise shipping fees.
                </p>
              </div>
              <ul className="space-y-4">
                {checks.map((check) => (
                  <li key={check} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases Box */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/30 md:p-12">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-brand-orange-500 mb-6 border border-slate-200 dark:border-slate-700">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Best use cases for this service
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  Buy From Chinese Websites works best when you already have product links. For large custom branding projects, use{' '}
                  <Link href="/corporate-sourcing" className={inlineServiceLinkClass}>
                    Corporate Sourcing
                  </Link>
                  .
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {useCases.map((item) => (
                  <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm mb-2">
                      {item.title === 'Phones, laptops and gadgets' ? (
                        <Link href="/shop" className="transition hover:text-brand-orange-500">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.title === 'Product samples' ? (
                        <>
                          Small trial orders before committing to higher-volume sourcing, white label or{' '}
                          <Link href="/corporate-sourcing" className={inlineServiceLinkClass}>
                            corporate procurement
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
        <section className="bg-slate-950 py-20 text-white md:py-28 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-64 w-64 bg-brand-orange-500/20 blur-[100px] pointer-events-none" />
          
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500 flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4" /> Buyer Education
                </span>
                <h2 className="text-3xl font-black tracking-tight md:text-5xl leading-tight">
                  1688, Alibaba and Taobao are not the same experience.
                </h2>
                <div className="mt-6 space-y-6 text-lg leading-relaxed text-slate-400">
                  <p>
                    Alibaba is usually easier for export buyers because suppliers understand international orders. 
                    1688 offers stronger domestic wholesale pricing but is harder for Nigerian buyers due to language barriers and RMB payments.
                  </p>
                  <p>
                    The platform is only one part of the decision. A profitable import still needs correct product details, realistic landed cost calculations, and a structured shipping plan.
                  </p>
                </div>
              </div>
              
              <div className="rounded-[2rem] bg-white/5 border border-white/10 p-8 md:p-10 backdrop-blur-sm">
                <BadgeCheck className="h-10 w-10 text-brand-orange-400 mb-6" />
                <h3 className="text-2xl font-black mb-6">Useful guides before you buy</h3>
                <div className="grid gap-4">
                  {[
                    ['How to buy from 1688 safely', '/blog/how-to-buy-from-1688-and-ship-to-nigeria-safely'],
                    ['How to buy from Alibaba safely', '/blog/how-to-buy-from-alibaba-and-ship-to-nigeria-safely-in-2026'],
                    ['Alibaba vs 1688 for Nigerians', '/blog/alibaba-vs-1688-which-is-better-for-nigerian-importers-in-2026'],
                    ['Paying Chinese suppliers safely', '/blog/how-to-pay-chinese-suppliers-from-nigeria-safely-in-2026'],
                    ['Cost of shipping to Nigeria', '/blog/cost-of-shipping-from-china-to-nigeria-in-2026-air-sea-express-breakdown'],
                  ].map(([title, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 hover:border-brand-orange-500/50"
                    >
                      <span className="font-bold text-slate-200 group-hover:text-brand-orange-300 transition-colors">{title}</span>
                      <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-brand-orange-400 transition-transform group-hover:translate-x-1" />
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
            <h2 className="text-center text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl mb-12">
              Buying from China FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details 
                  key={faq.question} 
                  className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-bold text-slate-950 dark:text-white outline-none transition hover:text-brand-orange-500 dark:hover:text-brand-orange-400">
                    <span>{renderFaqQuestion(faq.question)}</span>
                    <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
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
