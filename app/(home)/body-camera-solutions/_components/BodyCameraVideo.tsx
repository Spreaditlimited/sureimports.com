import { Play, ShieldCheck } from 'lucide-react';
import { bodyCameraVideo } from '@/lib/bodyCameraSolutions/config';

export default function BodyCameraVideo() {
  if (!bodyCameraVideo.isReady || !bodyCameraVideo.playerUrl) return null;

  return (
    <section
      aria-labelledby="body-camera-video-title"
      className="mx-auto mb-8 w-[calc(100%-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:w-[calc(100%-3rem)]"
    >
      <div className="grid lg:grid-cols-[0.68fr_1.32fr]">
        <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-600">
            <Play className="h-4 w-4" aria-hidden="true" /> See the solution in
            action
          </p>
          <h2
            id="body-camera-video-title"
            className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl"
          >
            <span className="block">See how connected</span>
            <span className="block">evidence begins</span>
            <span className="block">in the field.</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Explore how Hytera body cameras support frontline recording,
            evidence collection and coordinated operations across the complete
            incident workflow.
          </p>
          <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            Product overview video
          </p>
        </div>

        <div className="relative aspect-video min-h-64 overflow-hidden bg-slate-950 lg:aspect-auto lg:min-h-[420px]">
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
