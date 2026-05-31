'use client';

import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Laptop,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  FileText
} from 'lucide-react';

export default function WarrantyPolicy() {
  const [activeSection, setActiveSection] = useState('phones-tablets');

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
    { id: 'phones-tablets', title: 'Phones & Tablets', icon: Smartphone },
    { id: 'laptops', title: 'Laptops', icon: Laptop },
    { id: 'void-conditions', title: 'Void Conditions', icon: AlertTriangle },
    { id: 'claims-process', title: 'Claims Process', icon: Clock },
    { id: 'faya-warranty', title: 'FAYA Products', icon: Shield },
    { id: 'delivery-costs', title: 'Delivery Costs', icon: Truck },
    { id: 'not-covered', title: 'Not Covered', icon: XCircle },
  ];

  const phoneFeatures = [
    { title: '12 Months Warranty', desc: 'Active from delivery date' },
    { title: 'Motherboard Coverage', desc: 'Internal components protected' },
    { title: 'Quality Assurance', desc: 'For brand new & pre-owned devices' },
  ];

  const laptopFeatures = [
    { title: '3-12 Months Warranty', desc: '3mo pre-owned, 12mo new' },
    { title: 'Motherboard Coverage', desc: 'Internal processor-related issues' },
    { title: 'Professional Support', desc: 'Expert technical assistance' },
  ];

  const phoneExclusions = [
    'Screen damage (cracks, dead pixels, discoloration, touch malfunctions)',
    'Water or liquid damage',
    'Battery degradation due to age or misuse',
    'Physical damage (dents, broken buttons, charging port damage)',
    'Software/OS issues caused by third-party apps or modifications',
  ];

  const laptopExclusions = [
    'Screen damage or flickering',
    'Keyboard and trackpad issues caused by spills or physical wear',
    'Hinge breakage or casing cracks',
    'Battery or charger-related issues',
    'Any software-related problems (viruses, corrupted files)',
  ];

  const voidConditions = [
    'Evidence of physical damage or tampering',
    'Exposure to moisture or water',
    'Use of non-original chargers or accessories',
    'Repairs carried out by unauthorized technicians',
    "Rooting, jailbreaking, or altering the device's operating system",
  ];

  const notCovered = [
    'Products without sufficient proof of purchase',
    'Lost or stolen products',
    'Items that have expired their warranty period',
    'Non quality-related issues',
    'Free products',
    'Repairs through 3rd parties',
    'Damage from outside sources',
    'Damage from misuse of products (falls, extreme temps, water)',
  ];

  return (
    <div className="bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Premium Page Header */}
      <div className="border-b border-slate-200 bg-slate-50 pt-32 pb-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Shield className="h-3.5 w-3.5" /> Hardware Protection
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Warranty Policy
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
              Quality assurance and protection guidelines for all devices and accessories sourced through Sure Imports.
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
            
            {/* Phones & Tablets */}
            <section id="phones-tablets" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Smartphone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Phones and Tablets
              </h2>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                {phoneFeatures.map((f, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h4 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">{f.title}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                  <h4 className="mb-3 flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> Coverage Includes
                  </h4>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Motherboard and internal components.</p>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/30 dark:bg-rose-900/10">
                  <h4 className="mb-3 flex items-center gap-2 font-bold text-rose-900 dark:text-rose-300">
                    <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" /> Exclusions
                  </h4>
                  <ul className="space-y-2">
                    {phoneExclusions.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-medium text-rose-800 dark:text-rose-200">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-400" /> {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Laptops */}
            <section id="laptops" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Laptop className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Laptops
              </h2>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                {laptopFeatures.map((f, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h4 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">{f.title}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                  <h4 className="mb-3 flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> Coverage Includes
                  </h4>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Motherboard and internal processor-related issues.</p>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/30 dark:bg-rose-900/10">
                  <h4 className="mb-3 flex items-center gap-2 font-bold text-rose-900 dark:text-rose-300">
                    <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" /> Exclusions
                  </h4>
                  <ul className="space-y-2">
                    {laptopExclusions.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-medium text-rose-800 dark:text-rose-200">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-400" /> {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Void Conditions */}
            <section id="void-conditions" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                Warranty Void Conditions
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {voidConditions.map((condition, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{condition}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-900/10">
                <h4 className="mb-2 font-bold text-amber-900 dark:text-amber-200">Note on Screens & External Damage</h4>
                <p className="text-sm font-medium leading-relaxed text-amber-800 dark:text-amber-300">
                  Screens are not covered under warranty due to their fragile nature and vulnerability to damage from drops, pressure, or spills. Any external parts damaged by user mishandling are not covered. We encourage all customers to use protective cases.
                </p>
              </div>
            </section>

            {/* Claims Process */}
            <section id="claims-process" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Warranty Claims Process
              </h2>
              <div className="space-y-4 border-l-2 border-indigo-100 pl-6 dark:border-indigo-900/30">
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">1. Contact Us:</strong> Reach out via WhatsApp or email (hello@sureimports.com) with your order number and a clear explanation of the issue.
                </p>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">2. Assessment:</strong> If covered, we will guide you on returning the device to our Lagos office or sending a replacement part. (You bear the transit cost to/from Lagos and any local installation costs).
                </p>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">3. Resolution:</strong> After verification, we will repair the device at no cost, offer a replacement, or (in rare cases) refund the value.
                </p>
              </div>
              
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h4 className="mb-4 font-bold text-slate-900 dark:text-white">Required for Claims</h4>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Sufficient proof of purchase (Order # or Sales Invoice)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Documentation of troubleshooting steps taken</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Serial number and visible proof of defect</li>
                </ul>
              </div>
            </section>

            {/* FAYA Products */}
            <section id="faya-warranty" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                FAYA Products
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Sure Imports provides a straightforward, hassle-free warranty for all FAYA products. Quality-related defects are covered starting from the purchase date.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {['FAYA Charging Cable', 'FAYA Charger', 'FAYA Power banks', 'FAYA Phone'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                    <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">12 Months</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Costs */}
            <section id="delivery-costs" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Truck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Delivery Costs (Buyer Responsibility)
              </h2>
              <p className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                The buyer must cover delivery costs in the following situations:
              </p>
              <ul className="space-y-3">
                {[
                  'Returning products for any reason other than a proven defect',
                  'Warranty claims on items taken outside the original country of purchase',
                  "Buyer's accidental returns or personal items",
                  "Returning items claimed defective but found working by Sure Imports QA",
                  'Returning defective items via international shipping',
                  'Costs associated with unauthorized returns'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Not Covered */}
            <section id="not-covered" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                Not Covered Under Warranty
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {notCovered.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 dark:border-rose-900/30 dark:bg-rose-900/10">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    <span className="text-sm font-medium text-rose-900 dark:text-rose-200">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer Agreement */}
            <div className="mt-16 rounded-[24px] bg-slate-900 p-8 text-center dark:bg-slate-900/50 dark:border dark:border-slate-800">
              <p className="text-sm font-medium leading-relaxed text-slate-300">
                This limited warranty provided by the manufacturer in no way affects a potential statutory warranty provided by law.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}