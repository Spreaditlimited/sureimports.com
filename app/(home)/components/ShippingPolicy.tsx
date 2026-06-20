'use client';

import React, { useEffect, useState } from 'react';
import {
  Truck,
  Plane,
  Ship,
  Zap,
  MapPin,
  Clock,
  AlertCircle,
  CreditCard,
  Store,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function ShippingPolicy() {
  const [activeSection, setActiveSection] = useState('company-info');

  // Smooth scroll and active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'company-info', title: 'Company Information', icon: MapPin },
    { id: 'shipping-methods', title: 'Shipping Methods', icon: Truck },
    { id: 'global-procedures', title: 'Global Procedures', icon: Clock },
    { id: 'important-notes', title: 'Important Notes', icon: AlertCircle },
    { id: 'payment-tracking', title: 'Payment & Tracking', icon: CreditCard },
    { id: 'online-store', title: 'Online Store Shipping', icon: Store },
    { id: 'support-disclaimer', title: 'Support & Disclaimer', icon: ShieldAlert },
  ];

  const shippingMethods = [
    {
      icon: Plane,
      title: 'Normal Air Cargo',
      description: 'Suitable for goods without batteries, liquids, or gas.',
      details: ['Shipping via Cargo planes', 'Delivery: ~7 business days to most countries'],
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    },
    {
      icon: Plane,
      title: 'Special Air Cargo (via HK)',
      description: 'Suitable for goods containing batteries, liquids, or gas.',
      details: ['Shipping via Cargo planes through Hong Kong', 'Delivery: 3 to 4 weeks'],
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    },
    {
      icon: Ship,
      title: 'Sea Shipping',
      description: 'Suitable for bulky goods.',
      details: ['Full container load or groupage', 'Delivery: 60 to 90 days'],
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    },
    {
      icon: Zap,
      title: 'Express Shipping',
      description: 'Suitable for certain goods that can be carried via passenger airlines (e.g. phones, laptops).',
      details: ['Primary destinations: Nigeria & African countries', 'Delivery: Within 5 business days'],
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    },
    {
      icon: Truck,
      title: 'Partner Shipping',
      description: 'Suitable for shipments to Europe, USA, Australia, and other non-African countries.',
      details: ['Partners: DHL, UPS, FedEx, Royal Mail', 'End-to-end shipping or last-mile delivery'],
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    },
  ];

  return (
    <div className="bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Premium Page Header */}
      <div className="border-b border-slate-200 bg-slate-50 pt-48 pb-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Truck className="h-3.5 w-3.5" /> Logistics Operations
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Shipping Policy
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
              Comprehensive shipping timelines, methods, and delivery expectations for Sure Imports services worldwide.
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-400">Last Updated: May 2026</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
          
          {/* LEFT: Sticky Table of Contents */}
          <div className="hidden w-64 shrink-0 lg:sticky lg:top-32 lg:block">
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-slate-800">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                    className={`group flex items-center gap-3 border-l-2 py-2.5 pl-4 pr-3 text-sm font-semibold transition-all ${
                      isActive
                        ? '-ml-[2px] border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                        : '-ml-[2px] border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
                    {section.title}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* RIGHT: Document Content */}
          <div className="flex-1 space-y-16 lg:max-w-3xl">
            
            {/* Company Info */}
            <section id="company-info" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Company Information
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Sure Importers Limited is a product sourcing company registered in Nigeria with an operational office in Guangzhou, China.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="mb-3 font-bold text-slate-900 dark:text-white">Nigeria Office</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Sure Importers Limited<br />
                    5 Olutosin Ajayi (Martins Adegboyega) St,<br />
                    Ajao Estate Lagos, Nigeria
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="mb-3 font-bold text-slate-900 dark:text-white">China Office</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Guangzhou baiyun area NO.111<br />
                    airport road jiangfa plaza office NO.3FB3-1<br />
                    广州市白云区机场路111号建发广场3FB3-1
                  </p>
                </div>
              </div>
            </section>

            {/* Shipping Methods */}
            <section id="shipping-methods" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Truck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Shipping Methods
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                We offer various shipping methods to accommodate different types of goods and customer timelines globally:
              </p>
              <div className="space-y-4">
                {shippingMethods.map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <div key={idx} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-start">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${method.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{method.title}</h4>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{method.description}</p>
                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                          {method.details.map((detail, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span> {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Global Procedures */}
            <section id="global-procedures" className="scroll-mt-32">
              <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Global Shipping Procedures
              </h2>
              <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
                USA, UK, Europe, Australia & South Africa (Phones Only)
              </p>
              <ul className="space-y-3">
                {[
                  'Order confirmation and consolidation',
                  'Packaging for shipping',
                  'Determination of volumetric weight and pricing',
                  'Payment by customer',
                  'Remittance to shipping partners',
                  'Shipment to Hong Kong',
                  'Creation of shipping label (including tracking number)',
                  'Customs clearance',
                  'Handover to shipping partners'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900/50">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Important Notes */}
            <section id="important-notes" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Important Notes
              </h2>
              
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-900/10">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-200">Shipping label generation takes 2-3 BUSINESS days after payment.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-200">Tracking information becomes available only after our partners receive the shipment.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-200">Initial tracking may show that partners have not yet taken possession of the shipment.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h4 className="mb-2 font-bold text-slate-900 dark:text-white">
                  Sea Shipping to USA, UK, Europe, Australia, & SA (Phones only)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The time between shipping label generation and visible tracking movement can take 25 to 35 days.
                </p>
              </div>
            </section>

            {/* Payment & Tracking */}
            <section id="payment-tracking" className="scroll-mt-32">
              <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Payment and Tracking
              </h2>
              <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
                USA, UK, Europe, Australia & South Africa (Phones Only)
              </p>
              <div className="space-y-4 border-l-2 border-indigo-100 pl-6 dark:border-indigo-900/30">
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">1. Quote:</strong> Customers will be provided with a quote based on the volumetric weight of their shipment.
                </p>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">2. Payment:</strong> Full payment is required before shipping commences.
                </p>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">3. Tracking Number:</strong> Provided once the shipping label is generated.
                </p>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">4. Tracking Portal:</strong> Customers can track their shipments using the provided tracking number on our partners' websites.
                </p>
              </div>
            </section>

            {/* Online Store Shipping - Highlighted Section */}
            <section id="online-store" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Store className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Online Store Gadgets Shipping
              </h2>
              
              <div className="rounded-[24px] border border-brand-orange-500/20 bg-brand-orange-500/10 p-8 shadow-sm">
                <p className="mb-4 text-lg font-bold text-brand-orange-800 dark:text-brand-orange-200">
                  Items ordered on the Sure Imports online store have a standard shipping timeline of 10 business days from order to arrival at our Lagos office. 
                </p>
                <p className="text-base text-brand-orange-700 dark:text-brand-orange-300/80">
                  We maintain the same timeline for gadgets going to Ghana, Cameroon, and other eligible countries.
                </p>
              </div>

              <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                For last-mile delivery in Nigeria, we partner with trusted local delivery companies who determine the final delivery speed. You also have the option to pick up your gadget directly from our Lagos office.
              </p>
            </section>

            {/* Support & Disclaimer */}
            <section id="support-disclaimer" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <ShieldAlert className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Support & Disclaimer
              </h2>
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="mb-2 font-bold text-slate-900 dark:text-white">Customer Support</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    For any questions regarding your shipment, please contact our support team through our website or via the contact information provided for our office locations.
                  </p>
                </div>
                
                <div className="rounded-2xl bg-slate-100 p-6 dark:bg-slate-900/50">
                  <h4 className="mb-2 font-bold text-slate-900 dark:text-white">Disclaimer</h4>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Shipping times are estimates and may vary due to factors beyond our control, such as customs procedures, weather conditions, or unforeseen logistical issues. Sure Importers Limited will make every effort to ensure timely delivery but cannot guarantee specific delivery dates.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
