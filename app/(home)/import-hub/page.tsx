import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import HeroPill from '@/components/home/HeroPill';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';
import ImportMarkets from '@/components/home/ImportMarkets';
import ImportReadingPath from '@/components/home/ImportReadingPath';
import heroLayout from '@/components/home/HeroLayout.module.css';
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
      <main className={styles.page}>
        <section className={`${heroLayout.fixed} ${styles.hero}`}>
          <PublicHeroBackground />
          <div className={`${styles.container} ${styles.heroContent}`}>
            <HeroPill>Sure Imports · Import Hub</HeroPill>
            <h1>
              Start in China.
              <br />
              <span>Plan for your market.</span>
            </h1>
            <p className={styles.intro}>
              The right product is only the beginning. Choose where you are
              importing to for a clearer guide to sourcing, shipping, costs and
              your next step.
            </p>
          </div>
        </section>
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
