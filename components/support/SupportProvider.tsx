'use client';
import { Component, createContext, useContext, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import styles from './support.module.css';
import SupportWhatsApp from './SupportWhatsApp';
const SupportLauncher = dynamic(() => import('./SupportLauncher'), {
  ssr: false,
});
class SupportFallback extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className={styles.whatsappFallback}>
          <SupportWhatsApp />
        </div>
      );
    return this.props.children;
  }
}
const SupportEnabled = createContext(false);
export const useSupportEnabled = () => useContext(SupportEnabled);
export default function SupportProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return (
    <SupportEnabled.Provider value={enabled}>
      {children}
      {enabled && (
        <SupportFallback>
          <SupportLauncher />
        </SupportFallback>
      )}
    </SupportEnabled.Provider>
  );
}
