import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TrustedOrganizations from '@/app/(home)/components/TrustedOrganizations';
import { homeReviews } from '@/app/(home)/homeReviews';
import GoogleReviews from '@/components/reviews/GoogleReviews';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { procurementVideo } from '@/lib/website-videos/public';
import { videoSchema } from '@/lib/website-videos/policy';
import styles from './buying-guide.module.css';

export const revalidate = 60;
const canonical = 'https://www.sureimports.com/buy-from-chinese-websites/video';
const description =
  'Watch our Chinese shopping walkthrough, then prepare your product links, choose a shipping method and start your order with Sure Imports.';
const preparation = [
  {
    title: 'Keep your product links together',
    text: 'Save the product link, price, quantity and any size or colour choices for each item. You can add multiple products to one order.',
  },
  {
    title: 'Check the shop and currency',
    text: '1688 and Taobao use Chinese yuan (RMB); Alibaba orders use USD in our order form. Each order uses one currency, so keep products with different currencies in separate orders.',
  },
  {
    title: 'Choose your destination and shipping',
    text: 'Select your destination country to see the available shipping methods. Tell us if your goods contain batteries or liquids so you can choose a suitable service.',
  },
];
const featuredReviews = homeReviews.filter((review) =>
  ['Roberta Edu', 'Amarachi Ndukauba Ogbuagu', 'Agu Mba'].includes(review.name),
);

