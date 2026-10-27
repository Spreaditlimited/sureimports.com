import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShopListing } from '@/lib/shop/catalogue';
import {
  shopCategories,
  shopListingHref,
  SHOP_ORIGIN,
  SHOP_PAGE_SIZE,
  type ShopQuery,
} from '@/lib/shop/discovery';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import ShopContent from './ShopContent';

export function catalogueMetadata(query: ShopQuery): Metadata {
  const category = shopCategories.find((c) => c.value === query.category);
  const title = `${category ? `${category.name} from China to Nigeria` : 'Shop Phones, Laptops and Watches'}${query.page > 1 ? ` — Page ${query.page}` : ''}`;
  const description =
    category?.description ||
    'Browse phones, laptops and watches from Sure Imports. Compare product specifications, condition, prices and minimum order quantities.';
  const url = `${SHOP_ORIGIN}${shopListingHref(query)}`;
  const image = `${SHOP_ORIGIN}/images/sure-imports-social-card.png`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: !query.q && (!query.category || Boolean(category)),
      follow: true,
    },
    openGraph: { title, description, url, images: [image] },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
export default async function CataloguePage({ query }: { query: ShopQuery }) {
  // Reject unreasonable offsets before they reach the database's integer limit.
  if (query.page > 100_000) notFound();
  const data = await getShopListing(query);
  if (query.page > Math.max(1, Math.ceil(data.totalCount / SHOP_PAGE_SIZE)))
    notFound();
  const category = shopCategories.find((c) => c.value === query.category);
  if (query.category && !data.categories.includes(query.category)) notFound();
  const url = `${SHOP_ORIGIN}${shopListingHref(query)}`;
  return (
    <>
      <JsonLdScript
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${url}#collection`,
            name: category?.name || 'Sure Imports gadget shop',
            url,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: data.products.map((p, i) => ({
                '@type': 'ListItem',
                position: (query.page - 1) * SHOP_PAGE_SIZE + i + 1,
                name: p.productName,
                url: `${SHOP_ORIGIN}/shop/${encodeURIComponent(p.pidProduct)}`,
              })),
            },
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Shop', url: '/shop' },
            ...(category
              ? [
                  {
                    name: category.name,
                    url: `/shop/category/${category.slug}`,
                  },
                ]
              : []),
          ]),
        ]}
      />
      <ShopContent
        key={shopListingHref(query)}
        initialData={data}
        query={query}
      />
    </>
  );
}
