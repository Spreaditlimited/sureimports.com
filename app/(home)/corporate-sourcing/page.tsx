import ServiceHero from '@/components/home/ServiceHero';
import pageStyles from '@/components/home/PublicServicePage.module.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
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
  Laptop,
  Package,
  PenTool,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Info,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/(home)/components/Footer';
import TrustedOrganizations from '@/app/(home)/components/TrustedOrganizations';
import { JsonLdScript } from '@/components/seo/JsonLd';
import CorporateGiftsClient from './CorporateGiftsClient';
import {
  DEFAULT_CORPORATE_SOURCING_PRICE_NAIRA,
  DEFAULT_CORPORATE_SOURCING_PRICE_USD_CENTS,
} from '@/lib/corporateSourcing/pricing';
import workflowStyles from '@/components/home/Workflow.module.css';
import {
  LINESCOUT_BASE_URL,
  LINESCOUT_BULK_SOURCING_URL,
} from '@/lib/linescoutLinks';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/corporate-sourcing`;

export const metadata: Metadata = {
  title:
    'Corporate Procurement from China for Nigerian Organisations | Sure Imports',
  description:
    'Structured China procurement for banks, large companies, institutions, government bodies and NGOs. Sure Imports handles supplier search, verification, inspection, shipping and delivery to Nigeria.',
  keywords: [
    'corporate sourcing Nigeria',
    'corporate gifts from China Nigeria',
    'branded corporate gifts Nigeria',
    'promotional items from China',
    'institutional procurement from China',
    'enterprise procurement Nigeria',
    'industrial equipment sourcing Nigeria',
    'custom branded products Nigeria',
    'staff welcome kits Nigeria',
    'China sourcing agent Nigeria',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Corporate Procurement from China for Nigerian Organisations',
    description:
      'Structured China procurement for banks, large companies, institutions, government bodies and NGOs, with supplier checks, inspection and delivery.',
    url: pageUrl,
    siteName: 'Sure Imports',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/images/sure-imports-social-card.png`,
        width: 1200,
        height: 630,
        alt: 'Sure Imports corporate sourcing from China',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Procurement from China for Nigerian Organisations',
    description:
      'Formal China procurement support for established Nigerian organisations and institutional buyers.',
    images: [`${baseUrl}/images/sure-imports-social-card.png`],
  },
};

const productCategories = [
  {
    title: 'Machinery and equipment',
    text: 'Production, packaging, processing, agricultural and commercial machines sourced to match your required capacity, power and use case.',
    icon: Factory,
  },
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
];

const workflow = [
  {
    title: 'Share your brief',
    text: 'Send the product or machine name, intended use, specifications, quantity, reference files, budget range and delivery deadline.',
    icon: ClipboardCheck,
  },
  {
    title: 'Supplier search',
    text: 'We search China supplier options and compare specifications, production capacity, quality, minimum order quantity and pricing.',
    icon: Factory,
  },
  {
    title: 'Quote and approval',
    text: 'You receive a practical cost breakdown covering the product or machine, customization, inspection, shipping and local delivery.',
    icon: FileSearch,
  },
  {
    title: 'Specification and sample checks',
    text: 'Machine configurations, technical documents, artwork, samples or production proofs are reviewed where the order requires it.',
    icon: PenTool,
  },
  {
    title: 'Inspection and shipping',
    text: 'We help check the order before dispatch, coordinate shipping from China and keep the procurement record clear.',
    icon: ShieldCheck,
  },
  {
    title: 'Delivery support',
    text: 'Your order is delivered with updates so your team can plan installation, operations, distribution, events or launches.',
    icon: Truck,
  },
];

const buyerChecks = [
  'Product or machine type, quantity and intended business use',
  'Required capacity, output, power, voltage, dimensions or model',
  'Logo files, brand colors, customization or packaging requirements',
  'Target unit budget and delivery deadline',
  'Preferred material, size, model or finish',
  'Delivery deadline, installation plan, event date or campaign timeline',
  'Whether you need samples, testing or technical documentation',
];

const serviceLinks = [
  {
    title: 'LineScout Sourcing',
    text: 'Individuals and small businesses can manage white-label, wholesale product and machine sourcing projects in LineScout.',
    href: LINESCOUT_BULK_SOURCING_URL,
    icon: Package,
  },
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
];

