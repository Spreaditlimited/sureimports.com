'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  Database,
  Eye,
  Share2,
  Cookie,
  Link as LinkIcon,
  Baby,
  User,
  FileText,
  Mail,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('commitment');

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
    { id: 'commitment', title: 'Our Commitment', icon: Shield },
    { id: 'collection', title: 'Information We Collect', icon: Database },
    { id: 'usage', title: 'How We Use Your Info', icon: Eye },
    { id: 'security', title: 'Data Security', icon: ShieldCheck },
    { id: 'sharing', title: 'Sharing & Disclosure', icon: Share2 },
    { id: 'cookies', title: 'Cookies & Tracking', icon: Cookie },
    { id: 'third-party', title: 'Third-Party Links', icon: LinkIcon },
    { id: 'children', title: "Children's Privacy", icon: Baby },
    { id: 'rights', title: 'Your Rights', icon: User },
    { id: 'changes', title: 'Changes to Policy', icon: FileText },
    { id: 'contact', title: 'Contact Us', icon: Mail },
  ];

  return (
    <div className="bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Premium Page Header */}
      <div className="border-b border-slate-200 bg-slate-50 pt-48 pb-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Shield className="h-3.5 w-3.5" /> Legal Documentation
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
              A transparent breakdown of how we collect, use, and safeguard your personal information while you use Sure Imports.
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
            
            {/* Our Commitment */}
            <section id="commitment" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Our Commitment to Privacy
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  We are committed to protecting the privacy and security of our users' personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us when using our website and services.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section id="collection" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Database className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Information We Collect
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed text-slate-600 dark:text-slate-400">
                <p className="mb-6">
                  We collect personal information from users in various ways, including when you register on our website, place an order, or communicate with us via email or other channels.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    'Contact information (name, email, phone)',
                    'Billing and shipping address',
                    'Payment information',
                    'Order details and preferences',
                    'Communications and correspondence with us'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="usage" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Eye className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                How We Use Your Information
              </h2>
              <ul className="space-y-4">
                {[
                  'To process and fulfill orders for products and services.',
                  'To communicate with users regarding their orders, inquiries, or requests.',
                  'To provide customer support and assistance.',
                  'To improve our website, services, and user experience.',
                  'To personalize your experience and tailor our offerings to your preferences.',
                  'To send periodic emails and updates regarding our products, promotions, or relevant info.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/50">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {i + 1}
                    </div>
                    <span className="text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Security */}
            <section id="security" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                Data Security
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                We implement a variety of security measures to maintain the safety and integrity of your personal information, including:
              </p>
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                {['Encryption', 'Secure socket layer (SSL) technology', 'Firewalls', 'Regular security audits'].map((measure, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-900 dark:text-emerald-300">{measure}</span>
                  </div>
                ))}
              </div>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                We restrict access to your personal information to authorized personnel only and ensure that our third-party service providers adhere to strict security standards.
              </p>
            </section>

            {/* Sharing and Disclosure */}
            <section id="sharing" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Share2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Data Sharing and Disclosure
              </h2>
              
              {/* Highlight Box */}
              <div className="mb-6 rounded-2xl border border-brand-orange-500/20 bg-brand-orange-500/10 p-6">
                <p className="text-base font-bold text-brand-orange-800 dark:text-brand-orange-200">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required or permitted by law.
                </p>
              </div>

              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or servicing you, as long as they agree to keep your information confidential.
              </p>
            </section>

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Cookie className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                Cookies and Tracking Technologies
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and gather information about how you interact with our website.
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  You can choose to disable cookies through your browser settings; however, please note that some features of our website may not function properly if cookies are disabled.
                </p>
              </div>
            </section>

            {/* Third-Party Links */}
            <section id="third-party" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <LinkIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Third-Party Links
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Our website may contain links to third-party websites or services that are not operated or controlled by Sure Importers Limited. We are not responsible for the privacy practices or content of these third-party sites and encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section id="children" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Baby className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                Children's Privacy
              </h2>
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6 dark:border-purple-900/30 dark:bg-purple-900/10">
                <p className="text-base font-medium leading-relaxed text-purple-900 dark:text-purple-200">
                  Our website and services are not intended for children under the age of 18. We do not knowingly collect personal information from children, and if we become aware that we have inadvertently collected information from a child, we will take steps to delete it promptly.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section id="rights" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Your Rights
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                You have the right to access, update, or delete your personal information at any time. Your rights include:
              </p>
              <div className="mb-6 flex flex-wrap gap-3">
                {['Access your info', 'Update your info', 'Delete your info'].map((right, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    <ChevronRight className="h-4 w-4" /> {right}
                  </div>
                ))}
              </div>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                If you would like to exercise any of these rights or have questions about our Privacy Policy, please contact us using the information provided below.
              </p>
            </section>

            {/* Changes */}
            <section id="changes" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Changes to This Privacy Policy
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                We reserve the right to update or revise this Privacy Policy at any time without prior notice. Any changes will be posted on this page, and the effective date will be updated accordingly. We encourage you to review this Privacy Policy periodically for any updates or changes.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Contact Us
              </h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <p className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  If you have any questions, comments, or concerns about our Privacy Policy or our practices regarding your personal information, please contact us at:
                </p>
                <a
                  href="mailto:hello@sureimports.com"
                  className="inline-flex items-center gap-2 text-lg font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Mail className="h-5 w-5" /> hello@sureimports.com
                </a>
              </div>
            </section>

            {/* Footer Agreement */}
            <div className="mt-16 rounded-[24px] bg-slate-900 p-8 text-center dark:bg-slate-900/50 dark:border dark:border-slate-800">
              <p className="text-sm font-medium leading-relaxed text-slate-300">
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
