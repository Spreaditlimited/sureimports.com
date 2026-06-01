'use client';

import React from 'react';
import { ShopCartProvider } from '@/app/context/ShopCartContext';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopCartProvider>{children}</ShopCartProvider>;
}
