import { notFound } from 'next/navigation';
import CataloguePage, { catalogueMetadata } from '../../CataloguePage';
import {
  parseShopQuery,
  shopCategories,
  type ShopSearchParams,
} from '@/lib/shop/discovery';
export const dynamic = 'force-dynamic';
type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<ShopSearchParams>;
};
async function queryFor(props: Props) {
  const slug = (await props.params).category;
  const selected = shopCategories.find((c) => c.slug === slug);
  if (!selected) notFound();
  return parseShopQuery(await props.searchParams, selected.value);
}
export async function generateMetadata(props: Props) {
  return catalogueMetadata(await queryFor(props));
}
export default async function CategoryPage(props: Props) {
  return <CataloguePage query={await queryFor(props)} />;
}
