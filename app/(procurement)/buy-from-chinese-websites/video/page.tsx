import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { procurementVideo } from '@/lib/website-videos/public';
import { videoSchema } from '@/lib/website-videos/policy';
import styles from './video.module.css';

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
const guides = [
  {
    href: '/buy-from-chinese-websites',
    title: 'Buying from Chinese websites',
    text: 'Explore the service and prepare your product list.',
  },
  {
    href: '/shipping-rate',
    title: 'Shipping rates and methods',
    text: 'Compare the available options for your destination.',
  },
  {
    href: '/tools/landed-cost-estimator',
    title: 'Plan your landed cost',
    text: 'Estimate your budget before placing an order.',
  },
];

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
          <h1>{video.title}</h1>
          <p className={styles.intro}>
            See how buying from Chinese websites works, then get your own order
            ready with confidence.
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
          <div className={styles.videoFooter}>
            <p>A walkthrough you can pause and follow at your own pace.</p>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
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
          <p className={styles.note}>
            <strong>A note on estimates.</strong> Weight and shipping cost are
            estimated. Actual weight and shipping cost will be determined when
            your products arrive at our warehouse in Guangzhou, China.
          </p>
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
        <section className={styles.related} aria-labelledby="related-title">
          <h2 id="related-title">Keep planning your import</h2>
          <div className={styles.guides}>
            {guides.map((guide) => (
              <Link href={guide.href} key={guide.href}>
                <h3>
                  {guide.title} <span aria-hidden="true">↗</span>
                </h3>
                <p>{guide.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
