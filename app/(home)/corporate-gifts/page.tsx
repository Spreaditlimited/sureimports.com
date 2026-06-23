import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Factory,
  FileSearch,
  Gift,
  Globe,
  Laptop,
  MessageSquare,
  Package,
  PackageCheck,
  PenTool,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UploadCloud,
  Info
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/(home)/components/Footer';
import { JsonLdScript } from '@/components/seo/JsonLd';
import CorporateGiftsClient from './CorporateGiftsClient';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/corporate-gifts`;

export const metadata: Metadata = {
  title: 'Corporate Sourcing from China for Nigerian Businesses | Sure Imports',
  description:
    'Source branded corporate gifts, promotional items, staff kits and bulk custom products from China. Sure Imports handles supplier search, branding, inspection, shipping and delivery to Nigeria.',
  keywords: [
    'corporate sourcing Nigeria',
    'corporate gifts from China Nigeria',
    'branded corporate gifts Nigeria',
    'promotional items from China',
    'bulk product sourcing from China',
    'custom branded products Nigeria',
    'staff welcome kits Nigeria',
    'China sourcing agent Nigeria',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Corporate Sourcing from China for Nigerian Businesses',
    description:
      'Source branded gifts, promotional items, staff kits and bulk custom products from China with supplier checks, branding support, inspection and delivery.',
    url: pageUrl,
    siteName: 'Sure Imports',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sure Imports corporate sourcing from China',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Sourcing from China for Nigerian Businesses',
    description:
      'Branded corporate gifts, promotional items, staff kits and bulk custom products sourced from China for Nigerian businesses.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

const clients = [
  {
    name: 'Moppet',
    src: '/Moppet.PNG',
    frameClass: 'h-20 w-[190px] sm:h-24 sm:w-[220px] lg:h-24 lg:w-[230px] xl:h-28 xl:w-[280px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'Microware',
    src: '/Microware_dark.PNG',
    frameClass: 'h-20 w-[210px] sm:h-24 sm:w-[240px] lg:h-24 lg:w-[250px] xl:h-28 xl:w-[310px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'Sterling',
    src: '/Sterling.PNG',
    frameClass: 'h-20 w-[190px] sm:h-24 sm:w-[220px] lg:h-24 lg:w-[230px] xl:h-28 xl:w-[280px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'CafeOne',
    src: '/cafe-one-dark-transparent.png',
    frameClass: 'h-20 w-[170px] sm:h-24 sm:w-[190px] lg:h-24 lg:w-[200px] xl:h-28 xl:w-[240px]',
    imageClass: 'object-cover object-center',
  },
];

const marqueeClients = [...clients, ...clients];
const logoSlotClass = 'flex w-[280px] shrink-0 items-center justify-center';

const productCategories = [
  {
    title: 'Branded corporate gifts',
    text: 'Mugs, flasks, notebooks, pens, umbrellas, gift boxes and executive items customized with your company identity.',
    icon: Gift,
  },
  {
    title: 'Promotional merchandise',
    text: 'Event giveaways, conference items, campaign products, lanyards, wristbands, keyholders and activation materials.',
    icon: BadgeCheck,
  },
  {
    title: 'Staff and client kits',
    text: 'Welcome boxes, onboarding packs, remote-work kits, holiday hampers and appreciation gifts built to a clear budget.',
    icon: Briefcase,
  },
  {
    title: 'Tech and office products',
    text: 'Power banks, USB drives, speakers, wireless accessories, desk organizers and practical branded office tools.',
    icon: Laptop,
  },
  {
    title: 'Custom packaging',
    text: 'Boxes, sleeves, labels, inserts and branded packaging that make the final delivery feel complete and consistent.',
    icon: Package,
  },
  {
    title: 'Bulk business products',
    text: 'Repeatable items for schools, teams, retailers, churches, agencies, ecommerce operators and corporate departments.',
    icon: PackageCheck,
  },
];

const workflow = [
  {
    title: 'Share your brief',
    text: 'Send product ideas, reference photos, quantity, brand assets, budget range, delivery deadline and preferred finish.',
    icon: ClipboardCheck,
  },
  {
    title: 'Supplier search',
    text: 'We search China supplier options, compare product quality, minimum order quantity, branding method and pricing.',
    icon: Factory,
  },
  {
    title: 'Quote and approval',
    text: 'You receive a practical cost breakdown covering item cost, branding, packaging, inspection, shipping and local delivery.',
    icon: FileSearch,
  },
  {
    title: 'Branding and sample checks',
    text: 'Artwork, mockups, samples or production proofs are reviewed before full production where the order requires it.',
    icon: PenTool,
  },
  {
    title: 'Inspection and shipping',
    text: 'We help check the order before dispatch, coordinate shipping from China and keep the procurement record clear.',
    icon: ShieldCheck,
  },
  {
    title: 'Delivery support',
    text: 'Your items are delivered with updates so your team can plan distribution, events, launches or client gifting.',
    icon: Truck,
  },
];

const buyerChecks = [
  'Product type, quantity and expected use case',
  'Logo files, brand colors and packaging requirements',
  'Target unit budget and delivery deadline',
  'Preferred material, size, model or finish',
  'Event date, distribution plan or campaign timeline',
  'Whether you need samples before production',
];

const serviceLinks = [
  {
    title: 'Buy from Chinese Websites',
    text: 'Already found product links on 1688, Alibaba, Taobao or Pinduoduo? Submit them directly.',
    href: '/buy-from-chinese-websites',
    icon: ShoppingCart,
  },
  {
    title: 'Pay Supplier',
    text: 'Already have a confirmed supplier and invoice? Sign in to use Pay Supplier from your dashboard.',
    href: '/auth/login?next=%2Fdashboard%2Fpay-supplier%2Fcreate',
    icon: CreditCard,
  },
  {
    title: 'Laptops for Business',
    text: 'Need business laptops for staff, schools, resellers or company deployment?',
    href: '/laptops-for-business',
    icon: Laptop,
  },
  {
    title: 'Sure Imports Shop',
    text: 'For available phones, laptops and gadgets, browse products already listed in the shop.',
    href: '/shop',
    icon: PackageCheck,
  },
];

const faqs = [
  {
    question: 'What is corporate sourcing?',
    answer:
      'Corporate sourcing is the process of finding, verifying, customizing, inspecting and importing products for business use. For Sure Imports, this commonly includes branded corporate gifts, promotional items, staff kits, event merchandise and bulk custom products from China.',
  },
  {
    question: 'Can Sure Imports source branded corporate gifts from China?',
    answer:
      'Yes. Sure Imports helps Nigerian businesses source branded corporate gifts and promotional products from China, including supplier search, product comparison, logo branding, packaging, shipping and delivery support.',
  },
  {
    question: 'Is this service only for large companies?',
    answer:
      'No. Corporate sourcing works for companies, agencies, schools, churches, event teams, ecommerce brands, NGOs, startups and departments that need products in bulk or with custom branding.',
  },
  {
    question: 'Can I request samples before bulk production?',
    answer:
      'Yes. For many custom products, sample or proof review is recommended before full production. Sample feasibility depends on the product type, supplier policy, production timeline and budget.',
  },
  {
    question: 'How early should I start a corporate sourcing order?',
    answer:
      'Start as early as possible, especially for festive campaigns, conferences and branded gifts. Eight to twelve weeks is safer for custom production, packaging, international shipping and final delivery.',
  },
  {
    question: 'What if I already have a supplier?',
    answer:
      'If you already have a supplier and only need payment support, use Pay Supplier after signing in. If you need us to compare options, verify supplier fit, manage branding and coordinate the import, use Corporate Sourcing.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Corporate Sourcing from China',
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
  serviceType: 'Corporate sourcing, branded merchandise procurement and bulk product sourcing from China',
  description:
    'Corporate sourcing service for Nigerian businesses that need branded gifts, promotional items, staff kits and bulk custom products sourced from China.',
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

export default function CorporateGiftsPage() {
  return (
    <>
      <JsonLdScript data={[serviceSchema, faqSchema]} />
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfd] text-slate-950 antialiased dark:bg-slate-950 dark:text-white selection:bg-brand-orange-500/30">
        
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-slate-950 pb-20 pt-36 text-white md:pb-28 md:pt-44">
          <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px] pointer-events-none" />
          
          <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md">
                <Briefcase className="h-4 w-4" />
                Corporate Sourcing
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[64px]">
                Corporate gifts and bulk products <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-400 to-amber-300">sourced from China.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                Sure Imports helps Nigerian businesses source branded gifts, promotional items, and staff kits. We handle supplier checks, branding, inspection, and door-to-door delivery.
              </p>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#corporate-gifts-form"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-brand-orange-500 px-8 text-sm font-bold text-white transition-all hover:bg-brand-orange-600 hover:scale-[1.02] shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start a Sourcing Request <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
                <Link
                  href="/buy-from-chinese-websites"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
                >
                  Submit Product Links
                </Link>
              </div>
            </div>

            {/* Hero Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: 'Best for', value: 'Branded gifts & staff kits', icon: Gift },
                { label: 'Built for', value: 'Companies, schools & agencies', icon: ShieldCheck },
                { label: 'Handled', value: 'Sourcing, branding & logistics', icon: Truck },
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

          <div className="relative mx-auto mt-14 max-w-[1440px] px-4 pt-6 sm:mt-16 sm:px-6 sm:pt-8 lg:mt-20 lg:px-8 lg:pt-10">
            <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
              Trusted by organizations across Nigeria
            </p>

            <div className="-mx-4 overflow-hidden sm:-mx-6 lg:hidden">
              <div className="mobile-logo-marquee flex w-max items-center gap-0 px-4 sm:px-6">
                {marqueeClients.map((client, index) => (
                  <div
                    key={`${client.name}-${index}`}
                    className={logoSlotClass}
                  >
                    <div className={`relative overflow-hidden ${client.frameClass}`}>
                      <Image
                        src={client.src}
                        alt={client.name}
                        fill
                        sizes="280px"
                        className={client.imageClass}
                        quality={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden w-full grid-cols-4 place-items-center gap-5 lg:grid xl:gap-6">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="flex w-full items-center justify-center"
                >
                  <div className={`relative max-w-full overflow-hidden ${client.frameClass}`}>
                    <Image
                      src={client.src}
                      alt={client.name}
                      fill
                      sizes="25vw"
                      className={client.imageClass}
                      quality={100}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CATEGORIES BENTO --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Built for business buying
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                Source branded products without gambling on random suppliers.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Corporate sourcing isn't casual shopping. It involves exact quantities, firm deadlines, strict logo placement, and internal approvals. A bad supplier can miss your event, botch your brand colors, or ship inferior materials.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productCategories.map((item) => (
                <div key={item.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 hover:-translate-y-1">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 dark:bg-brand-orange-500/10 text-brand-orange-500">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- WORKFLOW TIMELINE --- */}
        <section className="bg-slate-950 py-20 text-white md:py-28 relative overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-brand-orange-500/10 blur-[120px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-400">
                How it works
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl leading-tight">
                A sourcing workflow your team can actually follow.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                The goal isn't just cheap products. The goal is the right item, accurate branding, correct quantity, and exact landed cost before a single Naira is committed.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workflow.map((step, index) => (
                <div key={step.title} className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition hover:bg-white/[0.04]">
                  <span className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] pointer-events-none">
                    {index + 1}
                  </span>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-brand-orange-400">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.text}</p>
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
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  What to prepare before requesting a quote
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  Clear briefs produce accurate quotes. Send context so we compare suppliers based on what you actually need, not just vague estimates.
                </p>
              </div>
              <ul className="space-y-4">
                {buyerChecks.map((check) => (
                  <li key={check} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline Box */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/30 md:p-12">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-brand-orange-500 mb-6 border border-slate-200 dark:border-slate-700">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Start early for campaigns and festive gifts.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  Corporate orders involve product search, artwork approval, sample review, production, and shipping. Starting early protects your event or gifting timeline.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold leading-relaxed text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  <Info className="inline-block h-4 w-4 mr-2 mb-1" />
                  For festive seasons and annual client gifting, plan 8 to 12 weeks ahead.
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {['Logo placement', 'Custom Packaging', 'Production proofing', 'Export Inspection'].map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- FORM SECTION --- */}
        <section id="corporate-gifts-form" className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/50 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
               <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                 Request a quote
               </span>
               <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                 Submit your sourcing brief.
               </h2>
               <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                 Share your product, quantity, deadline, and branding needs. Our team will review the details and contact you.
               </p>
             </div>
             <div className="mx-auto max-w-4xl">
               <CorporateGiftsClient />
             </div>
          </div>
        </section>

        {/* --- RELATED SERVICES --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Related services
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Choose the right route for your order.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Corporate Sourcing is best when you need supplier comparison and custom branding. Other Sure Imports services may fit better if your supplier is already decided.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {serviceLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-orange-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-brand-orange-500 group-hover:bg-brand-orange-50 dark:bg-slate-800 dark:group-hover:bg-brand-orange-500/10">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- NATIVE ACCORDION FAQS --- */}
        <section className="bg-slate-950 py-20 text-white md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-black tracking-tight md:text-5xl mb-12">
              Corporate sourcing FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details 
                  key={faq.question} 
                  className="group rounded-2xl border border-white/10 bg-white/5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-bold outline-none transition hover:text-brand-orange-400">
                    {faq.question}
                    <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                    <p>{faq.answer}</p>
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
