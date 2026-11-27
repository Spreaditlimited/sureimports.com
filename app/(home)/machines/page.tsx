import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import { JsonLdScript } from '@/components/seo/JsonLd';
import {
  getMachineGuides,
  getMachineSourcingContact,
} from '@/lib/machines/data';
import GuideDirectory from './GuideDirectory';
import { sourcingGuide } from './guide';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
const url = 'https://www.sureimports.com/machines';
const title = 'Machine Sourcing from China to Nigeria | Sure Imports';
const description =
  'Source machines and production lines from China to Nigeria. Compare specifications, factory tests, landed costs and setup needs, then explore our machine buying guides.';
const image =
  'https://res.cloudinary.com/djprcwnsz/image/upload/v1795769117/admin-sureimports/blog/BLOG_GEN_pl-071_b7b65ddc7fbcc16a.png';
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    images: [
      {
        url: image,
        alt: 'Illustration of a toilet tissue converting workshop',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
};
export default async function MachinesPage() {
  const [directory, contact] = await Promise.all([
    getMachineGuides()
      .then((guides) => ({ guides, failed: false }))
      .catch(() => {
        console.error('Machines guide directory unavailable');
        return { guides: [], failed: true };
      }),
    getMachineSourcingContact(),
  ]);
  const { guides } = directory;
  return (
    <div className={styles.page}>
      <Navigation />
      <main>
        <JsonLdScript
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              '@id': `${url}#page`,
              url,
              name: title,
              description,
              mainEntity: { '@id': `${url}#guides` },
              about: {
                '@type': 'Thing',
                name: 'Machine sourcing from China to Nigeria',
              },
            },
            ...(!directory.failed
              ? [
                  {
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    '@id': `${url}#guides`,
                    name: 'Published machine and production-line sourcing guides',
                    numberOfItems: guides.length,
                    itemListElement: guides.map((guide, index) => ({
                      '@type': 'ListItem',
                      position: index + 1,
                      name: guide.title,
                      url: `https://www.sureimports.com/blog/${guide.slug}`,
                    })),
                  },
                ]
              : []),
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://www.sureimports.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Machines',
                  item: url,
                },
              ],
            },
          ]}
        />
        <section className={styles.hero} aria-labelledby="machines-title">
          <div className={styles.heroInner}>
            <div>
              <p className={styles.eyebrow}>
                Sure Imports · Machines &amp; production lines
              </p>
              <h1 id="machines-title">
                Source machines from China.{' '}
                <em>Build your production in Nigeria.</em>
              </h1>
              <p className={styles.intro}>
                Machine sourcing from China to Nigeria starts with a clear
                production brief. Sure Imports helps you explore the right
                equipment, compare the scope and plan the checks your purchase
                needs.
              </p>
              <div className={styles.actions}>
                <a
                  href={contact}
                  className={styles.primary}
                  data-whatsapp-placement="page"
                >
                  {contact.startsWith('https://wa.me/')
                    ? 'Discuss your machine on WhatsApp'
                    : 'Contact Sure Imports about a machine'}
                </a>
                <a href="#machine-guides" className={styles.secondary}>
                  Explore machine guides
                </a>
              </div>
              <p className={styles.heroNote}>
                From a standalone machine to a complete production line.
              </p>
            </div>
            <figure className={styles.heroImage}>
              <Image
                src={image}
                alt="Illustration showing jumbo reels, converting machinery and finished toilet tissue rolls in a workshop"
                width={1536}
                height={1024}
                sizes="(max-width: 800px) 100vw, 45vw"
                priority
                unoptimized
              />
              <figcaption>
                Explore the process, equipment and factory setup. Illustration;
                actual configurations vary.
              </figcaption>
            </figure>
          </div>
        </section>
        <div className={styles.jumpBar}>
          <nav aria-label="On this page">
            <a href="#machine-guides">Machine guides</a>
            <a href="#sourcing-guide">China-to-Nigeria sourcing guide</a>
            <a href="#sourcing-brief">Prepare your brief</a>
          </nav>
        </div>
        <section
          id="machine-guides"
          className={styles.directory}
          aria-labelledby="directory-title"
        >
          <p className={styles.eyebrow}>Choose your process</p>
          <h2 id="directory-title">Machine &amp; production-line guides</h2>
          <p className={styles.lead}>
            Start with the equipment you want to source from China. Each guide
            helps you ask better questions about the process, capacity,
            utilities and Nigerian factory setup. Newly published guides appear
            here as the library grows.
          </p>
          {directory.failed ? (
            <div className={styles.notice}>
              <h3>The guide directory is temporarily unavailable.</h3>
              <p>
                You can still read the sourcing guide below or contact us about
                a machine.
              </p>
              <a href="/machines">Reload the directory</a>
            </div>
          ) : (
            <GuideDirectory guides={guides} />
          )}
        </section>
        <section
          id="sourcing-guide"
          className={styles.editorial}
          aria-labelledby="sourcing-title"
        >
          <div className={styles.editorialHeading}>
            <p className={styles.eyebrow}>The general sourcing guide</p>
            <h2 id="sourcing-title">
              How to import machines from China to Nigeria
            </h2>
            <p className={styles.lead}>
              A practical buying framework for industrial machinery,
              food-processing equipment, packaging machines and complete
              production lines.
            </p>
            <p className={styles.byline}>By Tochukwu Nkwocha · Sure Imports</p>
          </div>
          <div className={styles.editorialLayout}>
            <aside className={styles.contents}>
              <h3>Before you order</h3>
              <nav aria-label="Sourcing guide contents">
                {sourcingGuide.map((section) => (
                  <a href={`#${section.id}`} key={section.id}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>
            <div className={styles.prose}>
              {sourcingGuide.map((section) => (
                <section id={section.id} key={section.id}>
                  <h3>{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 45)}>{paragraph}</p>
                  ))}
                </section>
              ))}
              <section
                className={styles.checklist}
                aria-labelledby="brief-checklist"
              >
                <h3 id="brief-checklist">
                  Your request-for-quotation checklist
                </h3>
                <ul>
                  {[
                    'Finished product, raw material and representative samples',
                    'Saleable output per hour or shift, pack size and quality limits',
                    'Process flow, included machines, auxiliaries and exclusions',
                    'Power, water, air, heat, floor space and access constraints',
                    'Factory test criteria, evidence, corrections and retesting',
                    'Delivery term, packing, freight assumptions and payment milestones',
                    'Installation, site acceptance, training, warranty and critical spares',
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className={styles.references}>
                <h3>Useful planning tools and official sources</h3>
                <p>
                  Estimate shipment volume with our{' '}
                  <Link href="/tools/cbm-volumetric-weight-calculator">
                    CBM calculator
                  </Link>
                  , outline costs with the{' '}
                  <Link href="/tools/landed-cost-estimator">
                    landed-cost estimator
                  </Link>{' '}
                  and explore the{' '}
                  <Link href="/tools/generator-sizing">
                    generator-sizing tool
                  </Link>
                  . Have final technical and import requirements confirmed for
                  your project.
                </p>
                <p>
                  Check current guidance from the{' '}
                  <a href="https://son.gov.ng/faqs/">
                    Standards Organisation of Nigeria
                  </a>
                  ,{' '}
                  <a href="https://son.gov.ng/mancapservice/">
                    SON’s MANCAP programme
                  </a>
                  ,{' '}
                  <a href="https://nafdac.gov.ng/our-services/product-registrationevaluation/">
                    NAFDAC product registration
                  </a>{' '}
                  and{' '}
                  <a href="https://nesrea.gov.ng/laws-regulations/">
                    NESREA’s laws and regulations
                  </a>{' '}
                  where applicable.
                </p>
              </section>
            </div>
          </div>
        </section>
        <section className={styles.cta} aria-labelledby="cta-title">
          <div>
            <p className={styles.eyebrow}>
              Turn the research into a clear brief
            </p>
            <h2 id="cta-title">What do you want to produce?</h2>
            <p>
              Tell Sure Imports the product, required output and installation
              city. We’ll discuss the scope for sourcing your machine or
              production line from China to Nigeria.
            </p>
            <a
              href={contact}
              className={styles.primary}
              data-whatsapp-placement="page"
            >
              {contact.startsWith('https://wa.me/')
                ? 'Discuss your machine on WhatsApp'
                : 'Contact Sure Imports about a machine'}
            </a>
          </div>
          <div className={styles.briefNote}>
            <h3>Bring these three details</h3>
            <ol>
              <li>Your raw material and finished product</li>
              <li>The saleable output you need</li>
              <li>Your Nigerian site and available utilities</li>
            </ol>
            <p>
              Already have a quotation? Include the specification and what the
              price covers.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
