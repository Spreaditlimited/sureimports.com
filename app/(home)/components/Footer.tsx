'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TikTokIcon from './icons/TikTokIcon';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    toast.loading('Subscribing...');
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, service: 'SUREIMPORTS' }),
      });
      const data = await res.json();
      if (data.statusx === 'SUCCESS') {
        toast.success(data.messagex || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.messagex || 'Subscription failed.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          
          <div className="space-y-6">
            <Image src="/images/svg-logo-white.svg" alt="Sure Imports" width={160} height={30} />
            <p className="text-sm leading-relaxed">
              Your trusted partner for China product sourcing. We connect businesses with verified manufacturers, ensuring quality and reliability.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 shrink-0 text-indigo-400" />
                <a href="mailto:hello@sureimports.com" className="hover:text-white transition-colors">hello@sureimports.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 shrink-0 text-indigo-400" />
                <div>
                  <p>0803 764 9956</p>
                  <p>0806 458 3664</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-indigo-400" />
                <p>5 Olutosin Ajayi Street, Ajao Estate, Lagos, Nigeria</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => router.push('/about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => router.push('/terms-and-conditions')} className="hover:text-white transition-colors">Terms & Conditions</button></li>
              <li><button onClick={() => router.push('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => router.push('/warranty-policy')} className="hover:text-white transition-colors">Warranty Policy</button></li>
              <li><button onClick={() => router.push('/shipping-policy')} className="hover:text-white transition-colors">Shipping Policy</button></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="mb-6 flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-slate-800 bg-slate-900 text-sm text-white"
              />
              <Button type="submit" disabled={isSubmitting} className="h-10 bg-brand-orange-500 text-white hover:bg-brand-orange-600 border-0">
                Subscribe
              </Button>
            </form>
            
            <div className="flex gap-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-500"><Facebook className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-pink-500"><Instagram className="h-5 w-5" /></a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white"><TikTokIcon className="h-5 w-5" /></a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-red-500"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

        </div>
      </div>
      
      <div className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs">
        <p>© {new Date().getFullYear()} Sure Importers Limited. All rights reserved.</p>
      </div>
    </footer>
  );
}