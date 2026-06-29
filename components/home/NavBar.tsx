'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  MonitorPlay,
  Youtube,
  ShoppingCart,
  LogOut,
  Ship,
  Gift,
  Sparkles,
  Calculator,
  Box,
  Scale,
  Zap,
  DollarSign,
  Tags,
  Smartphone,
  Laptop,
  BookOpen,
  CalendarClock,
  Database,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/app/context/AuthContext';

const MENU_ITEMS = {
  videos: [
    {
      title: 'Import Hub',
      href: '/import-from-china-to-nigeria',
      icon: BookOpen,
      desc: 'Start here for Nigeria-focused import guides',
    },
    {
      title: 'YouTube',
      href: 'https://youtube.com/@sureimports?si=sAunkYlz_EUyT5nM',
      icon: Youtube,
      desc: 'Detailed tutorials and sourcing guides',
    },
    {
      title: 'TikTok',
      href: 'https://www.tiktok.com/@tochukwunkwocha',
      icon: MonitorPlay,
      desc: 'Quick tips and behind-the-scenes content',
    },
  ],
  services: [
    {
      title: 'Supplier Intelligence',
      href: '/supplier-intelligence',
      icon: Database,
      desc: 'Verified supplier research for Nigerian importers',
      color: 'from-slate-700 to-slate-950',
    },
    {
      title: 'Book Consultation',
      href: '/book-consultation',
      icon: CalendarClock,
      desc: 'Paid call for sourcing, supplier, cost and shipping decisions',
      color: 'from-brand-orange-400 to-brand-orange-600',
    },
    {
      title: 'Buy from Chinese Websites',
      href: '/buy-from-chinese-websites',
      icon: ShoppingCart,
      desc: 'Direct purchasing with quality assurance',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Ship with us',
      href: '/ship-with-us',
      icon: Ship,
      desc: 'Submit shipping-only requests for goods you already bought',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Corporate Sourcing',
      href: '/corporate-gifts',
      icon: Gift,
      desc: 'Branded gift sourcing and bulk customization',
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Laptops for Business',
      href: '/laptops-for-business',
      icon: Laptop,
      desc: 'Bulk laptop sourcing for teams, schools and resellers',
      color: 'from-slate-600 to-slate-900',
    },
    {
      title: 'LineScout',
      href: 'https://linescout.sureimports.com/',
      icon: Sparkles,
      desc: 'Machines and equipment sourcing guidance',
      color: 'from-purple-500 to-pink-600',
    },
  ],
  tools: [
    {
      title: 'Air vs Sea Calculator',
      href: '/tools/air-vs-sea-calculator',
      icon: Calculator,
      desc: 'Compare shipping methods instantly',
    },
    {
      title: 'Carton Optimization',
      href: '/tools/carton-optimization',
      icon: Box,
      desc: 'Optimize your carton size for shipping',
    },
    {
      title: 'CBM Calculator',
      href: '/tools/cbm-volumetric-weight-calculator',
      icon: Scale,
      desc: 'Calculate volumetric weight easily',
    },
    {
      title: 'Generator Sizing',
      href: '/tools/generator-sizing',
      icon: Zap,
      desc: 'Calculate the right generator size',
    },
    {
      title: 'Landed Cost Estimator',
      href: '/tools/landed-cost-estimator',
      icon: DollarSign,
      desc: 'Estimate total landed cost accurately',
    },
    {
      title: 'Retail Price Builder',
      href: '/tools/retail-price-builder',
      icon: Tags,
      desc: 'Turn landed cost into selling price',
    },
  ],
  shop: [
    {
      title: 'Shop',
      href: '/shop',
      icon: Smartphone,
      desc: 'Phones and electronics at wholesale prices',
      color: 'from-brand-orange-400 to-brand-orange-600',
    },
  ],
};

type NavbarProps = {
  forceLightNavbar?: boolean;
};

