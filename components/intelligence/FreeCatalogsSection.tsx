import Image from 'next/image';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';

import WhatsAppButton from '@/components/WhatsAppButton';
import { freeCatalogs } from '@/lib/intelligence/freeCatalogs';

import styles from './FreeCatalogsSection.module.css';

export default function FreeCatalogsSection() {
  const [featuredCatalog, ...productCatalogs] = freeCatalogs;

  const renderProductCatalog = (catalog: (typeof freeCatalogs)[number]) => (
    <article key={catalog.slug} className={styles.productCard}>
      <div className={styles.productCover}>
        <Image
          src={catalog.coverImageUrl}
          alt={`${catalog.title} catalog cover`}
          fill
          sizes="(max-width: 600px) 38vw, (max-width: 900px) 25vw, 180px"
          className={styles.productCoverImage}
        />
      </div>
      <div className={styles.productContent}>
        <p className={styles.productMeta}>
          Free catalog <span aria-hidden="true">·</span> {catalog.pageCount}{' '}
          pages
        </p>
        <h4>{catalog.title}</h4>
        <p>{catalog.description}</p>
        <div className={styles.productActions}>
          <a href={`/api/intelligence/free-catalogs/${catalog.slug}/download`}>
            Download PDF <ArrowDownToLine aria-hidden="true" size={15} />
          </a>
          <WhatsAppButton
            waID="CUR7YKW3K3RBA1"
            variant="inline"
            triggerLabel="Ask about products"
            triggerClassName={styles.productWhatsApp}
            message={`Hello Sure Imports, I found a product in the ${catalog.title} catalog. Please help me confirm availability and a delivered quote.`}
          />
        </div>
      </div>
    </article>
  );

  return (
    <section
      id="free-catalogs"
      aria-labelledby="free-catalogs-heading"
      className={styles.section}
    >
      <div className={styles.container}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>Complimentary catalogs</p>
            <h2 id="free-catalogs-heading" className={styles.heading}>
              Discover the collection.
            </h2>
          </div>
          <p className={styles.introCopy}>
            Browse free product catalogs, choose an item, and send us its code
            or page on WhatsApp for an availability check and final quote.
          </p>
        </div>

        <div className={styles.catalogList}>
          {[featuredCatalog].map((catalog, index) => (
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
                  Japanese Futura fibre <span aria-hidden="true">·</span> Lace
                  frontal wigs
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
                    <li>
                      <span>01</span>
                      <p>Download the catalog and choose a JY style code.</p>
                    </li>
                    <li>
                      <span>02</span>
                      <p>
                        Share your colour, length and lace choice on WhatsApp.
                      </p>
                    </li>
                    <li>
                      <span>03</span>
                      <p>
                        We confirm availability and your final quote before
                        payment.
                      </p>
                    </li>
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

        <div className={styles.collection}>
          <div className={styles.collectionHeading}>
            <div>
              <p className={styles.eyebrow}>The product library</p>
              <h3>Explore by product.</h3>
            </div>
            <p>
              {productCatalogs.length} focused catalogs{' '}
              <span aria-hidden="true">·</span> Free PDFs
            </p>
          </div>
          <p className={styles.collectionIntro}>
            These catalogs show supplier product references and RMB prices. Tell
            us the product and variant you want; we will confirm sourcing,
            minimum quantity, delivery and your final price before payment.
          </p>
          <div className={styles.productGrid}>
            {productCatalogs.slice(0, 6).map(renderProductCatalog)}
          </div>
          {productCatalogs.length > 6 && (
            <details className={styles.moreCatalogs}>
              <summary>
                View all {productCatalogs.length} product catalogs{' '}
                <ArrowUpRight aria-hidden="true" size={16} />
              </summary>
              <div className={styles.productGrid}>
                {productCatalogs.slice(6).map(renderProductCatalog)}
              </div>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
