import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, 
  CalendarClock, 
  CheckCircle2, 
  PhoneCall, 
  ShieldCheck, 
  Video
} from 'lucide-react';

import Footer from '@/app/(home)/components/Footer';
import Navigation from '@/app/(home)/components/Navigation';
import ConsultationBookingForm from '@/components/consultation/ConsultationBookingForm';
import ConsultationManageActions from '@/components/consultation/ConsultationManageActions';
import { clean, consultationAmountKobo, slotLabel } from '@/lib/consultation';
import { prisma } from '@/lib/prisma';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';

const pageUrl = 'https://www.sureimports.com/book-consultation';

export const metadata: Metadata = {
  title: 'Book a Paid Import Consultation | Sure Imports',
  description:
    'Pay and book a focused Sure Imports consultation for China sourcing, supplier checks, landed cost, shipping, or import decisions.',
  alternates: { canonical: pageUrl },
};

const benefits = [
  {
    step: '01',
    title: 'Schedule & Pay',
    description: 'Select an available time slot below and complete the secure Paystack payment to confirm your booking.',
    icon: CalendarClock,
  },
  {
    step: '02',
    title: 'Join the Call',
    description: 'You will receive a calendar invite with a meeting link. Join from a quiet place with a stable connection.',
    icon: Video,
  },
  {
    step: '03',
    title: 'Get Clarity',
    description: 'We will dissect your import plan, flag any immediate risks, and give you a structured pathway forward.',
    icon: ShieldCheck,
  },
];

type ManagedBooking = {
  pidBooking: string;
  fullName: string;
  email: string;
  phone: string | null;
  businessName: string | null;
  consultationGoal: string | null;
  slotStartUtc: Date;
  slotEndUtc: Date;
  durationMinutes: number;
  status: string;
  amountKobo: number;
  currency: string;
  paidAt: Date | null;
  zoomMeetingId: string | null;
  zoomJoinUrl: string | null;
  manageToken: string;
  createdAt: Date;
};

function formatMoney(kobo: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(kobo / 100));
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

