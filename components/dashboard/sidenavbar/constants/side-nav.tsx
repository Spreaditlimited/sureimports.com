'use client';

import {
  Download,
  HandCoins,
  Instagram,
  Package,
  Settings,
  ShoppingBag,
  ShoppingBasketIcon,
  ShoppingCart,
  ShoppingCartIcon,
  User2,
  Wallet,
} from 'lucide-react';
import {
  Category,
  Frame,
  Pay,
  SpecialSource,
  Shipping,
  BuyPhones,
  Shop,
  Message,
  Tiktok,
  Logout,
  Youtube,
  Academy,
  Affiliate,
} from '../components/icons/category';
import { type NavItem } from '../types';
import { BsInstagram, BsTiktok, BsYoutube } from 'react-icons/bs';
import { BiMoney } from 'react-icons/bi';

export const NavItems: NavItem[] = [
  {
    title: 'Videos',
    icon: Category,
    href: '/',
    target: '_blank',
    color: 'text-white',
    isChidren: true,
    children: [
      {
        title: 'TikTok',
        icon: BsTiktok,
        color: 'text-white',
        href: 'https://www.tiktok.com/@tochukwunkwocha',
        target: '_blank',
      },
      {
        title: 'Youtube',
        icon: BsYoutube,
        color: 'text-white',
        href: 'https://youtube.com/@sureimports?si=Ff0Ziwec36sACB2g',
      },
      // {
      //   title: 'Youtube',
      //   icon: BsYoutube,
      //   color: 'text-white',
      //   href: 'https://www.youtube.com/embed/MR9Sxx4dRaM',
      // },
      // {
      //   title: 'Instagram',
      //   icon: BsInstagram,
      //   color: 'text-white',
      //   href: 'https://www.instagram.com/sureimport',
      // },
    ],
  },
  {
    title: 'Shop',
    icon: ShoppingBag,
    href: '/dashboard/shop',
    color: 'text-white',
  },
  {
    title: 'Buy From Chinese Websites',
    icon: Shop,
    href: '/dashboard/procurement',
    color: 'text-white',
  },
  {
    title: 'Buy Phones & Laptops',
    icon: ShoppingCartIcon,
    href: '/dashboard/store?id=laptop',
    color: 'text-white',
  },
  {
    title: 'Special Sourcing',
    icon: SpecialSource,
    href: '/dashboard/special-sourcing/pending',
    color: 'text-white',
  },
  // {
  //   title: 'Pay Supplier',
  //   icon: Pay,
  //   href: '/dashboard/pay-supplier/saved',
  //   color: 'text-white',
  // },
  // {
  //   title: 'Shipping only',
  //   icon: Shipping,
  //   href: '/dashboard/shipping-only/request-received',
  //   color: 'text-white',
  // },
  {
    title: 'Verify Supplier',
    icon: Pay,
    href: '/dashboard/verify-supplier/pending-payment',
    color: 'text-white',
  },
  // {
  //   title: 'Buy Phones',
  //   icon: BuyPhones,
  //   href: '/dashboard/buy-phones',
  //   color: 'text-white',
  // },
  {
    title: 'Refunds',
    icon: BiMoney,
    href: '/dashboard/refunds',
    color: 'text-white',
  },
  {
    title: 'Wallet',
    icon: Wallet,
    href: '/dashboard/wallet',
    color: 'text-white',
  },
  {
    title: 'My Orders',
    icon: Package,
    href: '/dashboard/orders',
    color: 'text-white',
  },
  // {
  //   title: 'Buy Phones',
  //   icon: BuyPhones,
  //   href: '/',
  //   color: 'text-white',
  //   isChidren: true,
  //   children: [
  //     {
  //       title: 'Download',
  //       icon: Download,
  //       color: 'text-white',
  //       href: '/',
  //     },
  //   ],
  // },
  {
    title: 'Pay Small Small',
    icon: HandCoins,
    href: '/dashboard/pay-small-small?status=SAVED',
    color: 'text-white',
  },
  {
    title: 'Resources',
    icon: ShoppingCartIcon,
    href: 'https://spreadit.selar.co',
    color: 'text-white',
  },
  {
    title: 'Free Consultation',
    icon: User2,
    href: 'https://calendly.com/sureimports/product-sourcing-one-one-one-session/',
    color: 'text-white',
  },
  // {
  //   title: 'Blog',
  //   icon: Academy,
  //   href: `${process.env.NEXT_PUBLIC_ACADEMY_SITE_URL}`,
  //   color: 'text-white',
  // },
  // {
  //   title: 'Become an Affiliate',
  //   icon: Affiliate,
  //   href: `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}`,
  //   color: 'text-white',
  // },
  // {
  //   title: 'Inbox',
  //   icon: Message,
  //   href: '/dashboard/message/message-box',
  //   color: 'text-white',
  // },
  // {
  //   title: 'Settings',
  //   icon: Settings,
  //   href: '/dashboard/profile-update',
  //   color: 'text-white',
  // },
  // {
  //   title: 'Logout',
  //   icon: Logout,
  //   href: '/auth/logout',
  //   color: 'text-white',
  // },
];

