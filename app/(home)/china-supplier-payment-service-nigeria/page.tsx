import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Navigation from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import ServiceHero from '@/components/home/ServiceHero';
import pageStyles from '@/components/home/PublicServicePage.module.css';
import { JsonLdScript } from '@/components/seo/JsonLd';

const url = 'https://www.sureimports.com/china-supplier-payment-service-nigeria';
const paySupplierHref = '/auth/login?next=%2Fdashboard%2Fpay-supplier%2Fcreate';

export const metadata: Metadata = {
  title: { absolute: 'China Supplier Payment Support in Nigeria | Sure Imports' },
  description:
    'Already have a Chinese supplier and invoice? Learn what Sure Imports needs to review before a Pay Supplier request, how the order is recorded and when to choose a buying or sourcing service instead.',
  alternates: { canonical: url },
  openGraph: {
    title: 'China Supplier Payment Support in Nigeria | Sure Imports',
    description: 'A clear route for Nigerian buyers who already have a supplier and a defined invoice.',
    url,
    type: 'website',
    images: [{ url: 'https://www.sureimports.com/images/sure-imports-social-card.png', width: 1200, height: 630, alt: 'Sure Imports supplier payment support' }],
  },
};

const checklist = [
  'The supplier’s company name and verified contact details',
  'A current invoice or written order with product, variant, quantity and amount',
  'The proposed payment recipient and account details to compare with the supplier record',
  'The agreed delivery terms, production timeline and any inspection requirements',
];

export default function ChinaSupplierPaymentServiceNigeriaPage() {
  return (
    <main className={pageStyles.page} data-si-page-theme="service">
      <JsonLdScript data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'China supplier payment support for Nigerian buyers',
        serviceType: 'Supplier payment support for defined China orders',
        url,
        areaServed: { '@type': 'Country', name: 'Nigeria' },
        provider: { '@type': 'Organization', name: 'Sure Imports', url: 'https://www.sureimports.com' },
      }} />
      <Navigation />
      <ServiceHero
        eyebrow="For an existing supplier and invoice"
        title="Pay your Chinese supplier through a documented order."
        description="Sure Imports’ Pay Supplier route is for Nigerian buyers who have already chosen a supplier and agreed what is being purchased. Submit the supplier and invoice details in your account so the payment request is connected to a defined order."
        primary={{ href: paySupplierHref, label: 'Start a Pay Supplier request' }}
        secondary={{ href: '#before-you-request', label: 'See what you need' }}
        summaryTitle="Bring the order details first."
        steps={[
          { title: 'Confirm the supplier', description: 'Identify the company and check who should receive payment.' },
          { title: 'Document the order', description: 'Record the product, quantity, price and agreed terms.' },
          { title: 'Submit your request', description: 'Continue in your Sure Imports account for review and next steps.' },
        ]}
      />

      <section id="before-you-request" className="py-20 md:py-24" aria-labelledby="payment-checklist-title">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-brand-orange-500">Before you request payment</p>
            <h2 id="payment-checklist-title" className="mt-4 text-3xl text-slate-950 dark:text-white md:text-4xl">Make the payment match the purchase.</h2>
            <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">Sending money is only one part of a China order. A mismatched beneficiary, vague invoice or missing product specification can create a dispute even when a transfer succeeds. Keep the supplier, goods and recipient details together before submitting a request.</p>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">Any payment method, charges, exchange rate and timeline must be confirmed for your specific request. Do not rely on a rate or method shown in an older article or message.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl text-slate-950 dark:text-white">Information to have ready</h3>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40 md:py-24" aria-labelledby="payment-route-title">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2 id="payment-route-title" className="text-3xl text-slate-950 dark:text-white md:text-4xl">Choose the route that matches your order.</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              { title: 'Supplier and invoice ready', text: 'Use Pay Supplier to submit a defined supplier payment request in your account.', href: paySupplierHref, label: 'Open Pay Supplier' },
              { title: 'Product links ready', text: 'If you need Sure Imports to buy listings from 1688, Alibaba or another Chinese website, use the product-link buying flow.', href: '/buy-from-chinese-websites', label: 'Submit product links' },
              { title: 'Still finding a supplier', text: 'If the product, supplier or quotation is unresolved, start with sourcing instead of submitting a payment request.', href: '/china-sourcing-agent-nigeria', label: 'Explore sourcing' },
            ].map((route) => (
              <article key={route.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-xl text-slate-950 dark:text-white">{route.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{route.text}</p>
                <Link href={route.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-orange-600 underline underline-offset-4">{route.label} <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">Comparing Alibaba Trade Assurance, bank transfers and other ways to pay? Read the <Link href="/blog/how-to-pay-chinese-suppliers-from-nigeria-safely-in-2026" className="font-medium text-brand-orange-600 underline underline-offset-4">guide to paying Chinese suppliers from Nigeria</Link> before choosing a route.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
