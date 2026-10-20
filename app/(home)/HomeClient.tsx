import { homeReviews } from './homeReviews';
import TrustedOrganizations from './components/TrustedOrganizations';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Package, Search, Ship, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { LINESCOUT_BULK_SOURCING_URL } from '@/lib/linescoutLinks';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import styles from './HomePage.module.css';

const startingPoints = [
  {
    icon: Package,
    title: 'I have product links',
    description:
      'Buy from 1688, Taobao, Alibaba and other Chinese websites. Add your products to one order; we handle the purchase and shipping.',
    href: '/buy-from-chinese-websites',
    action: 'Build your order',
    detail: 'Buy from Chinese websites',
  },
  {
    icon: Search,
    title: 'I need to find a supplier',
    description:
      'Source wholesale stock, white-label products or machinery with LineScout. Start with what you need and work with our sourcing team.',
    href: LINESCOUT_BULK_SOURCING_URL,
    action: 'Explore LineScout',
    detail: 'Product & supplier sourcing',
  },
  {
    icon: Ship,
    title: 'My goods are ready to ship',
    description:
      'Already bought your products? Arrange warehouse intake, consolidation and shipping from China to your destination.',
    href: '/ship-with-us',
    action: 'Arrange shipping',
    detail: 'Shipping & consolidation',
  },
];
const specialistServices = [
  {
    title: 'Supplier intelligence',
    description: 'Research suppliers before you commit.',
    href: '/supplier-intelligence',
  },
  {
    title: 'Supplier verification',
    description: 'Company checks and physical visits in China.',
    href: '/supplier-verification',
  },
  {
    title: 'Corporate sourcing',
    description: 'Procurement for teams and institutions.',
    href: '/corporate-sourcing',
  },
  {
    title: 'Laptops for business',
    description: 'Source laptops for your team or customers.',
    href: '/laptops-for-business',
  },
  {
    title: 'Shop phones & gadgets',
    description: 'Browse our curated technology range.',
    href: '/shop',
  },
];
const steps = [
  {
    title: 'Tell us what you need',
    description:
      'Share product links, a sourcing brief or the details of goods you have already bought.',
  },
  {
    title: 'Review the details',
    description:
      'Confirm your products, costs and shipping arrangements before moving ahead.',
  },
  {
    title: 'Follow your order',
    description:
      'Keep your order details and updates together in your Sure Imports dashboard.',
  },
];

