import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Package, 
  UploadCloud, 
  MessageSquare, 
  CalendarClock,
  ArrowRight,
  ShieldCheck,
  Globe,
  Briefcase
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/(home)/components/Footer';
import CorporateGiftsClient from './CorporateGiftsClient';

export const metadata: Metadata = {
  title: 'Corporate Sourcing from China | Sure Imports',
  description: 'Submit requirements for branded gift items or customized bulk products. Professional sourcing for Nigerian companies.',
};

const clients = [
  {
    name: 'Moppet',
    src: '/Moppet.PNG',
    frameClass: 'h-20 w-[190px] sm:h-24 sm:w-[220px] lg:h-24 lg:w-[230px] xl:h-28 xl:w-[280px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'Microware',
    src: '/Microware_dark.PNG',
    frameClass: 'h-20 w-[210px] sm:h-24 sm:w-[240px] lg:h-24 lg:w-[250px] xl:h-28 xl:w-[310px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'Sterling',
    src: '/Sterling.PNG',
    frameClass: 'h-20 w-[190px] sm:h-24 sm:w-[220px] lg:h-24 lg:w-[230px] xl:h-28 xl:w-[280px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'CafeOne',
    src: '/cafe-one-dark-transparent.png',
    frameClass: 'h-20 w-[170px] sm:h-24 sm:w-[190px] lg:h-24 lg:w-[200px] xl:h-28 xl:w-[240px]',
    imageClass: 'object-cover object-center',
  },
];

const marqueeClients = [...clients, ...clients];
const logoSlotClass = 'flex w-[280px] shrink-0 items-center justify-center';

const productExamples = [
  { name: 'Branded Drinkware', desc: 'Mugs, tumblers, and smart flasks', icon: '☕' },
  { name: 'Tech & Power', desc: 'Power banks, flash drives, and speakers', icon: '🔋' },
  { name: 'Executive Hampers', desc: 'Premium curated gift boxes', icon: '🎁' },
  { name: 'Office Essentials', desc: 'Notebooks, pens, and desk organizers', icon: '📓' },
  { name: 'Travel & Bags', desc: 'Backpacks, totes, and luggage tags', icon: '🎒' },
  { name: 'Event Promo', desc: 'Lanyards, wristbands, and keychains', icon: '🎊' },
];

export default function CorporateGiftsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#fcfcfd] dark:bg-slate-950 antialiased">
        
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-slate-900 pb-16 pt-32 text-white sm:pb-20 sm:pt-40 lg:flex lg:min-h-[85vh] lg:items-center lg:pt-48">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/20 blur-[120px] pointer-events-none z-0" />
          </div>
          
          <div className="relative z-20 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/30 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand-orange-400 backdrop-blur-sm">
                  <Briefcase className="h-3.5 w-3.5" /> Direct Factory Sourcing
                </div>
                <h1 className="text-4xl font-black tracking-tight sm:text-6xl leading-[1.1]">
                  Premium Branded Products{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                    Sourced From China.
                  </span>
                </h1>
                <p className="mt-6 text-lg font-medium text-slate-300 leading-relaxed max-w-xl">
                  We handle the complexity of sourcing, branding, and shipping. Get high-quality, customized items delivered directly to your Nigerian office.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a href="#corporate-gifts-form" className="flex h-14 items-center justify-center gap-2 rounded-full bg-brand-orange-500 px-8 font-bold text-white hover:bg-brand-orange-600 transition-all shadow-lg shadow-brand-orange-500/20 active:scale-95">
                    Start Your Request <ArrowRight className="w-5 h-5" />
                  </a>
                  <div className="flex items-center justify-center gap-2 px-4 text-sm font-semibold text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Verified Suppliers Only
                  </div>
                </div>
              </div>

              {/* Product Visual Mockup */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-xl transition duration-1000"></div>
                <div className="relative grid grid-cols-2 gap-4 rounded-[32px] border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-2xl">
                   <div className="space-y-4">
                      <div className="h-48 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-6xl shadow-inner">🎁</div>
                      <div className="h-32 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-5xl shadow-inner">🔋</div>
                   </div>
                   <div className="space-y-4 pt-12">
                      <div className="h-32 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-5xl shadow-inner">☕</div>
                      <div className="h-48 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-6xl shadow-inner">🎒</div>
                   </div>
                </div>
              </div>
            </div>

            {/* --- CLIENT TRUST BAR --- */}
            <div className="mt-14 pt-6 sm:mt-16 sm:pt-8 lg:mt-20 lg:pt-10">
              <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                Trusted by organizations across Nigeria
              </p>

              <div className="-mx-4 overflow-hidden sm:-mx-6 lg:hidden">
                <div className="mobile-logo-marquee flex w-max items-center gap-0 px-4 sm:px-6">
                  {marqueeClients.map((client, index) => (
                    <div
                      key={`${client.name}-${index}`}
                      className={logoSlotClass}
                    >
                      <div
                        className={`relative overflow-hidden ${client.frameClass}`}
                      >
                        <Image
                          src={client.src}
                          alt={client.name}
                          fill
                          sizes="280px"
                          className={client.imageClass}
                          quality={100}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden w-full grid-cols-4 place-items-center gap-5 lg:grid xl:gap-6">
                {clients.map((client) => (
                  <div
                    key={client.name}
                    className="flex w-full items-center justify-center"
                  >
                    <div
                      className={`relative max-w-full overflow-hidden ${client.frameClass}`}
                    >
                      <Image
                        src={client.src}
                        alt={client.name}
                        fill
                        sizes="25vw"
                        className={client.imageClass}
                        quality={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- PROCESS STEPS --- */}
        <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-16 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">The Sourcing Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-12" />
                
                {[
                  { title: 'Describe', desc: 'Send us your product idea or reference photos.', icon: Package },
                  { title: 'Branding', desc: 'Upload your logo for custom factory printing.', icon: UploadCloud },
                  { title: 'Quotes', desc: 'We provide landed costs including shipping to Nigeria.', icon: Globe },
                  { title: 'Delivery', desc: 'We inspect, ship, and deliver to your location.', icon: MessageSquare },
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-6 shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400 dark:shadow-none">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-4">{step.desc}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* --- PRODUCT GRID --- */}
        <section className="px-4 py-24 bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div>
                 <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">Popular Categories</h2>
                 <p className="mt-2 text-slate-500">We can source almost anything, but these are client favorites.</p>
               </div>
               <div className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl flex items-center gap-2 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400">
                 <CalendarClock className="w-4 h-4" />
                 Book 12 weeks early for festive seasons
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productExamples.map((item) => (
                <div key={item.name} className="p-6 rounded-[24px] border border-slate-200 bg-slate-50 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex items-start gap-5 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-slate-800">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FORM SECTION --- */}
        <section id="corporate-gifts-form" className="bg-slate-50 py-24 dark:bg-slate-900/30">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Submit Your Request</h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">Our sourcing team will review your details and contact you via WhatsApp.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-10 shadow-xl shadow-slate-200/40 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
              <CorporateGiftsClient />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
