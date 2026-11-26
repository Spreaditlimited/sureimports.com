import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Navigation from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import ServiceHero from '@/components/home/ServiceHero';
import pageStyles from '@/components/home/PublicServicePage.module.css';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { LINESCOUT_BULK_SOURCING_URL, LINESCOUT_MACHINE_SOURCING_URL } from '@/lib/linescoutLinks';

const url = 'https://www.sureimports.com/china-sourcing-agent-nigeria';

export const metadata: Metadata = {
  title: { absolute: 'China Sourcing Agent for Nigerian Businesses | Sure Imports' },
  description:
    'Need a supplier for wholesale stock, custom products or machinery? See how Sure Imports and LineScout help Nigerian businesses define a brief, compare China suppliers and plan an order.',
  alternates: { canonical: url },
  openGraph: {
    title: 'China Sourcing Agent for Nigerian Businesses | Sure Imports',
    description:
      'A practical route from a product brief to supplier comparison, order checks and shipping planning for Nigerian businesses.',
    url,
    type: 'website',
    images: [{ url: 'https://www.sureimports.com/images/sure-imports-social-card.png', width: 1200, height: 630, alt: 'Sure Imports China product sourcing' }],
  },
};

const stages = [
  {
    title: 'Define what must be supplied',
    text: 'Share the product, intended use, specifications, quantity, acceptable alternatives, target budget and delivery destination. For a machine, include output, power, voltage and installation needs.',
  },
  {
    title: 'Compare suitable suppliers',
    text: 'Review product fit, minimum order quantities, customization, lead times, quotations and the checks needed before committing. A low unit price alone does not establish the best supplier.',
  },
  {
    title: 'Plan the purchase and shipment',
    text: 'Confirm the written specification, payment stages, inspection scope, packed dimensions and estimated landed cost. Proceed only after you understand what the quotation includes and excludes.',
  },
];

