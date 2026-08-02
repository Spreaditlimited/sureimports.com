import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import FooterNewsletterForm from './FooterNewsletterForm';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          
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
                <div className="space-y-2">
                  <p>5 Olutosin Ajayi Street, Ajao Estate, Lagos, Nigeria</p>
                  <p>China: 广州市白云区机场路111号建发广场3FB3-1.</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/import-from-china-to-nigeria" className="transition-colors hover:text-white">Import Hub</Link></li>
              <li><Link href="/supplier-intelligence" className="transition-colors hover:text-white">Supplier Intelligence</Link></li>
              <li><Link href="/book-consultation" className="transition-colors hover:text-white">Book Consultation</Link></li>
              <li><Link href="/buy-from-chinese-websites" className="transition-colors hover:text-white">Buy From Chinese Websites</Link></li>
              <li><Link href="/ship-with-us" className="transition-colors hover:text-white">Ship With Us</Link></li>
              <li><Link href="/track" className="transition-colors hover:text-white">Track Shipment</Link></li>
              <li><Link href="/shipping-rate" className="transition-colors hover:text-white">Shipping Rates</Link></li>
              <li><Link href="/corporate-sourcing" className="transition-colors hover:text-white">Corporate Sourcing</Link></li>
              <li><Link href="/laptops-for-business" className="transition-colors hover:text-white">Laptops for Business</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link href="/terms-and-conditions" className="transition-colors hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/warranty-policy" className="transition-colors hover:text-white">Warranty Policy</Link></li>
              <li><Link href="/shipping-policy" className="transition-colors hover:text-white">Shipping Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Stay Updated</h3>
            <FooterNewsletterForm />
            
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
