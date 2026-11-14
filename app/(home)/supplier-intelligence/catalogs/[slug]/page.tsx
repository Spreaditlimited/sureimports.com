import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight } from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import WhatsAppButton from '@/components/WhatsAppButton';
import { catalogSearchContent } from '@/lib/intelligence/catalogSearchContent';
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
  if (!catalog || !content)
    return { title: 'Catalog not found | Sure Imports' };

  const url = `${baseUrl}/supplier-intelligence/catalogs/${slug}`;
  const title = `Free ${catalog.title} Catalog`;
  const description = `${content.intro.split('.')[0]}.`;
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
  if (!catalog || !content) notFound();

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
        name: `${catalog.title} Catalog`,
        description: content.intro,
        image: catalog.coverImageUrl,
        mainEntity: { '@id': `${url}#document` },
      },
      {
        '@type': 'DigitalDocument',
        '@id': `${url}#document`,
        name: `${catalog.title} Catalog`,
        description: content.intro,
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
              <h1>{catalog.title}</h1>
              <p className={styles.lead}>{content.intro}</p>
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
