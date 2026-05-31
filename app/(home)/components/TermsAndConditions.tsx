'use client';

import React, { useEffect, useState } from 'react';
import {
  Scale,
  Users,
  Globe,
  CreditCard,
  RotateCcw,
  AlertTriangle,
  Gavel,
  FileText,
  MapPin,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('introduction');

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
    { id: 'introduction', title: 'Introduction', icon: FileText },
    { id: 'definitions', title: 'Definitions', icon: Scale },
    { id: 'scope', title: 'Scope of Services', icon: Globe },
    { id: 'commission', title: 'Commission', icon: CreditCard },
    { id: 'refunds', title: 'Refunds & Replacements', icon: RotateCcw },
    { id: 'obligations', title: 'User Obligations', icon: Users },
    { id: 'liability', title: 'Limitation of Liability', icon: AlertTriangle },
    { id: 'governing-law', title: 'Governing Law', icon: Gavel },
    { id: 'contact', title: 'Contact Information', icon: MapPin },
  ];

  const definitions = [
    { term: 'Sure Importers Limited', def: 'The company providing product sourcing services as described herein, with offices in Nigeria and China.' },
    { term: 'Website', def: 'sureimports.com' },
    { term: 'User', def: 'Any individual or entity accessing or using Sure Importers Limited\'s website or services.' },
    { term: 'Goods', def: 'Products procured by Sure Importers Limited on behalf of its users.' },
    { term: 'Special Sourcing Service', def: 'A customized procurement service offered by Sure Importers Limited.' },
    { term: 'Commission', def: 'The fee charged by Sure Importers Limited for its procurement services.' },
  ];

  const userObligations = [
    'Provide accurate and up-to-date information during the procurement process.',
    'Abide by all relevant laws and regulations governing international trade and shipping.',
    'Pay all fees and charges associated with the procurement and shipping of goods.',
    'Accept delivery of goods within the specified timeframe.',
  ];

  const refundConditions = [
    "Goods purchased under Sure Importers Limited's special sourcing service are eligible for refunds or replacements if they do not meet the specified criteria.",
    'Refunds will be issued if our system overestimates the shipping cost at the time of order placement.',
  ];

  return (
    <div className="bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Premium Page Header */}
      <div className="border-b border-slate-200 bg-slate-50 pt-32 pb-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Scale className="h-3.5 w-3.5" /> Legal Documentation
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
              The rules, guidelines, and agreements that govern your use of the Sure Imports platform and global sourcing services.
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
            
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Introduction
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  Welcome to Sure Importers Limited's website, sureimports.com. These terms and conditions ("Terms") govern your use of our website and services provided by Sure Importers Limited. 
                </p>
                <p>
                  By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree to these Terms, please refrain from using our website and services.
                </p>
              </div>
            </section>

            {/* Definitions */}
            <section id="definitions" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Scale className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Definitions
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {definitions.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h4 className="mb-2 font-bold text-indigo-900 dark:text-indigo-300">{item.term}</h4>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.def}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Scope of Services */}
            <section id="scope" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Scope of Services
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 border-l-2 border-indigo-100 pl-6 dark:border-indigo-900/30">
                <p>
                  Sure Importers Limited is a product sourcing company that facilitates the procurement and shipping of products primarily from China. We serve individuals and businesses globally.
                </p>
                <p>
                  We purchase goods on behalf of our users, who must fully pay for the products. Shipping fees for goods destined for Nigeria and Ghana can be paid upon arrival, while full payment is required for goods shipped from China to other countries.
                </p>
              </div>
            </section>

            {/* Commission */}
            <section id="commission" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Commission
              </h2>
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                <p className="mb-3 text-base leading-relaxed text-indigo-900 dark:text-indigo-200">
                  Sure Importers Limited charges a commission for every procurement transaction completed on behalf of our users. The commission amount is disclosed prior to the initiation of the procurement process and is <strong>non-negotiable</strong>.
                </p>
                <p className="text-base leading-relaxed text-indigo-900 dark:text-indigo-200">
                  For our special sourcing service, a consolidated quote is provided, typically including estimated shipping and clearing costs.
                </p>
              </div>
            </section>

            {/* Refunds and Replacements */}
            <section id="refunds" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <RotateCcw className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                Refunds and Replacements
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Sure Importers Limited will facilitate refunds and/or replacements for procured goods under the following circumstances:
              </p>
              <div className="space-y-3">
                {refundConditions.map((condition, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium leading-relaxed text-emerald-900 dark:text-emerald-200">{condition}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* User Obligations */}
            <section id="obligations" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                User Obligations
              </h2>
              <ul className="space-y-4">
                {userObligations.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/50">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {i + 1}
                    </div>
                    <span className="text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section id="liability" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                Limitation of Liability
              </h2>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-900/10">
                <div className="flex items-start gap-3">
                  <Info className="mt-1 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-base font-medium leading-relaxed text-amber-900 dark:text-amber-200">
                    Sure Importers Limited shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of our website or services, including but not limited to procurement errors, shipping delays, or product defects.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law & Amendments */}
            <section id="governing-law" className="scroll-mt-32">
              <div className="grid gap-12 sm:grid-cols-2">
                <div>
                  <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                    <Gavel className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Governing Law
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    These Terms shall be governed by and construed in accordance with the laws of Nigeria. Any dispute arising out of or relating to these Terms shall be resolved through arbitration in Nigeria, with each party bearing its own costs.
                  </p>
                </div>
                <div>
                  <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Amendments
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Sure Importers Limited reserves the right to amend these Terms at any time without prior notice. Amendments will be effective upon posting on our website. Users are encouraged to review these Terms periodically.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Contact Information
              </h2>
              
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <p className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  If you have any questions or concerns about these Terms, please contact us at:
                </p>
                <a
                  href="mailto:hello@sureimports.com"
                  className="inline-flex items-center gap-2 text-lg font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  hello@sureimports.com
                </a>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-900/50">
                  <h4 className="mb-3 font-bold text-slate-900 dark:text-white">Nigeria Office</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    5 Olutosin Ajayi (Martins Adegbiyega) Street, Ajao Estate, Lagos
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-900/50">
                  <h4 className="mb-3 font-bold text-slate-900 dark:text-white">China Office</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Guangzhou baiyun area NO.111 airport load jiangfa plaza office NO.3FB3-1
                    <br />
                    <span className="mt-1 block text-xs text-slate-400">广州市白云区机场路111号建发广场3FB3-1</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Footer Agreement */}
            <div className="mt-16 rounded-[24px] bg-slate-900 p-8 text-center dark:bg-slate-900/50 dark:border dark:border-slate-800">
              <p className="text-sm font-medium leading-relaxed text-slate-300">
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}