export async function generateMetadata(): Promise<Metadata> {
  const video = await procurementVideo();
  const image = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
  return {
    title: video.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: video.title,
      description,
      url: canonical,
      type: 'video.other',
      images: [{ url: image, width: 480, height: 360, alt: video.title }],
      videos: [
        {
          url: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
          type: 'text/html',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { 'max-video-preview': -1, 'max-image-preview': 'large' },
    },
  };
}

export default async function BuyingGuideVideo() {
  const video = await procurementVideo();
  const duration = `${Math.floor(video.durationSeconds / 60)} min ${video.durationSeconds % 60} sec`;
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.sureimports.com' },
    {
      name: 'Buy from Chinese websites',
      url: 'https://www.sureimports.com/buy-from-chinese-websites',
    },
    { name: 'Video guide', url: canonical },
  ];
  return (
    <div className="public-site-theme">
      <Navbar forceLightNavbar />
      <main className={styles.page}>
        <JsonLdScript
          data={[
            {
              ...videoSchema(video),
              '@id': `${canonical}#video`,
              mainEntityOfPage: { '@id': canonical },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.url,
              })),
            },
          ]}
        />
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <ol>
            {breadcrumbs.map((item, index) => (
              <li key={item.url}>
                {index < breadcrumbs.length - 1 ? (
                  <Link href={new URL(item.url).pathname}>{item.name}</Link>
                ) : (
                  <span aria-current="page">{item.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <header className={styles.header}>
          <p className={styles.eyebrow}>THE SURE IMPORTS VIDEO GUIDE</p>
          <h1>
            Buy from 1688, Taobao and Pinduoduo from the UK, US, Nigeria and
            Beyond
          </h1>
          <p className={styles.intro}>
            Pay in GBP, USD or NGN and combine products from multiple suppliers
            in one order. We handle supplier verification, purchasing, product
            checks, consolidation, shipping and customs clearance. See how it
            works below.
          </p>
          <div className={styles.metadata}>
            <span>{duration}</span>
            <span aria-hidden="true">·</span>
            <span>
              Published{' '}
              <time dateTime={video.uploadDate}>
                {new Date(video.uploadDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            </span>
          </div>
        </header>
        <section aria-label="Watch the buying guide" className={styles.watch}>
          <div className={styles.player}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
        <div className={styles.videoSignup}>
          <Link className={styles.primary} href="/auth/signup">
            Create a Free Account
          </Link>
        </div>
        <TrustedOrganizations
          embedded
          label="Some of the organisations we’ve supported"
        />
        <section className={styles.trust} aria-labelledby="reviews-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>CUSTOMER EXPERIENCES</p>
            <h2 id="reviews-title">Real orders. People behind every one.</h2>
            <p>
              Hear from customers who have used Sure Imports for sourcing and
              delivery.
            </p>
          </div>
          <div className={styles.reviews}>
            {featuredReviews.map((review, index) => (
              <figure
                key={review.name}
                className={index === 0 ? styles.featuredReview : styles.review}
              >
                {index === 0 && review.image && (
                  <div
                    className={styles.reviewPortrait}
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      sizes="280px"
                    />
                  </div>
                )}
                <div className={styles.reviewBody}>
                  <figcaption className={styles.reviewAuthor}>
                    {review.image ? (
                      <Image
                        className={styles.reviewAvatar}
                        src={review.image}
                        alt=""
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span
                        className={styles.reviewInitials}
                        aria-hidden="true"
                      >
                        {review.initials}
                      </span>
                    )}
                    <div>
                      <strong>{review.name}</strong>
                      <span>{review.role}</span>
                    </div>
                  </figcaption>
                  <blockquote>
                    <p>“{review.quote}”</p>
                  </blockquote>
                </div>
              </figure>
            ))}
          </div>
        </section>
        <GoogleReviews />
        <section className={styles.about} aria-labelledby="about-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>ABOUT SURE IMPORTS</p>
            <h2 id="about-title">
              A team behind your order, from China to your door.
            </h2>
            <p>
              Since 2018, Sure Importers Limited has helped customers source
              products from China. We bring purchasing and shipping together,
              with a team to support you through the process.
            </p>
          </div>
          <div className={styles.aboutDetails}>
            <p>
              Share the products you want to buy. We help with supplier
              verification, purchasing and product checks, then consolidate your
              items at our Guangzhou warehouse for shipping and customs
              clearance.
            </p>
            <p>
              You can combine products from multiple suppliers in one order,
              provided they use the same shop currency. Your destination and
              product type determine the shipping options available.
            </p>
            <Link href="/about" className={styles.textLink}>
              Get to know Sure Imports <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
        <section className={styles.founder} aria-labelledby="founder-title">
          <div
            className={styles.founderPortrait}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <Image
              src="/images/new/images/sureimports-ceo.JPG"
              alt="Tochukwu Nkwocha, founder of Sure Imports"
              fill
              sizes="(max-width: 640px) 100vw, 340px"
            />
          </div>
          <div className={styles.founderCopy}>
            <p className={styles.eyebrow}>MEET THE FOUNDER</p>
            <h2 id="founder-title">Tochukwu Nkwocha</h2>
            <p className={styles.founderRole}>
              Founder &amp; Chief Executive Officer
            </p>
            <p>
              Tochukwu leads Sure Imports, bringing together experience in
              digital marketing, software development and product management to
              make sourcing from China easier to navigate.
            </p>
            <p>
              His work connects technology with the practical steps of
              importing: finding products, working with suppliers and getting
              orders delivered.
            </p>
            <nav className={styles.founderSocials} aria-label="Follow Tochukwu Nkwocha">
              <a
                href="https://www.facebook.com/share/19Tmj5y7fp/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.tiktok.com/@tochukwunkwocha"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
        </section>
        <section className={styles.prepare} aria-labelledby="prepare-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>BEFORE YOU ORDER</p>
            <h2 id="prepare-title">A little preparation. A simpler order.</h2>
            <p>
              Use this checklist alongside the video to get the details right.
            </p>
          </div>
          <ol className={styles.steps}>
            {preparation.map((step, index) => (
              <li key={step.title}>
                <span className={styles.number} aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.cta} aria-labelledby="start-title">
          <div>
            <h2 id="start-title">Ready to start your order?</h2>
            <p>Create your account and bring your product links together.</p>
          </div>
          <Link className={styles.primary} href="/auth/signup">
            Start your order <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
