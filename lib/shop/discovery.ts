export const SHOP_ORIGIN = 'https://www.sureimports.com';
export const SHOP_PAGE_SIZE = 24;

export const shopCategories = [
  {
    slug: 'phones',
    value: 'phone',
    name: 'Phones',
    description:
      'Compare iPhone and Samsung models, storage, SIM configuration and condition. Check the specifications and warranty for the exact device before ordering.',
  },
  {
    slug: 'laptops',
    value: 'laptop',
    name: 'Laptops',
    description:
      'Compare laptops by processor, memory, storage and condition. Review the listed specifications and minimum order quantity for work, school or resale.',
  },
  {
    slug: 'watches',
    value: 'watch',
    name: 'Watches',
    description:
      'Browse watches and compare the specifications, condition and listed price of each model. Confirm phone compatibility and included accessories before ordering.',
  },
] as const;

export type ShopQuery = { q: string; category: string; page: number };
export type ShopSearchParams = Record<string, string | string[] | undefined>;
export function parseShopQuery(
  params: ShopSearchParams,
  category = '',
): ShopQuery {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const rawPage = first(params.page) || '1';
  return {
    q: (first(params.q) || first(params.search) || '').trim().slice(0, 120),
    category: category || first(params.category) || '',
    page:
      /^\d+$/.test(rawPage) &&
      Number(rawPage) > 0 &&
      Number.isSafeInteger(Number(rawPage))
        ? Number(rawPage)
        : 1,
  };
}
export function shopListingHref(query: ShopQuery) {
  const category = shopCategories.find((c) => c.value === query.category);
  const path = category ? `/shop/category/${category.slug}` : '/shop';
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category && !category) params.set('category', query.category);
  if (query.page > 1) params.set('page', String(query.page));
  return `${path}${params.size ? `?${params}` : ''}`;
}

export type ShopProduct = {
  pidProduct: string;
  productName: string | null;
  productBrand: string | null;
  productPrice: number | null;
  productImage: string | null;
  productCategory: string | null;
  productCondition: string | null;
  productMOQ: number | null;
  productStatus: string | null;
  productDescription: string | null;
  productFeature: string | null;
  productSpecification: string | null;
  warrantyPeriod: string | null;
};
export type ShopCardProduct = Pick<
  ShopProduct,
  | 'pidProduct'
  | 'productName'
  | 'productBrand'
  | 'productPrice'
  | 'productImage'
  | 'productCategory'
  | 'productCondition'
  | 'productMOQ'
  | 'productStatus'
>;
export const shopProductUrl = (id: string) =>
  `${SHOP_ORIGIN}/shop/${encodeURIComponent(id)}`;
export function productDescription(product: ShopProduct) {
  return (
    product.productDescription ||
    `Compare specifications, condition and pricing for ${product.productName || 'this product'} from Sure Imports. Review order quantity, shipping and warranty details before buying.`
  )
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 170);
}
export function productAvailability(status: string | null) {
  if (status === 'unavailable') return 'https://schema.org/OutOfStock';
  // An orderable item is sourced from China after purchase; it is not held
  // as ready-to-ship inventory. Do not label it InStock without a verified
  // fulfilment promise for the exact item.
  return undefined;
}
export function productConditionLabel(
  product: Pick<ShopProduct, 'productName' | 'productCondition'>,
) {
  if (
    product.productCondition === 'REFURBISHED' ||
    /refurbished/i.test(product.productName || '')
  )
    return 'Refurbished';
  if (product.productCondition === 'BRAND_NEW') return 'Brand new';
  if (product.productCondition === 'PRE_OWNED') return 'Pre-owned';
  if (product.productCondition === 'OPEN_BOX') return 'Open box';
  return 'Condition to be confirmed';
}
export function shopProductSchema(product: ShopProduct, image?: string) {
  const url = shopProductUrl(product.pidProduct);
  const price = product.productPrice;
  const common = {
    name: product.productName,
    description: productDescription(product),
    url,
    ...(image ? { image: [image] } : {}),
  };
  if (
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !image
  ) {
    return { '@type': 'WebPage', '@id': `${url}#webpage`, ...common };
  }
  const condition =
    productConditionLabel(product) === 'Refurbished'
      ? 'https://schema.org/RefurbishedCondition'
      : product.productCondition === 'BRAND_NEW'
        ? 'https://schema.org/NewCondition'
        : product.productCondition === 'PRE_OWNED'
          ? 'https://schema.org/UsedCondition'
          : undefined;
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    ...common,
    sku: product.pidProduct,
    ...(product.productBrand
      ? { brand: { '@type': 'Brand', name: product.productBrand } }
      : {}),
    category: product.productCategory,
    ...(condition ? { itemCondition: condition } : {}),
    offers: {
      '@type': 'Offer',
      url,
      price,
      priceCurrency: 'NGN',
      eligibleRegion: { '@type': 'Country', name: 'Nigeria' },
      ...(condition ? { itemCondition: condition } : {}),
      ...(productAvailability(product.productStatus)
        ? { availability: productAvailability(product.productStatus) }
        : {}),
      ...(product.productMOQ && product.productMOQ > 1
        ? {
            eligibleQuantity: {
              '@type': 'QuantitativeValue',
              minValue: product.productMOQ,
            },
          }
        : {}),
      seller: {
        '@type': 'Organization',
        '@id': `${SHOP_ORIGIN}/#organization`,
        name: 'Sure Imports',
        url: SHOP_ORIGIN,
      },
    },
  };
}
