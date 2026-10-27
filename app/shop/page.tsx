import { permanentRedirect } from 'next/navigation';
import CataloguePage, { catalogueMetadata } from './CataloguePage';
import {
  parseShopQuery,
  shopCategories,
  shopListingHref,
  type ShopSearchParams,
} from '@/lib/shop/discovery';
export const dynamic = 'force-dynamic';
type Props = { searchParams: Promise<ShopSearchParams> };
export async function generateMetadata({ searchParams }: Props) {
  return catalogueMetadata(parseShopQuery(await searchParams));
}
export default async function ShopPage({ searchParams }: Props) {
  const query = parseShopQuery(await searchParams);
  if (shopCategories.some((category) => category.value === query.category))
    permanentRedirect(shopListingHref(query));
  return <CataloguePage query={query} />;
}
