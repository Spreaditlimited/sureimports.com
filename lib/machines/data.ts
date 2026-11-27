import 'server-only';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { isRedirectedBlogSlug } from '@/lib/blogRedirects';
import { selectMachineGuides } from './guides';

// Request-scoped only: publication timestamps become visible without a build or cache purge.
export const getMachineGuides = cache(async () => {
  const now = new Date();
  const blogs = await prisma.blog.findMany({
    where: {
      blogPublished: true,
      xStaus: 'active',
      OR: [{ createdAt: null }, { createdAt: { lte: now } }],
    },
    select: {
      blogTitle: true,
      blogSlug: true,
      blogExt2: true,
      blogPublished: true,
      xStaus: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
  return selectMachineGuides(blogs, now, isRedirectedBlogSlug);
});
export async function getMachineSourcingContact() {
  try {
    const contacts = await prisma.$queryRaw<
      Array<{ phone: string | null }>
    >`SELECT phone FROM admin_whatsapp_contacts WHERE pidContact = 'WAC-GENERAL' AND isActive = true LIMIT 1`;
    const phone = String(contacts[0]?.phone || '').replace(/[^\d]/g, '');
    if (/^[1-9]\d{7,14}$/.test(phone))
      return `https://wa.me/${phone}?text=${encodeURIComponent('Hello Sure Imports. I want to source a machine or production line from China to Nigeria. My product is: __. Required output: __. Installation city: __. Please help me define the sourcing brief.')}`;
  } catch {
    console.error('Machine sourcing contact unavailable');
  }
  return '/contact-us';
}
