import Image from 'next/image';
import { Activity, LockKeyhole, Radio } from 'lucide-react';
import type { SolutionImage } from '@/lib/bodyCameraSolutions/images';

type TechnologyStageProps = {
  image: SolutionImage;
  eyebrow?: string;
  status?: string;
  priority?: boolean;
  compact?: boolean;
  className?: string;
};

const stageSignals = [
  { label: 'Capture', icon: Activity },
  { label: 'Secure', icon: LockKeyhole },
  { label: 'Connect', icon: Radio },
];

export default function TechnologyStage({
  image,
  eyebrow = 'Field technology',
  status = 'System ready',
  priority = false,
  compact = false,
  className = '',
}: TechnologyStageProps) {
  return (
    <figure
      className={`relative isolate overflow-hidden bg-[#07111f] text-white ${compact ? 'min-h-[300px] rounded-none shadow-none' : 'min-h-[460px] rounded-[2rem] shadow-[0_30px_80px_rgba(8,20,40,0.22)]'} ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(114,145,183,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(114,145,183,0.1)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-cyan-300/15" />
      <div className="absolute -right-8 -top-8 h-52 w-52 rounded-full border border-cyan-300/10" />
      <div className="absolute left-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent" />
      <div className="absolute left-0 top-[24%] h-px w-full bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 backdrop-blur-md sm:left-7 sm:top-7">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        {status}
      </div>
      <div className="absolute right-5 top-5 z-10 text-right sm:right-7 sm:top-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/70">
          {eyebrow}
        </p>
        <p className="mt-1 text-xs font-semibold text-white/80">
          {image.subject}
        </p>
      </div>

      <div
        className={`absolute top-20 ${compact ? 'inset-x-12 bottom-14 sm:inset-x-20' : 'inset-x-10 bottom-16 sm:inset-x-16 sm:bottom-20'}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div
        className={`absolute z-10 grid grid-cols-3 gap-2 ${compact ? 'inset-x-5 bottom-4' : 'inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7'}`}
      >
        {stageSignals.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-1.5 border-t border-white/10 bg-white/[0.035] px-2 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-300 backdrop-blur-sm sm:text-[10px]"
          >
            <Icon className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
    </figure>
  );
}
