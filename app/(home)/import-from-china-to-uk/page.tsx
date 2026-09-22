import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShoppingCart,
  PackageCheck,
  Factory,
  MapPin,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import Navigation from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import HeroPill from '@/components/home/HeroPill';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';
import ImportMarkets from '@/components/home/ImportMarkets';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { LINESCOUT_WHITE_LABEL_URL } from '@/lib/linescoutLinks';
import heroLayout from '@/components/home/HeroLayout.module.css';
import styles from '@/components/home/ImportGuide.module.css';
import ImportReadingPath from '@/components/home/ImportReadingPath';

const lineScout = 'https://linescout.sureimports.com';
const sourcing = LINESCOUT_WHITE_LABEL_URL;
const pageUrl = 'https://www.sureimports.com/import-from-china-to-uk';
const title =
  'Import From China to the UK: Sourcing, Shipping & White Labelling';
const description =
  'Buy from Chinese websites, source products for your own brand and arrange shipping to the UK. Plan your costs and next steps with Sure Imports and LineScout.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: 'website',
    siteName: 'Sure Imports',
    locale: 'en_GB',
    images: [
      {
        url: 'https://www.sureimports.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports — China sourcing and shipping',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.sureimports.com/og-image.jpg'],
  },
};

const routes = [
  {
    icon: ShoppingCart,
    label: 'You have product links',
    title: 'We help you buy.',
    text: 'Found what you want on 1688, Alibaba, Taobao or Pinduoduo? Send the links, quantities and specifications through Buy From Chinese Websites. Select the United Kingdom as your destination.',
    href: '/buy-from-chinese-websites',
    action: 'Submit product links',
  },
  {
    icon: Factory,
    label: 'You need a product or a supplier',
    title: 'We help you source.',
    text: 'Build a brand, find wholesale stock or source equipment. Use LineScout to explain your requirements, work with sourcing specialists and review quotations before committing to an order.',
    href: `${lineScout}/sourcing-project?route_type=simple_sourcing`,
    action: 'Start a sourcing project',
  },
  {
    icon: PackageCheck,
    label: 'You have already bought goods',
    title: 'We help you ship.',
    text: 'Keep your own supplier and use Sure Imports for shipping. Share the goods, carton details and UK delivery address so the available route, handling and charges can be confirmed.',
    href: '/ship-with-us',
    action: 'Request shipping',
  },
];
const steps = [
  [
    'Define the product and the buyer',
    'Choose who you want to sell to, the problem your product solves, your target price and a realistic first-order budget.',
  ],
  [
    'Confirm the supplier and sample',
    'Agree the materials, dimensions, minimum order quantity and branding options. Review a sample or proof before approving bulk production.',
  ],
  [
    'Approve the costs and production',
    'Review the quotation, packaging, payment stages and inspection scope. Keep the agreed specifications in your sourcing project.',
  ],
  [
    'Arrange shipping and prepare to sell',
    'Confirm the UK destination, import responsibilities and delivery plan. Prepare your shop, product information and customer support before stock arrives.',
  ],
];
const faqs = [
  [
    'Can Sure Imports help me import from China to the UK?',
    'Yes. You can submit Chinese website links for buying support, use LineScout for supplier sourcing and white-label projects, or request shipping for goods you have already purchased. Confirm the UK delivery address and product details so the appropriate route and costs can be agreed.',
  ],
  [
    'Can I buy from 1688 if I live in the UK?',
    'Yes. Submit the exact product links, variants and quantities through Buy From Chinese Websites and select the United Kingdom. A low listing price is not the full delivered cost: confirm product availability, the purchase amount, service charges and shipping before paying.',
  ],
  [
    'What is the difference between white labelling and private labelling?',
    'White labelling usually means adding your brand to an existing manufacturer’s product, where permitted. Private labelling can involve more specific changes to the product, materials or packaging. Neither automatically provides exclusivity. Confirm intellectual property rights, customisation options and minimum quantities with the supplier.',
  ],
  [
    'How much does it cost to import from China to the UK?',
    'There is no single price for every shipment. Product value, quantities, carton dimensions, weight, freight method, duty, import VAT and delivery requirements all affect the cost. Request an itemised quotation and confirm which import charges are included and which you must pay separately.',
  ],
  [
    'Can you source products for Amazon UK or TikTok Shop?',
    'You can use LineScout to source products intended for those channels and use our guides and profit calculator to plan. Seller accounts, listing eligibility and product compliance remain your responsibility. Amazon preparation, labels and delivery to a fulfilment centre must be specifically agreed; they are not automatically included.',
  ],
  [
    'Do you offer a fixed delivery time or minimum order quantity?',
    'No single promise applies to every product. A ready-made purchase differs from a customised production order. Supplier minimums, samples, manufacturing, inspections, shipping and customs can all affect the schedule. Confirm the quantity and delivery estimate in your quotation before paying.',
  ],
  [
    'Do the same import rules apply throughout the UK?',
    'Not always. Great Britain and Northern Ireland can have different customs and product requirements. Tell us your full delivery location before ordering, and check the current official guidance or obtain advice appropriate to your product and business.',
  ],
];

