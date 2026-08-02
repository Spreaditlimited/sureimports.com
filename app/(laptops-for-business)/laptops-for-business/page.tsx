import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  GraduationCap,
  Laptop,
  MonitorCheck,
  PackageCheck,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  ChevronDown,
  Info
} from 'lucide-react';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import TrustedOrganizations from '@/app/(home)/components/TrustedOrganizations';
import { JsonLdScript } from '@/components/seo/JsonLd';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/laptops-for-business`;

export const metadata: Metadata = {
  title: 'Laptops for Business in Nigeria | Bulk Laptop Sourcing from China',
  description:
    'Source business laptops from China for Nigerian companies, schools, startups and resellers. Sure Imports handles supplier verification, inspection, shipping and delivery.',
  keywords: [
    'laptops for business Nigeria',
    'bulk laptops from China to Nigeria',
    'business laptop sourcing Nigeria',
    'buy laptops from China to Nigeria',
    'corporate laptop procurement Nigeria',
    'used laptops China Nigeria',
    'MacBooks for business Nigeria',
    'HP Dell Lenovo laptops Nigeria',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Laptops for Business in Nigeria | Sure Imports',
    description:
      'Bulk laptop sourcing, inspection and China-to-Nigeria delivery for businesses, schools, resellers and teams.',
    url: pageUrl,
    siteName: 'Sure Imports',
    images: [
      {
        url: `${baseUrl}/images/laptops.png`,
        width: 1200,
        height: 630,
        alt: 'Business laptops sourced by Sure Imports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laptops for Business in Nigeria | Sure Imports',
    description:
      'Source tested laptops from China for your Nigerian business, school or reseller operation.',
    images: [`${baseUrl}/images/laptops.png`],
  },
};

const laptopTypes = [
  'MacBook Air and MacBook Pro for executives, creators and development teams',
  'HP EliteBook, ProBook, ZBook, Spectre and Pavilion models',
  'Dell Latitude, XPS and Precision models for office and technical teams',
  'Lenovo ThinkPad, ThinkBook and Legion models for business and performance use',
  'Student laptops for schools, training centres and deployment programs',
  'Mixed-grade reseller batches with clear condition and specification records',
];

const inspectionChecks = [
  'Processor generation, RAM, SSD type and storage health',
  'Battery cycle count, battery health and charging performance',
  'Screen condition, brightness, dead pixels and pressure marks',
  'Keyboard, trackpad, hinges, ports, webcam, speakers and microphone',
  'Wi-Fi, Bluetooth, operating system, BIOS lock and charger compatibility',
  'Cosmetic grade, casing condition, packaging and accessory confirmation',
];

const audiences = [
  {
    icon: Building2,
    title: 'Companies',
    text: 'Procure consistent laptop batches for staff onboarding, operations, sales teams and remote work.',
  },
  {
    icon: GraduationCap,
    title: 'Schools',
    text: 'Source dependable laptops for computer labs, training centres, coding cohorts and student programs.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Resellers',
    text: 'Build laptop inventory with clearer grades, stronger inspection and better landed-cost control.',
  },
  {
    icon: Users,
    title: 'Teams',
    text: 'Equip design, engineering, support and admin teams with the right specification for their workload.',
  },
];

const process = [
  {
    icon: ClipboardCheck,
    title: 'Define the requirement',
    text: 'We clarify quantity, brand, processor, RAM, storage, condition, budget, warranty expectation and delivery timeline.',
  },
  {
    icon: ShieldCheck,
    title: 'Verify supply options',
    text: 'We compare supplier options, batch consistency, pricing, grade claims and inspection readiness before purchase.',
  },
  {
    icon: MonitorCheck,
    title: 'Inspect before shipping',
    text: 'Laptops are checked for technical condition, cosmetic grade, battery, ports, accessories and packaging.',
  },
  {
    icon: Truck,
    title: 'Ship to Nigeria',
    text: 'We coordinate China warehouse intake, freight, documentation guidance and delivery updates through the process.',
  },
];

const faqs = [
  {
    question: 'Can Sure Imports source laptops in bulk for Nigerian companies?',
    answer:
      'Yes. Sure Imports helps Nigerian companies, schools, resellers and teams source bulk laptops from China with supplier verification, inspection, shipping and delivery support.',
  },
  {
    question: 'Can I buy both used and brand new laptops?',
    answer:
      'Yes. We can support brand new, pre-owned and reseller-grade laptop batches, but the specification, grade and warranty expectations must be agreed before purchase.',
  },
  {
    question: 'Do you inspect laptops before shipping from China?',
    answer:
      'Yes. Inspection can include processor, RAM, SSD, battery, screen, keyboard, trackpad, ports, webcam, Wi-Fi, Bluetooth, charger, cosmetic grade and packaging checks.',
  },
  {
    question: 'Can I buy available laptops directly?',
    answer:
      'Yes. For ready products, use the Sure Imports shop. For custom company or bulk requirements, use the corporate sourcing route.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Business Laptop Sourcing from China to Nigeria',
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
  serviceType: 'Corporate laptop procurement and China sourcing',
  description:
    'Bulk laptop sourcing, supplier verification, inspection and China-to-Nigeria delivery for Nigerian businesses, schools, teams and resellers.',
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

export default function LaptopsForBusinessPage() {
  return (
    <>
      <JsonLdScript data={[serviceSchema, faqSchema]} />
      <Header />
      <main className="min-h-screen bg-[#fcfcfd] text-slate-950 dark:bg-slate-950 dark:text-white selection:bg-brand-orange-500/30">
        
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-slate-950 pb-20 pt-36 text-white md:pb-32 md:pt-44">
          <PublicHeroBackground />
          
          <div className="relative mx-auto flex max-w-[1440px] items-center justify-center px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center">
              <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <Laptop className="h-4 w-4" />
                Enterprise Hardware Sourcing
              </div>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
                Business laptops from China, <span className="text-white">verified before shipping</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                Sure Imports helps Nigerian businesses, schools, and resellers source bulk laptops from China. We handle supplier verification, strict technical inspections, and end-to-door delivery.
              </p>
              
              <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                <Link
                  href="/corporate-sourcing"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-brand-orange-500 px-8 text-base font-bold text-white transition-all hover:bg-brand-orange-600 hover:scale-[1.02] shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Request a Business Quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
                >
                  Browse Available Stock
                </Link>
              </div>
            </div>
          </div>
        </section>

        <TrustedOrganizations />

        {/* --- TRUST BAR --- */}
        <section className="border-b border-slate-200 bg-white py-10 dark:border-slate-800/50 dark:bg-slate-900/50">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {[
              { stat: 'Since 2018', desc: 'Import operations built around Nigerian buyers' },
              { stat: 'Bulk Ready', desc: 'Laptop batches for teams, schools and resellers' },
              { stat: 'Inspection Led', desc: 'Strict technical checks before China dispatch' },
            ].map((item) => (
              <div key={item.stat} className="flex items-center gap-4">
                <div className="h-10 w-1 rounded-full bg-brand-orange-500" />
                <div>
                  <p className="text-xl font-black text-slate-950 dark:text-white">{item.stat}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- AUDIENCES (Bento Grid) --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Built for procurement
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                Source laptops by specification, not by random supplier photos.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Buying laptops from China for a Nigerian business requires exactness. You need consistent
                model grades, verified battery health, standard keyboard layouts, and a landed
                cost that protects your bottom line.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {audiences.map((audience) => (
                <div
                  key={audience.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 hover:-translate-y-1"
                >
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-brand-orange-500/5 transition-transform group-hover:scale-150" />
                  <audience.icon className="relative h-8 w-8 text-brand-orange-500" />
                  <h3 className="relative mt-6 text-xl font-black text-slate-950 dark:text-white">
                    {audience.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {audience.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- WORKFLOW TIMELINE --- */}
        <section className="bg-slate-950 py-20 text-white md:py-28 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-brand-orange-500/10 blur-[120px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-400">
                Procurement workflow
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl leading-tight">
                A clear process before money leaves your account.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                The safest business laptop procurement starts with a written requirement. We help you
                define the brief, compare realistic supply options, and inspect the batch before shipping.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {process.map((item, index) => (
                <div key={item.title} className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-brand-orange-400">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] pointer-events-none">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CAPABILITIES (Split Cards) --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-orange-500 mb-6">
                  <Cpu className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Brands & Models we source
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  We support business laptop sourcing for teams that need
                  consistent specifications and resellers that need sellable grades.
                </p>
              </div>
              <ul className="space-y-4">
                {laptopTypes.map((type) => (
                  <li key={type} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{type}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/30 md:p-12">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-brand-orange-500 mb-6 border border-slate-200 dark:border-slate-700">
                  <BatteryCharging className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Our Inspection Protocol
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8">
                  Laptop sourcing fails when buyers only check the brand name. We check the parts that affect resale value and staff productivity.
                </p>
              </div>
              <ul className="space-y-4">
                {inspectionChecks.map((check) => (
                  <li key={check} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <PackageCheck className="h-5 w-5 shrink-0 text-brand-orange-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --- BUYING GUIDE BENTO --- */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500 flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4" /> Business buying guide
                </span>
                <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                  How to buy laptops from China for a Nigerian business.
                </h2>
                <div className="mt-6 space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  <p>
                    Start with the workload. A school may need durable, affordable
                    Windows laptops. A design agency may need MacBook Pros. A reseller may need a mixed batch with
                    reliable grades and fast-moving models.
                  </p>
                  <p>
                    After the workload is clear, define the processor generation,
                    RAM, storage, screen size, keyboard layout, and delivery
                    deadline. This protects you from supplier quotes that look
                    cheap but hide old processors or weak batteries.
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'Don’t buy by “Core i5” alone',
                    text: 'Processor generation matters. A newer Core i5 outperforms an older one and holds better resale value.',
                  },
                  {
                    title: 'Battery health is economics',
                    text: 'Weak batteries create support issues for teams and instantly reduce resale confidence for dealers.',
                  },
                  {
                    title: 'Keyboard layout matters',
                    text: 'US, UK and non-standard layouts heavily affect user comfort and buyer acceptance.',
                  },
                  {
                    title: 'Landed cost decides profit',
                    text: 'Supplier price, freight, customs, and local delivery must be calculated before you purchase.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Resources */}
            <div className="mt-16 rounded-[2rem] bg-slate-950 p-8 text-white md:p-12 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-64 w-64 bg-brand-orange-500/20 blur-[100px] pointer-events-none" />
              <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-center">
                <div>
                  <BadgeCheck className="h-10 w-10 text-brand-orange-400 mb-6" />
                  <h3 className="text-3xl font-black tracking-tight">
                    Laptop Import Resources
                  </h3>
                  <p className="mt-4 text-slate-400">Read our detailed guides on how to safely navigate Chinese electronics markets.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/blog/how-to-import-laptops-from-china-to-nigeria-safely"
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 hover:border-brand-orange-500/50"
                  >
                    <p className="font-bold text-slate-200 group-hover:text-brand-orange-300 transition-colors">Importing safely to Nigeria</p>
                  </Link>
                  <Link
                    href="/blog/how-to-safely-source-second-hand-iphones-and-laptops-from-china-without-losing-money-or-sleep"
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 hover:border-brand-orange-500/50"
                  >
                    <p className="font-bold text-slate-200 group-hover:text-brand-orange-300 transition-colors">Used iPhones & Laptops Guide</p>
                  </Link>
                  <Link
                    href="/blog/nigeria-customs-duty-on-goods-from-china-how-to-estimate-your-import-cost-in-2026"
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 hover:border-brand-orange-500/50"
                  >
                    <p className="font-bold text-slate-200 group-hover:text-brand-orange-300 transition-colors">Estimating Customs Duty</p>
                  </Link>
                  <Link
                    href="/blog/how-to-calculate-landed-cost-before-importing-from-china-to-nigeria"
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 hover:border-brand-orange-500/50"
                  >
                    <p className="font-bold text-slate-200 group-hover:text-brand-orange-300 transition-colors">Calculating Landed Cost</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTAS --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <Wrench className="mx-auto h-12 w-12 text-brand-orange-500 mb-6" />
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                Two ways to buy laptops through Sure Imports.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Use the shop for ready-to-ship available products. Use corporate
                sourcing when you need a specific batch, strict specifications, or a procurement quote for your team.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
              <Link
                href="/shop"
                className="group flex flex-col items-center text-center rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm transition-all hover:border-brand-orange-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Laptop className="h-8 w-8 text-brand-orange-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                  Browse the shop
                </h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Check available laptops, phones and gadgets already listed and ready for purchase.
                </p>
              </Link>
              
              <Link
                href="/corporate-sourcing"
                className="group flex flex-col items-center text-center rounded-[2.5rem] border-2 border-brand-orange-500 bg-brand-orange-50/50 p-10 shadow-md transition-all hover:bg-brand-orange-50 dark:border-brand-orange-500/50 dark:bg-brand-orange-500/5 dark:hover:bg-brand-orange-500/10"
              >
                <div className="h-16 w-16 rounded-2xl bg-brand-orange-100 dark:bg-brand-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BriefcaseBusiness className="h-8 w-8 text-brand-orange-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                  Request bulk sourcing
                </h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Submit a custom laptop requirement for your company, school, or reseller pipeline.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* --- NATIVE ACCORDION FAQS --- */}
        <section className="bg-slate-950 py-20 text-white md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-black tracking-tight md:text-5xl mb-12">
              Business laptop FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details 
                  key={faq.question} 
                  className="group rounded-2xl border border-white/10 bg-white/5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-bold outline-none transition hover:text-brand-orange-300">
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
