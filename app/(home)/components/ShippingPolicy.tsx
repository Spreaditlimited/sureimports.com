import type { ReactNode } from 'react';
import { Truck } from 'lucide-react';

import HeroPill from '@/components/home/HeroPill';
import { shippingPolicyText } from '@/content/policies/shippingPolicyText';
import styles from '@/components/home/EditorialPage.module.css';

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'ordered-list'; items: string[] };

function parsePolicy(markdown: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      blocks.push({
        type: 'paragraph',
        text: paragraph
          .map((line) => line.endsWith('  ') ? line.trimEnd() + '\n' : line.trim())
          .join(' ')
          .trim(),
      });
      paragraph = [];
    }
    if (list.length) {
      blocks.push({ type: 'ordered-list', items: list });
      list = [];
    }
  };

  for (const line of markdown.trim().split(/\r?\n/)) {
    if (!line.trim()) {
      flush();
      continue;
    }

    const heading = line.match(/^(#{1,3}) (.+)$/);
    if (heading) {
      flush();
      blocks.push({
        type: 'heading',
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2],
      });
      continue;
    }

    const listItem = line.match(/^\d+\. (.+)$/);
    if (listItem) {
      if (paragraph.length) flush();
      list.push(listItem[1]);
      continue;
    }

    if (list.length) flush();
    paragraph.push(line);
  }
  flush();
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, partIndex) =>
    part.split('\n').flatMap((line, lineIndex) => {
      const content = part.startsWith('**') && part.endsWith('**')
        ? <strong key={`strong-${partIndex}-${lineIndex}`} className="font-bold text-slate-900 dark:text-white">{line.slice(2, -2)}</strong>
        : line;
      return lineIndex === 0
        ? [content]
        : [<br key={`break-${partIndex}-${lineIndex}`} />, content];
    })
  );
}

const blocks = parsePolicy(shippingPolicyText);
const sections = blocks
  .filter((block): block is Extract<Block, { type: 'heading' }> => block.type === 'heading' && block.level === 2)
  .map((block, index) => ({ id: `section-${index + 1}`, title: block.text }));

export default function ShippingPolicy() {
  let sectionNumber = 0;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <HeroPill className="mb-6">
              <Truck className="h-3.5 w-3.5" /> Logistics Operations
            </HeroPill>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Shipping Policy
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Last Updated: May 2026
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <nav aria-label="Shipping policy sections" className="hidden w-72 shrink-0 lg:sticky lg:top-32 lg:block">
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">
              On this page
            </h2>
            <ol className="space-y-1 border-l-2 border-slate-200 dark:border-slate-800">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block border-l-2 border-transparent py-2 pl-4 text-sm font-semibold text-slate-600 hover:border-indigo-600 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-300"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 flex-1 lg:max-w-3xl">
            {blocks.map((block, index) => {
              if (block.type === 'heading') {
                if (block.level === 1) return null;
                if (block.level === 2) {
                  sectionNumber += 1;
                  return (
                    <h2
                      key={index}
                      id={`section-${sectionNumber}`}
                      className="mb-5 mt-12 scroll-mt-32 border-t border-slate-200 pt-9 text-2xl font-bold text-slate-900 first:mt-0 dark:border-slate-800 dark:text-white"
                    >
                      {block.text}
                    </h2>
                  );
                }
                return (
                  <h3 key={index} className="mb-3 mt-7 text-lg font-bold text-slate-900 dark:text-white">
                    {block.text}
                  </h3>
                );
              }

              if (block.type === 'ordered-list') {
                return (
                  <ol key={index} className="mb-6 list-decimal space-y-2 pl-6 text-base leading-7 text-slate-700 dark:text-slate-300">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{renderInline(item)}</li>
                    ))}
                  </ol>
                );
              }

              if (block.text.startsWith('**Last Updated:')) return null;
              return (
                <p key={index} className="mb-5 text-base leading-7 text-slate-700 dark:text-slate-300">
                  {renderInline(block.text)}
                </p>
              );
            })}
          </article>
        </div>
      </div>
    </div>
  );
}
