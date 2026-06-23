import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  FileSearch,
  Globe2,
  PackageCheck,
  Route,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Truck,
  Warehouse,
  Weight,
  Info,
  Lock,
  Link as LinkIcon
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JsonLdScript } from '@/components/seo/JsonLd';
import PublicShippingOnlyFlow from './components/PublicShippingOnlyFlow';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/ship-with-us`;
const paySupplierHref = '/auth/login?next=%2Fdashboard%2Fpay-supplier%2Fcreate';

export const metadata: Metadata = {
  title: 'Ship From China to Nigeria After Buying Goods | Sure Imports',
  description:
    'Already bought from a Chinese supplier? Ship with Sure Imports. Send goods to our China warehouse for shipping-only logistics, consolidation, optional verification and delivery to Nigeria.',
  keywords: [
    'ship from China to Nigeria',
    'shipping from China to Nigeria',
    'China warehouse Nigeria shipping',
    'ship goods from China to Nigeria',
    'shipping agent from China to Nigeria',
    'China to Nigeria logistics',
    'consolidate goods in China',
    'Sure Imports ship with us',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Ship From China to Nigeria After Buying Goods',
    description:
      'Send goods from your Chinese supplier to the Sure Imports China warehouse. We coordinate shipping-only logistics, consolidation and delivery to Nigeria.',
    url: pageUrl,
    siteName: 'Sure Imports',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sure Imports China to Nigeria shipping service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ship From China to Nigeria After Buying Goods',
    description:
      'Shipping-only logistics for Nigerian importers who already bought goods from Chinese suppliers.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

const workflow = [
  {
    title: 'Create your shipment request',
    text: 'Tell us the destination, estimated weight, shipment label name, tracking details and what your supplier is sending.',
    icon: ClipboardCheck,
  },
  {
    title: 'Supplier sends to our warehouse',
    text: 'Your supplier ships the goods to the China warehouse details provided for your request.',
    icon: Warehouse,
  },
  {
    title: 'Warehouse intake and checks',
    text: 'We match the shipment to your request and can support consolidation or basic product verification if selected.',
    icon: ShieldCheck,
  },
  {
    title: 'Shipping route is confirmed',
    text: 'Your shipment moves through the selected shipping plan based on destination, weight, category and route availability.',
    icon: Route,
  },
  {
    title: 'Delivery updates continue',
    text: 'Your dashboard keeps the record tied to your account so you can follow payment, tracking and delivery progress.',
    icon: Truck,
  },
];

const bestFor = [
  'You already paid or arranged payment with a Chinese supplier',
  'Your goods are ready to be sent to a China warehouse',
  'You need consolidation from multiple suppliers',
  'You want optional product verification before shipping',
  'You need a dashboard record for shipment tracking',
  'You want China-to-Nigeria logistics without full sourcing support',
];

const checks = [
  'Supplier tracking number or expected dispatch date',
  'Correct shipment label/name for warehouse matching',
  'Estimated gross weight in kilograms',
  'Product category, quantity and any restricted-item details',
  'Whether goods contain batteries, liquids, powders or fragile items',
  'Destination country, delivery address and preferred shipping plan',
];

const relatedServices = [
  {
    title: 'Buy From Chinese Websites',
    text: 'Use this when you still need Sure Imports to help process product links from 1688, Taobao, Alibaba or Pinduoduo.',
    href: '/buy-from-chinese-websites',
    icon: ShoppingCart,
  },
  {
    title: 'Corporate Sourcing',
    text: 'Use this for branded gifts, custom products, staff kits and bulk procurement that requires supplier comparison.',
    href: '/corporate-gifts',
    icon: BadgeCheck,
  },
  {
    title: 'Pay Supplier',
    text: 'Use this after signing in when you already have a confirmed supplier and mainly need supplier payment support.',
    href: paySupplierHref,
    icon: CreditCard,
  },
  {
    title: 'Shop',
    text: 'Use the shop for available phones, laptops and gadgets already listed by Sure Imports.',
    href: '/shop',
    icon: PackageCheck,
  },
];

const faqs = [
  {
    question: 'What is Ship With Us?',
    answer:
      'Ship With Us is Sure Imports shipping-only service for customers who already bought or arranged goods from a Chinese supplier and need logistics from China to Nigeria or another supported destination.',
  },
  {
    question: 'Can my supplier send goods directly to your China warehouse?',
    answer:
      'Yes. After creating a shipment request, your supplier can send the goods to the China warehouse details tied to your request. Use the correct shipment label so the warehouse can match the goods properly.',
  },
  {
    question: 'Is this the same as Buy From Chinese Websites?',
    answer:
      'No. Buy From Chinese Websites is for link-based purchases where Sure Imports helps process the order. Ship With Us is for goods you already bought or arranged with your supplier.',
  },
  {
    question: 'Can you consolidate goods from multiple suppliers?',
    answer:
      'Yes. If selected, consolidation support helps combine eligible shipments from multiple suppliers before international shipping. Timing depends on when all supplier packages arrive at the warehouse.',
  },
  {
    question: 'Can you verify products before shipping?',
    answer:
      'Basic product verification can be requested, but it is not the same as full supplier sourcing or factory inspection. Tell us what needs to be checked before dispatch.',
  },
  {
    question: 'What details do I need before submitting a shipment request?',
    answer:
      'You should provide contact details, destination, shipment name, estimated gross weight, supplier tracking number if available, shipping plan and clear notes about what is inside the shipment.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ship From China to Nigeria',
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
  serviceType: 'China to Nigeria shipping-only logistics',
  description:
    'Shipping-only logistics service for customers who already bought goods from Chinese suppliers and need warehouse intake, consolidation, optional verification, shipping and delivery support.',
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

const inlineLinkClass =
  'font-bold text-brand-orange-600 underline decoration-brand-orange-300 underline-offset-4 transition hover:text-brand-orange-700 dark:text-brand-orange-400 dark:decoration-brand-orange-500/60 dark:hover:text-brand-orange-300';

export default function ShipWithUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfd] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-brand-orange-500/30">
      <JsonLdScript data={[serviceSchema, faqSchema]} />
      <Navbar />
      <main className="flex-1">
        
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-slate-950 pb-20 pt-36 text-white md:pb-28 md:pt-44">
          <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px] pointer-events-none" />
          
          <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md">
                <Ship className="h-4 w-4" />
                Shipping-only logistics
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[64px]">
                Ship goods from China to Nigeria <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-400 to-amber-300">after buying.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                Already bought goods from 1688, Alibaba, Taobao or a private Chinese supplier? Send them to our China warehouse and let Sure Imports handle shipping, consolidation, and delivery.
              </p>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#start-shipment"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-brand-orange-500 px-8 text-sm font-bold text-white transition-all hover:bg-brand-orange-600 hover:scale-[1.02] shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Shipment Request <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
                <Link
                  href="/tools/air-vs-sea-calculator"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
                >
                  Compare Air vs Sea
                </Link>
              </div>
            </div>

            {/* Hero Stats Grid */}
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: 'Best for', value: 'Goods already bought', icon: PackageCheck },
                { label: 'Options', value: 'Consolidation & tracking', icon: ShieldCheck },
                { label: 'Routes', value: 'China warehouse to destination', icon: Truck },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:bg-white/[0.06] hover:border-brand-orange-500/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange-500/20 text-brand-orange-400 transition-colors group-hover:bg-brand-orange-500 group-hover:text-white">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-base font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- WHY USE THIS SERVICE --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                For self-procured goods
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                Use Ship With Us when sourcing is already handled.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Ship With Us is for importers who already have goods with a Chinese supplier and need the logistics handled properly. It is not a product sourcing request, and it is not a shopping service. Your supplier sends the goods to our China warehouse, then we help move the shipment.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                If you still need Sure Imports to buy from a Chinese website, use{' '}
                <Link href="/buy-from-chinese-websites" className={inlineLinkClass}>
                  Buy From Chinese Websites
                </Link>
                . If you need branded procurement, use{' '}
                <Link href="/corporate-gifts" className={inlineLinkClass}>
                  Corporate Sourcing
                </Link>
                . If you need payment support, use{' '}
                <Link href={paySupplierHref} className={inlineLinkClass}>
                  Pay Supplier
                </Link>
                .
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bestFor.map((item) => (
                <div key={item} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange-50 dark:bg-brand-orange-500/10 text-brand-orange-500">
                        <CheckCircle2 className="h-5 w-5" />
                     </div>
                     <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300 pt-2">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- WORKFLOW TIMELINE --- */}
        <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl mx-auto text-center">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Shipping workflow
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl leading-tight">
                From supplier dispatch to delivery support.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Good shipping starts before the supplier dispatches. The shipment name, tracking details, product category and weight estimate help prevent warehouse matching problems and routing delays.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {workflow.map((step, index) => (
                <div key={step.title} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60">
                  <span className="absolute right-4 top-2 text-5xl font-black text-slate-100 dark:text-white/[0.03] pointer-events-none">
                    {index + 1}
                  </span>
                  <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500 dark:bg-brand-orange-500/10">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative text-base font-black text-slate-950 dark:text-white">{step.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CHECKS & PLANNING BENTO --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            
            {/* Checklist Box */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-50 dark:bg-slate-800 text-brand-orange-500 mb-6">
                  <FileSearch className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Details to confirm before shipping.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  The most common shipping problems start with unclear shipment identity. Confirm the basics before goods leave your supplier.
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

            {/* Warnings Box */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/30 md:p-12">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-brand-orange-500 mb-6 border border-slate-200 dark:border-slate-700">
                  <Weight className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Weight, category and route affect the final process.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  Goods with batteries, liquids, powders, fragile parts or unusually large dimensions may require extra handling. Clear notes help avoid delayed warehouse decisions.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {['Batteries included', 'Liquids or Creams', 'Powders', 'Fragile goods'].map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/tools/air-vs-sea-calculator"
                  className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Estimate Air vs Sea Route
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* --- APP-LIKE ORDER FORM WIDGET --- */}
        <section
          id="start-shipment"
          className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-[#080b14]"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-orange-500/5 blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
               <div>
                 <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/20 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-600 dark:text-brand-orange-400">
                    <LinkIcon className="h-4 w-4" />
                    Logistics Portal
                 </div>
                 <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                   Submit your shipping request.
                 </h2>
                 <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                   Add your contact details, shipment name, destination, estimated weight and shipment notes. If you already have supplier tracking, include it now.
                 </p>
               </div>

               <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950 dark:text-white">
                        Secure shipment handoff
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Your request creates a dashboard shipment record before payment and delivery updates.
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
                    <span className="truncate">my.sureimports.com/ship</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <PublicShippingOnlyFlow />
              </div>
              
              <div className="border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 dark:border-slate-800/50 dark:bg-slate-950/50">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2"><Warehouse className="h-4 w-4 text-emerald-500"/> China Warehouse Intake</span>
                  <span className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-blue-500"/> Optional Verification</span>
                  <span className="flex items-center gap-2"><Route className="h-4 w-4 text-brand-orange-500"/> Global Routing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- RELATED SERVICES --- */}
        <section className="bg-slate-950 py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-400">
                Related services
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Choose the right Sure Imports route.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                Ship With Us is best when the goods are already purchased. Use a different route if you still need help buying, sourcing, paying a supplier or choosing ready products.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-brand-orange-500/50 hover:bg-white/[0.08]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-orange-300 group-hover:bg-brand-orange-500 group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- NATIVE ACCORDION FAQS --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Ship With Us FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-bold text-slate-950 dark:text-white outline-none transition hover:text-brand-orange-500 dark:hover:text-brand-orange-400">
                    <span>{faq.question}</span>
                    <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition group-open:rotate-180 dark:bg-slate-800">
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 leading-relaxed text-slate-600 dark:text-slate-400">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
