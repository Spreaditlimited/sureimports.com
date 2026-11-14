import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight } from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import WhatsAppButton from '@/components/WhatsAppButton';
import { catalogSearchContent } from '@/lib/intelligence/catalogSearchContent';
import { catalogSourcingContent } from '@/lib/intelligence/catalogSourcingContent';
import {
  freeCatalogBySlug,
  freeCatalogs,
} from '@/lib/intelligence/freeCatalogs';

import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };
const baseUrl = 'https://www.sureimports.com';

export function generateStaticParams() {
  return freeCatalogs.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = freeCatalogBySlug.get(slug);
  const content = catalogSearchContent[slug];
  const sourcing = catalogSourcingContent[slug];
  if (!catalog || !content || !sourcing)
    return { title: 'Catalog not found | Sure Imports' };

  const url = `${baseUrl}/supplier-intelligence/catalogs/${slug}`;
  const title = `${sourcing.heading} | Free catalog`;
  const description = `${sourcing.summary.split('. ')[0]}.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${title} | Sure Imports`,
      description,
      images: [
        { url: catalog.coverImageUrl, alt: `${catalog.title} catalog cover` },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Sure Imports`,
      description,
      images: [catalog.coverImageUrl],
    },
  };
}

export default async function FreeCatalogPage({ params }: Props) {
  const { slug } = await params;
  const catalog = freeCatalogBySlug.get(slug);
  const content = catalogSearchContent[slug];
  const sourcing = catalogSourcingContent[slug];
  if (!catalog || !content || !sourcing) notFound();

  const url = `${baseUrl}/supplier-intelligence/catalogs/${slug}`;
  const pdfUrl = `/api/intelligence/free-catalogs/${slug}/download`;
  const priceCurrency = slug === 'futura-premium-wigs' ? 'USD' : 'RMB';
  const currentIndex = freeCatalogs.findIndex((item) => item.slug === slug);
  const related = [
    ...freeCatalogs.slice(currentIndex + 1),
    ...freeCatalogs.slice(0, currentIndex),
  ].slice(0, 3);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: sourcing.heading,
        description: sourcing.summary,
        image: catalog.coverImageUrl,
        mainEntity: { '@id': `${url}#document` },
      },
      {
        '@type': 'DigitalDocument',
        '@id': `${url}#document`,
        name: `${catalog.title} Catalog`,
        description: sourcing.summary,
        encodingFormat: 'application/pdf',
        thumbnailUrl: catalog.coverImageUrl,
        numberOfPages: catalog.pageCount,
        isAccessibleForFree: true,
        publisher: {
          '@type': 'Organization',
          name: 'Sure Imports',
          url: baseUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Supplier reports and catalogs',
            item: `${baseUrl}/supplier-intelligence/reports`,
          },
          { '@type': 'ListItem', position: 2, name: catalog.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <Navigation />
      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/supplier-intelligence/reports#free-catalogs">
            <ArrowLeft aria-hidden="true" size={16} /> All free catalogs
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{catalog.title}</span>
        </nav>

        <article>
          <div className={styles.hero}>
            <div className={styles.coverPanel}>
              <div className={styles.cover}>
                <Image
                  src={catalog.coverImageUrl}
                  alt={`${catalog.title} catalog cover`}
                  fill
                  priority
                  sizes="(max-width: 720px) 72vw, 380px"
                  className={styles.coverImage}
                />
              </div>
            </div>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>Free product catalog</p>
              <h1>{sourcing.heading}</h1>
              <p className={styles.lead}>{sourcing.summary}</p>
              <dl className={styles.facts}>
                <div>
                  <dt>Format</dt>
                  <dd>{catalog.pageCount}-page PDF</dd>
                </div>
                <div>
                  <dt>File size</dt>
                  <dd>{catalog.fileSizeLabel}</dd>
                </div>
                <div>
                  <dt>Price references</dt>
                  <dd>{priceCurrency}</dd>
                </div>
              </dl>
              <div className={styles.actions}>
                <a href={pdfUrl} className={styles.download}>
                  <ArrowDownToLine aria-hidden="true" size={18} /> Download free
                  catalog
                </a>
                <WhatsAppButton
                  waID="CUR7YKW3K3RBA1"
                  variant="inline"
                  triggerLabel="Ask about a product"
                  triggerClassName={styles.whatsApp}
                  message={`Hello Sure Imports, I found an item in the ${catalog.title} catalog. Please help me confirm its availability, minimum quantity and delivered quote.`}
                />
              </div>
              <p className={styles.disclaimer}>
                Supplier prices in the PDF are references, not a delivered
                offer. We confirm availability, minimum quantity and the final
                price before payment.
              </p>
            </div>
          </div>

          <div className={styles.details}>
            <section aria-labelledby="inside-heading">
              <p className={styles.eyebrow}>What you will find</p>
              <h2 id="inside-heading">Inside the catalog</h2>
              <p className={styles.insideIntro}>{content.intro}</p>
              <ul className={styles.inside}>
                {content.inside.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="choose-heading" className={styles.choose}>
              <p className={styles.eyebrow}>Before you order</p>
              <h2 id="choose-heading">Choose the right listing</h2>
              <p>{content.choosing}</p>
              <p>
                Download the PDF, note the product name or page, and send it to
                us on WhatsApp. We will check the supplier details and give you
                a final quote.
              </p>
            </section>
          </div>

          <section
            className={styles.sourcing}
            aria-labelledby="sourcing-heading"
          >
            <div className={styles.sourcingIntro}>
              <p className={styles.eyebrow}>China sourcing guide</p>
              <h2 id="sourcing-heading">
                From a catalog listing to a confirmed order
              </h2>
              <p>{sourcing.buyingNote}</p>
              <p>
                This catalog is a shortlist, not a live stock list. For delivery
                to Nigeria, send us the product code or PDF page, your chosen
                specifications, quantity and delivery city. We will check the
                supplier&apos;s current terms and give you a final delivered
                quote before you pay.
              </p>
              <p>
                Planning a larger import? See our{' '}
                <Link href="/import-from-china-to-nigeria">
                  China to Nigeria import guide
                </Link>{' '}
                for buying, shipping and sourcing routes.
              </p>
            </div>
            <div className={styles.checklist}>
              <h3>What to send for a useful quote</h3>
              <ol>
                {sourcing.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ol>
              <p>
                {priceCurrency} prices in the PDF are supplier references. Your
                confirmed quote accounts for the selected variant, quantity and
                delivery; it may differ from the catalog figure.
              </p>
            </div>
          </section>
        </article>

        <section className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading">Explore more free catalogs</h2>
          <div>
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/supplier-intelligence/catalogs/${item.slug}`}
              >
                {item.title} <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