const faqs = [
  {
    question: 'What is corporate sourcing?',
    answer:
      'Corporate sourcing is a structured procurement service for established organisations buying from China. Sure Imports supports formal briefs, supplier comparison, verification, customization, inspection, shipping, delivery and the records needed for internal review.',
  },
  {
    question: 'Can Sure Imports source machines and equipment for my business?',
    answer:
      "Yes. We can source production, packaging, processing, agricultural and other commercial machinery from China. Share the machine's intended use, required capacity, power or voltage, preferred model and delivery location so we can compare suitable suppliers and configurations.",
  },
  {
    question: 'Can Sure Imports source branded corporate gifts from China?',
    answer:
      'Yes. Sure Imports helps Nigerian businesses source branded corporate gifts and promotional products from China, including supplier search, product comparison, logo branding, packaging, shipping and delivery support.',
  },
  {
    question: 'Is this service only for large companies?',
    answer:
      'This service is designed for banks, large companies, established institutions, government bodies and NGOs with formal procurement requirements. Individuals, entrepreneurs and small businesses sourcing white-label products, bulk stock or machines should use LineScout instead.',
  },
  {
    question: 'Can I request samples before bulk production?',
    answer:
      'Yes. For many custom products, sample or proof review is recommended before full production. Sample feasibility depends on the product type, supplier policy, production timeline and budget.',
  },
  {
    question: 'How early should I start a corporate sourcing order?',
    answer:
      'Start as early as possible. Allow at least eight to twelve weeks for supplier checks, customization or production, inspection, international shipping and delivery. Complex or made-to-order machines may require a longer timeline.',
  },
  {
    question: 'What if I already have a supplier?',
    answer:
      'If your organisation already has a supplier and only needs payment support, use Pay Supplier after signing in. If you need a structured supplier comparison, verification, production oversight and delivery process, use Corporate Sourcing.',
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
  serviceType: 'Institutional and enterprise procurement from China',
  description:
    'Corporate procurement service for Nigerian banks, large companies, institutions, government bodies and NGOs buying from China.',
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
      <main className={pageStyles.page} data-si-page-theme="service">
        {/* --- HERO SECTION --- */}
        <ServiceHero
          eyebrow="Corporate sourcing"
          title="China procurement for your organisation."
          description="Structured sourcing for banks, companies, institutions, government bodies and NGOs. Bring specifications, approvals, inspection and delivery into one coordinated process."
          summaryTitle="Built around your procurement brief."
          primary={{
            href: '#corporate-sourcing-form',
            label: 'Start a sourcing request',
          }}
          secondary={{
            href: LINESCOUT_BASE_URL,
            label: 'Small business? Use LineScout',
          }}
          steps={[
            {
              title: 'Define your requirements',
              description:
                'Share specifications, quantities, budget and delivery needs.',
            },
            {
              title: 'Review your options',
              description:
                'Work through supplier selection, samples and approvals.',
            },
            {
              title: 'Coordinate fulfilment',
              description:
                'Arrange inspection, shipping and delivery with our team.',
            },
          ]}
        />

        <TrustedOrganizations />

        {/* --- CATEGORIES BENTO --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <span className="text-xs font-medium uppercase tracking-widest text-brand-orange-500">
                Built for business buying
              </span>
              <h2 className="mt-4 text-3xl font-medium leading-tight tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Procurement that can stand up to organisational scrutiny.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Institutional procurement can involve technical specifications,
                production capacity, exact quantities, firm deadlines,
                customization, internal approvals and several stakeholders. We
                keep the supplier and order process clear enough for your team
                to review and act on.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productCategories.map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[var(--si-surface)] p-8 shadow-sm transition-all hover:shadow-none dark:border-slate-800"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 text-brand-orange-500 dark:bg-brand-orange-500/10">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- WORKFLOW TIMELINE --- */}
        <section
          className={`${workflowStyles.workflow} relative overflow-hidden py-20 md:py-28`}
        >
          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <span
                className={`${workflowStyles.accent} text-xs font-medium uppercase tracking-widest`}
              >
                How it works
              </span>
              <h2 className="mt-4 text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                A sourcing workflow your team can actually follow.
              </h2>
              <p
                className={`${workflowStyles.copy} mt-6 text-lg leading-relaxed`}
              >
                The goal isn't just a low price. It is the right product or
                machine, correct specifications and quantity, and a clear landed
                cost before a single Naira is committed.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className={`${workflowStyles.card} relative rounded-2xl border p-8`}
                >
                  <span
                    className={`${workflowStyles.number} pointer-events-none absolute right-6 top-6 text-6xl font-medium`}
                  >
                    {index + 1}
                  </span>
                  <div
                    className={`${workflowStyles.icon} mb-6 flex h-12 w-12 items-center justify-center rounded-xl border`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-medium">{step.title}</h3>
                  <p
                    className={`${workflowStyles.copy} mt-3 text-sm leading-relaxed`}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CHECKS & PLANNING BENTO --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {/* Checklist Box */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[var(--si-surface)] p-8 shadow-sm dark:border-slate-800 md:p-12">
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-500 dark:bg-slate-800">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-medium tracking-tight text-slate-950 dark:text-white">
                  What to prepare before requesting a quote
                </h2>
                <p className="mb-8 mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Clear briefs produce accurate quotes. Send context so we
                  compare suppliers based on what you actually need, not just
                  vague estimates.
                </p>
              </div>
              <ul className="space-y-4">
                {buyerChecks.map((check) => (
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

            {/* Timeline Box */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[var(--si-surface)] p-8 shadow-sm dark:border-slate-800 md:p-12">
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-[var(--si-surface)] text-brand-orange-500 dark:border-slate-700">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-medium tracking-tight text-slate-950 dark:text-white">
                  Start early for machinery, campaigns and custom orders.
                </h2>
                <p className="mb-8 mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Corporate orders may involve technical confirmation, supplier
                  checks, samples or testing, production and shipping. Starting
                  early protects your operational or campaign timeline.
                </p>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium leading-relaxed text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  <Info className="mb-1 mr-2 inline-block h-4 w-4" />
                  Allow at least 8 to 12 weeks; complex or made-to-order
                  machines may require longer.
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    'Machine specifications',
                    'Custom packaging',
                    'Production proofing',
                    'Export inspection',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-[var(--si-surface)] p-4 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FORM SECTION --- */}
        <section
          id="corporate-sourcing-form"
          className="border-y border-slate-200 bg-[var(--si-surface)] py-20 dark:border-slate-800 md:py-28"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-brand-orange-500">
                Request a quote
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Submit your organisation&apos;s procurement brief.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Share the organisation name, product or equipment details,
                specifications, quantity, approval timeline and any
                customization requirements. This route is intended for
                established organisations with formal procurement needs. Please
                note that a{' '}
                <strong className="font-medium text-slate-900 dark:text-white">
                  ₦50,000 or $50 research fee
                </strong>{' '}
                is required before we begin identifying the most suitable
                manufacturer. This fee is{' '}
                <strong className="font-medium text-slate-900 dark:text-white">
                  fully credited toward your procurement
                </strong>{' '}
                if you proceed with your order.
              </p>
            </div>
            <div className="mx-auto max-w-4xl">
              <CorporateGiftsClient
                researchFee={{
                  priceNaira: DEFAULT_CORPORATE_SOURCING_PRICE_NAIRA,
                  priceUsdCents: DEFAULT_CORPORATE_SOURCING_PRICE_USD_CENTS,
                }}
              />
            </div>
          </div>
        </section>

        {/* --- RELATED SERVICES --- */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="text-xs font-medium uppercase tracking-widest text-brand-orange-500">
                Related services
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Choose the right route for your order.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Corporate Sourcing is for established organisations with formal
                procurement requirements. Individuals and small businesses
                sourcing white-label products, wholesale stock or machines
                should manage those projects in LineScout.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {serviceLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-[var(--si-surface)] p-6 transition-all hover:border-brand-orange-300 hover:shadow-lg dark:border-slate-800"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--si-surface)] text-brand-orange-500 group-hover:bg-brand-orange-50 dark:group-hover:bg-brand-orange-500/10">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- NATIVE ACCORDION FAQS --- */}
        <section className="si-dark-surface bg-[#15171c] py-20 text-white md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-medium tracking-tight md:text-4xl">
              Corporate sourcing FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-white/10 bg-[var(--si-surface)] [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium outline-none transition hover:text-brand-orange-400">
                    {faq.question}
                    <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--si-surface)] transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 leading-relaxed text-slate-400">
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
