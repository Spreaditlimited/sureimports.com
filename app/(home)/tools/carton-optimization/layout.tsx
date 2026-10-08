import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  "title": {
    "absolute": "Carton Packing & CBM Optimisation Calculator | Sure Imports"
  },
  "description": "Compare carton sizes and packing options to estimate shipping volume. Check how packaging choices affect your China import freight calculations.",
  "alternates": {
    "canonical": "https://www.sureimports.com/tools/carton-optimization"
  },
  "openGraph": {
    "title": "Carton Packing & CBM Optimisation Calculator | Sure Imports",
    "description": "Compare carton sizes and packing options to estimate shipping volume. Check how packaging choices affect your China import freight calculations.",
    "url": "https://www.sureimports.com/tools/carton-optimization",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Carton Packing & CBM Optimisation Calculator | Sure Imports",
    "description": "Compare carton sizes and packing options to estimate shipping volume. Check how packaging choices affect your China import freight calculations."
  }
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