export default function ImportFromChinaToUKPage() {
  return (
    <>
      <Navigation />
      <main className={styles.page}>
        <JsonLdScript
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              '@id': pageUrl,
              url: pageUrl,
              name: title,
              description,
              inLanguage: 'en-GB',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Import Hub',
                  item: 'https://www.sureimports.com/import-hub',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Import from China to the UK',
                  item: pageUrl,
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(([question, answer]) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: { '@type': 'Answer', text: answer },
              })),
            },
          ]}
        />
        <section className={`${heroLayout.fixed} ${styles.hero}`}>
          <PublicHeroBackground />
          <div className={`${styles.container} ${styles.heroContent}`}>
            <HeroPill>
              <span aria-hidden="true">🇬🇧</span> China to the United Kingdom
            </HeroPill>
            <h1>
              Import from China to the UK.
              <br />
              <span>Build something of your own.</span>
            </h1>
            <p className={styles.intro}>
              Buy the products you have found, source stock for your business,
              or put your brand on a product. Sure Imports connects the buying,
              sourcing and shipping, with a team in China and a UK point of
              contact.
            </p>
            <div className={styles.actions}>
              <Link href="#choose-your-route" className={styles.primary}>
                Find your starting point
              </Link>
              <a href={LINESCOUT_WHITE_LABEL_URL} className={styles.secondary}>
                Explore white-label ideas
              </a>
            </div>
            <div className={styles.trust}>
              <span>
                <MapPin aria-hidden="true" /> UK contact, China sourcing team
              </span>
              <span>
                <ShieldCheck aria-hidden="true" /> Operating since 2018
              </span>
              <span>
                <PackageCheck aria-hidden="true" /> Buying, branding and
                shipping
              </span>
            </div>
            <ImportMarkets active="uk" />
          </div>
        </section>
        <div className={styles.container}>
          <nav className={styles.jumpLinks} aria-label="On this page">
            <a href="#choose-your-route">Where to start</a>
            <a href="#white-labelling">Build your brand</a>
            <a href="#costs">Understand the costs</a>
            <a href="#uk-checklist">UK checklist</a>
            <a href="#questions">Your questions</a>
          </nav>

          <section id="choose-your-route" className={styles.section}>
            <span className={styles.eyebrow}>
              Three starting points. One connected service.
            </span>
            <h2 className={styles.heading}>
              You do not need to figure it all out before you begin.
            </h2>
            <p className={styles.lede}>
              Start with what you already have: a link, an idea or goods waiting
              to ship. We will help you take the next step.
            </p>
            <div className={styles.cards}>
              {routes.map((route) => (
                <article className={styles.card} key={route.href}>
                  <route.icon className={styles.icon} aria-hidden="true" />
                  <span className={styles.eyebrow}>{route.label}</span>
                  <h3>{route.title}</h3>
                  <p>{route.text}</p>
                  <Link className={styles.textLink} href={route.href}>
                    {route.action}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section
            id="white-labelling"
            className={`${styles.section} ${styles.split}`}
          >
            <div>
              <span className={styles.eyebrow}>
                Your product. Your name on it.
              </span>
              <h2 className={styles.heading}>
                You do not need a factory to start a brand.
              </h2>
              <p className={styles.lede}>
                White labelling lets you sell an existing manufacturer’s product
                under your own brand, where branding is available and permitted.
                Private labelling can go further, with changes to materials,
                features or packaging.
              </p>
              <p className={styles.lede}>
                LineScout is your sourcing workspace. Explore researched product
                ideas and estimated landed costs, then work with Sure Imports
                specialists to confirm suppliers, samples, branding and
                delivery.
              </p>
              <div className={styles.actions}>
                <a href={sourcing} className={styles.primary}>
                  Start your white-label project
                </a>
              </div>
              <p className={styles.note}>
                Select the United Kingdom in LineScout to explore GBP
                landed-cost estimates. These are planning estimates, not final
                quotations or guarantees of demand, availability or profit.
              </p>
            </div>
            <ol className={styles.steps}>
              {steps.map(([heading, text], i) => (
                <li key={heading}>
                  <span className={styles.number} aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div>
                    <h3>{heading}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.section} aria-labelledby="selling-heading">
            <span className={styles.eyebrow}>From sourcing to selling</span>
            <h2 id="selling-heading" className={styles.heading}>
              Plan for where your customers will buy.
            </h2>
            <p className={styles.lede}>
              Whether you sell on Amazon UK, TikTok Shop or your own website,
              the supplier’s price is only one part of the decision. Understand
              your selling costs before placing a bulk order.
            </p>
            <div className={styles.resources}>
              <a href={`${lineScout}/sell-on-amazon`}>
                <strong>Selling on Amazon UK</strong>
                <p>
                  Product selection, sourcing decisions, fulfilment
                  considerations and the costs behind your selling price.
                </p>
                <span className={styles.textLink}>Read the Amazon guide</span>
              </a>
              <a href={`${lineScout}/sell-on-tiktok-shop`}>
                <strong>Selling on TikTok Shop</strong>
                <p>
                  Choose a product you can demonstrate clearly, and plan for
                  platform fees, creator commissions and returns.
                </p>
                <span className={styles.textLink}>
                  Read the TikTok Shop guide
                </span>
              </a>
              <a href={`${lineScout}/amazon-profit-calculator`}>
                <strong>Check your estimated profit</strong>
                <p>
                  Compare Amazon and TikTok Shop scenarios in GBP before
                  committing your budget to stock.
                </p>
                <span className={styles.textLink}>
                  Use the profit calculator
                </span>
              </a>
            </div>
          </section>

          <section id="costs" className={`${styles.section} ${styles.split}`}>
            <div>
              <span className={styles.eyebrow}>Know the whole cost</span>
              <h2 className={styles.heading}>
                A low factory price is not your landed cost.
              </h2>
              <p className={styles.lede}>
                Build your budget in pounds, but check the currency of each
                quotation and payment. Allow for exchange rates and any
                payment-provider charges. Ask what is included before comparing
                two prices.
              </p>
              <p className={styles.lede}>
                For shipping from China to the UK, share the product, carton
                dimensions, weight, quantity and delivery postcode. Express, air
                and sea options depend on the goods and route availability; the
                fastest option is not always the best fit.
              </p>
              <p className={styles.note}>
                Keep samples, production time and freight transit time separate
                when planning your launch. Customs checks and final delivery can
                also affect arrival dates.
              </p>
              <div className={styles.actions}>
                <Link href="/ship-with-us" className={styles.secondary}>
                  Discuss your shipment
                </Link>
              </div>
            </div>
            <div className={styles.costs}>
              <h3>Your import budget, line by line</h3>
              <dl>
                {[
                  [
                    'The goods',
                    'Product specification, quantity, samples and supplier price.',
                  ],
                  [
                    'Your branding',
                    'Logo application, artwork, packaging, labels and any tooling.',
                  ],
                  [
                    'Sourcing and checks',
                    'Agreed service charges, supplier checks and inspection scope.',
                  ],
                  [
                    'Freight and delivery',
                    'China collection, consolidation, international freight and UK delivery as quoted.',
                  ],
                  [
                    'Import charges',
                    'Applicable duty, import VAT and clearance charges. Confirm who is responsible for each.',
                  ],
                  [
                    'Your selling costs',
                    'Marketplace fees, advertising, storage, returns and working capital.',
                  ],
                ].map(([label, text]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section
            id="uk-checklist"
            className={`${styles.section} ${styles.split}`}
          >
            <div>
              <span className={styles.eyebrow}>Before you pay a supplier</span>
              <h2 className={styles.heading}>
                Get the UK details right from the start.
              </h2>
              <p className={styles.lede}>
                The requirements depend on your goods, business and destination.
                Agree who will act as importer and handle customs, and check the
                product rules before production—not after goods reach the
                border.
              </p>
              <ul className={styles.checklist}>
                <li>
                  <strong>Import arrangements:</strong> check EORI requirements,
                  commodity classification and customs documentation.
                </li>
                <li>
                  <strong>Product requirements:</strong> confirm applicable
                  safety, labelling, testing and intellectual property
                  obligations.
                </li>
                <li>
                  <strong>Your destination:</strong> Great Britain and Northern
                  Ireland can follow different requirements.
                </li>
                <li>
                  <strong>The paperwork:</strong> keep the agreed specification,
                  commercial invoice, packing details and relevant compliance
                  records.
                </li>
              </ul>
            </div>
            <div className={styles.costs}>
              <h3>Start with official guidance</h3>
              <p className={styles.lede}>
                Use these sources alongside advice specific to your product and
                business.
              </p>
              <ul className={styles.checklist}>
                <li>
                  <a
                    className={styles.textLink}
                    href="https://www.gov.uk/import-goods-into-uk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GOV.UK: importing goods into the UK
                  </a>
                </li>
                <li>
                  <a
                    className={styles.textLink}
                    href="https://www.gov.uk/eori"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GOV.UK: EORI numbers
                  </a>
                </li>
                <li>
                  <a
                    className={styles.textLink}
                    href="https://www.gov.uk/guidance/product-safety-advice-for-businesses"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GOV.UK: product safety for businesses
                  </a>
                </li>
              </ul>
              <p className={styles.note}>
                A supplier’s assurance or marketplace listing is not proof of
                compliance. Sourcing support does not replace the
                responsibilities of the importer or seller.
              </p>
              <Link href="/supplier-verification" className={styles.textLink}>
                Already found a supplier? Explore verification
              </Link>
            </div>
          </section>

          <ImportReadingPath market="uk" />

          <section id="questions" className={styles.section}>
            <span className={styles.eyebrow}>A little more clarity</span>
            <h2 className={styles.heading}>
              Your China-to-UK questions, answered.
            </h2>
            <div className={styles.faq}>
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={`${styles.section} ${styles.split}`}>
            <div>
              <span className={styles.eyebrow}>
                A UK contact. A team in China.
              </span>
              <h2 className={styles.heading}>
                Bring the idea.
                <br />
                Let us work through the next step.
              </h2>
              <p className={styles.lede}>
                Tell us what you want to buy or build, your approximate quantity
                and where in the UK it needs to arrive. You do not need a
                finished business plan to start a conversation.
              </p>
              <div className={styles.actions}>
                <a href={sourcing} className={styles.primary}>
                  Start a sourcing project
                </a>
                <a
                  href="https://wa.me/447881194138?text=Hello%2C%20I%20would%20like%20help%20importing%20from%20China%20to%20the%20UK."
                  className={styles.secondary}
                >
                  Talk to our UK team
                </a>
              </div>
            </div>
            <div className={styles.contact}>
              <span className={styles.eyebrow}>Our UK company</span>
              <h3>Spreadit Sourcing Limited</h3>
              <address>
                33 Bevan Court, Dunlop Street
                <br />
                Warrington, WA4 6AA, England
                <br />
                <a href="tel:+447881194138">+44 788 119 4138</a>
                <br />
                <a href="mailto:hello@sureimports.com">hello@sureimports.com</a>
              </address>
              <p className={styles.note}>
                Part of the Sure Imports service, connecting UK buyers with
                sourcing and fulfilment support in China.
              </p>
              <Link className={styles.textLink} href="/import-hub">
                Explore the Import Hub
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
