import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Factory,
  FileSearch,
  Globe2,
  PackageCheck,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Smartphone,
  Truck,
  ChevronDown,
} from 'lucide-react';

import Navigation from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import {
  fetchPublishedBlogsLite,
  fetchPublishedBlogSlugs,
} from '@/app/(home)/actions/blogActions';
import { JsonLdScript } from '@/components/seo/JsonLd';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';
import {
  LINESCOUT_BULK_SOURCING_URL,
  LINESCOUT_MACHINE_SOURCING_URL,
} from '@/lib/linescoutLinks';

const baseUrl = 'https://www.sureimports.com';
const pageUrl = `${baseUrl}/import-from-china-to-nigeria`;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Import From China to Nigeria: Complete Sure Imports Hub',
  description:
    'Learn how to import from China to Nigeria with guides, calculators, shipping resources, sourcing support and Sure Imports service routes for different buyer needs.',
  keywords: [
    'import from China to Nigeria',
    'how to import from China to Nigeria',
    'China sourcing Nigeria',
    'shipping from China to Nigeria',
    'China procurement agent Nigeria',
    'mini importation Nigeria',
    '1688 Nigeria',
    'Alibaba Nigeria',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Import From China to Nigeria: Complete Sure Imports Hub',
    description:
      'A practical starting point for Nigerian buyers who want to source, buy, ship and plan China imports with fewer mistakes.',
    url: pageUrl,
    siteName: 'Sure Imports',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sure Imports China importation hub for Nigerians',
      },
    ],
  },
};

const featuredGuides = [
  {
    title: 'Import from China to Nigeria: practical 2026 pillar guide',
    text: 'Start here if you want the complete import process explained before choosing a service or calculator.',
    href: '/blog/import-from-china-to-nigeria-practical-2026-pillar-guide',
    icon: BookOpen,
  },
  {
    title: 'China to Nigeria shipping, customs and landed cost',
    text: 'Understand the cost and logistics questions that shape profit before goods leave China.',
    href: '/blog/china-to-nigeria-shipping-customs-and-landed-cost-pillar-guide',
    icon: Ship,
  },
  {
    title: 'Buy from Chinese websites in Nigeria',
    text: 'Compare 1688, Taobao, Alibaba, Pinduoduo and DHgate so you know when each platform makes sense.',
    href: '/blog/how-to-buy-from-chinese-websites-in-nigeria-1688-taobao-alibaba-pinduoduo-dhgate',
    icon: Globe2,
  },
  {
    title: 'Corporate sourcing from China to Nigeria',
    text: 'For banks, large companies and institutions that need a structured procurement process, formal approvals and reporting.',
    href: '/blog/corporate-sourcing-from-china-to-nigeria-pillar-guide-for-business-buyers',
    icon: Factory,
  },
];

const pathways = [
  {
    eyebrow: 'I am new',
    title: 'Learn the process first',
    text: 'Use the beginner guide, product research posts and cost tools before paying any supplier.',
    href: '/blog/the-complete-beginner-s-guide-to-starting-a-mini-importation-business-in-nigeria-2026-edition',
    icon: BookOpen,
  },
  {
    eyebrow: 'I found product links',
    title: 'Buy from Chinese websites',
    text: 'Submit product links from 1688, Alibaba, Taobao, or Pinduoduo for purchase handling.',
    href: '/buy-from-chinese-websites',
    icon: ShoppingCart,
  },
  {
    eyebrow: 'I need sourcing help',
    title: 'Start a LineScout project',
    text: 'For individuals and small businesses sourcing white-label products, wholesale stock or other products in bulk.',
    href: LINESCOUT_BULK_SOURCING_URL,
    icon: FileSearch,
  },
  {
    eyebrow: 'I already bought goods',
    title: 'Ship with Sure Imports',
    text: 'Use shipping-only when your supplier will send goods to our China warehouse for support.',
    href: '/ship-with-us',
    icon: Truck,
  },
  {
    eyebrow: 'Machines/equipment',
    title: 'Use LineScout',
    text: 'For industrial sourcing where rigorous specifications and supplier qualification matter.',
    href: LINESCOUT_MACHINE_SOURCING_URL,
    icon: Factory,
  },
  {
    eyebrow: 'Established organisations',
    title: 'Use Corporate Sourcing',
    text: 'For banks, large companies, institutions, government bodies and NGOs with formal procurement requirements.',
    href: '/corporate-sourcing',
    icon: ShieldCheck,
  },
  {
    eyebrow: 'Phones/laptops',
    title: 'Use specific routes',
    text: 'Phones and business laptops need separate checks around condition and deployment needs.',
    href: '/buy-phones-from-china',
    icon: Smartphone,
  },
];

