'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Camera,
  Database,
  LayoutGrid,
  Menu,
  Radio,
  type LucideIcon,
} from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type SectionLink = {
  href: string;
  label: string;
  mobileLabel: string;
  description: string;
  icon: LucideIcon;
  matches: (pathname: string) => boolean;
};

const industryPaths = [
  '/body-camera-solutions/body-cameras-for-banks',
  '/body-camera-solutions/body-cameras-for-security-companies',
  '/body-camera-solutions/body-cameras-for-government',
  '/body-camera-solutions/body-cameras-for-transport-and-logistics',
  '/body-camera-solutions/body-cameras-for-oil-gas-and-industry',
];

const links: SectionLink[] = [
  {
    href: '/body-camera-solutions',
    label: 'Overview',
    mobileLabel: 'Solutions overview',
    description: 'The complete body-camera and evidence ecosystem',
    icon: LayoutGrid,
    matches: (pathname) => pathname === '/body-camera-solutions',
  },
  {
    href: '/body-camera-solutions/hytera-body-cameras',
    label: 'Cameras',
    mobileLabel: 'Body cameras',
    description: 'Compare connected and record-only field devices',
    icon: Camera,
    matches: (pathname) =>
      [
        '/body-camera-solutions/hytera-body-cameras',
        '/body-camera-solutions/hytera-sc580',
        '/body-camera-solutions/hytera-gc550',
      ].includes(pathname),
  },
  {
    href: '/body-camera-solutions/digital-evidence-management',
    label: 'Evidence',
    mobileLabel: 'Evidence management',
    description: 'Collect, protect, investigate and share evidence',
    icon: Database,
    matches: (pathname) =>
      [
        '/body-camera-solutions/digital-evidence-management',
        '/body-camera-solutions/hytera-eds30-docking-station',
      ].includes(pathname),
  },
  {
    href: '/body-camera-solutions/live-command-and-dispatch',
    label: 'Live command',
    mobileLabel: 'Live command',
    description: 'Connect field users with authorised dispatchers',
    icon: Radio,
    matches: (pathname) =>
      pathname === '/body-camera-solutions/live-command-and-dispatch',
  },
  {
    href: '/body-camera-solutions#industries',
    label: 'Industries',
    mobileLabel: 'Industry solutions',
    description: 'Solutions designed around operational context',
    icon: Building2,
    matches: (pathname) => industryPaths.includes(pathname),
  },
];

export default function SolutionHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 dark:border-slate-800 ${
        scrolled
          ? 'border-slate-200 bg-white/95 shadow-lg shadow-slate-200/50 dark:bg-slate-950/95 dark:shadow-black/10'
          : 'border-slate-200/80 bg-white/90 dark:bg-slate-950/90'
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? 'min-h-[68px]' : 'min-h-[78px]'
        }`}
      >
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label="Sure Imports home"
        >
          <Image
            src="/images/svg-logo.svg"
            alt="Sure Imports"
            width={180}
            height={40}
            priority
            className="h-7 w-auto dark:hidden sm:h-8"
          />
          <Image
            src="/images/svg-logo-white.svg"
            alt=""
            width={180}
            height={40}
            priority
            className="hidden h-7 w-auto dark:block sm:h-8"
          />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-slate-200/80 bg-slate-100/80 p-1 shadow-inner shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 xl:flex"
          aria-label="Body camera solutions"
        >
          {links.map((link) => {
            const active = link.matches(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-950/5 dark:bg-slate-800 dark:text-white dark:ring-white/10'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/body-camera-solutions#assessment"
            className="group hidden items-center gap-2 rounded-full bg-brand-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/35 active:scale-[0.98] md:inline-flex"
          >
            Request assessment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 xl:hidden"
                aria-label="Open body camera solutions menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="z-[100] w-full overflow-y-auto border-slate-800 bg-slate-950 p-0 text-white sm:max-w-md"
            >
              <SheetTitle className="sr-only">
                Body Camera Solutions Menu
              </SheetTitle>

              <div className="border-b border-white/10 px-6 pb-6 pt-8">
                <Image
                  src="/images/svg-logo-white.svg"
                  alt="Sure Imports"
                  width={180}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>

              <nav
                className="space-y-2 px-4 py-5"
                aria-label="Body camera solutions mobile"
              >
                {links.map((link) => {
                  const Icon = link.icon;
                  const active = link.matches(pathname);
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={`group flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                          active
                            ? 'border-white/15 bg-white/10 text-white'
                            : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                            active
                              ? 'bg-brand-orange-500 text-white'
                              : 'bg-slate-900 text-slate-400 group-hover:text-white'
                          }`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold">
                            {link.mobileLabel}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-400">
                            {link.description}
                          </span>
                        </span>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="border-t border-white/10 p-6">
                <SheetClose asChild>
                  <Link
                    href="/body-camera-solutions#assessment"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600"
                  >
                    Request an assessment
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </SheetClose>
                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Nigeria-based design, deployment and support for African
                  organisations.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
