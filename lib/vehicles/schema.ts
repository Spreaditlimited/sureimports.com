import type { PublicVehicle } from './data';

// Only confirmed, quoteable configurations are offers. Supplier reference
// ranges and missing prices must never become zero-price or invented offers.
export function vehicleEntitySchema(vehicle: PublicVehicle) {
  const url = `https://www.sureimports.com/cars/models/${vehicle.slug}`;
  const offers = vehicle.variants.flatMap((variant) => {
    const price = variant.price?.totalNgn;
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0)
      return [];
    return [
      {
        '@type': 'Offer',
        name: `${vehicle.name} — ${variant.name}`,
        url: `${url}?configuration=${encodeURIComponent(variant.id)}`,
        price,
        priceCurrency: 'NGN',
        eligibleRegion: { '@type': 'Country', name: 'Nigeria' },
        seller: { '@type': 'Organization', name: 'Sure Imports' },
      },
    ];
  });
  const page = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: vehicle.name,
    description: vehicle.description,
    url,
    image: vehicle.images,
  };
  // Vehicle inherits Product. Without a genuine offer/review/rating it causes
  // invalid Product rich results; keep ordinary page metadata instead.
  if (!offers.length) return page;
  return {
    '@type': 'Vehicle',
    '@id': `${url}#vehicle`,
    name: vehicle.name,
    model: vehicle.name,
    description: vehicle.description,
    url,
    image: vehicle.images,
    category: vehicle.category,
    fuelType: vehicle.powertrain,
    ...(['Ruichi', 'BYD', 'GAC', 'Changan', 'Chery', 'Avatr'].includes(
      vehicle.name.split(' ')[0],
    )
      ? { brand: { '@type': 'Brand', name: vehicle.name.split(' ')[0] } }
      : {}),
    offers,
  };
}
