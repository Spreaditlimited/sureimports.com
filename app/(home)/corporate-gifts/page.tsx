import type { Metadata } from 'next';
import Image from 'next/image';
import { 
  Package, 
  UploadCloud, 
  MessageSquare, 
  CalendarClock,
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import CorporateGiftsClient from './CorporateGiftsClient';

export const metadata: Metadata = {
  title: 'Corporate Gift Sourcing from China | Sure Imports',
  description: 'Submit requirements for branded gift items or customized bulk products. Professional sourcing for Nigerian companies.',
};

const clients = [
  { name: 'Moppet', src: '/Moppet.PNG' },
  {
    name: 'Microware',
    src: '/Microware.PNG',
    className: 'drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]',
    widthClass: 'w-[280px] md:w-[360px]',
  },
  { name: 'Sterling', src: '/Sterling.PNG' },
  {
    name: 'CafeOne',
    src: '/cafeOne.PNG',
    className: 'invert brightness-200 contrast-125',
  },
];

const productExamples = [
  { name: 'Branded Mugs & Drinkware', icon: '☕' },
  { name: 'Power Banks & Tech Gifts', icon: '🔋' },
  { name: 'Gift Boxes & Hampers', icon: '🎁' },
  { name: 'Notebooks & Office Items', icon: '📓' },
  { name: 'Bags & Travel Gear', icon: '🎒' },
  { name: 'Event & Promo Items', icon: '🎊' },
];

export default function CorporateGiftsPage() {
  return (
    <>
      <Header />
      <main className="bg-[#020617] text-white">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[120px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Direct Factory Sourcing
                </div>
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]">
                  Premium Corporate Gifts{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Sourced From China.
                  </span>
                </h1>
                <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
                  We handle the complexity of sourcing, branding, and shipping. Get high-quality, customized items delivered directly to your Nigerian office.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a href="#corporate-gifts-form" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                    Start Your Request <ArrowRight className="w-4 h-4" />
                  </a>
                  <div className="flex items-center gap-3 px-4 text-sm text-slate-400">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    Verified Suppliers Only
                  </div>
                </div>
              </div>

              {/* Product Visual Mockup */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative grid grid-cols-2 gap-4 rounded-[2rem] border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl">
                   <div className="space-y-4">
                      <div className="h-40 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl">🎁</div>
                      <div className="h-32 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl">🔋</div>
                   </div>
                   <div className="space-y-4 pt-8">
                      <div className="h-32 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl">☕</div>
                      <div className="h-40 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl">🎒</div>
                   </div>
                </div>
              </div>
            </div>

            {/* --- CLIENT TRUST BAR --- */}
            <div className="mt-24 border-t border-white/5 pt-12">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-8">
                Trusted by organizations across Nigeria
              </p>
              <div className="grid w-full grid-cols-2 place-items-center gap-10 md:grid-cols-4 md:gap-12">
                {clients.map((client) => (
                  <div key={client.name} className="flex items-center justify-center">
                    <Image
                      src={client.src}
                      alt={client.name}
                      width={260}
                      height={100}
                      className={`h-auto object-contain ${
                        client.widthClass ?? 'w-[180px] md:w-[240px]'
                      } ${client.className ?? ''}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- PROCESS STEPS --- */}
        <section className="py-24 bg-slate-950/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-16">The Sourcing Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-12" />
                
                {[
                  { title: 'Describe', desc: 'Send us your product idea or reference photos.', icon: <Package /> },
                  { title: 'Branding', desc: 'Upload your logo for custom factory printing.', icon: <UploadCloud /> },
                  { title: 'Quotes', desc: 'We provide landed costs including shipping to Nigeria.', icon: <Globe /> },
                  { title: 'Delivery', desc: 'We inspect, ship, and deliver to your location.', icon: <MessageSquare /> },
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-xl">
                      {step.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed px-4">{step.desc}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* --- PRODUCT GRID --- */}
        <section className="py-24 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex justify-between items-end mb-10">
               <h2 className="text-2xl font-bold">Catalog Examples</h2>
               <div className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-200 px-4 py-2 rounded-full flex items-center gap-2">
                 <CalendarClock className="w-3 h-3" />
                 Book 6-8 weeks early for festive seasons
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {productExamples.map((item) => (
                <div key={item.name} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium text-slate-300">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FORM SECTION --- */}
        <section id="corporate-gifts-form" className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold">Submit Your Request</h2>
              <p className="mt-4 text-slate-400">Our sourcing team will review your details and contact you via WhatsApp.</p>
            </div>
            <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-4 sm:p-8 shadow-2xl">
              <CorporateGiftsClient />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