//MOBILE MENU

export const MobileNavItems: NavItem[] = [
  {
    title: 'Videos',
    icon: Category,
    href: '/',
    color: 'text-white',
    isChidren: true,
    children: [
      {
        title: 'TikTok',
        icon: BsTiktok,
        color: 'text-white',
        href: 'https://www.tiktok.com/@tochukwunkwocha',
        target: '_blank',
      },
      {
        title: 'Youtube',
        icon: BsYoutube,
        color: 'text-white',
        href: 'https://youtube.com/@sureimports?si=Ff0Ziwec36sACB2g',
      },
      // {
      //   title: 'Instagram',
      //   icon: BsInstagram,
      //   color: 'text-white',
      //   href: 'https://www.instagram.com/sureimport',
      // },
    ],
  },
    {
    title: 'Shop',
    icon: ShoppingBag,
    href: '/dashboard/shop',
    color: 'text-white',
  },
  {
    title: 'Buy From Chinese Websites',
    icon: Frame,
    href: '/dashboard/procurement',
    color: 'text-white',
  },
  {
    title: 'Buy Phones & Laptops',
    icon: ShoppingCartIcon,
    href: '/dashboard/store?id=laptop',
    color: 'text-white',
  },
  {
    title: 'Special Sourcing',
    icon: SpecialSource,
    href: '/dashboard/special-sourcing/pending',
    color: 'text-white',
  },
  // {
  //   title: 'Pay Supplier',
  //   icon: Pay,
  //   href: '/dashboard/pay-supplier/saved',
  //   color: 'text-white',
  // },
  // {
  //   title: 'Shipping only',
  //   icon: Shipping,
  //   href: '/dashboard/shipping-only/request-received',
  //   color: 'text-white',
  // },
  {
    title: 'Verify Supplier',
    icon: Pay,
    href: '/dashboard/verify-supplier/pending-payment',
    color: 'text-white',
  },
  // {
  //   title: 'Buy Phones',
  //   icon: BuyPhones,
  //   href: '/dashboard/buy-phones',
  //   color: 'text-white',
  // },
  {
    title: 'Refunds',
    icon: BiMoney,
    href: '/dashboard/refunds',
    color: 'text-white',
  },
  {
    title: 'Wallet',
    icon: Wallet,
    href: '/dashboard/wallet',
    color: 'text-white',
  },
  {
    title: 'My Orders',
    icon: Package,
    href: '/dashboard/orders',
    color: 'text-white',
  },
  {
    title: 'Pay Small Small',
    icon: HandCoins,
    href: '/dashboard/pay-small-small?status=SAVED',
    color: 'text-white',
  },
  // {
  //   title: 'Buy Phones',
  //   icon: BuyPhones,
  //   href: '/',
  //   color: 'text-white',
  //   isChidren: true,
  //   children: [
  //     {
  //       title: 'Download',
  //       icon: Download,
  //       color: 'text-white',
  //       href: '/',
  //     },
  //   ],
  // },

    {
    title: 'Resources',
    icon: ShoppingCartIcon,
    href: 'https://spreadit.selar.co',
    color: 'text-white',
  },
  {
    title: 'Free Consultation',
    icon: User2,
    href: 'https://calendly.com/sureimports/product-sourcing-one-one-one-session/',
    color: 'text-white',
  },
  // {
  //   title: 'Blog',
  //   icon: Academy,
  //   href: `${process.env.NEXT_PUBLIC_ACADEMY_SITE_URL}`,
  //   color: 'text-white',
  // },

  // {
  //   title: 'Become an Affiliate',
  //   icon: Affiliate,
  //   href: `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}`,
  //   color: 'text-white',
  // },
  // {
  //   title: 'Logout',
  //   icon: Logout,
  //   href: '/auth/logout',
  //   color: 'text-white',
  // },
];
