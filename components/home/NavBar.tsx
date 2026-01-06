'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { AlignRight } from 'lucide-react';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
// import NotificationMessage from './NotificationMessage';
// import NotificationStrip from './NotificationStrip';

const components: { title: string; href: string; icon: string }[] = [
  {
    title: 'Buy from Chinese websites',
    href: '/buy-from-chinese-websites',
    icon: '/icons/general-procurement.svg',
  },
  {
    title: 'Source products from China',
    href: '/source-products-from-china',
    icon: '/icons/special-sourcing.svg',
  },
  // {
  //   title: 'General Procurement',
  //   href: '/services/general-procurement',
  //   icon: '/icons/general-procurement.svg',
  // },
  // {
  //   title: 'Special Sourcing',
  //   href: '/services/special-sourcing',
  //   icon: '/icons/special-sourcing.svg',
  // },
  // {
  //   title: 'Buy from Chinese websites',
  //   href: '/buy-from-chinese-websites',
  //   icon: '/icons/special-sourcing.svg',
  // },
  // {
  //   title: 'Source products from China',
  //   href: '/source-products-from-china',
  //   icon: '/icons/special-sourcing.svg',
  // },
  // {
  //   title: 'Pay Supplier',
  //   href: '/services/pay-supplier',
  //   icon: '/icons/pay-supplier.svg',
  // },
  // {
  //   title: 'Shipping Only',
  //   href: '/services/shipping-only',
  //   icon: '/icons/shipping.svg',
  // },
];

const components2: { title: string; href: string; icon: string }[] = [
  {
    title: 'Buy Phones From China',
    href: '/buy-phones-from-china',
    icon: '/icons/general-procurement.svg',
  },
  // {
  //   title: 'Deal Directly With Suppliers',
  //   href: '/shop/deal-directly-with-suppliers',
  //   icon: '/icons/special-sourcing.svg',
  // },
  {
    title: 'Faya Accessories',
    href: '/faya',
    icon: '/icons/special-sourcing.svg',
  },
];

