'use client';

import { Button } from '@/components/ui/button';
import { Search, Gift, Ship, ShoppingCart, ArrowRight, Laptop } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServicesSectionProps {
  onNavigateToSignUp?: () => void;
}

export default function ServicesSection({ onNavigateToSignUp }: ServicesSectionProps) {
  const router = useRouter();
  const services = [
    {
      title: 'Buy From Chinese Websites',
      icon: Search,
      desc: 'Search for products on over 100 Chinese websites. Provide the link, and we handle the purchasing, quality verification, secure payment, and consolidation.',
      tags: ['1688', 'Alibaba', 'Pinduoduo', 'Taobao'],
    },
    {
      title: 'Ship with us',
      icon: Ship,
      desc: 'Already bought your goods? Submit your shipment details and we handle freight, warehouse intake, consolidation, and final delivery updates in your dashboard.',
      tags: ['Shipping Only', 'Warehouse Intake', 'Live Tracking'],
      href: '/ship-with-us',
    },
    {
      title: 'Corporate Sourcing',
      icon: Gift,
      desc: 'Order premium branded products for your team, partners, and clients. We source, customize, and deliver high-quality corporate sourcing projects tailored to your brand.',
      tags: ['Branded Gifts', 'Bulk Orders', 'Custom Packaging'],
      href: '/corporate-gifts',
    },
    {
      title: 'Laptops for Business',
      icon: Laptop,
      desc: 'Source tested laptops from China for staff, schools, startups, resellers, and business teams with supplier checks, inspection, and delivery support.',
      tags: ['Bulk Laptops', 'Inspection', 'Business Procurement'],
      href: '/laptops-for-business',
    },
    {
      title: 'Buy Gadgets from China',
      icon: ShoppingCart,
      desc: 'Browse our curated selection of authentic phones, electronics, and gadgets. Every device is tested, includes complimentary accessories, and comes with a solid warranty.',
      tags: ['Wholesale Tech', 'Tested Authentic', 'Warranty Included'],
      href: '/shop',
    },
  ];

  return (
    <section id="services-section" className="bg-[#fcfcfd] py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 max-w-2xl">
          <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            Core Solutions
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Everything you need to import with <span className="text-brand-orange-500">confidence.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Choose from our comprehensive range of end-to-end logistics and sourcing services designed to scale your business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col justify-between rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/20 transition-all hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-slate-700"
            >
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-900/20 dark:text-indigo-400">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="mb-6 leading-relaxed text-slate-500 dark:text-slate-400">
                  {service.desc}
                </p>
                <div className="mb-8 flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => {
                  router.push(service.href || '/auth/login');
                }}
                variant="ghost"
                className="w-fit p-0 text-brand-orange-500 hover:bg-transparent hover:text-brand-orange-600 dark:hover:text-brand-orange-400"
              >
                <span className="font-bold">Get Started</span> <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
