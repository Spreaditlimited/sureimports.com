import type { ReactNode } from 'react';
import {
  AlertCircle,
  CreditCard,
  MapPin,
  PackageCheck,
  Plane,
  ShieldCheck,
  Ship,
  Store,
  Truck,
  Wallet,
} from 'lucide-react';

import HeroPill from '@/components/home/HeroPill';
import styles from '@/components/home/EditorialPage.module.css';
import { shippingPolicyText } from '@/content/policies/shippingPolicyText';

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

type PolicySection = { title: string; id: string; blocks: Block[] };

const sectionIcons = [
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wallet,
  CreditCard,
  Plane,
  Store,
  AlertCircle,
  ShieldCheck,
];

function parsePolicy(text: string): { introduction: string; sections: PolicySection[] } {
  const sections: PolicySection[] = [];
  let introduction = '';
  let current: PolicySection | undefined;
  let paragraph: string[] = [];
  let list: string[] = [];

  function flush() {
    if (paragraph.length) {
      const content = paragraph
        .map((line) => line.endsWith('  ') ? line.trimEnd() + '\n' : line.trim())
        .join(' ')
        .trim();
      if (current) current.blocks.push({ type: 'paragraph', text: content });
      else if (!content.startsWith('**Last Updated:')) introduction = content;
      paragraph = [];
    }
    if (list.length) {
      current?.blocks.push({ type: 'list', items: list });
      list = [];
    }
  }

  for (const line of text.trim().split(/\r?\n/)) {
    if (!line.trim()) {
      flush();
    } else if (line.startsWith('## ')) {
      flush();
      const title = line.slice(3).replace(/^\d+\.\s*/, '');
      current = {
        title,
        id: `section-${sections.length + 1}`,
        blocks: [],
      };
      sections.push(current);
    } else if (line.startsWith('### ')) {
      flush();
      current?.blocks.push({ type: 'heading', text: line.slice(4) });
    } else if (/^\d+\.\s/.test(line)) {
      if (paragraph.length) flush();
      list.push(line.replace(/^\d+\.\s*/, ''));
    } else if (!line.startsWith('# ') && !line.startsWith('**Last Updated:')) {
      if (list.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return { introduction, sections };
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, index) =>
    part.split('\n').flatMap((line, lineIndex) => {
      const content = part.startsWith('**') && part.endsWith('**')
        ? <strong key={`bold-${index}-${lineIndex}`} className="font-semibold text-slate-900 dark:text-white">{line.slice(2, -2)}</strong>
        : line;
      return lineIndex
        ? [<br key={`break-${index}-${lineIndex}`} />, content]
        : [content];
    }),
  );
}

const policy = parsePolicy(shippingPolicyText);

function PolicyBlocks({ section, sectionIndex }: { section: PolicySection; sectionIndex: number }) {
  const methodCards = sectionIndex === 3;
  const officeCards = sectionIndex === 0;
  const shopHighlight = sectionIndex === 7;
  let inCard = false;

  return (
    <div className="space-y-5">
      {section.blocks.map((block, index) => {
        if (block.type === 'heading') {
          inCard = methodCards || officeCards || sectionIndex === 5;
          return (
            <h3
              key={index}
              className={inCard
                ? 'mt-7 rounded-t-2xl border border-b-0 border-slate-200 bg-white px-6 pt-6 text-lg font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white'
                : 'pt-5 text-lg font-bold text-slate-900 dark:text-white'}
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === 'list') {
          return (
            <ol key={index} className="space-y-2 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">{itemIndex + 1}</span>
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        const followingHeading = section.blocks[index + 1]?.type === 'heading';
        const lastInCard = inCard && (followingHeading || index === section.blocks.length - 1);
        const officeCard = officeCards && /^\*\*(Nigeria|China) Office\*\*/.test(block.text);
        const authorisationCallout = sectionIndex === 2 && block.text.startsWith('**By arranging');
        return (
          <p
            key={index}
            className={
              officeCard
                ? 'rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                : authorisationCallout
                  ? 'rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-base leading-8 text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-100'
                : shopHighlight && index < 3
                ? 'rounded-2xl border border-orange-200 bg-orange-50 px-6 py-5 text-base leading-8 text-orange-950 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-orange-100'
                : inCard
                  ? `border-x border-slate-200 bg-white px-6 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 ${lastInCard ? 'rounded-b-2xl border-b pb-6' : 'pb-3'}`
                  : 'text-base leading-8 text-slate-700 dark:text-slate-300'
            }
          >
            {inline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function ShippingPolicy() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <HeroPill className="mb-6">
              <Truck className="h-3.5 w-3.5" /> Logistics Operations
            </HeroPill>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Shipping Policy
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {policy.introduction}
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Last Updated: May 2026
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          <nav aria-label="Shipping policy sections" className="lg:sticky lg:top-32 lg:w-64 lg:shrink-0">
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              On this page
            </h2>
            <ol className="grid grid-cols-1 gap-1 border-l-2 border-slate-200 sm:grid-cols-2 lg:grid-cols-1 dark:border-slate-800">
              {policy.sections.map((section, index) => {
                const Icon = sectionIcons[index];
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group -ml-[2px] flex items-start gap-3 border-l-2 border-transparent py-2.5 pl-4 pr-2 text-sm font-semibold text-slate-600 transition-colors hover:border-indigo-600 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300"
                    >
                      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                      <span>{section.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <article className="min-w-0 flex-1 space-y-14 lg:max-w-3xl">
            {policy.sections.map((section, index) => {
              const Icon = sectionIcons[index];
              return (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="mb-6 flex items-start gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        Section {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <PolicyBlocks section={section} sectionIndex={index} />
                </section>
              );
            })}
          </article>
        </div>
      </div>
    </div>
  );
}
