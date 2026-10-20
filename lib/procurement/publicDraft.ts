import { usesDeviceFlatFee } from './deviceShipping';
import { z } from 'zod';
import { normalizeProductUrl } from '../productUrl';

export const PUBLIC_DRAFT_KEY = 'sureimports:procurement-draft:v1';
export const shops = [
  { id: '1688', name: '1688', currency: 'CNY', domains: ['1688.com'] },
  {
    id: 'taobao',
    name: 'Taobao',
    currency: 'CNY',
    domains: ['taobao.com', 'tmall.com'],
  },
  {
    id: 'pinduoduo',
    name: 'Pinduoduo',
    currency: 'CNY',
    domains: ['pinduoduo.com', 'yangkeduo.com'],
  },
  { id: 'alibaba', name: 'Alibaba', currency: 'USD', domains: ['alibaba.com'] },
  { id: 'other', name: 'Other website', currency: '', domains: [] },
];
export function inspectProductLink(link: string) {
  const url = normalizeProductUrl(link);
  if (!url) return { url: null, shop: undefined };
  const parsed = new URL(url);
  if (parsed.username || parsed.password) return { url: null, shop: undefined };
  const host = parsed.hostname.toLowerCase();
  return {
    url,
    shop: shops.find((s) =>
      s.domains.some((d) => host === d || host.endsWith(`.${d}`)),
    ),
  };
}
export const productDraftSchema = z.object({
  id: z.string(),
  productCategory: z.enum(['OTHER', 'PHONE', 'LAPTOP']).default('OTHER'),
  productName: z.string(),
  productLink: z.string(),
  productPrice: z.string(),
  productWeight: z.string(),
  productQuantity: z.string(),
  productInfo: z.string(),
  currency: z.string(),
  review: z.boolean(),
  measurementReview: z.boolean(),
  linkConfirmed: z.boolean(),
});
export type ProductDraft = z.infer<typeof productDraftSchema>;
export const emptyProduct = (): ProductDraft => ({
  id: '',
  productCategory: 'OTHER',
  productName: '',
  productLink: '',
  productPrice: '',
  productWeight: '',
  productQuantity: '1',
  productInfo: '',
  currency: '',
  review: false,
  measurementReview: false,
  linkConfirmed: false,
});
export const publicDraftSchema = z.object({
  version: z.literal(1),
  draftId: z.string(),
  shop: z.string(),
  currency: z.enum(['CNY', 'USD']),
  destinationCountry: z.string(),
  shippingPlan: z.string(),
  orderCategory: z
    .enum([
      'Other Goods',
      'Goods with Battery',
      'Raw Batteries',
      'Liquids, Gases, Powder',
    ])
    .default('Other Goods'),
  products: z.array(productDraftSchema),
  current: productDraftSchema,
});
export type PublicDraft = z.infer<typeof publicDraftSchema>;
export function productProblem(
  product: ProductDraft,
  shopId: string,
  currency: string,
  countryName?: string,
) {
  const link = inspectProductLink(product.productLink);
  if (!link.url) return 'Please enter a valid product web link.';
  if (link.shop && link.shop.currency !== currency)
    return `${link.shop.name} links use ${link.shop.currency}. Please create a separate order for products in another currency.`;
  if (
    (!link.shop || (shopId !== 'other' && link.shop.id !== shopId)) &&
    !product.linkConfirmed
  )
    return 'Please confirm the website and quoted currency for this link.';
  if (!product.productName.trim()) return 'Please enter a product name.';
  if (
    !Number.isFinite(Number(product.productPrice)) ||
    Number(product.productPrice) < 0.01
  )
    return 'Please enter a valid unit price.';
  if (
    !usesDeviceFlatFee(countryName, product.productCategory) && (!Number.isFinite(Number(product.productWeight)) ||
    Number(product.productWeight) <= 0)
  )
    return 'Please enter a valid per-item measurement.';
  if (
    !Number.isSafeInteger(Number(product.productQuantity)) ||
    Number(product.productQuantity) < 1
  )
    return 'Please enter a whole-number quantity of at least one.';
  if (product.review || product.currency !== currency)
    return 'Please review and confirm this product’s link and price.';
  if (product.measurementReview && !usesDeviceFlatFee(countryName, product.productCategory))
    return 'Please review this product’s measurement for the selected shipping method.';
  return null;
}
