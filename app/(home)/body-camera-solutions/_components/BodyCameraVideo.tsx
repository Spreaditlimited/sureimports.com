import { Play, ShieldCheck } from 'lucide-react';
import { bodyCameraVideo } from '@/lib/bodyCameraSolutions/config';

export default function BodyCameraVideo() {
  if (!bodyCameraVideo.isReady || !bodyCameraVideo.playerUrl) return null;

  return (
    <section
      aria-labelledby="body-camera-video-title"
      className="px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#0b1930] text-white shadow-[0_30px_80px_rgba(8,20,40,0.16)] lg:grid-cols-[0.68fr_1.32fr]">
        <div className="relative flex flex-col justify-center overflow-hidden px-7 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_36%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-400">
            <Play className="h-4 w-4" aria-hidden="true" /> See the solution in
            action
          </p>
          <h2
            id="body-camera-video-title"
            aria-label="See how connected evidence begins in the field."
            className="relative mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl"
          >
            <span className="block">See how connected</span>
            <span className="block">evidence begins</span>
            <span className="block">in the field.</span>
          </h2>
          <p className="relative mt-5 text-sm leading-7 text-slate-300 sm:text-base">
            Explore how Hytera body cameras support frontline recording,
            evidence collection and coordinated operations across the complete
            incident workflow.
          </p>
          <p className="relative mt-7 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            Product overview video
          </p>
        </div>

        <div className="relative aspect-video min-h-64 overflow-hidden bg-slate-950 ring-1 ring-inset ring-white/10 lg:aspect-auto lg:min-h-[520px]">
          <iframe
            src={bodyCameraVideo.playerUrl}
            title="Hytera body camera and digital evidence solution overview"
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
