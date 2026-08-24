import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BadgeCheck, Check, ChevronDown } from 'lucide-react';
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
import HeroTitle from '../_components/HeroTitle';
import TechnologyStage from '../_components/TechnologyStage';

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

const sectionEyebrow =
  'text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-600 dark:text-brand-orange-400';

const heroTitleLinesBySlug: Record<string, string[]> = {
  'hytera-body-cameras': [
    'Hytera body',
    'cameras for',
    'accountable field',
    'operations',
  ],
  'hytera-sc580': ['Hytera SC580', 'smart 4G', 'body camera'],
  'hytera-gc550': ['Hytera GC550', 'compact 2K', 'body camera'],
  'digital-evidence-management': [
    'Digital Evidence',
    'Management for',
    'secure, auditable',
    'footage',
  ],
  'hytera-eds30-docking-station': [
    'Hytera EDS30',
    'portable eight-bay',
    'docking station',
  ],
  'live-command-and-dispatch': ['Live body-camera', 'command and', 'dispatch'],
  'body-cameras-for-banks': [
    'Body-camera',
    'systems for banks',
    'and financial',
    'institutions',
  ],
  'body-cameras-for-security-companies': [
    'Body cameras',
    'for private security',
    'companies',
  ],
  'body-cameras-for-government': [
    'Body-camera and',
    'evidence systems',
    'for government',
  ],
  'body-cameras-for-transport-and-logistics': [
    'Body cameras',
    'for transport and',
    'logistics operations',
  ],
  'body-cameras-for-oil-gas-and-industry': [
    'Body cameras for',
    'oil, gas and',
    'industrial teams',
  ],
};

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = solutionPageBySlug.get(slug);
  if (!page) notFound();

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
    <main className="overflow-hidden bg-[#f8fafc] text-slate-950 dark:bg-slate-950 dark:text-white">
      <JsonLdScript data={schema} />

      <section className="relative px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(circle_at_75%_20%,rgba(31,94,178,0.12),transparent_34%),linear-gradient(rgba(26,55,91,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(26,55,91,0.05)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl">
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

          <header className="mt-10 grid items-center gap-x-14 gap-y-8 lg:mt-14 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="min-w-0 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-900/10 bg-white/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Professional evidence systems
              </div>
              <p className={`${sectionEyebrow} mt-7`}>{page.eyebrow}</p>
              <HeroTitle lines={heroTitleLinesBySlug[slug] ?? [page.title]} />
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                {page.description}
              </p>
            </div>

            {productImage ? (
              <TechnologyStage
                image={productImage}
                eyebrow={page.eyebrow}
                status="Solution profile"
                priority
                className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1"
              />
            ) : null}

            <div className="order-3 max-w-2xl lg:col-start-1 lg:row-start-2">
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#assessment"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#153f87] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_32px_rgba(21,63,135,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0f326f]"
                >
                  Design your solution{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#related-solutions"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white"
                >
                  Explore related solutions <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-3 border-t border-slate-200 pt-5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300 sm:grid-cols-3">
                {page.heroPoints.map((point) => (
                  <span key={point} className="inline-flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand-orange-600" />
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </header>
        </div>
      </section>

      <article className="mx-auto mb-16 max-w-7xl px-4 sm:px-6">
        <section className="grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-slate-900 sm:grid-cols-3">
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
            <div
              key={item.label}
              className="border-b border-slate-200 p-6 last:border-b-0 dark:border-white/10 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="py-16 sm:py-24">
          <p className={sectionEyebrow}>The operational case</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                {page.challengeTitle}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                {page.challenge}
              </p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-3">
              {page.outcomes.map((outcome, index) => (
                <li
                  key={outcome.title}
                  className="group relative min-h-56 overflow-hidden border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-cyan-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="mt-12">
                    <h3 className="text-lg font-bold">{outcome.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {outcome.text}
                    </p>
                  </div>
                  <span className="absolute right-0 top-0 h-px w-12 bg-brand-orange-500" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] bg-[#07111f] px-7 py-12 text-white sm:px-10 sm:py-16 lg:px-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(34,211,238,0.13),transparent_28%),linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                Solution capabilities
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                Engineered as a system, not a box shipment.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                Hardware, evidence controls and operating policy work together
                as one supported environment.
              </p>
            </div>
            <div className="grid border border-white/10 sm:grid-cols-2">
              {page.capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="min-h-48 border-b border-white/10 p-6 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <BadgeCheck className="h-5 w-5 text-cyan-300" />
                  <div className="mt-8">
                    <h3 className="font-bold text-white">{capability.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {capability.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {page.specifications ? (
          <section className="py-16 sm:py-24">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className={sectionEyebrow}>Key specifications</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                  The technical profile.
                </h2>
              </div>
              <p className="max-w-md text-xs leading-6 text-slate-500 dark:text-slate-400">
                Final specifications, accessories and compatibility are
                confirmed against the manufacturer-approved project datasheet.
              </p>
            </div>
            <dl className="mt-9 grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-3">
              {page.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="relative min-h-36 border-b border-slate-200 p-6 last:border-b-0 dark:border-white/10 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {spec.label}
                  </dt>
                  <dd className="mt-8 text-base font-bold leading-6">
                    {spec.value}
                  </dd>
                  <span className="absolute bottom-0 left-0 h-0.5 w-10 bg-blue-700 dark:bg-cyan-300" />
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-24">
          <p className={sectionEyebrow}>A controlled rollout</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
              From requirement to supported operation.
            </h2>
            <ol className="grid border-l border-slate-200 dark:border-white/10 sm:grid-cols-5 sm:border-l-0 sm:border-t">
              {page.process.map((step, index) => (
                <li
                  key={step}
                  className="relative min-h-32 border-b border-slate-200 p-5 text-sm font-semibold dark:border-white/10 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <span className="text-[10px] font-bold tracking-[0.18em] text-blue-700 dark:text-cyan-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-8 block leading-6">{step}</span>
                  <span className="absolute -left-1 top-5 h-2 w-2 rounded-full bg-brand-orange-500 sm:-top-1 sm:left-5" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <DocumentDownloads />

        <section className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20">
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
          className="border-t border-slate-200 py-16 dark:border-slate-800 sm:py-20"
          aria-label="Related solution areas"
        >
          <p className={sectionEyebrow}>Continue your research</p>
          <h2 className="mt-3 text-2xl font-bold">Related solution areas</h2>
          <ul className="mt-7 grid gap-3 md:grid-cols-3">
            {relatedPages.map((related) => (
              <li
                key={related.slug}
                className="group border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900"
              >
                <Link
                  href={`/body-camera-solutions/${related.slug}`}
                  className="flex items-start justify-between gap-4 font-bold text-slate-950 transition group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-300"
                >
                  {related.shortTitle}{' '}
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                </Link>
                <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
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
