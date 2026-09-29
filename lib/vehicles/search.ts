import type { PublicVehicle } from './data';
export type SearchVariant = PublicVehicle['variants'][number];
export const uses = [
  ['commuting', 'Everyday commuting'],
  ['family', 'Family travel'],
  ['ride-hailing', 'Ride-hailing'],
  ['delivery', 'Deliveries'],
  ['passengers', 'Passenger transport'],
  ['cold-chain', 'Refrigerated transport'],
  ['leisure', 'Leisure & camping'],
] as const;
export const sorts = [
  ['relevance', 'Recommended'],
  ['price', 'Lowest landed estimate'],
  ['range', 'Highest published range'],
  ['seats', 'Most seats'],
  ['newest', 'Recently added'],
] as const;
export type VehicleFilters = {
  q: string;
  category: string;
  brand: string;
  use: string;
  maxPrice: string;
  seats: string;
  range: string;
  battery: string;
  powertrain: string;
  maxLength: string;
  cargo: string;
  body: string;
  sort: string;
};
export const emptyFilters: VehicleFilters = {
  q: '',
  category: '',
  brand: '',
  use: '',
  maxPrice: '',
  seats: '',
  range: '',
  battery: '',
  powertrain: '',
  maxLength: '',
  cargo: '',
  body: '',
  sort: 'relevance',
};
export function readVehicleFilters(params: {
  get: (key: string) => string | null;
}): VehicleFilters {
  const result = { ...emptyFilters };
  for (const key of Object.keys(result) as (keyof VehicleFilters)[])
    result[key] = (params.get(key) || result[key]).slice(0, 200);
  if (result.category === 'All vehicles') result.category = '';
  for (const key of [
    'maxPrice',
    'seats',
    'range',
    'battery',
    'maxLength',
    'cargo',
  ] as const)
    if (!Number.isFinite(Number(result[key])) || Number(result[key]) <= 0)
      result[key] = '';
  if (!sorts.some(([value]) => value === result.sort))
    result.sort = 'relevance';
  return result;
}
const normalise = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
export const vehicleBrand = (model: Pick<PublicVehicle, 'name'>) =>
  model.name.split(' ')[0];
