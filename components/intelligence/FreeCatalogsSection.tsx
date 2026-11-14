import Image from 'next/image';
import { ArrowDownToLine } from 'lucide-react';

import WhatsAppButton from '@/components/WhatsAppButton';
import { freeCatalogs } from '@/lib/intelligence/freeCatalogs';

import styles from './FreeCatalogsSection.module.css';

export default function FreeCatalogsSection() {
  return (
    <section id="free-catalogs" aria-labelledby="free-catalogs-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>Complimentary catalogs</p>
            <h2 id="free-catalogs-heading" className={styles.heading}>
              Discover the collection.
            </h2>
          </div>
          <p className={styles.introCopy}>
            Explore real products at your own pace. Find a style you love, then
            send us its code and we&apos;ll source it for you.
          </p>
        </div>

        <div className={styles.catalogList}>
          {freeCatalogs.map((catalog, index) => (
            <article key={catalog.slug} className={styles.catalog}>
              <div className={styles.coverPanel}>
                <div className={styles.coverTopline}>
                  <span>Catalog {String(index + 1).padStart(2, '0')}</span>
                  <span>Sure Imports</span>
                </div>
                <div className={styles.coverFrame}>
                  <Image
                    src={catalog.coverImageUrl}
                    alt={`${catalog.title} catalog cover featuring a long brown lace frontal wig`}
                    fill
                    sizes="(max-width: 767px) 72vw, (max-width: 1199px) 32vw, 330px"
                    className={styles.coverImage}
                  />
                </div>
                <p className={styles.coverCaption}>
                  Japanese Futura fibre <span aria-hidden="true">·</span> Lace frontal wigs
                </p>
              </div>

              <div className={styles.content}>
                <div className={styles.catalogMeta}>
                  <span>Free to download</span>
                  <span>{catalog.pageCount}-page PDF</span>
                </div>
                <h3 className={styles.catalogTitle}>{catalog.title}</h3>
                <p className={styles.description}>{catalog.description}</p>

                <dl className={styles.details}>
                  <div>
                    <dt>Styles</dt>
                    <dd>{catalog.styleCount} with JY codes</dd>
                  </div>
                  <div>
                    <dt>Lace options</dt>
                    <dd>13 × 4 or 13 × 6</dd>
                  </div>
                  <div>
                    <dt>Minimum order</dt>
                    <dd>1 piece</dd>
                  </div>
                </dl>

                <div className={styles.orderGuide}>
                  <p className={styles.guideTitle}>How it works</p>
                  <ol>
                    <li><span>01</span><p>Download the catalog and choose a JY style code.</p></li>
                    <li><span>02</span><p>Share your colour, length and lace choice on WhatsApp.</p></li>
                    <li><span>03</span><p>We confirm availability and your final quote before payment.</p></li>
                  </ol>
                </div>

                <div className={styles.actions}>
                  <a
                    href={`/api/intelligence/free-catalogs/${catalog.slug}/download`}
                    className={styles.downloadButton}
                  >
                    <ArrowDownToLine aria-hidden="true" size={17} />
                    Download catalog
                  </a>
                  <WhatsAppButton
                    waID="CUR7YKW3K3RBA1"
                    variant="inline"
                    triggerLabel="Ask about a style"
                    triggerClassName={styles.whatsAppButton}
                    message={`Hello Sure Imports, I found a style in the ${catalog.title} catalog. Please help me confirm availability and a quote.`}
                  />
                </div>
                <p className={styles.priceNote}>
                  Prices in the PDF are USD product references. We confirm
                  availability, shipping and your final price before you order.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
