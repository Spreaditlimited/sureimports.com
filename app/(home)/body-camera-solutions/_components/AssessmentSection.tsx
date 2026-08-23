import Image from 'next/image';
import { Building2, Check, Mail, Phone } from 'lucide-react';
import { bodyCameraBrand } from '@/lib/bodyCameraSolutions/config';
import { bodyCameraProductImages } from '@/lib/bodyCameraSolutions/images';
import LeadForm from './LeadForm';

const reviewItems = [
  'Requirements and stakeholder review',
  'Connected versus record-only recommendation',
  'Storage and retention sizing',
  'Pilot and phased deployment plan',
];

export default function AssessmentSection({ source }: { source?: string }) {
  return (
    <section
      id="assessment"
      className="scroll-mt-28 bg-[#07111f] px-4 py-20 text-white sm:px-6 sm:py-24"
    >
      <article className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1930] shadow-[0_30px_90px_rgba(0,0,0,0.25)] lg:grid-cols-[0.72fr_1.28fr]">
        <header className="relative flex h-full flex-col overflow-hidden border-b border-white/10 px-7 py-10 text-white sm:px-10 sm:py-12 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.12),transparent_34%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-400">
            Start with the operation
          </p>
          <h2 className="relative mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-5xl">
            Build the right evidence operation.
          </h2>
          <p className="relative mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Clarify the camera fleet, connectivity, docking, storage, retention,
            access, implementation and support scope before your organisation
            commits to a configuration.
          </p>

          <figure className="relative mt-10 hidden min-h-[380px] flex-1 overflow-hidden border-t border-white/10 lg:block">
            <div className="absolute inset-x-0 top-5 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
              <span>Field hardware</span>
              <span className="flex items-center gap-2 text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                Deployment ready
              </span>
            </div>
            <div className="absolute inset-x-2 bottom-0 top-14">
              <Image
                src={bodyCameraProductImages.sc580.src}
                alt={bodyCameraProductImages.sc580.alt}
                fill
                sizes="(min-width: 1024px) 34vw"
                className="object-contain object-bottom drop-shadow-[0_28px_35px_rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full border border-cyan-300/10" />
            <div className="pointer-events-none absolute bottom-10 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full border border-cyan-300/10" />
          </figure>
        </header>

        <div className="bg-white px-7 py-10 text-slate-950 dark:bg-slate-900 dark:text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <h3 className="text-xl font-bold">
            Tell us what the system needs to achieve
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            We will use the information below to prepare the right technical
            conversation—not a generic equipment list.
          </p>

          <ul className="mt-6 grid gap-x-8 gap-y-3 border-y border-slate-200 py-5 dark:border-slate-800 sm:grid-cols-2">
            {reviewItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <LeadForm source={source} />
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <a
              href={`mailto:${bodyCameraBrand.contactEmail}`}
              className="flex items-center gap-2 hover:text-blue-700"
            >
              <Mail className="h-4 w-4" /> {bodyCameraBrand.contactEmail}
            </a>
            <a
              href={`tel:${bodyCameraBrand.phoneHref}`}
              className="flex items-center gap-2 hover:text-blue-700"
            >
              <Phone className="h-4 w-4" /> {bodyCameraBrand.phoneDisplay}
            </a>
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Lagos, Nigeria · Serving African
              organisations
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
