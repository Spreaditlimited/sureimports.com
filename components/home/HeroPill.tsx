import type { ReactNode } from 'react';
import styles from './HeroPill.module.css';

export default function HeroPill({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span data-hero-pill className={`${styles.pill} ${className}`}>
      {children}
    </span>
  );
}
