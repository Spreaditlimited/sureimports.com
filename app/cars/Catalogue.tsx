'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Search, Zap, X } from 'lucide-react';
import type { PublicVehicle } from '@/lib/vehicles/data';
import { naira } from '@/lib/vehicles/policy';
import VehicleHeroCarousel from './VehicleHeroCarousel';
import VehicleComparison from './VehicleComparison';
import guides from '@/content/vehicle-guides/manifest.json';
import VehicleFaqs from './VehicleFaqs';

export default function Catalogue({ models }: { models: PublicVehicle[] }) {
  const params = useSearchParams();
  const [category, setCategory] = useState(
    params.get('category') || 'All vehicles',
  );
  const [query, setQuery] = useState('');
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const categories = [
    'All vehicles',
    ...new Set(models.map((m) => m.category)),
  ];
  const filtered = useMemo(
    () =>
      models.filter(
        (m) =>
          (category === 'All vehicles' || m.category === category) &&
          `${m.name} ${m.description} ${m.powertrain}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [models, category, query],
  );
  return (
    <main>
      <section className="vehicle-hero">
        <div className="vehicle-hero-copy">
          <p className="vehicle-eyebrow">
            <span /> THE NEXT MOVE FOR YOUR BUSINESS
          </p>
          <h1>
            Electric ambition.
            <br />
            <em>Delivered.</em>
          </h1>
          <p className="vehicle-hero-description">
            Discover electric vans, buses and trucks from China. Clear Naira
            pricing. One team, from your first enquiry to arrival in Nigeria.
          </p>
          <a href="#range" className="vehicle-button">
            Find your vehicle <ArrowUpRight size={18} />
          </a>
          <div className="vehicle-hero-note">
            <Zap size={17} /> Introducing the Ruichi electric range
          </div>
        </div>
        <VehicleHeroCarousel models={models} />
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
            <h2>Different jobs. An electric answer.</h2>
          </div>
          <p>
            From the daily delivery route
            <br />
            to your next fleet expansion.
          </p>
        </div>
        <div className="vehicle-filters">
          <div className="vehicle-tabs" aria-label="Filter by vehicle type">
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                className={category === c ? 'active' : ''}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="vehicle-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the range"
              aria-label="Search vehicles"
            />
          </label>
        </div>
        <p className="vehicle-result-count" aria-live="polite">
          {filtered.length} models · Choose a model to explore configurations
        </p>
        <div className="vehicle-grid">
          {filtered.map((m) => {
            const ranges = m.variants
              .map((v) => v.rangeKm)
              .filter((n): n is number => n !== null);
            const prices = m.variants
              .map((v) => v.price?.totalNgn)
              .filter((n): n is number => n !== undefined);
            return (
              <article className="vehicle-card" key={m.slug}>
                <Link
                  href={`/cars/models/${m.slug}`}
                  className="vehicle-card-image"
                >
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
                  <Link href={`/cars/models/${m.slug}`}>
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
                    <span>{m.variants.length} configurations</span>
                  </div>
                  <div className="vehicle-card-bottom">
                    <div>
                      <small>
                        {prices.length
                          ? 'Estimated landed price from'
                          : 'Manufacturer pricing being confirmed'}
                      </small>
                      <strong>
                        {prices.length
                          ? naira(Math.min(...prices))
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
                        onChange={(e) =>
                          setCompare(
                            e.target.checked
                              ? [...compare, m.slug]
                              : compare.filter((s) => s !== m.slug),
                          )
                        }
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
          <p className="vehicle-empty">
            No vehicles match your search. Try another category or model name.
          </p>
        )}
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
        models={models.filter((model) => compare.includes(model.slug))}
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
