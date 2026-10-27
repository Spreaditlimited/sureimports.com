import type { ReactNode } from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';
import HeroPill from '@/components/home/HeroPill';

// Render the introduction immediately while fresh catalogue data is fetched.
export default function VehicleCatalogueHero({
  children,
}: {
  children: ReactNode;
}) {
  return (
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
        {children}
      </div>
    </section>
  );
}
