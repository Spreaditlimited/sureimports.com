import { Building2, Check, Mail, Phone } from 'lucide-react';
import { bodyCameraBrand } from '@/lib/bodyCameraSolutions/config';
import LeadForm from './LeadForm';

const reviewItems = [
  'Requirements and stakeholder review',
  'Connected versus record-only recommendation',
  'Storage and retention sizing',
  'Pilot and phased deployment plan',
];

export default function AssessmentSection({ source }: { source?: string }) {
  return (
    <section id="assessment" className="scroll-mt-28 px-4 pb-24 sm:px-6">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <header className="bg-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-orange-400">
            Start with the operation
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Request a solution assessment.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Clarify the camera fleet, connectivity, docking, storage, retention,
            access, implementation and support scope before your organisation
            commits to a configuration.
          </p>
        </header>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">
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
