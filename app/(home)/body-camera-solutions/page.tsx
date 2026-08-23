import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ChevronDown,
  Database,
  Eye,
  FileCheck2,
  Landmark,
  LockKeyhole,
  Radio,
  Server,
  ShieldCheck,
  Truck,
  Waves,
} from 'lucide-react';
import { JsonLdScript } from '@/components/seo/JsonLd';
import {
  BODY_CAMERA_LAUNCH_READY,
  bodyCameraBrand,
  bodyCameraPlaceholders,
  bodyCameraVideo,
} from '@/lib/bodyCameraSolutions/config';
import AssessmentSection from './_components/AssessmentSection';
import DocumentDownloads from './_components/DocumentDownloads';
import BodyCameraVideo from './_components/BodyCameraVideo';
import { bodyCameraProductImages } from '@/lib/bodyCameraSolutions/images';

const pageUrl = `${bodyCameraBrand.baseUrl}${bodyCameraBrand.hubPath}`;

export const metadata: Metadata = {
  title: 'Body Camera & Digital Evidence Solutions Nigeria',
  description:
    'Hytera body cameras, docking, Digital Evidence Management and live command solutions designed, supplied and supported for organisations in Nigeria and Africa.',
  keywords: [
    'body camera Nigeria',
    'body worn camera supplier Nigeria',
    'Hytera body camera Nigeria',
    'digital evidence management Nigeria',
    '4G body camera Nigeria',
    'body camera for security companies',
  ],
  alternates: { canonical: pageUrl },
  robots: BODY_CAMERA_LAUNCH_READY
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
  openGraph: {
    title: 'Body Camera & Digital Evidence Solutions for Nigeria',
    description:
      'From field capture to secure, auditable evidence—designed and supported by Sure Imports.',
    type: 'website',
    url: pageUrl,
    siteName: 'Sure Imports',
    images: [
      {
        url: `${bodyCameraBrand.baseUrl}${bodyCameraProductImages.sc580.src}`,
        alt: bodyCameraProductImages.sc580.alt,
      },
    ],
  },
};

const workflow = [
  {
    title: 'Capture',
    text: 'Record clear video, audio and photographs in the field.',
    icon: Camera,
  },
  {
    title: 'Collect',
    text: 'Dock, charge and acquire recordings through a controlled handover.',
    icon: Server,
  },
  {
    title: 'Protect',
    text: 'Encrypt, retain and restrict access to sensitive evidence.',
    icon: LockKeyhole,
  },
  {
    title: 'Investigate',
    text: 'Search, tag, link, review and redact evidence efficiently.',
    icon: Eye,
  },
  {
    title: 'Share',
    text: 'Disclose authorised copies through traceable workflows.',
    icon: FileCheck2,
  },
];

const industries = [
  {
    title: 'Banks & financial institutions',
    href: '/body-camera-solutions/body-cameras-for-banks',
    icon: Landmark,
    text: 'Security, sensitive operations, incident review and staff protection.',
  },
  {
    title: 'Private security',
    href: '/body-camera-solutions/body-cameras-for-security-companies',
    icon: ShieldCheck,
    text: 'Guard accountability, client-site evidence and live escalation.',
  },
  {
    title: 'Government & public safety',
    href: '/body-camera-solutions/body-cameras-for-government',
    icon: Building2,
    text: 'Enforcement, inspections and auditable public-facing operations.',
  },
  {
    title: 'Transport & logistics',
    href: '/body-camera-solutions/body-cameras-for-transport-and-logistics',
    icon: Truck,
    text: 'Fleet, terminal, cargo handover and field-team incidents.',
  },
  {
    title: 'Oil, gas & industry',
    href: '/body-camera-solutions/body-cameras-for-oil-gas-and-industry',
    icon: Waves,
    text: 'Site security, inspections, remote supervision and safety review.',
  },
];

