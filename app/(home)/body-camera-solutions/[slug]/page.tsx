import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  ChevronDown,
  Database,
  Radio,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { JsonLdScript } from '@/components/seo/JsonLd';
import {
  BODY_CAMERA_LAUNCH_READY,
  bodyCameraBrand,
} from '@/lib/bodyCameraSolutions/config';
import {
  solutionPageBySlug,
  solutionPages,
} from '@/lib/bodyCameraSolutions/content';
import { solutionImageBySlug } from '@/lib/bodyCameraSolutions/images';
import AssessmentSection from '../_components/AssessmentSection';
import DocumentDownloads from '../_components/DocumentDownloads';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutionPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = solutionPageBySlug.get(slug);
  if (!page) return {};
  const url = `${bodyCameraBrand.baseUrl}${bodyCameraBrand.hubPath}/${slug}`;
  const productImage = solutionImageBySlug[slug];

  return {
    title: `${page.shortTitle} Nigeria`,
    description: page.description,
    keywords: page.searchIntent,
    alternates: { canonical: url },
    robots: BODY_CAMERA_LAUNCH_READY
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      url,
      siteName: 'Sure Imports',
      images: productImage
        ? [
            {
              url: `${bodyCameraBrand.baseUrl}${productImage.src}`,
              alt: productImage.alt,
            },
          ]
        : undefined,
    },
  };
}

function visualIcon(slug: string) {
  if (slug.includes('evidence')) return Database;
  if (slug.includes('docking')) return Server;
  if (slug.includes('command')) return Radio;
  return Camera;
}

const sectionEyebrow =
  'text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-600';

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = solutionPageBySlug.get(slug);
  if (!page) notFound();

  const Icon = visualIcon(slug);
  const productImage = solutionImageBySlug[slug];
  const pageUrl = `${bodyCameraBrand.baseUrl}${bodyCameraBrand.hubPath}/${slug}`;
  const relatedPages = page.relatedSlugs.flatMap((relatedSlug) => {
    const related = solutionPageBySlug.get(relatedSlug);
    return related ? [related] : [];
  });
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': page.productName ? 'Product' : 'Service',
        '@id': `${pageUrl}#primary`,
        name: page.productName || page.title,
        description: page.description,
        url: pageUrl,
        ...(page.productName
          ? {
              brand: { '@type': 'Brand', name: 'Hytera' },
              ...(productImage
                ? {
                    image: `${bodyCameraBrand.baseUrl}${productImage.src}`,
                  }
                : {}),
            }
          : {
              provider: {
                '@type': 'Organization',
                name: 'Sure Imports',
                url: bodyCameraBrand.baseUrl,
              },
            }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: bodyCameraBrand.baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Body Camera Solutions',
            item: `${bodyCameraBrand.baseUrl}${bodyCameraBrand.hubPath}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.shortTitle,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className="bg-[#f5f6fa] text-slate-950 dark:bg-slate-950 dark:text-white">
      <JsonLdScript data={schema} />

      <section className="px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-5xl">
          <nav
            className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-blue-700">
              Home
            </Link>
            <span>/</span>
            <Link href="/body-camera-solutions" className="hover:text-blue-700">
              Body Camera Solutions
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">
              {page.shortTitle}
            </span>
          </nav>

          <header className="mx-auto mt-12 max-w-4xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className={`${sectionEyebrow} mt-6`}>{page.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {page.description}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="#assessment"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(32,69,155,0.24)] transition hover:bg-blue-900"
              >
                Request an assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#related-solutions"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-900/15 bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:border-blue-900/30 dark:bg-slate-900 dark:text-blue-300"
              >
                Explore related solutions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {page.heroPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
                  {point}
                </span>
              ))}
            </div>

            {productImage ? (
              <figure className="mx-auto mt-10 max-w-3xl">
                <div className="relative h-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:h-96">
                  <Image
                    src={productImage.src}
                    alt={productImage.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 768px"
                    className="object-contain p-7 sm:p-10"
                  />
                </div>
                <figcaption className="mt-3 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {productImage.subject} · Official product imagery courtesy of
                  Hytera
                </figcaption>
              </figure>
            ) : null}
          </header>
        </div>
      </section>

      <article className="mx-auto mb-16 w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:w-[calc(100%-3rem)]">
        <section className="grid gap-px bg-slate-200 dark:bg-slate-800 sm:grid-cols-3">
          {[
            { label: 'Best suited to', value: page.audience },
            {
              label: 'Commercial model',
              value: 'Configured project quotation in NGN or USD',
            },
            {
              label: 'Delivery model',
              value: 'Assessment, pilot, implementation, training and support',
            },
          ].map((item) => (
            <div key={item.label} className="bg-white p-6 dark:bg-slate-900">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="px-6 py-10 sm:px-10 sm:py-12">
          <p className={sectionEyebrow}>The operational case</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {page.challengeTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                {page.challenge}
              </p>
            </div>
            <ol className="border-t border-slate-200 dark:border-slate-800">
              {page.outcomes.map((outcome, index) => (
                <li
                  key={outcome.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-slate-200 py-5 dark:border-slate-800"
                >
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-bold">{outcome.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {outcome.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
          <p className={sectionEyebrow}>Solution capabilities</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Designed as an operating system, not a box shipment.
          </h2>
          <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {page.capabilities.map((capability) => (
              <div
                key={capability.title}
                className="grid gap-2 py-5 sm:grid-cols-[2rem_1fr] sm:gap-4"
              >
                <BadgeCheck className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                <div>
                  <h3 className="font-bold">{capability.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {capability.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {page.specifications ? (
          <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
            <p className={sectionEyebrow}>Key specifications</p>
            <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h2 className="text-3xl font-semibold tracking-tight">
                Decision-useful product details.
              </h2>
              <p className="max-w-md text-xs leading-6 text-slate-500 dark:text-slate-400">
                Final specifications, accessories and compatibility will be
                confirmed against the manufacturer-approved project datasheet.
              </p>
            </div>
            <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-3">
              {page.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="bg-slate-50 p-5 dark:bg-slate-950"
                >
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {spec.label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
          <p className={sectionEyebrow}>A controlled rollout</p>
          <div className="mt-3 grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              From requirement to supported operation.
            </h2>
            <ol className="border-t border-slate-200 dark:border-slate-800">
              {page.process.map((step, index) => (
                <li
                  key={step}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-slate-200 py-4 text-sm font-semibold dark:border-slate-800"
                >
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <DocumentDownloads />

        <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
          <p className={sectionEyebrow}>Common questions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            What decision-makers need to know.
          </h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-blue-700 transition-transform group-open:rotate-180 dark:text-blue-400" />
                </summary>
                <p className="max-w-3xl pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <nav
          id="related-solutions"
          className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12"
          aria-label="Related solution areas"
        >
          <p className={sectionEyebrow}>Continue your research</p>
          <h2 className="mt-3 text-2xl font-bold">Related solution areas</h2>
          <ul className="mt-5 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {relatedPages.map((related) => (
              <li key={related.slug} className="py-5">
                <Link
                  href={`/body-camera-solutions/${related.slug}`}
                  className="inline-flex items-center gap-2 font-bold text-blue-700 underline decoration-blue-200 underline-offset-4 transition hover:text-brand-orange-600 dark:text-blue-300"
                >
                  {related.shortTitle} <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {related.description}
                </p>
              </li>
            ))}
          </ul>
        </nav>
      </article>

      <AssessmentSection source={`body-camera-solutions/${slug}`} />
    </main>
  );
}