const calculators = [
  ['Landed Cost Estimator', '/tools/landed-cost-estimator'],
  ['Retail Price Builder', '/tools/retail-price-builder'],
  ['Air vs Sea Calculator', '/tools/air-vs-sea-calculator'],
  ['CBM & Volumetric Calculator', '/tools/cbm-volumetric-weight-calculator'],
  ['Carton Optimization', '/tools/carton-optimization-tool'],
];

const faqs = [
  {
    question: 'What is the best way to import from China to Nigeria?',
    answer:
      'The best route depends on your situation. If you already have product links, use "Buy from Chinese Websites". Individuals and small businesses that need supplier search, white-label products, bulk sourcing or machines should use LineScout. Established organisations with formal procurement requirements should use Corporate Sourcing. If goods are already bought, use "Ship With Us".',
  },
  {
    question: 'Can Sure Imports help me calculate landed cost?',
    answer:
      'Yes. Sure Imports provides tools and guides to help Nigerian importers think through product cost, shipping assumptions and selling price. Final costs depend on product details, route, supplier terms and other order specifics.',
  },
  {
    question: 'Which service should I use for machines from China?',
    answer:
      'Use LineScout for machines, equipment and industrial products because those orders require stronger specification review, supplier qualification and inspection planning.',
  },
  {
    question: 'Should beginners start with 1688 or Alibaba?',
    answer:
      'Beginners should first understand platform differences, product risk, minimum order quantity, shipping and landed cost. This hub links to guides that compare 1688, Alibaba, Taobao, Pinduoduo and other Chinese platforms.',
  },
];

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Import From China to Nigeria Hub',
    url: pageUrl,
    description:
      'A Sure Imports resource hub for Nigerian buyers who want to learn how to import from China, calculate costs and choose the right buying, sourcing or shipping route.',
    publisher: {
      '@type': 'Organization',
      name: 'Sure Imports',
      url: baseUrl,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
];