const faqs = [
  {
    question: 'Does Sure Imports supply only the body cameras?',
    answer:
      'We can assess device-only requirements, but our core offering is the complete operational solution: cameras, docking, evidence software, storage design, implementation, training, warranty and support.',
  },
  {
    question: 'Can the solution be deployed on premises?',
    answer:
      'Yes. Hytera Digital Evidence Management supports on-premises and cloud deployment options. We recommend an architecture after reviewing data sovereignty, connectivity, resilience and operating-cost requirements.',
  },
  {
    question: 'Can prices be quoted in naira and US dollars?',
    answer:
      'Yes. Product and project quotations can be prepared in NGN or USD based on your selected equipment, deployment model and support requirements.',
  },
  {
    question: 'Can we run a pilot before a large deployment?',
    answer:
      'Yes. A representative pilot is recommended for larger programmes to validate policy, user experience, connectivity, docking throughput, evidence review and storage assumptions.',
  },
  {
    question: 'Do you support tenders and RFPs?',
    answer:
      'Yes. Sure Imports can review technical and commercial requirements, build a compliant solution schedule and coordinate manufacturer clarification where required.',
  },
  {
    question: 'Can Sure Imports serve organisations outside Nigeria?',
    answer:
      'Yes, subject to destination, manufacturer territory rules, shipping, implementation and support requirements. USD quotations are available for eligible African markets.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: 'Body-Worn Camera and Digital Evidence Solutions',
      description: metadata.description,
      url: pageUrl,
      serviceType:
        'Enterprise body-worn camera and digital evidence deployment',
      provider: {
        '@type': 'Organization',
        name: 'Sure Imports',
        url: bodyCameraBrand.baseUrl,
      },
      areaServed: [
        { '@type': 'Country', name: 'Nigeria' },
        { '@type': 'Place', name: 'Africa' },
      ],
      brand: { '@type': 'Brand', name: 'Hytera' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@type': 'VideoObject',
      name: 'Hytera Body Camera and Digital Evidence Solution Overview',
      description:
        'See how Hytera body cameras support frontline recording, evidence collection and coordinated operations across the incident workflow.',
      thumbnailUrl: [bodyCameraVideo.posterUrl],
      uploadDate: '2026-08-23',
      duration: 'PT2M0S',
      contentUrl: bodyCameraVideo.manifestUrl,
      embedUrl: bodyCameraVideo.playerUrl,
    },
  ],
};

const sectionEyebrow =
  'text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-600';

