# SEO Implementation Guide - Sure Imports

## Overview

This document outlines the comprehensive SEO implementation for Sure Imports, following Next.js 15 best practices.

## Files Created/Updated

### Core SEO Configuration

| File | Purpose |
|------|---------|
| `lib/seo/config.ts` | Default metadata, viewport, and page-specific SEO generators |
| `lib/seo/schema.ts` | JSON-LD structured data schemas (Organization, Website, Article, FAQ, Breadcrumb, Product) |
| `lib/seo/index.ts` | Central export file for all SEO utilities |
| `components/seo/JsonLd.tsx` | Components for rendering JSON-LD structured data |
| `app/sitemap.ts` | Dynamic sitemap generation with blog posts |
| `app/robots.ts` | Programmatic robots.txt configuration |

### Updated Pages

- `app/layout.tsx` - Root layout with global SEO metadata
- `app/(home)/page.tsx` - Home page with FAQ schema
- `app/(home)/blog/page.tsx` - Blog listing with breadcrumbs
- `app/(home)/blog/[slug]/page.tsx` - Dynamic article metadata (already had excellent SEO)

## Usage

### 1. Adding SEO to a New Page

```tsx
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/config';

// Option 1: Use the generator
export const metadata = generatePageMetadata(
  'about',
  'About Us - Your Import Partner',
  'Custom description for the about page'
);

// Option 2: Manual metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  // ... other fields
};
```

### 2. Adding JSON-LD Structured Data

```tsx
import { JsonLdScript } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schema';

// In your page component
export default function Page() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Current Page', url: '/current-page' },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbs} />
      {/* Page content */}
    </>
  );
}
```

### 3. Blog Post SEO

Blog posts automatically get:
- Dynamic metadata from database fields
- Article schema (JSON-LD)
- Breadcrumb schema
- Open Graph and Twitter Cards

The SEO data is stored in `blogExt2` as JSON:

```json
{
  "seoTitle": "Custom SEO Title",
  "metaDescription": "Custom meta description",
  "keywords": ["keyword1", "keyword2"],
  "focusKeyword": "main keyword",
  "ogTitle": "Open Graph Title",
  "ogDescription": "Open Graph description",
  "ogImage": "https://...",
  "canonicalUrl": "https://...",
  "noIndex": false,
  "noFollow": false
}
```

## Available Schemas

### Organization Schema
Used globally in root layout. Represents the business.

### Website Schema
Used globally. Includes site search potential action.

### Service Schema
Describes import services offered.

### Article Schema
For blog posts. Generated via `generateArticleSchema()`.

### FAQ Schema
For FAQ sections. Generated via `generateFAQSchema()`.

### Breadcrumb Schema
For navigation trails. Generated via `generateBreadcrumbSchema()`.

### Product Schema
For shop products. Generated via `generateProductSchema()`.

## Sitemap

The sitemap at `/sitemap.xml` includes:
- Static pages (home, about, blog, policies, etc.)
- Dynamic blog posts (fetched from database)

## Robots.txt

The robots.txt at `/robots.txt` includes:
- Allow all crawlers for main content
- Disallow sensitive routes (/api/, /dashboard/, /auth/)
- Sitemap reference

## Required Assets

Create the following images for optimal SEO:

1. **`/public/images/og-image.png`** (1200x630px)
   - Main Open Graph image for social sharing
   
2. **`/public/images/og-blog.png`** (1200x630px)
   - Open Graph image for blog section

## Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://sureimports.com`
3. Get verification code
4. Add to `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  // ... existing config
  verification: {
    google: 'YOUR-VERIFICATION-CODE',
  },
};
```

5. Submit sitemap: `https://sureimports.com/sitemap.xml`

## SEO Checklist

- [x] Title tags with template
- [x] Meta descriptions
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] Robots meta tags
- [x] Dynamic sitemap
- [x] Robots.txt
- [x] JSON-LD Organization schema
- [x] JSON-LD Website schema
- [x] JSON-LD Article schema (blog posts)
- [x] JSON-LD Breadcrumb schema
- [x] JSON-LD FAQ schema (home page)
- [ ] OG image creation (need to create actual images)
- [ ] Google Search Console verification

## Performance Tips

1. Keep meta descriptions under 160 characters
2. Keep titles under 60 characters
3. Use focus keywords in titles and descriptions
4. Update sitemap when adding new pages
5. Monitor Core Web Vitals in Search Console
