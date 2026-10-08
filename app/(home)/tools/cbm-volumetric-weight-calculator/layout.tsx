import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  "title": {
    "absolute": "CBM & Volumetric Weight Calculator | Sure Imports"
  },
  "description": "Calculate carton CBM for sea freight and volumetric weight for air freight. Compare shipment measurements before importing from China to Nigeria.",
  "alternates": {
    "canonical": "https://www.sureimports.com/tools/cbm-volumetric-weight-calculator"
  },
  "openGraph": {
    "title": "CBM & Volumetric Weight Calculator | Sure Imports",
    "description": "Calculate carton CBM for sea freight and volumetric weight for air freight. Compare shipment measurements before importing from China to Nigeria.",
    "url": "https://www.sureimports.com/tools/cbm-volumetric-weight-calculator",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "CBM & Volumetric Weight Calculator | Sure Imports",
    "description": "Calculate carton CBM for sea freight and volumetric weight for air freight. Compare shipment measurements before importing from China to Nigeria."
  }
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
