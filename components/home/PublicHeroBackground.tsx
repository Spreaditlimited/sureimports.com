import Image from 'next/image';

type PublicHeroBackgroundProps = {
  priority?: boolean;
};

export default function PublicHeroBackground({
  priority = true,
}: PublicHeroBackgroundProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Image
        src="/images/hero-background-1.png"
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover opacity-40 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
    </div>
  );
}
