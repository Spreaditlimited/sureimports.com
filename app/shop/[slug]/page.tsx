import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShopProduct, getRelatedProducts } from '@/lib/shop/catalogue';
import {
  productDescription,
  shopProductSchema,
  shopProductUrl,
  shopCategories,
  SHOP_ORIGIN,
} from '@/lib/shop/discovery';
import { resolveMediaUrl } from '@/lib/cloudinary/url';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import ProductDetailsContent from './ProductDetailsContent';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getShopProduct((await params).slug);
  if (!product) notFound();
  const title = `${product.productName} in Nigeria`;
  const description = productDescription(product);
  const url = shopProductUrl(product.pidProduct);
  const rawImage = resolveMediaUrl(product.productImage);
  const image = rawImage ? new URL(rawImage, SHOP_ORIGIN).href : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: image
        ? [{ url: image, alt: product.productName || 'Product' }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}
export default async function ProductPage({ params }: Props) {
  const product = await getShopProduct((await params).slug);
  if (!product) notFound();
  const relatedProducts = await getRelatedProducts(product);
  const rawImage = resolveMediaUrl(product.productImage);
  const image = rawImage ? new URL(rawImage, SHOP_ORIGIN).href : undefined;
  const category = shopCategories.find(
    (c) => c.value === product.productCategory,
  );
  return (
    <>
      <JsonLdScript
        data={[
          {
            '@context': 'https://schema.org',
            ...shopProductSchema(product, image),
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
            {
              name: product.productName || 'Product',
              url: `/shop/${product.pidProduct}`,
            },
          ]),
        ]}
      />
      <ProductDetailsContent
        key={product.pidProduct}
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
