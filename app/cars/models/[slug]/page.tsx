import { getPlanSettings } from '@/lib/vehicles/plans';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  vehicleCatalogue,
  vehicleRates,
  publicVehicle,
} from '@/lib/vehicles/data';
import VehicleDetail from '../../VehicleDetail';
import VehicleBuyingGuide from '../../VehicleBuyingGuide';
import { carsSocialImage, vehicleSocialImage } from '@/lib/vehicles/social';
export const dynamic = 'force-dynamic';
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ configuration?: string; quantity?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = (await vehicleCatalogue()).find(
    (m) => m.slug === slug && m.published,
  );
  if (!model) notFound();
  const title = `${model.name} in Nigeria: Specifications & Import Price`;
  const description = `Compare ${model.name} configurations, specifications and Naira import estimates. Order from China with shipping, clearing, duties and taxes included in shipping.`;
  const url = `https://www.sureimports.com/cars/models/${slug}`;
  const photo = model.images.find((image) =>
    image.startsWith('https://res.cloudinary.com/'),
  );
  const socialImage = photo
    ? {
        ...carsSocialImage,
        url: vehicleSocialImage(photo),
        alt: `${model.name} — Sure Imports vehicles from China to Nigeria`,
      }
    : carsSocialImage;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Sure Imports',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: socialImage.url, alt: socialImage.alt }],
    },
  };
}
export default async function VehiclePage({ params, searchParams }: Props) {
  const [{ slug }, query, models, rates] = await Promise.all([
    params,
    searchParams,
    vehicleCatalogue(),
    vehicleRates(),
  ]);
  const model = models.find((m) => m.slug === slug && m.published);
  if (!model) notFound();
  const vehicle = publicVehicle(model, rates);
  const url = `https://www.sureimports.com/cars/models/${slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Vehicle',
        '@id': `${url}#vehicle`,
        name: model.name,
        model: model.name,
        description: model.description,
        url,
        image: model.images,
        category: model.category,
        fuelType: model.powertrain,
        ...(['Ruichi', 'BYD', 'GAC', 'Changan', 'Chery', 'Avatr'].includes(
          model.name.split(' ')[0],
        )
          ? { brand: { '@type': 'Brand', name: model.name.split(' ')[0] } }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.sureimports.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Cars & commercial vehicles',
            item: 'https://www.sureimports.com/cars',
          },
          { '@type': 'ListItem', position: 3, name: model.name, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <VehicleDetail
        planSettings={await getPlanSettings()}
        key={`${slug}:${query.configuration || ''}:${query.quantity || ''}`}
        model={vehicle}
      >
        <VehicleBuyingGuide
          model={vehicle}
          related={models
            .filter(
              (m) =>
                m.published && m.slug !== slug && m.category === model.category,
            )
            .slice(0, 3)
            .map(({ slug, name }) => ({ slug, name }))}
        />
      </VehicleDetail>
    </>
  );
}
