import ServiceHero from '@/components/home/ServiceHero';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import ImportMarkets from '@/components/home/ImportMarkets';
import ImportReadingPath from '@/components/home/ImportReadingPath';
import styles from '@/components/home/ImportGuide.module.css';

export const metadata: Metadata = {
  title: 'China Import Hub: Nigeria & UK Guides',
  description:
    'Choose your destination. Practical China importing guides for Nigeria and the UK, covering sourcing, white labelling, buying, shipping and costs.',
  alternates: { canonical: 'https://www.sureimports.com/import-hub' },
};

export default function ImportHubPage() {
  return (
    <>
      <Navigation />
      <main className={styles.page} data-si-page-theme="service">
        <ServiceHero
          eyebrow="Sure Imports · Import Hub"
          title="Start in China. Plan for your market."
          description="The right product is only the beginning. Choose your destination for practical guidance on sourcing, shipping, costs and your next step."
          primary={{ href: "#markets-heading", label: "Choose your destination" }}
          secondary={{ href: "/blog", label: "Browse import guides" }}
          summaryTitle="A clearer route from research to buying."
          steps={[
            { title: "Choose your market", description: "Start with guidance for Nigeria or the United Kingdom." },
            { title: "Understand the costs", description: "Plan purchasing, shipping and destination costs together." },
            { title: "Take the next step", description: "Find the right service when you are ready to buy." },
          ]}
        />
        <section
          className={`${styles.container} ${styles.section}`}
          aria-labelledby="markets-heading"
        >
          <span className={styles.eyebrow}>Your destination comes first</span>
          <h2 id="markets-heading" className={styles.heading}>
            Where are you importing to?
          </h2>
          <div className="mt-8">
            <ImportMarkets expanded />
          </div>
          <p className={styles.lede}>
            Already know what you need?{' '}
            <Link className={styles.textLink} href="/buy-from-chinese-websites">
              Submit product links
            </Link>{' '}
            or{' '}
            <Link className={styles.textLink} href="/blog">
              browse our import guides
            </Link>
            .
          </p>
        </section>
        <div className={styles.container}>
          <ImportReadingPath />
        </div>
      </main>
      <Footer />
    </>
  );
}