function getBlogSlugFromHref(href: string) {
  if (!href.startsWith('/blog/')) return null;
  return href.replace(/^\/blog\//, '').replace(/\/$/, '');
}

function isPublishedHref(href: string, publishedSlugs: Set<string>) {
  const slug = getBlogSlugFromHref(href);
  return !slug || publishedSlugs.has(slug);
}

function resolvePublicHref(href: string, publishedSlugs: Set<string>) {
  return isPublishedHref(href, publishedSlugs) ? href : '/blog';
}

export default async function ImportFromChinaHubPage() {
  const [publishedBlogSlugs, latestBlogResult] = await Promise.all([
    fetchPublishedBlogSlugs(),
    fetchPublishedBlogsLite(1, 9),
  ]);
  const publishedSlugs = new Set(publishedBlogSlugs);
  const latestPublishedGuides = latestBlogResult.posts;
  const visibleFeaturedGuides = featuredGuides.filter((guide) =>
    isPublishedHref(guide.href, publishedSlugs),
  );
  const visiblePathways = pathways.map((pathway) => ({
    ...pathway,
    href: resolvePublicHref(pathway.href, publishedSlugs),
  }));

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-950 antialiased dark:bg-slate-950 dark:text-white selection:bg-brand-orange-500/30">
      <JsonLdScript data={schema} />
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-slate-950 pb-20 pt-36 text-white md:pb-28 md:pt-44">
        <PublicHeroBackground />
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-orange-500/10 blur-[120px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md">
              <BookOpen className="h-4 w-4" />
              Sure Imports Resource Hub
            </div>
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
              Import from China to Nigeria <span className="text-white">without guessing</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Use this hub to learn the process, choose the right service, estimate costs, avoid supplier mistakes and move from research to a practical import plan.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/supplier-intelligence"
                className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-brand-orange-500 px-8 text-base font-bold text-white transition-all hover:bg-brand-orange-600 hover:scale-[1.02] shadow-[0_0_30px_rgba(249,115,22,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Supplier Intelligence <ShieldCheck className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/blog"
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
              >
                Browse All Guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {visibleFeaturedGuides.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Foundation Knowledge
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Start with these core guides.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {visibleFeaturedGuides.map((guide) => (
                <Link 
                  key={guide.href} 
                  href={guide.href} 
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-brand-orange-200 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
                >
                  <div>
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-50 dark:bg-brand-orange-500/10 text-brand-orange-500 group-hover:scale-110 transition-transform">
                      <guide.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white leading-tight group-hover:text-brand-orange-600 dark:group-hover:text-brand-orange-400 transition-colors">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {guide.text}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- PATHWAYS --- */}
      <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
              Service Routes
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Choose the right path for your situation.
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Matching your need to the right service saves time and prevents costly mistakes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visiblePathways.map((pathway) => (
              <Link 
                key={pathway.title} 
                href={pathway.href} 
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-brand-orange-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange-500 mb-6">
                  {pathway.eyebrow}
                </p>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                  <pathway.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  {pathway.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {pathway.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALCULATORS --- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:items-center">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-50 dark:bg-brand-orange-500/10 text-brand-orange-500 mb-6">
              <Calculator className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Calculate before you commit.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Cost mistakes usually happen before payment. Use these tools before deciding on product price, order size, shipping method, or your final retail selling price.
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {calculators.map(([label, href]) => (
              <Link 
                key={href} 
                href={href} 
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-brand-orange-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="font-bold text-slate-950 dark:text-white group-hover:text-brand-orange-600 dark:group-hover:text-brand-orange-400 transition-colors">
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-orange-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {latestPublishedGuides.length > 0 && (
        <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40 md:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange-500">
                Published Import Guides
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Deepen your knowledge.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Read current Sure Imports guides that are already live on the blog.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPublishedGuides.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex min-h-[260px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-orange-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div>
                    <p className="mb-5 text-[10px] font-black uppercase tracking-widest text-brand-orange-500">
                      {post.category || 'Import Guide'}
                    </p>
                    <h3 className="text-xl font-bold leading-tight text-slate-950 transition-colors group-hover:text-brand-orange-600 dark:text-white dark:group-hover:text-brand-orange-400">
                      {post.title}
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-brand-orange-600 dark:text-white dark:group-hover:text-brand-orange-400">
                    Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-sm font-bold text-slate-950 transition hover:border-brand-orange-300 hover:text-brand-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-600 dark:hover:text-brand-orange-400"
              >
                Browse all published guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* --- CTA SECTION --- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-16 text-center text-white shadow-2xl sm:px-12 md:py-20 lg:px-16">
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange-500/20 blur-[100px] pointer-events-none" />
            
            <ShieldCheck className="mx-auto h-12 w-12 text-brand-orange-400 mb-6" />
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Not sure which path fits your import?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Individuals and small businesses can use LineScout for supplier comparison, custom branding, bulk products and machines. Corporate Sourcing is reserved for established organisations with formal procurement needs.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link 
                href={LINESCOUT_BULK_SOURCING_URL}
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand-orange-500 px-8 text-sm font-bold text-white transition hover:bg-brand-orange-600"
              >
                Start with LineScout <PackageCheck className="h-4 w-4" />
              </Link>
              <Link 
                href="/buy-from-chinese-websites" 
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Submit Product Links <ShoppingCart className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- NATIVE ACCORDION FAQS --- */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900/30 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
            Common Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-bold text-slate-950 dark:text-white outline-none transition hover:text-brand-orange-500 dark:hover:text-brand-orange-400">
                  <span>{faq.question}</span>
                  <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition group-open:rotate-180 dark:bg-slate-800">
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </span>
                </summary>
                <div className="px-6 pb-6 leading-relaxed text-slate-600 dark:text-slate-400">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
