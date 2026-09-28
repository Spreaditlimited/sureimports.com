'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import type { PublicVehicle } from '@/lib/vehicles/data';

export default function VehicleHeroCarousel({
  models,
}: {
  models: PublicVehicle[];
}) {
  const slides = useMemo(() => {
    const available = models.filter((model) => model.images.length);
    const categories = new Set<string>();
    const representatives = available.filter((model) => {
      if (categories.has(model.category)) return false;
      categories.add(model.category);
      return true;
    });
    return [
      ...representatives,
      ...available.filter((model) => !representatives.includes(model)),
    ];
  }, [models]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(true);
  const [hovered, setHovered] = useState(false);
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(preference.matches);
    const change = () => setPaused(preference.matches);
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (paused || hovered || slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden)
        setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, slides.length]);
  if (!slides.length) return null;
  const active = index % slides.length;
  const move = (direction: number) => {
    setPaused(true);
    setIndex(
      (current) => (current + direction + slides.length) % slides.length,
    );
  };
  return (
    <section
      className="vehicle-hero-image vehicle-carousel"
      aria-label="Explore our vehicle catalogue"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setPaused(true);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current !== null) {
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1);
        }
        touchStart.current = null;
      }}
    >
      <div
        className="vehicle-carousel-track"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((model, position) => (
          <div
            key={model.slug}
            className="vehicle-carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${slides.length}: ${model.name}`}
            aria-hidden={position !== active}
            inert={position !== active}
          >
            <Image
              src={model.images[0]}
              alt={model.name}
              fill
              priority={position === 0}
              sizes="(max-width: 800px) 100vw, 52vw"
            />
            <div className="vehicle-image-caption">
              <span>{model.category}</span>
              <Link href={`/cars/models/${model.slug}`}>
                <strong>{model.name}</strong>
                <ArrowRight size={20} />
              </Link>
              <span>{model.powertrain} · Explore configurations</span>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="vehicle-carousel-controls">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={
              paused ? 'Start vehicle slideshow' : 'Pause vehicle slideshow'
            }
          >
            {paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
          <span aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
            {active + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous vehicle"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next vehicle"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