export function landedBounds(v: SearchVariant) {
  if (v.price)
    return { min: v.price.totalNgn, max: v.price.totalNgn, indicative: false };
  if (
    v.indicativePrice?.landedMinNgn != null &&
    v.indicativePrice.landedMaxNgn != null
  )
    return {
      min: v.indicativePrice.landedMinNgn,
      max: v.indicativePrice.landedMaxNgn,
      indicative: true,
    };
  return null;
}
const passengerCategories = ['Sedans', 'SUVs', 'Hatchbacks', 'City cars'];
export function matchesUse(
  model: PublicVehicle,
  v: SearchVariant,
  use: string,
): boolean {
  const passenger = passengerCategories.includes(model.category);
  switch (use) {
    case 'commuting':
      return passenger;
    case 'family':
      return passenger && (v.seats || 0) >= 5;
    case 'ride-hailing':
      return passenger && (v.seats || 0) >= 5;
    case 'delivery':
      return (
        /Cargo/.test(model.category) &&
        (v.seats || 0) <= 3 &&
        !/passenger/i.test(v.name)
      );
    case 'passengers':
      return /vans/i.test(model.category) && (v.seats || 0) >= 6;
    case 'cold-chain':
      return /refrigerat/i.test(v.name);
    case 'leisure':
      return model.category === 'Leisure vehicles';
    default:
      return !use;
  }
}
function nearWord(a: string, b: string) {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4 || Math.abs(a.length - b.length) > 1)
    return false;
  if (a.length === b.length) {
    const positions = [...a]
      .map((c, i) => (c !== b[i] ? i : -1))
      .filter((i) => i >= 0);
    return (
      positions.length === 1 ||
      (positions.length === 2 &&
        positions[1] === positions[0] + 1 &&
        a[positions[0]] === b[positions[1]] &&
        a[positions[1]] === b[positions[0]])
    );
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  for (let i = 0; i < long.length; i++)
    if (long.slice(0, i) + long.slice(i + 1) === short) return true;
  return false;
}
export function parseVehicleQuery(query: string) {
  let text = query
    .toLowerCase()
    .replace(/[,]/g, '')
    .replace(/avatar\b/g, 'avatr')
    .replace(/atto\s*3/g, 'atto 3')
    .replace(
      /\b(two|four|five|six|seven|eight|nine)(?=\s*[- ]?\s*(?:seats?|seaters?|people|passengers)\b)/g,
      (word) =>
        String(
          (
            {
              two: 2,
              four: 4,
              five: 5,
              six: 6,
              seven: 7,
              eight: 8,
              nine: 9,
            } as Record<string, number>
          )[word],
        ),
    );
  let maxPrice: number | null = null,
    range: number | null = null,
    seats: number | null = null;
  let strictRange = false;
  text = text.replace(
    /(?:under|below|up to|budget(?: of)?|less than|maximum|max)\s*(?:₦|ngn|naira)?\s*(\d+(?:\.\d+)?)\s*(million|m|k)?(?:\s*naira)?\b/g,
    (_match, n, unit) => {
      maxPrice =
        Number(n) *
        (unit === 'm' || unit === 'million' ? 1e6 : unit === 'k' ? 1e3 : 1);
      return ' ';
    },
  );
  text = text.replace(
    /(?:(over|above|at least|minimum|min)\s*)?(\d+)\s*\+?\s*km\b/g,
    (_match, comparison, n) => {
      range = Number(n);
      strictRange = comparison === 'over' || comparison === 'above';
      return ' ';
    },
  );
  text = text.replace(
    /(\d+)\s*[- ]?\s*(?:seater|seaters|seat|seats|people|passengers)\b/g,
    (_match, n) => {
      seats = Number(n);
      return ' ';
    },
  );
  const tokens = normalise(text)
    .split(' ')
    .filter(
      (t) =>
        t &&
        ![
          'a',
          'an',
          'the',
          'i',
          'want',
          'need',
          'show',
          'me',
          'find',
          'with',
          'and',
          'for',
          'in',
          'nigeria',
          'car',
          'cars',
          'vehicle',
          'vehicles',
          'of',
          'to',
          'that',
          'can',
          'has',
          'have',
          'only',
          'fully',
          'powered',
          'something',
          'please',
          'range',
        ].includes(t),
    );
  return { tokens, maxPrice, range, seats, strictRange };
}
function searchWords(model: PublicVehicle, v: SearchVariant) {
  const terms = [
    model.name,
    model.slug,
    model.category,
    model.powertrain,
    v.name,
  ];
  if (model.powertrain === 'Electric') terms.push('ev bev electric');
  if (model.category === 'SUVs') terms.push('suv crossover');
  if (model.category === 'Sedans') terms.push('sedan saloon');
  if (model.category === 'Hatchbacks') terms.push('hatchback hatch');
  if (model.category === 'City cars') terms.push('small compact mini city');
  if (/vans/.test(model.category)) terms.push('van bus minibus');
  if (/trucks/.test(model.category)) terms.push('truck pickup lorry');
  if (model.slug === 'byd-yuan-plus') terms.push('atto3 atto 3 yuan plus');
  for (const [use, label] of uses)
    if (matchesUse(model, v, use)) terms.push(use, label);
  if (matchesUse(model, v, 'delivery'))
    terms.push('cargo freight goods courier');
  if (matchesUse(model, v, 'cold-chain'))
    terms.push('cold chain refrigerator refrigerated cooling');
  if (matchesUse(model, v, 'ride-hailing'))
    terms.push('taxi uber bolt ride hailing');
  if (matchesUse(model, v, 'leisure')) terms.push('camper motorhome camping');
  return normalise(terms.join(' ')).split(' ');
}
export type VehicleMatch = {
  model: PublicVehicle;
  variants: SearchVariant[];
  budgetOverlap: boolean;
  score: number;
  index: number;
};
export function searchVehicles(
  models: PublicVehicle[],
  filters: VehicleFilters,
): VehicleMatch[] {
  const query = parseVehicleQuery(filters.q);
  const budgets = [
    Number(filters.maxPrice) || Infinity,
    query.maxPrice ?? Infinity,
  ];
  const budget = Math.min(...budgets);
  const seats = Math.max(Number(filters.seats) || 0, query.seats || 0);
  const range = Math.max(Number(filters.range) || 0, query.range || 0);
  const results: VehicleMatch[] = [];
  models.forEach((model, index) => {
    if (filters.category && model.category !== filters.category) return;
    if (filters.brand && vehicleBrand(model) !== filters.brand) return;
    if (filters.powertrain && model.powertrain !== filters.powertrain) return;
    let score = 0;
    const variants = model.variants.filter((v) => {
      const price = landedBounds(v);
      if (budget !== Infinity && (!price || price.min > budget)) return false;
      if (seats && (!v.seats || v.seats < seats)) return false;
      if (
        range &&
        (!v.rangeKm ||
          v.rangeKm < range ||
          (query.strictRange && v.rangeKm === query.range))
      )
        return false;
      if (
        filters.battery &&
        (!v.batteryKwh || v.batteryKwh < Number(filters.battery))
      )
        return false;
      if (
        filters.maxLength &&
        (!v.lengthMm || v.lengthMm > Number(filters.maxLength))
      )
        return false;
      if (filters.cargo && (!v.cargoM3 || v.cargoM3 < Number(filters.cargo)))
        return false;
      if (
        filters.body &&
        !normalise(v.name + ' ' + v.id).includes(
          filters.body === 'fence' ? 'high sided' : filters.body,
        )
      ) {
        if (!(filters.body === 'fence' && v.id === 'fence')) return false;
      }
      if (!matchesUse(model, v, filters.use)) return false;
      const words = searchWords(model, v);
      let relevance = 0;
      for (const token of query.tokens) {
        if (words.includes(token)) relevance += 3;
        else if (
          token.length >= 3 &&
          words.some((word) => word.startsWith(token))
        )
          relevance += 2;
        else if (words.some((word) => nearWord(token, word))) relevance += 1;
        else return false;
      }
      score = Math.max(score, relevance);
      return true;
    });
    if (variants.length)
      results.push({
        model,
        variants,
        budgetOverlap:
          budget !== Infinity &&
          variants.some((v) => {
            const p = landedBounds(v);
            return !!p && p.max > budget;
          }),
        score,
        index,
      });
  });
  const price = (r: VehicleMatch) =>
    Math.min(...r.variants.map((v) => landedBounds(v)?.min ?? Infinity));
  const max = (r: VehicleMatch, key: 'rangeKm' | 'seats') =>
    Math.max(...r.variants.map((v) => v[key] || 0));
  return results.sort((a, b) => {
    if (filters.sort === 'price')
      return price(a) - price(b) || a.index - b.index;
    if (filters.sort === 'range')
      return max(b, 'rangeKm') - max(a, 'rangeKm') || a.index - b.index;
    if (filters.sort === 'seats')
      return max(b, 'seats') - max(a, 'seats') || a.index - b.index;
    if (filters.sort === 'newest') return b.index - a.index;
    return b.score - a.score || a.index - b.index;
  });
}
