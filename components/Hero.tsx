import HeroPill from '@/components/home/HeroPill';
import heroLayout from '@/components/home/HeroLayout.module.css';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  size?: 'large' | 'small';
  showCTA?: boolean;
}

export default function Hero({
  title,
  subtitle,
  imageUrl = '/images/hero-background-1.png',
  size = 'large',
  showCTA = false,
}: HeroProps) {
  return (
<section
      className={`${heroLayout.fixed} ${styles.hero} relative flex w-full flex-col items-center justify-center overflow-hidden ${
        size === 'large'
          ? 'min-h-[85vh] pb-20 pt-32'
          : 'min-h-[40vh] pb-16 pt-32'
      }`}
    >
      <div className={`${styles.art} absolute inset-0 z-0`}>
        <Image
          src={imageUrl}
          alt="Logistics Background"
          fill
          priority
          className="object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">
        {size === 'large' && (
<HeroPill className="mb-6">
            Import from China with Confidence
          </HeroPill>
        )}

        <h1
          className={`font-black tracking-tight text-white ${
            size === 'large'
              ? 'text-5xl leading-[1.1] sm:text-6xl md:text-7xl'
              : 'text-4xl sm:text-5xl'
          }`}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl">
            {subtitle}
          </p>
        )}

        {showCTA && (
          <div className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="h-14 w-full rounded-full border-0 bg-brand-orange-500 px-8 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/40 active:scale-[0.98] sm:w-auto"
            >
              <Link href="/auth/login">
                Start Sourcing Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 w-full rounded-full border-slate-700 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/book-consultation">Talk to an Expert</Link>
            </Button>
          </div>
        )}
      </div>

      <div className={styles.fade} />
    </section>
  );
}
