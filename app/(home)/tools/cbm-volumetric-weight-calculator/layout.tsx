import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  "title": {
    "absolute": "CBM Calculator for China to Nigeria Shipping | Sure Imports"
  },
  "description": "Calculate carton CBM for China to Nigeria sea shipping and volumetric weight for air freight. Enter packed dimensions and quantity, then use the result to request a shipment quote.",
  "alternates": {
    "canonical": "https://www.sureimports.com/tools/cbm-volumetric-weight-calculator"
  },
  "openGraph": {
    "title": "CBM Calculator for China to Nigeria Shipping | Sure Imports",
    "description": "Calculate carton CBM for China to Nigeria sea shipping and volumetric weight for air freight.",
    "url": "https://www.sureimports.com/tools/cbm-volumetric-weight-calculator",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "CBM Calculator for China to Nigeria Shipping | Sure Imports",
    "description": "Calculate carton CBM for China to Nigeria sea shipping and volumetric weight for air freight."
  }
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
