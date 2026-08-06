'use client';

import Image from 'next/image';
import { 
  Users, 
  Globe, 
  Award, 
  TrendingUp, 
  Zap, 
  Code, 
  Heart, 
  Target,
  MapPin,
  Building2,
  Briefcase
} from 'lucide-react';

export default function AboutUs() {
  const achievements = [
    {
      icon: Users,
      number: '40,000+',
      label: 'Registered Users',
      description: 'Growing community since 2018',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: TrendingUp,
      number: 'Millions',
      label: 'Dollars Remitted',
      description: 'To suppliers worldwide',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: Award,
      number: '4.7/5',
      label: 'Google Rating',
      description: 'Trusted by our customers',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      icon: Globe,
      number: '100k+',
      label: 'Products Delivered',
      description: 'Across multiple continents',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  const founderSkills = [
    'Digital Marketing Strategy',
    'Facebook & TikTok Ads',
    'Software Development',
    'Product Management',
    'Artificial Intelligence',
    'E-commerce Strategy',
  ];

  const globalPresence = [
    { country: 'Nigeria', role: 'Headquarters', location: 'Lagos', icon: Building2 },
    { country: 'China', role: 'Sourcing Hub', location: 'Guangzhou', icon: MapPin },
    { country: 'United Kingdom', role: 'Market Expansion', location: 'Manchester', icon: Globe },
    { country: 'Africa', role: 'Market Expansion', location: 'Multiple Countries', icon: Briefcase },
  ];

  return (
    <div className="bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-slate-50 pt-32 pb-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/5 blur-[120px] dark:bg-indigo-600/10" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange-500/20 bg-brand-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand-orange-600 dark:text-brand-orange-400">
            <Heart className="h-3.5 w-3.5" /> Our Story
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Transforming Global <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">
              Procurement.
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            We connect businesses with verified Chinese suppliers and manufacturers, ensuring quality, reliability, and seamless international trade.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 space-y-24">
        
        {/* Stats Bento Grid */}
        <section>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((stat, idx) => (
              <div key={idx} className="group rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-3xl font-black text-slate-900 dark:text-white">{stat.number}</h3>
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="text-sm font-medium text-slate-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Story Bento */}
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Our Journey</h2>
            <div className="space-y-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              <p>
                Since 2018, Sure Importers Limited has revolutionized the way businesses source products from China. What started as a vision to bridge the gap between African entrepreneurs and Chinese manufacturers has grown into a thriving global procurement platform.
              </p>
              <p>
                Our team has transformed the global procurement landscape by building trust, ensuring quality, and providing seamless service. We've successfully remitted millions of dollars to suppliers and delivered hundreds of thousands of products worldwide, creating lasting partnerships across continents.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-2 rounded-[32px] border border-brand-orange-500/20 bg-brand-orange-500/10 p-8 shadow-sm sm:p-12">
            <Target className="mb-6 h-10 w-10 text-brand-orange-500" />
            <h2 className="mb-4 text-2xl font-bold text-brand-orange-900 dark:text-brand-orange-100">Our Mission</h2>
            <p className="text-base leading-relaxed text-brand-orange-800 dark:text-brand-orange-200">
              To democratize global trade by providing businesses of all sizes with access to high-quality Chinese products, reliable suppliers, and exceptional service that drives their success in the global marketplace.
            </p>
          </div>
        </section>

        {/* Meet the Founder */}
        <section>
          <div className="rounded-[40px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              
              {/* Image Side */}
              <div className="relative min-h-[400px] w-full bg-slate-100 dark:bg-slate-800 lg:min-h-full p-8 sm:p-12 flex items-center justify-center">
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-[32px] shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5 dark:ring-white/10 aspect-[3/4]">
                  <Image
                    src="/images/new/images/sureimports-ceo.JPG"
                    alt="Tochukwu Nkwocha - Founder & CEO"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
                  Leadership
                </div>
                <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-white">Tochukwu Nkwocha</h2>
                <p className="mb-8 font-bold text-indigo-600 dark:text-indigo-400">Founder & Chief Executive Officer</p>

                <div className="space-y-6 text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-10">
                  <p>
                    Leading Sure Imports with visionary expertise, Tochukwu has leveraged his background in digital marketing to grow our user base to over 40,000 registered users since 2018.
                  </p>
                  <p>
                    His unique combination of software development and product management experience has been pivotal in directing our development teams to enhance our product sourcing platform, creating a seamless synergy between technology and commerce.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                    <Code className="h-4 w-4 text-indigo-500" /> Expertise & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {founderSkills.map((skill, index) => (
                      <span key={index} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
                  <div className="mb-2 flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Digital & AI Influence
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-blue-800 dark:text-blue-300">
                    With over 100,000 followers, Tochukwu actively shares insights on how businesses can leverage AI and digital strategy to improve operations and thrive in the modern economy.
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Global Presence */}
        <section>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-slate-900 dark:text-white">Global Presence</h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Strategically positioned across key markets for optimal service delivery.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {globalPresence.map((loc, idx) => {
              const Icon = loc.icon;
              return (
                <div key={idx} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">{loc.country}</h3>
                  <p className="mb-3 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{loc.role}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{loc.location}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vision Statement */}
        <section>
          <div className="rounded-[40px] bg-indigo-950 p-12 text-center shadow-2xl sm:p-20 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-orange-500 blur-[100px]" />
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500 blur-[100px]" />
            </div>
            
            <div className="relative z-10 mx-auto max-w-4xl">
              <h2 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Our Vision for the Future
              </h2>
              <p className="text-lg font-medium leading-relaxed text-indigo-200 sm:text-xl">
                To become the world's most trusted global procurement platform, where businesses of every size can access quality products, reliable suppliers, and innovative solutions that drive growth and success in an interconnected world.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