export default function HomeClient() {
  return (
    <>
      <Navbar />
      <main id="home-content" className={styles.home} data-si-page-theme="home">
        <section
          className={`${styles.container} ${styles.hero}`}
          aria-labelledby="home-title"
        >
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Your team for buying from China</p>
            <h1 id="home-title">
              A simpler way to
              <br className={styles.desktopBreak} /> import from{' '}
              <span>China.</span>
            </h1>
            <p className={styles.intro}>
              From the products you find to the goods you receive. Get help with
              sourcing, purchasing and shipping, all in one place.
            </p>
            <div className={styles.actions}>
              <Link href="/start" className={styles.primary}>
                Start your order <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a href="#services-section" className={styles.textLink}>
                Find the right service{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <p className={styles.heroNote}>
              <Check size={15} aria-hidden="true" /> Start with product links.
              Save as you go.
            </p>
          </div>
          <figure
            className={styles.heroVisual}
            aria-labelledby="shipment-card-title"
          >
            <div className={styles.shipmentHeader}>
              <span className={styles.shipmentLabel}>
                Buying & shipping, connected
              </span>
              <Package size={20} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h2 id="shipment-card-title">
              Many products.
              <br />
              One order.
            </h2>
            <div
              className={styles.marketplaces}
              aria-label="Buy from Chinese marketplaces"
            >
              <span>1688</span>
              <span>Taobao</span>
              <span>Alibaba</span>
            </div>
            <svg
              className={styles.parcelArt}
              viewBox="0 0 440 200"
              fill="none"
              aria-hidden="true"
            >
              <ellipse
                cx="220"
                cy="174"
                rx="151"
                ry="16"
                className={styles.parcelShadow}
              />
              <path
                d="M45 63H105M335 63H395M220 15V36"
                className={styles.routeLine}
              />
              <circle cx="45" cy="63" r="4" className={styles.routeDot} />
              <circle cx="395" cy="63" r="4" className={styles.routeDot} />
              <path
                d="M137 74 220 34 303 74 220 116Z"
                className={styles.boxTop}
              />
              <path
                d="M137 74 220 116V183L137 141Z"
                className={styles.boxLeft}
              />
              <path
                d="M220 116 303 74V141L220 183Z"
                className={styles.boxRight}
              />
              <path
                d="M183 52 266 94V119L251 127V102L168 60Z"
                className={styles.boxTape}
              />
              <path
                d="M151 112 178 126M151 121 170 131"
                className={styles.boxMark}
              />
              <path
                d="M76 122 116 103 156 123 116 143Z"
                className={styles.boxTop}
              />
              <path
                d="M76 122 116 143V178L76 157Z"
                className={styles.boxLeft}
              />
              <path
                d="M116 143 156 123V158L116 178Z"
                className={styles.boxRight}
              />
              <path
                d="M282 126 325 105 368 126 325 147Z"
                className={styles.boxTop}
              />
              <path
                d="M282 126 325 147V181L282 160Z"
                className={styles.boxLeft}
              />
              <path
                d="M325 147 368 126V160L325 181Z"
                className={styles.boxRight}
              />
              <path
                d="M307 113 350 134V146L340 151V139L297 118Z"
                className={styles.boxTape}
              />
            </svg>
            <figcaption className={styles.shipmentCaption}>
              <div>
                <span>01</span>
                <strong>Purchase</strong>
                <small>Your product links</small>
              </div>
              <div>
                <span>02</span>
                <strong>Consolidate</strong>
                <small>Our China warehouse</small>
              </div>
              <div>
                <span>03</span>
                <strong>Ship</strong>
                <small>Your destination</small>
              </div>
            </figcaption>
          </figure>
        </section>

        <TrustedOrganizations />

        <section
          id="services-section"
          className={`${styles.container} ${styles.section}`}
          aria-labelledby="services-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Start where you are</p>
              <h2 id="services-title">What can we help you with?</h2>
            </div>
            <p>
              Whether you have a product in mind or a shipment ready to go,
              there’s a place to start.
            </p>
          </div>
          <div className={styles.serviceGrid}>
            {startingPoints.map(({ icon: Icon, ...service }) => (
              <article key={service.title} className={styles.service}>
                <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
                <p className={styles.serviceLabel}>{service.detail}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href={service.href} className={styles.textLink}>
                  {service.action}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          <div className={styles.specialists}>
            <div>
              <h3>A little more specialised?</h3>
              <p>
                Support for the decisions and purchases that need extra
                attention.
              </p>
            </div>
            <div className={styles.serviceList}>
              {specialistServices.map((service) => (
                <Link key={service.href} href={service.href}>
                  <div>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                  </div>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          className={styles.processSection}
          aria-labelledby="process-title"
        >
          <div className={`${styles.container} ${styles.process}`}>
            <div>
              <p className={styles.eyebrow}>From first idea to delivery</p>
              <h2 id="process-title">
                Less guesswork.
                <br />A clear next step.
              </h2>
              <p className={styles.processIntro}>
                Buying internationally comes with questions. We help you work
                through the details, with a team in China and an order you can
                follow.
              </p>
              <Link href="/book-consultation" className={styles.textLink}>
                Talk through your plans{' '}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <ol className={styles.steps}>
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className={`${styles.container} ${styles.section}`}
          aria-labelledby="reviews-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>In our customers’ words</p>
              <h2 id="reviews-title">Good relationships travel far.</h2>
            </div>
            <p>
              From machinery and bulk orders to gifts for a special occasion.
              Here’s what our customers say about working with us.
            </p>
          </div>
          <div className={styles.reviews}>
            {homeReviews.map((review, index) => (
              <figure
                key={review.name}
                className={index === 0 ? styles.reviewFeatured : undefined}
              >
                <div className={styles.reviewBody}>
                  <div
                    className={styles.reviewRating}
                    aria-label="5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }, (_, star) => (
                      <Star key={star} size={14} aria-hidden="true" />
                    ))}
                  </div>
                  {index === 0 && (
                    <p className={styles.reviewLabel}>A customer’s story</p>
                  )}
                  <blockquote>
                    <p>“{review.quote}”</p>
                  </blockquote>
                </div>
                <figcaption>
                  {review.image ? (
                    <Image src={review.image} alt="" width={40} height={40} />
                  ) : (
                    <span className={styles.reviewAvatar} aria-hidden="true">
                      {review.initials}
                    </span>
                  )}
                  <div>
                    <span>{review.name}</span>
                    <small>{review.role}</small>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          className={`${styles.container} ${styles.closing}`}
          aria-labelledby="closing-title"
        >
          <div>
            <p className={styles.eyebrow}>Your next order starts here</p>
            <h2 id="closing-title">Found something you want to buy?</h2>
            <p>Bring your product links. We’ll help with the rest.</p>
          </div>
          <Link href="/buy-from-chinese-websites" className={styles.primary}>
            Build your order <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
