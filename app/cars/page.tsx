import type { Metadata } from 'next';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import VehicleCatalogueHero from './VehicleCatalogueHero';
import VehicleHeroCarousel from './VehicleHeroCarousel';
import type { PublicVehicle } from '@/lib/vehicles/data';
import {
  vehicleCatalogue,
  vehicleRates,
  publicVehicle,
} from '@/lib/vehicles/data';
import Catalogue from './Catalogue';
import { emptyFilters } from '@/lib/vehicles/search';
import { carsSocialImage } from '@/lib/vehicles/social';
const catalogueMetadata: Metadata = {
  title: 'Electric Cars, Vans & Cargo Trucks in Nigeria',
  description:
    'Compare electric cars, SUVs, vans and trucks sourced from China on order. Naira landed-cost estimates and delivery are for buyers in Nigeria only.',
  alternates: { canonical: 'https://www.sureimports.com/cars' },
  openGraph: {
    title: 'Electric Vehicles from China to Nigeria | Sure Imports',
    description:
      'Compare vehicles, Naira import estimates and practical ownership guides.',
    url: 'https://www.sureimports.com/cars',
    type: 'website',
    siteName: 'Sure Imports',
    images: [carsSocialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Vehicles from China to Nigeria | Sure Imports',
    description:
      'Compare vehicles, Naira import estimates and practical ownership guides.',
    images: [{ url: carsSocialImage.url, alt: carsSocialImage.alt }],
  },
};
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const query = await searchParams;
  const filtered = Object.keys(emptyFilters).some((key) => Boolean(query[key]));
  return { ...catalogueMetadata, robots: { index: !filtered, follow: true } };
}
export const dynamic = 'force-dynamic';
async function loadPublicCatalogue() {
  const [models, rates] = await Promise.all([
    vehicleCatalogue(),
    vehicleRates(),
  ]);
  return models
    .filter((model) => model.published)
    .map((model) => publicVehicle(model, rates));
}

// Share the public browsing snapshot briefly across visitors. The model-detail,
// quotation and order paths continue to read fresh data through their existing
// loaders; this cache contains only public catalogue data and estimated prices.
// This app uses the Data Cache API until Cache Components is enabled.
const publicCatalogueSnapshot = unstable_cache(
  loadPublicCatalogue,
  ['public-vehicle-catalogue-v1'],
  { revalidate: 60, tags: ['public-vehicle-catalogue'] },
);

type CatalogueData = { modelsPromise: Promise<PublicVehicle[]> };
async function HeroModels({ modelsPromise }: CatalogueData) {
  return <VehicleHeroCarousel models={await modelsPromise} />;
}
async function CatalogueResults({ modelsPromise }: CatalogueData) {
  const models = await modelsPromise;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Electric cars and commercial vehicles in Nigeria',
    url: 'https://www.sureimports.com/cars',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: models.map((m, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: m.name,
        url: `https://www.sureimports.com/cars/models/${m.slug}`,
      })),
    },
  };
  return (
    <>
      {' '}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <Catalogue models={models} />
    </>
  );
}

export default function CarsPage() {
  const modelsPromise = publicCatalogueSnapshot();
  return (
    <main className="vehicle-catalogue">
      <VehicleCatalogueHero>
        <Suspense
          fallback={<div className="vehicle-hero-image" aria-hidden="true" />}
        >
          <HeroModels modelsPromise={modelsPromise} />
        </Suspense>
      </VehicleCatalogueHero>
      <Suspense
        fallback={
          <section id="range" className="vehicle-range">
            <p role="status">Loading vehicles and current prices…</p>
          </section>
        }
      >
        <CatalogueResults modelsPromise={modelsPromise} />
      </Suspense>
    </main>
  );
}