export default function Navbar({ forceLightNavbar = false }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isShopProductPage =
    Boolean(pathname?.startsWith('/shop/')) &&
    pathname !== '/shop/checkout' &&
    pathname !== '/shop/order-success';
  const LEGAL_PAGE_PATHS = [
    '/privacy-policy',
    '/terms-and-conditions',
    '/shipping-policy',
    '/warranty-policy',
    '/faya-warranty-policy',
    '/about',
  ];
  const isLegalPage = Boolean(pathname && LEGAL_PAGE_PATHS.includes(pathname));
  const isToolsPage = Boolean(pathname?.startsWith('/tools'));
  const isBlogPage = Boolean(pathname?.startsWith('/blog'));
  const useLightNavbar =
    forceLightNavbar || isShopProductPage || isLegalPage || isToolsPage || isBlogPage;
  const signInHref = '/auth/login';
  const isOnShopPage = Boolean(pathname?.startsWith('/shop'));

  const handleCartNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isOnShopPage) return;
    event.preventDefault();
    window.dispatchEvent(new Event('open-shop-cart'));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncCartCount = () => {
      try {
        const raw = localStorage.getItem('shopCart');
        if (!raw) {
          setCartCount(0);
          return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          setCartCount(0);
          return;
        }
        const count = parsed.reduce(
          (total: number, item: { quantity?: number }) =>
            total + Number(item?.quantity || 0),
          0,
        );
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    syncCartCount();
    window.addEventListener('storage', syncCartCount);
    window.addEventListener('shop-cart-updated', syncCartCount);
    return () => {
      window.removeEventListener('storage', syncCartCount);
      window.removeEventListener('shop-cart-updated', syncCartCount);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        useLightNavbar
          ? scrolled
            ? 'border-b border-slate-200 bg-white/95 py-3 shadow-lg shadow-slate-200/60 backdrop-blur-xl'
            : 'border-b border-slate-200/80 bg-white/85 py-5 backdrop-blur-xl'
          : scrolled
            ? 'border-b border-slate-800/60 bg-slate-950/80 py-3 shadow-xl shadow-black/10 backdrop-blur-xl'
            : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="z-50 flex items-center transition-opacity hover:opacity-80"
          >
            <Image
              src={
                useLightNavbar
                  ? '/images/svg-logo.svg'
                  : '/images/svg-logo-white.svg'
              }
              alt="Sure Imports"
              width={180}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      pathname === '/'
                        ? useLightNavbar
                          ? 'bg-slate-900/10 text-slate-900'
                          : 'bg-white/10 text-white'
                        : useLightNavbar
                          ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`rounded-full bg-transparent px-4 py-2 text-sm font-semibold transition-colors focus:bg-transparent ${
                      useLightNavbar
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white'
                    }`}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
                      {MENU_ITEMS.services.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                          desc={item.desc}
                          icon={item.icon}
                          color={item.color}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`rounded-full bg-transparent px-4 py-2 text-sm font-semibold transition-colors focus:bg-transparent ${
                      useLightNavbar
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white'
                    }`}
                  >
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[650px] grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
                      {MENU_ITEMS.tools.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                          desc={item.desc}
                          icon={item.icon}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/import-from-china-to-nigeria"
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      pathname === '/import-from-china-to-nigeria'
                        ? useLightNavbar
                          ? 'bg-slate-900/10 text-slate-900'
                          : 'bg-white/10 text-white'
                        : useLightNavbar
                          ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Import Hub
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/blog"
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      pathname?.startsWith('/blog')
                        ? useLightNavbar
                          ? 'bg-slate-900/10 text-slate-900'
                          : 'bg-white/10 text-white'
                        : useLightNavbar
                          ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Blog
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      useLightNavbar
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Link href="/shop">Shop</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      useLightNavbar
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Link href="/shop?openCart=1" onClick={handleCartNavClick}>
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <>
                <Button
                  asChild
                  className="rounded-full border-0 bg-brand-orange-500 px-6 py-5 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/40 active:scale-95"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-full border-0 bg-slate-800 px-6 py-5 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-700 active:scale-95"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="rounded-full border-0 bg-brand-orange-500 px-6 py-5 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/40 active:scale-95"
              >
                <Link href={signInHref}>Sign In</Link>
              </Button>
            )}
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`border-0 ${useLightNavbar ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full overflow-y-auto border-slate-800 bg-slate-950 p-0 sm:max-w-md"
              >
                <SheetTitle className="sr-only">
                  Main Navigation Menu
                </SheetTitle>
                <div className="p-6">
                  <Image
                    src="/images/svg-logo-white.svg"
                    alt="Sure Imports"
                    width={140}
                    height={30}
                    className="mb-8"
                  />

                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="rounded-xl px-4 py-3 text-lg font-semibold text-white hover:bg-slate-900"
                      >
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/import-from-china-to-nigeria"
                        className="rounded-xl px-4 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                      >
                        Import Hub
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/blog"
                        className="rounded-xl px-4 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                      >
                        Blog
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/shop"
                        className="rounded-xl px-4 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                      >
                        Shop
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/shop?openCart=1"
                        onClick={handleCartNavClick}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Cart
                        {cartCount > 0 && (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </SheetClose>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full border-none"
                    >
                      <AccordionItem value="services" className="border-none">
                        <AccordionTrigger className="rounded-xl px-4 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white hover:no-underline">
                          Services
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-0 pl-4 pt-2">
                          {MENU_ITEMS.services.map((item) => (
                            <SheetClose asChild key={item.title}>
                              <Link
                                href={item.href}
                                target={
                                  item.href.startsWith('http')
                                    ? '_blank'
                                    : undefined
                                }
                                rel={
                                  item.href.startsWith('http')
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-white"
                              >
                                <item.icon className="h-5 w-5" /> {item.title}
                              </Link>
                            </SheetClose>
                          ))}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="tools" className="border-none">
                        <AccordionTrigger className="rounded-xl px-4 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white hover:no-underline">
                          Tools
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-0 pl-4 pt-2">
                          {MENU_ITEMS.tools.map((item) => (
                            <SheetClose asChild key={item.title}>
                              <Link
                                href={item.href}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-white"
                              >
                                <item.icon className="h-5 w-5" /> {item.title}
                              </Link>
                            </SheetClose>
                          ))}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="videos" className="border-none">
                        <AccordionTrigger className="rounded-xl px-4 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white hover:no-underline">
                          Videos
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-0 pl-4 pt-2">
                          {MENU_ITEMS.videos.map((item) => (
                            <SheetClose asChild key={item.title}>
                              <Link
                                href={item.href}
                                target={
                                  item.href.startsWith('http')
                                    ? '_blank'
                                    : undefined
                                }
                                rel={
                                  item.href.startsWith('http')
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-white"
                              >
                                <item.icon className="h-5 w-5" /> {item.title}
                              </Link>
                            </SheetClose>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="mt-8 border-t border-slate-800 pt-8">
                    <SheetClose asChild>
                      {user ? (
                        <div className="space-y-3">
                          <Button
                            asChild
                            className="w-full rounded-xl bg-brand-orange-500 py-6 text-lg font-bold text-white hover:bg-brand-orange-600"
                          >
                            <Link href="/dashboard">Go to Dashboard</Link>
                          </Button>
                          <Button
                            type="button"
                            onClick={() => void logout()}
                            className="w-full rounded-xl bg-slate-800 py-6 text-lg font-bold text-white hover:bg-slate-700"
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <Button
                          asChild
                          className="w-full rounded-xl bg-brand-orange-500 py-6 text-lg font-bold text-white hover:bg-brand-orange-600"
                        >
                          <Link href={signInHref}>Sign In to Dashboard</Link>
                        </Button>
                      )}
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

type ListItemProps = {
  title: string;
  href: string;
  desc: string;
  icon: LucideIcon;
  color?: string;
};

const ListItem = ({ title, href, desc, icon: Icon, color }: ListItemProps) => {
  return (
    <li>
      <Link
        href={href}
        target={href.startsWith('http') ? '_blank' : '_self'}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-800"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${
            color ||
            'from-slate-700 to-slate-800 group-hover:from-slate-600 group-hover:to-slate-700'
          }`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="mb-1 text-sm font-bold text-white transition-colors group-hover:text-blue-400">
            {title}
          </h4>
          <p className="line-clamp-2 text-xs text-slate-400">{desc}</p>
        </div>
      </Link>
    </li>
  );
};
