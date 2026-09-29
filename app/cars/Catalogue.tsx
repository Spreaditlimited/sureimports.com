'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Zap, X } from 'lucide-react';
import type { PublicVehicle } from '@/lib/vehicles/data';
import { naira } from '@/lib/vehicles/policy';
import VehicleHeroCarousel from './VehicleHeroCarousel';
import VehicleComparison from './VehicleComparison';
import guides from '@/content/vehicle-guides/manifest.json';
import VehicleFaqs from './VehicleFaqs';
import HeroPill from '@/components/home/HeroPill';
import VehicleSearchFilters from './VehicleSearchFilters';
import {
  emptyFilters,
  readVehicleFilters,
  searchVehicles,
  landedBounds,
  type VehicleFilters,
} from '@/lib/vehicles/search';

export default function Catalogue({ models }: { models: PublicVehicle[] }) {
  const params = useSearchParams();
  const filters = useMemo(() => readVehicleFilters(params), [params]);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareVariants, setCompareVariants] = useState<
    Record<string, string>
  >({});
  const filtered = useMemo(
    () => searchVehicles(models, filters),
    [models, filters],
  );
  function changeFilters(patch: Partial<VehicleFilters>) {
    const next = { ...filters, ...patch };
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(next))
      if (value && !(key === 'sort' && value === 'relevance'))
        search.set(key, value);
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${search.size ? '?' + search.toString() : ''}${window.location.hash}`,
    );
  }
  return (
    <main className="vehicle-catalogue">
      <section className="vehicle-hero-surface">
        <div className="vehicle-hero">
          <div className="vehicle-hero-copy">
            <HeroPill>Your next move, made electric</HeroPill>
            <h1>
              Electric ambition.
              <br />
              <em>Delivered.</em>
            </h1>
            <p className="vehicle-hero-description">
              Discover electric cars, SUVs, vans and trucks from China. Clear
              Naira pricing. One team, from your first enquiry to arrival in
              Nigeria.
            </p>
            <a href="#range" className="vehicle-button">
              Find your vehicle <ArrowUpRight size={18} />
            </a>
            <div className="vehicle-hero-note">
              <Zap size={17} /> Electric cars and commercial vehicles
            </div>
          </div>
          <VehicleHeroCarousel models={models} />
        </div>
      </section>
      <section className="vehicle-trust" aria-label="Buying with Sure Imports">
        <div>
          <span>01</span>
          <strong>Priced in Naira</strong>
          <p>Know your vehicle and estimated landed cost.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Clearing included</strong>
          <p>Shipping estimates include duties and taxes.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Every step, visible</strong>
          <p>Order updates in your dashboard, email and WhatsApp.</p>
        </div>
      </section>
      <section id="range" className="vehicle-range">
        <div className="vehicle-section-heading">
          <div>
            <p className="vehicle-eyebrow">FIND YOUR FIT</p>
            <h2>Find your next electric vehicle.</h2>
          </div>
          <p>
            From your everyday commute
            <br />
            to your next fleet expansion.
          </p>
        </div>
        <VehicleSearchFilters
          models={models}
          filters={filters}
          onChange={changeFilters}
          count={filtered.length}
        >
          <div className="vehicle-grid">
            {filtered.map(({ model: m, variants, budgetOverlap }) => {
              const href = `/cars/models/${m.slug}?configuration=${encodeURIComponent(variants[0].id)}`;
              const bounds = variants
                .map(landedBounds)
                .filter(
                  (p): p is NonNullable<ReturnType<typeof landedBounds>> =>
                    p !== null,
                );
              const indicative = bounds.some((p) => p.indicative);
              const minimum = bounds.length
                ? Math.min(...bounds.map((p) => p.min))
                : null;
              const maximum = bounds.length
                ? Math.max(...bounds.map((p) => p.max))
                : null;
              const ranges = variants
                .map((v) => v.rangeKm)
                .filter((n): n is number => n !== null);
              return (
                <article className="vehicle-card" key={m.slug}>
                  <Link href={href} className="vehicle-card-image">
                    {m.images[0] ? (
                      <Image
                        src={m.images[0]}
                        alt={m.name}
                        fill
                        sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="vehicle-image-placeholder">{m.name}</div>
                    )}
                    <span className="vehicle-tag">
                      <Zap size={12} />
                      {m.powertrain}
                    </span>
                  </Link>
                  <div className="vehicle-card-body">
                    <p className="vehicle-eyebrow">{m.category}</p>
                    <Link href={href}>
                      <h3>
                        {m.name}
                        <ArrowUpRight size={21} />
                      </h3>
                    </Link>
                    <div className="vehicle-card-specs">
                      <span>
                        {ranges.length
                          ? `Up to ${Math.max(...ranges)} km*`
                          : 'Specifications on request'}
                      </span>
                      <span>
                        {variants.length}{' '}
                        {variants.length === 1
                          ? 'configuration'
                          : 'configurations'}
                        {variants.length < m.variants.length ? ' match' : ''}
                      </span>
                    </div>
                    {budgetOverlap && (
                      <p className="vehicle-budget-note">
                        Lower estimate fits your budget; some configurations
                        cost more.
                      </p>
                    )}
                    <div className="vehicle-card-bottom">
                      <div>
                        <small>
                          {minimum !== null
                            ? indicative
                              ? 'Indicative landed price range'
                              : 'Estimated landed price from'
                            : 'Supplier pricing being confirmed'}
                        </small>
                        <strong>
                          {minimum !== null
                            ? indicative && maximum !== null
                              ? `${naira(minimum)} – ${naira(maximum)}`
                              : naira(minimum)
                            : 'Request a quotation'}
                        </strong>
                      </div>
                      <label>
                        <input
                          type="checkbox"
                          aria-label={`Compare ${m.name}`}
                          checked={compare.includes(m.slug)}
                          disabled={
                            !compare.includes(m.slug) && compare.length === 3
                          }
                          onChange={(e) => {
                            if (e.target.checked)
                              setCompareVariants((current) => ({
                                ...current,
                                [m.slug]: variants[0].id,
                              }));
                            setCompare(
                              e.target.checked
                                ? [...compare, m.slug]
                                : compare.filter((s) => s !== m.slug),
                            );
                          }}
                        />
                        Compare
                      </label>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {!filtered.length && (
            <div className="vehicle-empty">
              <h3>No vehicles match these filters</h3>
              <p>
                Try a higher budget, fewer filters or another model name.
                Unconfirmed specifications and prices may limit the results.
              </p>
              <button
                className="vehicle-button"
                onClick={() => changeFilters(emptyFilters)}
              >
                Clear filters
              </button>
            </div>
          )}
        </VehicleSearchFilters>
        <p className="vehicle-footnote">
          *Supplier-stated range varies by configuration and test cycle. Actual
          range depends on load, route and driving conditions. Photographs may
          show different configurations; your quotation confirms the supplied
          vehicle.
        </p>
      </section>
      <section className="vehicle-how">
        <div>
          <p className="vehicle-eyebrow">CHINA TO NIGERIA, MADE CLEAR</p>
          <h2>
            Your next vehicle.
            <br />A straightforward journey.
          </h2>
        </div>
        <ol>
          <li>
            <strong>Choose your configuration</strong>
            <p>
              Tell us what you need. We confirm the vehicle, availability and
              quotation.
            </p>
          </li>
          <li>
            <strong>Pay securely by bank transfer</strong>
            <p>
              Use the account on your order, upload proof and receive
              confirmation.
            </p>
          </li>
          <li>
            <strong>Follow it all the way home</strong>
            <p>See shipment milestones and receive updates through delivery.</p>
          </li>
        </ol>
      </section>
      <section
        className="vehicle-guides"
        id="ownership-guides"
        aria-labelledby="ownership-guides-title"
      >
        <p className="vehicle-eyebrow">OWNING AN EV IN NIGERIA</p>
        <h2 id="ownership-guides-title">
          Make the numbers work for your everyday life.
        </h2>
        <p>
          Understand charging, real electricity costs, generator and solar
          options, range and maintenance before choosing your vehicle.
        </p>
        <div className="vehicle-guide-grid">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/blog/${guide.slug}`}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <span>Read the guide →</span>
            </Link>
          ))}
        </div>
      </section>
      <VehicleFaqs />
      {compare.length > 0 && (
        <div className="vehicle-compare-bar">
          <span>{compare.length} of 3 selected</span>
          <button
            className="vehicle-button"
            onClick={() => setShowCompare(true)}
          >
            Compare models
          </button>
          <button aria-label="Clear comparison" onClick={() => setCompare([])}>
            <X />
          </button>
        </div>
      )}
      <VehicleComparison
        models={models
          .filter((model) => compare.includes(model.slug))
          .map((model) => ({
            ...model,
            variants: [...model.variants].sort(
              (a, b) =>
                Number(b.id === compareVariants[model.slug]) -
                Number(a.id === compareVariants[model.slug]),
            ),
          }))}
        open={showCompare}
        onClose={() => setShowCompare(false)}
        onRemove={(slug) => {
          setCompare((current) => current.filter((value) => value !== slug));
          if (compare.length === 1) setShowCompare(false);
        }}
      />
    </main>
  );
}
