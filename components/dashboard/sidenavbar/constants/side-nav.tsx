'use client';

import {
  HandCoins,
  Package,
  ShoppingBag,
  Wallet,
  Globe,
  Package2,
  Video,
  ReceiptText,
} from 'lucide-react';
import { type NavItem } from '../types';
import { BsTiktok, BsYoutube } from 'react-icons/bs';

export const NavItems: NavItem[] = [
  {
    title: 'Videos',
    icon: Video,
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
        target: '_blank',
      },
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
    icon: Globe,
    href: '/dashboard/procurement',
    color: 'text-white',
  },
  {
    title: 'Corporate Gifts',
    icon: Package2,
    href: '/dashboard/corporate-gifts',
    color: 'text-white',
  },
  // {
  //   title: 'Buy Phones & Laptops',
  //   icon: Smartphone,
  //   href: '/dashboard/store?id=laptop',
  //   color: 'text-white',
  // },
  // {
  //   title: 'Special Sourcing',
  //   icon: Search,
  //   href: '/dashboard/special-sourcing/pending',
  //   color: 'text-white',
  // },

  {
    title: 'Refunds',
    icon: HandCoins,
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
    title: 'My Invoices',
    icon: ReceiptText,
    href: '/dashboard/my-invoices',
    color: 'text-white',
  },
  {
    title: 'Pay Small Small',
    icon: HandCoins,
    href: '/dashboard/pay-small-small?status=SAVED',
    color: 'text-white',
  },
];

//MOBILE MENU

export const MobileNavItems: NavItem[] = [
  {
    title: 'Videos',
    icon: Video,
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
        target: '_blank',
      },
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
    icon: Globe,
    href: '/dashboard/procurement',
    color: 'text-white',
  },
  {
    title: 'Corporate Gifts',
    icon: Package2,
    href: '/dashboard/corporate-gifts',
    color: 'text-white',
  },
  // {
  //   title: 'Buy Phones & Laptops',
  //   icon: Smartphone,
  //   href: '/dashboard/store?id=laptop',
  //   color: 'text-white',
  // },
  // {
  //   title: 'Special Sourcing',
  //   icon: Search,
  //   href: '/dashboard/special-sourcing/pending',
  //   color: 'text-white',
  // },
  {
    title: 'Refunds',
    icon: HandCoins,
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
    title: 'My Invoices',
    icon: ReceiptText,
    href: '/dashboard/my-invoices',
    color: 'text-white',
  },
  {
    title: 'Pay Small Small',
    icon: HandCoins,
    href: '/dashboard/pay-small-small?status=SAVED',
    color: 'text-white',
  },
];
