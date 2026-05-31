import { Shield, Users, Calendar, Star, CheckCircle, Globe, Clock, Award } from 'lucide-react';

export default function WhyChooseUs() {
  const stats = [
    { number: '40,000+', label: 'Registered Users', icon: Users },
    { number: '7', label: 'Years in Business', icon: Calendar },
    { number: '4.7/5', label: 'Google Rating', icon: Star },
    { number: '100+', label: 'Chinese Websites', icon: Globe },
  ];

  const features = [
    { icon: Shield, title: 'Quality Guaranteed', desc: 'Every product is thoroughly inspected and verified before shipping to ensure you receive exactly what you ordered.' },
    { icon: Globe, title: 'Global Shipping', desc: 'We ship to any country worldwide with full tracking and end-to-end insurance coverage.' },
    { icon: Clock, title: 'Fast Processing', desc: 'Quick order processing and efficient handling to get your products shipped faster than the competition.' },
  ];

  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            Why choose <span className="text-brand-orange-500">Sure Imports?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            We've built our reputation on trust, quality, and exceptional service. Here's why thousands of businesses scale with us.
          </p>
        </div>

        {/* Floating Stats */}
        <div className="mb-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-black text-white">{stat.number}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-colors hover:border-slate-700">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-500/20 text-brand-orange-500">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="leading-relaxed text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/5 bg-white/5 p-6 text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-400" /> Verified Business</div>
          <div className="hidden h-1.5 w-1.5 rounded-full bg-slate-700 sm:block" />
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-indigo-400" /> Secure Payments</div>
          <div className="hidden h-1.5 w-1.5 rounded-full bg-slate-700 sm:block" />
          <div className="flex items-center gap-2"><Award className="h-5 w-5 text-brand-orange-400" /> Industry Leader</div>
        </div>

      </div>
    </section>
  );
}