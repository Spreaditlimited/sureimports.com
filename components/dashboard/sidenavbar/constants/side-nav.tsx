'use client';

import {
  Download,
  HandCoins,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User2,
  Wallet,
  Globe,
  Search,
  Smartphone,
  DollarSign,
  Truck,
  CheckCircle,
  Package2,
  BookOpen,
  UserPlus,
  MessageSquare,
  LogOut,
  Video,
  Youtube,
  Instagram,
} from 'lucide-react';
import { type NavItem } from '../types';
import { BsInstagram, BsTiktok, BsYoutube } from 'react-icons/bs';

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
    title: 'LineScout',
    icon: Search,
    href: 'https://linescout.sureimports.com/',
    color: 'text-white',
  },
  {
    title: 'Verify Supplier',
    icon: CheckCircle,
    href: '/dashboard/verify-supplier/pending-payment',
    color: 'text-white',
  },
  {
    title: 'Refunds',
    icon: DollarSign,
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
  {
    title: 'Resources',
    icon: BookOpen,
    href: 'https://spreadit.selar.co',
    color: 'text-white',
  },
  {
    title: 'Free Consultation',
    icon: User2,
    href: 'https://calendly.com/sureimports/product-sourcing-one-one-one-session/',
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
    title: 'LineScout',
    icon: Search,
    href: 'https://linescout.sureimports.com/',
    color: 'text-white',
  },
  {
    title: 'Verify Supplier',
    icon: CheckCircle,
    href: '/dashboard/verify-supplier/pending-payment',
    color: 'text-white',
  },
  {
    title: 'Refunds',
    icon: DollarSign,
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
  {
    title: 'Resources',
    icon: BookOpen,
    href: 'https://spreadit.selar.co',
    color: 'text-white',
  },
  {
    title: 'Free Consultation',
    icon: User2,
    href: 'https://calendly.com/sureimports/product-sourcing-one-one-one-session/',
    color: 'text-white',
  },
];
