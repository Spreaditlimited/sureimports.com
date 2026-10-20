import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './ServiceHero.module.css';

type Action = { href: string; label: string };
type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primary: Action;
  secondary: Action;
  summaryTitle: string;
  steps: readonly { title: string; description: string }[];
  children?: ReactNode;
};

function ServiceAction({
  action,
  className,
  iconSize,
}: {
  action: Action;
  className: string;
  iconSize: number;
}) {
  const content = (
    <>
      {action.label}
      <ArrowRight size={iconSize} aria-hidden="true" />
    </>
  );
  return action.href.startsWith('#') ? (
    <a href={action.href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}

/** Shared public service introduction. Server-rendered; actions remain ordinary links. */
export default function ServiceHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  summaryTitle,
  steps,
  children,
}: ServiceHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="service-title">
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id="service-title">{title}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.actions}>
            <ServiceAction
              action={primary}
              className={styles.primary}
              iconSize={17}
            />
            <ServiceAction
              action={secondary}
              className={styles.secondary}
              iconSize={16}
            />
          </div>
        </div>
        <aside className={styles.summary} aria-label={summaryTitle}>
          <p className={styles.eyebrow}>At a glance</p>
          <h2>{summaryTitle}</h2>
          <ol>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.number} aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          {children && <div className={styles.details}>{children}</div>}
        </aside>
      </div>
    </section>
  );
}
