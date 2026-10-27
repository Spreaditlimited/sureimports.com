import HeroPill from '@/components/home/HeroPill';
import { BookOpen } from 'lucide-react';

export default function BlogIntro() {
  return (
    <>
      <HeroPill className="mb-6">
        <BookOpen className="h-3.5 w-3.5" />
        Import Insights & Expert Guides
      </HeroPill>

      <h1 className="mb-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Import Insights <span className="text-[var(--si-accent)]">Blog</span>
      </h1>

      <p className="mx-auto mb-12 max-w-3xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xl">
        Master the art of international trade with expert insights, success
        stories, and practical guides to help you build a thriving import
        business.
      </p>
    </>
  );
}
