'use client';

import { FaFacebookF, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const footerLinks = [
  { name: 'Terms', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Shipping Policy', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Team', href: '#' },
  { name: 'Calculator', href: '#' },
];

const officeLocations = [
  {
    title: 'LAGOS, NIGERIA',
    lines: [
      'Sure Importers Limited',
      '5 Olutosin Ajayi Street,',
      'Ajao Estate, Lagos',
      '+234 803 764 9956',
      '+234 806 458 3664',
      '+234 806 839 7263',
    ],
  },
  {
    title: 'GUANGZHOU, CHINA',
    lines: [
      'Room 323 3/F Mingsheng Business Centre 12-20',
      'Guangyang road',
      'M. Baiyun District,',
      'Guangzhou, China.',
      '广州市白云区广源中路18号',
      '明圣商务城明圣商贸城323档',
    ],
  },
  {
    title: 'COLORADO, USA',
    lines: [
      'Spreadit Sourcing LLC',
      '1942 Broadway Street.',
      'Suite 314C. 80302,',
      'Boulder, Colorado',
    ],
  },
  {
    title: 'LONDON, UNITED KINGDOM',
    lines: [
      'Spreadit Sourcing Limited',
      '85 Great Portland Street,',
      'London W1W 7LT United Kingdom',
    ],
  },
  {
    title: 'EMAIL',
    lines: ['hello@sureimports.com'],
    isEmail: true,
  },
];

const socialIcons = [
  { icon: <FaFacebookF />, href: '#' },
  { icon: <FaYoutube />, href: '#' },
  { icon: <FaTiktok />, href: '#' },
  { icon: <FaInstagram />, href: '#' },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#121124] pb-6 pt-12 text-sm text-white">
      <div className="container">
        {/* Top nav + social */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-gray-600/30 pb-6 lg:flex-row"
        >
          <div className="flex flex-wrap justify-center gap-6 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 transition hover:text-orange-500"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="mt-4 flex items-start justify-start md:mt-0 md:justify-end">
            <div className="flex gap-4 rounded-full bg-white px-4 py-2">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="text-xl text-orange-500 hover:text-orange-600"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Office Locations */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-6 flex flex-wrap justify-between gap-6 border-b border-gray-600/30 pb-8"
        >
          {officeLocations.map((office) => (
            <div key={office.title} className="max-w-[200px]">
              <h4 className="mb-2 text-sm font-semibold uppercase">
                {office.title}
              </h4>
              <address className="not-italic leading-relaxed text-gray-300">
                {office.lines.map((line, i) =>
                  office.isEmail ? (
                    <a
                      key={i}
                      href={`mailto:${line}`}
                      className="block text-gray-300 hover:underline"
                    >
                      {line}
                    </a>
                  ) : (
                    <div key={i}>{line}</div>
                  ),
                )}
              </address>
            </div>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center text-[12px] font-semibold text-gray-400 sm:text-[16px]"
        >
          Copyright © Sure Importers Limited 2024. All Rights Reserved.
        </motion.p>
      </div>
    </footer>
  );
}