const NavBar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* <NotificationMessage /> */}

      {/* <NotificationStrip /> */}

      <div className="fixedX z-50 flex max-h-10 w-full flex-col overflow-y-visible bg-[#161629] px-20 pb-20 pt-6 max-md:max-w-full max-md:px-5">
        {!isMobile && (
          <div className="flex w-full flex-row justify-between">
            <div className="z-20 h-20 w-72 pt-5">
              <Link href="/" passHref>
                <Image
                  //src="/images/logo-white.svg"
                  src="/images/svg-logo-white.svg"
                  alt="Spreadit"
                  width={500}
                  height={300}
                  className=""
                  quality={500}
                />
              </Link>
            </div>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={clsx(navigationMenuTriggerStyle(), {
                        'after:w-full after:scale-x-100': pathname === '/',
                      })}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Videos</NavigationMenuTrigger>
                  <NavigationMenuContent className="rounded-2xl bg-transparent">
                    <ul className="grid w-72 gap-3 rounded-3xl bg-transparent p-6 lg:grid-cols-[.75fr_1fr]">
                      <ListItem
                        href="https://www.tiktok.com/@tochukwunkwocha"
                        title="TikTok"
                        icon="/icons/tiktok-app-symbol.svg"
                      />
                      <ListItem
                        href="https://www.youtube.com/@sureimports"
                        title="YouTube"
                        icon="/icons/yt-app-symbol.svg"
                      />
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={clsx(navigationMenuTriggerStyle(), {
                      'after:w-full after:scale-x-100':
                        pathname.startsWith('/services'),
                    })}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-96 gap-3 p-4 md:grid-cols-2">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          icon={component.icon}
                          active={pathname.startsWith('/services')}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={clsx(navigationMenuTriggerStyle(), {
                      'after:w-full after:scale-x-100':
                        pathname.startsWith('/shop'),
                    })}
                  >
                    Shop
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className="grid w-96 gap-3 p-4 md:grid-cols-2">
                      {components2.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          icon={component.icon}
                          active={pathname.startsWith('/shop')}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                  {/* <Link
                  href="/shop/deal-directly-with-suppliers"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink
                    className={clsx(navigationMenuTriggerStyle(), {
                      'after:w-full after:scale-x-100':
                        pathname === '/shop/deal-directly-with-suppliers',
                    })}
                  >
                    Shop
                  </NavigationMenuLink>
                </Link> */}
                </NavigationMenuItem>

                {/* <NavigationMenuItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_ACADEMY_SITE_URL}/`}
                    legacyBehavior
                    passHref
                    target="_blank"
                  >
                    <NavigationMenuLink
                      className={clsx(navigationMenuTriggerStyle(), {
                        'after:w-full after:scale-x-100':
                          pathname === '/academy',
                      })}
                    >
                      Academy
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem> */}

                {/* <NavigationMenuItem>
                  <Link
                    href="https://spreaditglobal.com/calculator"
                    legacyBehavior
                    passHref
                    target="_blank"
                  >
                    <NavigationMenuLink
                      className={clsx(navigationMenuTriggerStyle(), {
                        'after:w-full after:scale-x-100':
                          pathname === '/calculator',
                      })}
                    >
                      Calculator
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem> */}

                {/* <NavigationMenuItem>
                  <Link
                    href="https://calendly.com/sureimports/product-sourcing-one-one-one-session/"
                    legacyBehavior
                    passHref
                    target="_blank"
                  >
                    <NavigationMenuLink
                      className={clsx(navigationMenuTriggerStyle(), {
                        'after:w-full after:scale-x-100':
                          pathname ===
                          'https://calendly.com/sureimports/product-sourcing-one-one-one-session/',
                      })}
                    >
                      <div className="rounded-xl bg-orange-500 p-2 pl-5 pr-5">
                        Book a Call
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem> */}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="pt-5">
              {/* <Button className="z-20 mr-7 h-12 w-28 bg-orange-500">
                <Link
                  href="https://calendly.com/sureimports/product-sourcing-one-one-one-session/"
                  target="_blank"
                  passHref
                >
                  Book a Call
                </Link>
              </Button> */}

              <Button asChild className="z-20 h-12 w-28">
                <Link href="/auth/login" passHref>
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        )}
        {isMobile && (
          <div className="z-30 flex w-full flex-row items-center justify-between">
            <div className="z-30 -ml-3 h-20 w-64 pt-3">
              <Link href="/" passHref>
                <Image
                  //src="/images/logo-white.png"
                  src="/images/svg-logo-white.svg"
                  alt="Sure Imports"
                  width={500}
                  height={300}
                  className="m-2"
                  quality={500}
                />
              </Link>
            </div>

            <Sheet>
              <SheetTrigger asChild className="m-2 h-10">
                <Button className="text-white" aria-label="Open navigation menu">
                  <AlignRight />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-[#161629] text-white">
                <div className="w-full space-y-1 pt-6">
                  {/* Home Link */}
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className={clsx(
                        'flex min-h-[44px] items-center gap-4 rounded-xl px-3 py-3 text-base text-white transition-colors hover:bg-white/10',
                        {
                          'bg-white/20': pathname === '/',
                        },
                      )}
                    >
                      Home
                    </Link>
                  </SheetClose>

                  {/* Accordion for expandable sections */}
                  <Accordion type="single" collapsible className="w-full space-y-1">
                    {/* Videos Section */}
                    <AccordionItem value="videos" className="border-none">
                      <AccordionTrigger className="min-h-[44px] rounded-xl px-3 py-0 text-base text-white hover:bg-white/10 hover:no-underline [&[data-state=open]]:bg-white/10">
                        Videos
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-1 pl-4">
                          <SheetClose asChild>
                            <Link
                              href="https://www.tiktok.com/@tochukwunkwocha"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              <Image
                                src="/icons/tiktok-app-symbol.svg"
                                alt="TikTok"
                                width={20}
                                height={20}
                                className="rounded-full bg-white p-1"
                              />
                              TikTok
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href="https://www.youtube.com/@sureimports"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              <Image
                                src="/icons/yt-app-symbol.svg"
                                alt="YouTube"
                                width={20}
                                height={20}
                                className="rounded-full bg-white p-1"
                              />
                              YouTube
                            </Link>
                          </SheetClose>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Services Section */}
                    <AccordionItem value="services" className="border-none">
                      <AccordionTrigger
                        className={clsx(
                          'min-h-[44px] rounded-xl px-3 py-0 text-base text-white hover:bg-white/10 hover:no-underline',
                          {
                            'bg-white/20': pathname.startsWith('/services') ||
                                          pathname.startsWith('/buy-from-chinese-websites') ||
                                          pathname.startsWith('/source-products-from-china'),
                            '[&[data-state=open]]:bg-white/10': !(pathname.startsWith('/services') ||
                                          pathname.startsWith('/buy-from-chinese-websites') ||
                                          pathname.startsWith('/source-products-from-china')),
                          }
                        )}
                      >
                        Services
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-1 pl-4">
                          {components.map((component) => (
                            <SheetClose asChild key={component.title}>
                              <Link
                                href={component.href}
                                className={clsx(
                                  'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white',
                                  {
                                    'bg-white/20 text-white': pathname === component.href,
                                  },
                                )}
                              >
                                <Image
                                  src={component.icon}
                                  alt={component.title}
                                  width={20}
                                  height={20}
                                  className="rounded-full bg-white p-1"
                                />
                                <span className="flex-1">{component.title}</span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Shop Section */}
                    <AccordionItem value="shop" className="border-none">
                      <AccordionTrigger
                        className={clsx(
                          'min-h-[44px] rounded-xl px-3 py-0 text-base text-white hover:bg-white/10 hover:no-underline',
                          {
                            'bg-white/20': pathname.startsWith('/shop') ||
                                          pathname.startsWith('/buy-phones-from-china') ||
                                          pathname.startsWith('/faya'),
                            '[&[data-state=open]]:bg-white/10': !(pathname.startsWith('/shop') ||
                                          pathname.startsWith('/buy-phones-from-china') ||
                                          pathname.startsWith('/faya')),
                          }
                        )}
                      >
                        Shop
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-1 pl-4">
                          {components2.map((component) => (
                            <SheetClose asChild key={component.title}>
                              <Link
                                href={component.href}
                                className={clsx(
                                  'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white',
                                  {
                                    'bg-white/20 text-white': pathname === component.href,
                                  },
                                )}
                              >
                                <Image
                                  src={component.icon}
                                  alt={component.title}
                                  width={20}
                                  height={20}
                                  className="rounded-full bg-white p-1"
                                />
                                <span className="flex-1">{component.title}</span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Additional Navigation Links */}
                  <div className="space-y-1 pt-2">
                    <SheetClose asChild>
                      <Link
                        href="https://spreaditglobal.com/calculator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center gap-4 rounded-xl px-3 py-3 text-base text-white transition-colors hover:bg-white/10"
                      >
                        Calculator
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="https://calendly.com/sureimports/product-sourcing-one-one-one-session/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center rounded-xl px-3 py-3"
                      >
                        <div className="w-full rounded-xl bg-orange-500 px-5 py-2 text-center text-base font-medium text-white transition-colors hover:bg-orange-600">
                          Book a Call
                        </div>
                      </Link>
                    </SheetClose>
                  </div>

                  {/* Sign In Button Footer */}
                  <div className="mt-6 w-full pt-4">
                    <SheetClose asChild className="w-full">
                      <Button
                        variant="default"
                        asChild
                        className="h-12 w-full bg-white text-base font-medium text-indigo-800 transition-colors hover:bg-indigo-100"
                      >
                        <Link href="/auth/login">
                          Sign In
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </>
  );
};
//test
const ListItem = React.forwardRef<
  React.ElementRef<'div'>,
  {
    className?: string;
    title: string;
    href: string;
    icon: string;
    active?: boolean;
  }
>(({ className, title, href, icon, active, ...props }, ref) => {
  return (
    <li>
      <Link href={href} passHref>
        <div
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-xl p-3 leading-none text-indigo-800 no-underline outline-none transition-colors hover:bg-indigo-800 hover:bg-opacity-10 focus:bg-indigo-800 focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-opacity-50',
            { 'after:w-full after:scale-x-100': active }, // Apply active class
            className,
          )}
          {...props}
        >
          <div className="flex items-center">
            <Image
              src={icon}
              alt={`${title} icon`}
              width={20}
              height={20}
              className="mr-2"
            />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
        </div>
      </Link>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default NavBar;
