import type { Metadata } from 'next';
import {
  vehicleCatalogue,
  vehicleRates,
  publicVehicle,
} from '@/lib/vehicles/data';
import Catalogue from './Catalogue';
export const metadata: Metadata = {
  title: 'Electric Cars, Vans & Cargo Trucks in Nigeria',
  description:
    'Import electric vehicles from China to Nigeria. Compare Ruichi vans, passenger vehicles and cargo trucks, Naira prices, specifications and landed-cost estimates.',
  alternates: { canonical: 'https://www.sureimports.com/cars' },
  openGraph: {
    title: 'Electric Vehicles from China to Nigeria | Sure Imports',
    description:
      'Compare vehicles, Naira import estimates and practical ownership guides.',
    url: 'https://www.sureimports.com/cars',
    type: 'website',
  },
};
export const dynamic = 'force-dynamic';
export default async function CarsPage() {
  const [models, rates] = await Promise.all([
    vehicleCatalogue(),
    vehicleRates(),
  ]);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Electric cars and commercial vehicles in Nigeria',
    url: 'https://www.sureimports.com/cars',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: models
        .filter((m) => m.published)
        .map((m, index) => ({
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
      <Catalogue
        models={models
          .filter((m) => m.published)
          .map((m) => publicVehicle(m, rates))}
      />
    </>
  );
}