export default async function BookConsultationPage({
  searchParams,
}: {
  searchParams?: Promise<{ manage?: string }>;
}) {
  const amountKobo = consultationAmountKobo();
  const resolvedSearchParams = await searchParams;
  const manageToken = clean(resolvedSearchParams?.manage, 180);

  if (manageToken) {
    const rows = await prisma.$queryRaw<ManagedBooking[]>`
      SELECT
        pidBooking,
        fullName,
        email,
        phone,
        businessName,
        consultationGoal,
        slotStartUtc,
        slotEndUtc,
        durationMinutes,
        status,
        amountKobo,
        currency,
        paidAt,
        zoomMeetingId,
        zoomJoinUrl,
        manageToken,
        createdAt
      FROM consultation_bookings
      WHERE manageToken = ${manageToken}
      LIMIT 1
    `;

    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfd] text-slate-600 antialiased selection:bg-brand-orange-500/30">
        <Navigation forceLightNavbar />
        <main className="flex-1">
          <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-48 sm:px-6 lg:px-8">
            <header className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-600">
              <CalendarClock className="h-3.5 w-3.5" />
              Paid Consultation
            </div>
            <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Manage your{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                consultation booking
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-slate-500">
              Join your Zoom meeting, choose another available time, or cancel
              the booking from this page.
            </p>
            </header>

            <div className="mx-auto max-w-3xl">
              {rows[0] ? (
                <ManagedBookingPanel booking={rows[0]} />
              ) : (
                <InvalidManageLink />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 antialiased selection:bg-brand-orange-500/30">
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-16 pt-32 text-center text-white sm:px-6 sm:pb-24 sm:pt-44 lg:px-8">
        <PublicHeroBackground />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-brand-orange-500/15 blur-[100px] sm:h-[600px] sm:w-[800px]" />
        
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange-400 backdrop-blur-md sm:mb-6 sm:px-4 sm:py-1.5 sm:text-xs">
            <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            1-on-1 Strategy Call
          </div>
          
          <h1 className="text-[clamp(2.25rem,6.4vw,4.5rem)] font-black leading-[1.08] tracking-tight">
            <span className="md:block md:whitespace-nowrap">
              Get clear direction before you
            </span>{" "}
            <span className="md:block md:whitespace-nowrap">
              send money to China
            </span>
          </h1>
          
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:mt-6 sm:text-lg">
            Book a focused call with Sure Imports to review your import plan, vet a supplier concern, or calculate your true landed costs.
          </p>
          
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <a
              href="#booking"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-8 text-base font-bold text-white transition-all hover:bg-brand-orange-600 sm:w-auto sm:rounded-full"
            >
              Choose a slot <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/supplier-intelligence"
              className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto sm:rounded-full"
            >
              Supplier Intelligence
            </Link>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-left sm:mb-16 sm:text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              How the consultation works
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
              Come prepared with your product links, supplier chats, and specific questions.
            </p>
          </div>

          <div className="relative">
            {/* Mobile Vertical Timeline Line */}
            <div className="absolute bottom-4 left-[27px] top-4 w-px bg-slate-100 md:hidden" />
            
            <div className="grid gap-8 sm:gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title} 
                  className="relative flex items-start gap-5 md:flex-col md:items-center md:text-center"
                >
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 shadow-sm md:h-16 md:w-16 md:rounded-[1.5rem]">
                    <benefit.icon className="h-6 w-6 md:h-7 md:w-7" />
                    <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange-500 text-[10px] font-black text-white ring-4 ring-white">
                      {benefit.step}
                    </span>
                  </div>
                  <div className="pt-2 md:pt-0">
                    <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FOCUSED BOOKING SECTION --- */}
      <section id="booking" className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-orange-200 bg-brand-orange-50 text-brand-orange-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange-600">
              Private 1-on-1 advisory
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Secure your session
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Choose a time that works for you, share what you need help with,
              and reserve your consultation securely.
            </p>
          </header>

          {amountKobo > 0 ? (
            <ConsultationBookingForm amountKobo={amountKobo} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-amber-200 bg-white px-4 py-10 text-center shadow-xl shadow-slate-200/50 sm:p-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <CalendarClock className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-amber-900">Booking Offline</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-amber-800">
                Consultation booking is currently offline while we update our schedule. Please check back later.
              </p>
            </div>
          )}

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-500">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            Encrypted payment processed securely by Paystack
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ManagedBookingPanel({ booking }: { booking: ManagedBooking }) {
  const isBooked = booking.status === 'booked' || booking.status === 'rescheduled';
  const timeText = slotLabel(booking.slotStartUtc.toISOString());

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:rounded-[2rem]">
      <div className="p-5 sm:p-8">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Your Sure Imports consultation
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {timeText} (Africa/Lagos)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                isBooked
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {statusLabel(booking.status)}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold text-slate-600">
              {booking.pidBooking}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Name" value={booking.fullName} />
          <Info label="Email" value={booking.email} />
          <Info label="Phone" value={booking.phone} />
          <Info label="Business" value={booking.businessName} />
          <Info label="Call time" value={`${timeText} (Africa/Lagos)`} />
          <Info label="Duration" value={`${booking.durationMinutes} minutes`} />
          <Info label="Amount paid" value={formatMoney(booking.amountKobo, booking.currency)} />
          <Info label="Paid at" value={booking.paidAt ? slotLabel(booking.paidAt.toISOString()) : null} />
        </div>

        {booking.consultationGoal ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              What you submitted
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
              {booking.consultationGoal}
            </p>
          </div>
        ) : null}

        <ConsultationManageActions
          manageToken={booking.manageToken}
          zoomJoinUrl={booking.zoomJoinUrl}
          currentSlotIso={booking.slotStartUtc.toISOString()}
          status={booking.status}
        />
      </div>
    </div>
  );
}

function InvalidManageLink() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
        Booking link not found
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        This manage-booking link is invalid or no longer available.
      </p>
      <Link
        href="/book-consultation"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-orange-500 px-5 text-sm font-bold text-white transition hover:bg-brand-orange-600"
      >
        Book a consultation
      </Link>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-900">
        {value}
      </p>
    </div>
  );
}
