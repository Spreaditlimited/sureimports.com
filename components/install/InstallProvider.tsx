'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};
const InstallContext = createContext({
  installed: false, ready: false, ios: false, available: false, busy: false, error: '',
  install: async () => {},
});

export function useAppInstall() { return useContext(InstallContext); }

export default function InstallProvider({ children }: { children: ReactNode }) {
  const prompt = useRef<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ready, setReady] = useState(false);
  const [ios, setIos] = useState(false);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)');
    const update = () => setInstalled(standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const capture = (event: Event) => {
      event.preventDefault();
      prompt.current = event as InstallPrompt;
      setAvailable(true);
    };
    const complete = () => { prompt.current = null; setAvailable(false); setInstalled(true); };
    update();
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    setReady(true);
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', complete);
    standalone.addEventListener('change', update);
    return () => {
      window.removeEventListener('beforeinstallprompt', capture);
      window.removeEventListener('appinstalled', complete);
      standalone.removeEventListener('change', update);
    };
  }, []);

  async function install() {
    const event = prompt.current;
    if (!event || busy) return;
    prompt.current = null;
    setAvailable(false);
    setBusy(true);
    setError('');
    try {
      await event.prompt();
      await event.userChoice;
      // Only appinstalled or standalone mode confirms that installation finished.
    } catch {
      setError('Use your browser menu to install Sure Imports, or reload this page to try again.');
    } finally { setBusy(false); }
  }

  return <InstallContext.Provider value={{ installed, ready, ios, available, busy, error, install }}>{children}</InstallContext.Provider>;
}
