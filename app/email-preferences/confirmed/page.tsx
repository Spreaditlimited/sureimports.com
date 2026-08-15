import Link from 'next/link';
import { CheckCircle2, Clock3, MailX } from 'lucide-react';

const states = {
  confirmed: {
    icon: CheckCircle2,
    title: 'Your email is confirmed',
    message: 'Thank you. You will receive practical Sure Imports guidance and can unsubscribe whenever you choose.',
  },
  expired: {
    icon: Clock3,
    title: 'This confirmation link has expired',
    message: 'Submit your email again on Sure Imports and we will send you a fresh confirmation link.',
  },
  invalid: {
    icon: MailX,
    title: 'This confirmation link is not valid',
    message: 'The link may be incomplete or no longer available. Submit your email again to receive a new one.',
  },
} as const;

export default async function EmailConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const state = states[status as keyof typeof states] || states.invalid;
  const Icon = state.icon;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <img src="/images/logo.png" alt="Sure Imports" className="mx-auto h-12 w-auto max-w-full object-contain" />
        <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">{state.title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{state.message}</p>
        <Link href="/" className="mt-8 inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
          Return to Sure Imports
        </Link>
      </section>
    </main>
  );
}
