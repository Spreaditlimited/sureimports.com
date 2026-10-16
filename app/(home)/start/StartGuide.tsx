'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Package, Play, ShoppingBag, Sparkles } from 'lucide-react';
import { LINESCOUT_WHITE_LABEL_URL } from '@/lib/linescoutLinks';
import styles from './start.module.css';

type Experience = 'new' | 'experienced';
type Goal = 'buy' | 'source';
const videoUrl = '/buy-from-chinese-websites#how-it-works';

export default function StartGuide() {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  function track(event: string, values: Record<string, string>) {
    const analytics = window as Window & { dataLayer?: Record<string, unknown>[] };
    analytics.dataLayer?.push({ event, ...values });
  }
  function move(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });
  }
  function destination(service: string) {
    track('start_service_click', { service, experience: experience || 'skipped', goal: goal || 'skipped' });
  }
  const buying = goal === 'buy';
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroIcon}><ShoppingBag size={32} aria-hidden="true" /></div>
          <p className={styles.eyebrow}>Start with Sure Imports</p>
          <h1>Find the right service</h1>
          <p>Answer two quick questions to find your next step: buying from Chinese websites or sourcing with LineScout.</p>
        </header>
        <section className={styles.guide} aria-label="Find your service">
          <div className={styles.progress}>
            <span>{step < 2 ? `Question ${step + 1} of 2` : 'Your next step'}</span>
            <div aria-hidden="true"><i className={styles.active} /><i className={step > 0 ? styles.active : ''} /></div>
          </div>
          {step > 0 && <button type="button" className={styles.back} onClick={() => move(step - 1)}><ArrowLeft size={16} aria-hidden="true" /> Back</button>}
          <h2 ref={heading} tabIndex={-1} className={styles.question}>
            {step === 0 ? 'Have you imported from China before?' : step === 1 ? 'What would you like to do?' : buying ? experience === 'new' ? 'Your first order starts with finding a product.' : 'You find the products. We help you buy them.' : 'Your product idea. The right sourcing partner.'}
          </h2>
          <p className={styles.intro}>{step === 0 ? 'A little about you helps us point you in the right direction.' : step === 1 ? 'Choose what you need today. Both services are open to first-time and experienced importers.' : buying ? experience === 'new' ? 'We recommend starting on 1688.com. Our video walks you through finding a product, copying its link, and creating your order on Sure Imports.' : 'Buy from 1688, Taobao, Alibaba, and other Chinese websites through Sure Imports. Watch the walkthrough to see how to place your order.' : 'Use LineScout when you need help finding suppliers, sourcing in bulk, or finding a manufacturer for your own brand.'}</p>
          {step === 0 && <div className={styles.choices}>
            {([{ value: 'new', title: 'No, this is my first time', text: 'I’d like some guidance on where to begin.', icon: Sparkles }, { value: 'experienced', title: 'Yes, I’ve imported before', text: 'I’m looking for help with my next purchase.', icon: Package }] as const).map(({ value, title, text, icon: Icon }) => <button key={value} type="button" aria-pressed={experience === value} className={styles.choice} onClick={() => { setExperience(value); track('start_experience_selected', { experience: value }); move(1); }}><span className={styles.icon}><Icon size={24} aria-hidden="true" /></span><strong>{title}</strong><span>{text}</span><ArrowRight size={20} aria-hidden="true" className={styles.arrow} /></button>)}
          </div>}
          {step === 1 && <div className={styles.choices}>
            {([{ value: 'buy', title: 'Buy from Chinese websites', text: 'Find products online. Get help buying and shipping them.', icon: ShoppingBag }, { value: 'source', title: 'Source products or start a brand', text: 'Find suppliers for bulk purchases or your own branded products.', icon: Sparkles }] as const).map(({ value, title, text, icon: Icon }) => <button key={value} type="button" aria-pressed={goal === value} className={styles.choice} onClick={() => { setGoal(value); track('start_goal_selected', { goal: value, experience: experience! }); move(2); }}><span className={styles.icon}><Icon size={24} aria-hidden="true" /></span><strong>{title}</strong><span>{text}</span><ArrowRight size={20} aria-hidden="true" className={styles.arrow} /></button>)}
          </div>}
          {step === 2 && <div className={styles.result}>
            <div className={styles.benefits}>
              {(buying ? ['Pay for your orders in naira', 'Track progress through your Sure Imports account', 'Manage this order and future orders in one place'] : ['Get help finding suppliers in China', 'Source products for bulk purchases', 'Explore products for your own brand']).map(text => <p key={text}><Check size={18} aria-hidden="true" />{text}</p>)}
            </div>
            {buying ? <Link className={styles.primary} href={videoUrl} onClick={() => destination('buy_video')}><Play size={18} aria-hidden="true" /> Watch how to place an order <ArrowRight size={18} aria-hidden="true" /></Link> : <a className={styles.primary} href={LINESCOUT_WHITE_LABEL_URL} onClick={() => destination('brand')}>Explore starting a brand <ArrowRight size={18} aria-hidden="true" /></a>}
            <p className={styles.note}>{buying ? 'The video is on our Buy from Chinese Websites page.' : 'You’ll continue on LineScout, our sourcing platform.'}</p>
          </div>}
          {step < 2 && <p className={styles.note}>Two quick questions. No account needed to get started.</p>}
        </section>
        <section className={styles.shortcuts} aria-labelledby="know-heading">
          <h2 id="know-heading">Already know what you need?</h2>
          <div>
            <Link href={videoUrl} onClick={() => destination('buy_video_direct')}><ShoppingBag size={20} aria-hidden="true" /><span><strong>Buy from Chinese websites</strong><small>Watch the guide. Find a product. Place your order.</small></span><ArrowRight size={18} aria-hidden="true" /></Link>
            <a href={LINESCOUT_WHITE_LABEL_URL} onClick={() => destination('brand_direct')}><Sparkles size={20} aria-hidden="true" /><span><strong>Build your brand with LineScout</strong><small>Explore products and get sourcing support.</small></span><ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </section>
      </div>
    </main>
  );
}