export default function ChinaSourcingAgentNigeriaPage() {
  return (
    <main className={pageStyles.page} data-si-page-theme="service">
      <JsonLdScript data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${url}#service`,
        name: 'China product and supplier sourcing for Nigerian businesses',
        serviceType: 'Product and supplier sourcing',
        url,
        description: 'Supplier search and comparison for wholesale goods, custom products and machinery requested by Nigerian buyers.',
        areaServed: { '@type': 'Country', name: 'Nigeria' },
        provider: { '@id': 'https://www.sureimports.com/#organization' },
        mainEntityOfPage: url,
      }} />
      <Navigation />
      <ServiceHero
        eyebrow="Product and supplier sourcing"
        title="A China sourcing agent for your Nigerian business."
        description="When you know what you want to sell or use but have not chosen a supplier, start with a clear brief. Sure Imports connects Nigerian businesses with its LineScout sourcing workflow for wholesale products, custom goods and machinery."
        primary={{ href: LINESCOUT_BULK_SOURCING_URL, label: 'Start a sourcing project' }}
        secondary={{ href: '#how-sourcing-works', label: 'See how it works' }}
        summaryTitle="Start with a product brief."
        steps={[
          { title: 'Describe the need', description: 'Product, quantity, specifications, budget and destination.' },
          { title: 'Review the options', description: 'Supplier fit, quotations, samples and order risks.' },
          { title: 'Approve the plan', description: 'Confirm costs, checks and shipping before purchase.' },
        ]}
      />

      <section id="how-sourcing-works" className="py-20 md:py-28" aria-labelledby="sourcing-process-title">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-orange-500">The sourcing workflow</p>
          <h2 id="sourcing-process-title" className="mt-4 max-w-3xl text-3xl text-slate-950 dark:text-white md:text-5xl">What a sourcing agent should help you decide.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            The useful result is a supplier and order you can evaluate, not just a list of contacts. The scope of verification, sampling, inspection and shipping depends on the product and the agreed project.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {stages.map((stage, index) => (
              <article key={stage.title} className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-sm font-semibold text-brand-orange-500">0{index + 1}</span>
                <h3 className="mt-5 text-xl text-slate-950 dark:text-white">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{stage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24" aria-labelledby="sourcing-comparison-title">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-orange-500">Before choosing a factory</p>
          <h2 id="sourcing-comparison-title" className="mt-4 max-w-4xl text-3xl text-slate-950 dark:text-white md:text-4xl">Compare like-for-like supplier quotations, not only unit prices.</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-400">For a Nigerian buyer sourcing from China, two quotations are comparable only when they describe the same product and order terms. Ask for the evidence below before deciding which supplier to use.</p>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {[
              { title: 'Product and sample', text: 'Match material, size, colour, components, packaging and branding to the brief. A sample can reveal differences a product photo cannot.' },
              { title: 'Supplier and capability', text: 'Record the legal company name, contact, production role and capacity. A marketplace listing or low quote alone does not establish who will make the goods.' },
              { title: 'Quantity and timing', text: 'Compare minimum order quantity, price breaks, sample lead time, production lead time and what happens if a variant is unavailable.' },
              { title: 'Total order scope', text: 'Check whether the quote includes tooling, labels, inspection, China-side delivery and export packing. Confirm the payment stages and where shipping responsibility begins.' },
            ].map((check) => (
              <div key={check.title} className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-xl text-slate-950 dark:text-white">{check.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{check.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">Example: if one supplier quotes a finished, branded product and another quotes an unbranded item without packaging, the lower unit price does not answer which order will cost less to deliver. Put both offers against one written specification first.</p>
          <div className="mt-9 max-w-3xl rounded-2xl border-l-4 border-brand-orange-500 bg-white p-7 dark:bg-slate-950">
            <h3 className="text-xl text-slate-950 dark:text-white">Experience across multi-product orders</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Sure Imports has worked with network-marketing companies that buy several kinds of products from China. The team has sourced many of those products end to end, alongside supplier-payment support. That experience is why a sourcing brief needs to separate each product’s specification, quantity and supplier terms instead of treating a mixed order as one interchangeable quote.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40 md:py-24" aria-labelledby="sourcing-fit-title">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <h2 id="sourcing-fit-title" className="text-3xl text-slate-950 dark:text-white md:text-4xl">Is sourcing the right route?</h2>
            <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">Use sourcing when the product or supplier still needs to be identified or compared. This includes wholesale stock, white-label products, custom manufacturing and equipment with detailed specifications.</p>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">For machines and production lines, use the <Link className="font-medium text-brand-orange-600 underline underline-offset-4" href={LINESCOUT_MACHINE_SOURCING_URL}>LineScout machinery route</Link> so capacity, utilities, testing and after-sales needs are captured in the brief.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xl text-slate-950 dark:text-white">Already further along?</h3>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <li><Link className="font-medium text-brand-orange-600 underline underline-offset-4" href="/buy-from-chinese-websites">Have product links?</Link> Submit them through the website-buying route.</li>
              <li><Link className="font-medium text-brand-orange-600 underline underline-offset-4" href="/china-supplier-payment-service-nigeria">Have a confirmed supplier and invoice?</Link> Review the Pay Supplier route.</li>
              <li><Link className="font-medium text-brand-orange-600 underline underline-offset-4" href="/ship-with-us">Already purchased the goods?</Link> Use shipping-only if you need receiving and freight support.</li>
              <li><Link className="font-medium text-brand-orange-600 underline underline-offset-4" href="/corporate-sourcing">Buying for an established organisation?</Link> Use Corporate Sourcing for formal procurement and approvals.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24" aria-labelledby="sourcing-brief-title">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2 id="sourcing-brief-title" className="text-3xl text-slate-950 dark:text-white md:text-4xl">Prepare a brief that produces useful quotations.</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-400">Include reference photos or technical drawings where available, exact variants and quantities, material or performance requirements, packaging or branding, your target cost and delivery location. Ask which checks are included and whether samples, factory visits, inspection, shipping or customs handling need separate approval.</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-400">Tell the team whether you want an existing wholesale product, a private-label version or a product made to your own specification. That changes the likely minimum order, sample work and questions to put to suppliers. For machinery, add the required output per hour, local power supply, installation space, consumables and spare-part needs.</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-400">The agreed project scope should say which supplier checks, samples, inspections and shipping tasks are included. Fees, lead times and final landed costs depend on the product and quotation; confirm them before committing to an order. You can estimate the freight volume with the <Link href="/tools/cbm-volumetric-weight-calculator" className="font-medium text-brand-orange-600 underline underline-offset-4">CBM calculator</Link> once packed dimensions are available.</p>
          <Link href={LINESCOUT_BULK_SOURCING_URL} className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange-500 px-7 py-4 text-sm font-medium text-white transition hover:bg-brand-orange-600">Start in LineScout <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