export default function BodyCameraSolutionsPage() {
  return (
    <main className="bg-[#f5f6fa] text-slate-950 dark:bg-slate-950 dark:text-white">
      <JsonLdScript data={schema} />

      <section className="px-4 pb-14 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className={`${sectionEyebrow} mt-6`}>
            {bodyCameraBrand.partnerDesignation} ·{' '}
            {bodyCameraBrand.partnerRegion}
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Body cameras and evidence systems for accountable operations.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Hytera body-worn cameras, secure evidence management and optional
            live command—designed and supported for organisations in Nigeria and
            across Africa.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#assessment"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(32,69,155,0.24)] transition hover:bg-blue-900"
            >
              Request an assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#solutions"
              className="inline-flex items-center justify-center rounded-2xl border border-blue-900/15 bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:border-blue-900/30 dark:bg-slate-900 dark:text-blue-300"
            >
              Compare the two options
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Nigeria-based project support</span>
            <span>NGN and USD quotations</span>
            <span>Pilot to enterprise scale</span>
          </div>
        </div>
      </section>

      <BodyCameraVideo />

      <article className="mx-auto mb-16 w-[calc(100%-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:w-[calc(100%-3rem)]">
        <section className="px-6 py-10 sm:px-10 sm:py-12">
          <p className={sectionEyebrow}>The complete evidence lifecycle</p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                More than a camera on a uniform.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                A dependable deployment governs what happens before, during and
                after recording. We bring the field device, collection
                infrastructure and evidence controls into one design.
              </p>
            </div>
            <ol className="border-t border-slate-200 dark:border-slate-800">
              {workflow.map(({ title, text, icon: Icon }, index) => (
                <li
                  key={title}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-slate-200 py-5 dark:border-slate-800 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="pt-0.5 text-sm font-bold text-blue-700 dark:text-blue-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <h3 className="font-bold">{title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="solutions"
          className="scroll-mt-28 border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12"
        >
          <p className={sectionEyebrow}>Choose your operating model</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Two field options. One governed evidence platform.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              {
                name: 'GC550 Standard Evidence',
                tag: 'Reliable capture',
                href: '/body-camera-solutions/hytera-gc550',
                text: 'Compact 2K recording for teams focused on straightforward capture, central docking and controlled evidence retention.',
                features: [
                  'Under 120 g',
                  '2K recording',
                  'Slide-to-record control',
                  'Central docking and DEM',
                ],
                image: bodyCameraProductImages.gc550,
              },
              {
                name: 'SC580 Connected Command',
                tag: 'Live operations',
                href: '/body-camera-solutions/hytera-sc580',
                text: 'Smart 4G body-worn video for teams that also need live visibility, location information and voice coordination.',
                features: [
                  '4G/WLAN live video',
                  'Push-to-talk',
                  'Positioning',
                  'Record and stream',
                ],
                image: bodyCameraProductImages.sc580,
              },
            ].map((solution) => (
              <div
                key={solution.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="relative h-64 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:h-72">
                  <Image
                    src={solution.image.src}
                    alt={solution.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-7"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400">
                    {solution.tag}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">{solution.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {solution.text}
                  </p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {solution.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
                      >
                        <Check className="h-3.5 w-3.5 text-brand-orange-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={solution.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-brand-orange-600 dark:text-blue-300"
                  >
                    View solution <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {[
              {
                title: 'Digital Evidence Management',
                href: '/body-camera-solutions/digital-evidence-management',
                text: 'Protect, search, review, redact and share evidence.',
                icon: Database,
              },
              {
                title: 'EDS30 Docking Station',
                href: '/body-camera-solutions/hytera-eds30-docking-station',
                text: 'Acquire and charge eight cameras simultaneously.',
                icon: Server,
              },
              {
                title: 'Live Command & Dispatch',
                href: '/body-camera-solutions/live-command-and-dispatch',
                text: 'Connect selected field users to authorised dispatchers.',
                icon: Radio,
              },
            ].map(({ title, href, text, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group grid gap-2 py-5 sm:grid-cols-[2rem_1fr_auto] sm:items-center sm:gap-4"
              >
                <Icon className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                <span>
                  <span className="block font-bold">{title}</span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                    {text}
                  </span>
                </span>
                <ArrowRight className="hidden h-4 w-4 text-slate-400 transition group-hover:translate-x-1 sm:block" />
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
          <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10 sm:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <Database className="h-7 w-7 text-blue-700 dark:text-blue-300" />
                <p className={`${sectionEyebrow} mt-5`}>Secure by design</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  From field footage to useful, auditable evidence.
                </h2>
              </div>
              <div>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Hytera DEM centralises video, audio, photographs and documents
                  so authorised teams can manage cases without losing control of
                  sensitive material.
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    'AES-256 encryption and digital signatures',
                    'Case and evidence linkage',
                    'User and function permissions',
                    'Activity logs and audit trails',
                    'Evidence search and tagging',
                    'Video, audio and privacy redaction',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm font-semibold"
                    >
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/body-camera-solutions/digital-evidence-management"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-brand-orange-600 dark:text-blue-300"
                >
                  Explore evidence management <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="industries"
          className="scroll-mt-28 border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12"
        >
          <p className={sectionEyebrow}>Designed around your operation</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            For organisations where accountability matters.
          </h2>
          <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {industries.map(({ title, href, icon: Icon, text }) => (
              <Link
                key={title}
                href={href}
                className="group grid gap-2 py-5 sm:grid-cols-[2rem_1fr_auto] sm:items-center sm:gap-4"
              >
                <Icon className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                <span>
                  <span className="block font-bold">{title}</span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                    {text}
                  </span>
                </span>
                <ArrowRight className="hidden h-4 w-4 text-slate-400 transition group-hover:translate-x-1 sm:block" />
              </Link>
            ))}
          </div>
        </section>

        {bodyCameraPlaceholders.caseStudyApproved ? (
          <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
            <p className={sectionEyebrow}>Deployment story</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              A 1,000-user evidence environment for a Nigerian financial
              institution.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              A removable case-study module covering a multi-site camera fleet,
              portable docking, 90-day retention, on-premises evidence
              management and an optional live command layer.
            </p>
          </section>
        ) : null}

        <DocumentDownloads />

        <section className="border-t border-slate-200 px-6 py-10 dark:border-slate-800 sm:px-10 sm:py-12">
          <p className={sectionEyebrow}>Common questions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Before your organisation begins.
          </h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {faqs.map((faq) => (
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
      </article>

      <AssessmentSection />
    </main>
  );
}
