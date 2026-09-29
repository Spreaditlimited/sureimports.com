'use client';
import { useState, type ReactNode } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import VehiclePicker from '@/components/vehicles/VehiclePicker';
import type { PublicVehicle } from '@/lib/vehicles/data';
import {
  emptyFilters,
  parseVehicleQuery,
  sorts,
  uses,
  vehicleBrand,
  type VehicleFilters,
} from '@/lib/vehicles/search';
import { naira } from '@/lib/vehicles/policy';

export default function VehicleSearchFilters({
  models,
  filters,
  onChange,
  count,
  children,
}: {
  models: PublicVehicle[];
  filters: VehicleFilters;
  onChange: (patch: Partial<VehicleFilters>) => void;
  count: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [tray, setTray] = useState<HTMLDivElement | null>(null);
  const picker = (
    key: keyof VehicleFilters,
    label: string,
    options: readonly (readonly [string, string])[],
    all = 'Any',
    portalContainer?: HTMLElement | null,
  ) => (
    <VehiclePicker
      portalContainer={portalContainer}
      label={label}
      value={filters[key] || 'all'}
      onValueChange={(value) =>
        onChange({ [key]: value === 'all' ? '' : value })
      }
      options={[
        { value: 'all', label: all },
        ...options.map(([value, label]) => ({ value, label })),
      ]}
    />
  );
  const query = parseVehicleQuery(filters.q);
  const commercial =
    !!(filters.body || filters.cargo) ||
    /Cargo/.test(filters.category) ||
    ['delivery', 'cold-chain', 'passengers'].includes(filters.use) ||
    query.tokens.some((t) =>
      [
        'cargo',
        'truck',
        'van',
        'delivery',
        'deliveries',
        'refrigerated',
        'freight',
      ].includes(t),
    );
  const labels: Record<keyof VehicleFilters, string> = {
    q: 'Search',
    category: 'Type',
    brand: 'Brand',
    use: 'Use',
    maxPrice: 'Landed budget',
    seats: 'Minimum seats',
    range: 'Minimum range',
    battery: 'Minimum battery',
    powertrain: 'Powertrain',
    maxLength: 'Maximum length',
    cargo: 'Minimum cargo volume',
    body: 'Cargo body',
    sort: 'Sort',
  };
  const active = (Object.keys(filters) as (keyof VehicleFilters)[]).filter(
    (k) => k !== 'sort' && filters[k],
  );
  const display = (key: keyof VehicleFilters) =>
    key === 'maxPrice'
      ? naira(Number(filters[key]))
      : key === 'use'
        ? uses.find(([value]) => value === filters[key])?.[1] || filters[key]
        : `${filters[key]}${key === 'range' ? ' km' : key === 'battery' ? ' kWh' : key === 'maxLength' ? ' mm' : key === 'cargo' ? ' m³' : ''}`;
  const panel = (container?: HTMLElement | null) => {
    const panelPicker = (
      key: keyof VehicleFilters,
      label: string,
      options: readonly (readonly [string, string])[],
      all = 'Any',
    ) => picker(key, label, options, all, container);
    return (
      <div className="vehicle-filter-fields">
        {' '}
        <div className="vehicle-discovery-primary">
          {panelPicker(
            'category',
            'Vehicle type',
            [...new Set(models.map((m) => m.category))].map((c) => [c, c]),
            'All vehicle types',
          )}
          {panelPicker(
            'brand',
            'Brand',
            [...new Set(models.map(vehicleBrand))].sort().map((b) => [b, b]),
            'All brands',
          )}
          <label className="vehicle-field">
            Maximum landed budget (₦)
            <input
              type="number"
              min="1"
              step="any"
              inputMode="numeric"
              value={filters.maxPrice}
              placeholder="e.g. 30000000"
              onChange={(e) => onChange({ maxPrice: e.target.value })}
            />
          </label>
          {panelPicker('use', 'What will you use it for?', uses, 'Any use')}
        </div>
        <details className="vehicle-discovery-more">
          <summary>
            <SlidersHorizontal size={17} aria-hidden="true" /> More filters{' '}
            <span>Seats, range, size & cargo</span>
          </summary>
          <div className="vehicle-discovery-secondary">
            {panelPicker('seats', 'Minimum seats', [
              ['2', '2+ seats'],
              ['4', '4+ seats'],
              ['5', '5+ seats'],
              ['6', '6+ seats'],
              ['7', '7+ seats'],
              ['9', '9+ seats'],
            ])}
            {panelPicker('range', 'Minimum published range', [
              ['150', '150+ km'],
              ['250', '250+ km'],
              ['300', '300+ km'],
              ['400', '400+ km'],
              ['500', '500+ km'],
              ['600', '600+ km'],
            ])}
            {panelPicker('battery', 'Minimum battery capacity', [
              ['30', '30+ kWh'],
              ['40', '40+ kWh'],
              ['50', '50+ kWh'],
              ['60', '60+ kWh'],
              ['70', '70+ kWh'],
            ])}
            {panelPicker(
              'powertrain',
              'Powertrain',
              [...new Set(models.map((m) => m.powertrain))].map((p) => [p, p]),
              'All powertrains',
            )}
            {panelPicker(
              'maxLength',
              'Vehicle length',
              [
                ['3500', 'Up to 3.5 m · small city car'],
                ['4500', 'Up to 4.5 m'],
                ['5000', 'Up to 5 m'],
              ],
              'Any exterior length',
            )}
            {commercial && (
              <>
                {panelPicker(
                  'body',
                  'Cargo body',
                  [
                    ['box', 'Enclosed box'],
                    ['flatbed', 'Flatbed'],
                    ['fence', 'High-sided'],
                    ['refrigerated', 'Refrigerated'],
                  ],
                  'Any cargo body',
                )}
                {panelPicker('cargo', 'Minimum cargo volume', [
                  ['3', '3+ m³'],
                  ['5', '5+ m³'],
                  ['7', '7+ m³'],
                ])}
              </>
            )}
          </div>
          <p className="vehicle-discovery-help">
            Cargo filters appear for commercial vehicle searches. Filters use
            published specifications; vehicles with missing values will not
            match. Charging hardware, payload, equipment and arrival dates are
            confirmed with your quotation.
          </p>
        </details>
        <p className="vehicle-discovery-help">
          Landed estimates include shipping, clearing, duties and taxes to
          Lagos. Indicative ranges depend on the final configuration.
        </p>
      </div>
    );
  };
  return (
    <div className="vehicle-discovery">
      <aside className="vehicle-filter-sidebar" aria-label="Filter vehicles">
        <div className="vehicle-sidebar-heading">
          <h3>Filters</h3>
          {active.length > 0 && (
            <button onClick={() => onChange(emptyFilters)}>Clear all</button>
          )}
        </div>
        {panel()}
      </aside>
      <div className="vehicle-search-results">
        <label className="vehicle-search vehicle-discovery-search">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search vehicles</span>
          <input
            type="search"
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Try ‘electric SUV under ₦30m’ or ‘7-seater’"
            aria-describedby="vehicle-search-help"
          />
        </label>
        <p id="vehicle-search-help" className="sr-only">
          Search by model, use, seats or landed budget.
        </p>
        <div className="vehicle-catalogue-controls">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="vehicle-mobile-filters">
                <SlidersHorizontal size={17} aria-hidden="true" /> Filters
                {active.length > 0 && <span>{active.length}</span>}
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              ref={setTray}
              className="vehicle-filter-tray"
            >
              <div className="vehicle-tray-header">
                <SheetTitle>Filter vehicles</SheetTitle>
                <SheetDescription>
                  Find the right vehicle for your needs and budget.
                </SheetDescription>
              </div>
              <div className="vehicle-tray-body">{panel(tray)}</div>
              <div className="vehicle-tray-footer">
                <button onClick={() => onChange(emptyFilters)}>
                  Clear all
                </button>
                <SheetClose asChild>
                  <button className="vehicle-button">
                    Show {count} {count === 1 ? 'vehicle' : 'vehicles'}
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          <p
            className="vehicle-result-count"
            aria-live="polite"
            aria-atomic="true"
          >
            {count} {count === 1 ? 'vehicle' : 'vehicles'}
          </p>
          <VehiclePicker
            label="Sort vehicles"
            value={filters.sort}
            onValueChange={(sort) => onChange({ sort })}
            options={sorts.map(([value, label]) => ({ value, label }))}
          />
        </div>
        {(query.maxPrice !== null ||
          query.seats !== null ||
          query.range !== null) && (
          <p className="vehicle-search-interpretation">
            From your search:{' '}
            {[
              query.maxPrice !== null
                ? `maximum landed budget ${naira(query.maxPrice)}`
                : null,
              query.seats ? `${query.seats}+ seats` : null,
              query.range
                ? `${query.strictRange ? 'over' : 'at least'} ${query.range} km published range`
                : null,
            ]
              .filter(Boolean)
              .join(' · ')}
            .
          </p>
        )}
        {active.length > 0 && (
          <div className="vehicle-filter-chips" aria-label="Active filters">
            {active.map((key) => (
              <button
                key={key}
                onClick={() => onChange({ [key]: '' })}
                aria-label={`Remove ${labels[key]} filter`}
              >
                <span>
                  {labels[key]}: {display(key)}
                </span>
                <X size={14} aria-hidden="true" />
              </button>
            ))}
            <button
              className="vehicle-clear-filters"
              onClick={() => onChange(emptyFilters)}
            >
              Clear all
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
