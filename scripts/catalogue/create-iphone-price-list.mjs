import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { jsPDF } from 'jspdf';

const source = JSON.parse(
  await fs.readFile(
    new URL('./iphone-prices-2026-09-22.json', import.meta.url),
  ),
);
const out = path.resolve('deliverables/iphone-price-list');
await fs.mkdir(out, { recursive: true });
const logo = (
  await sharp('public/images/svg-logo.svg').resize(580).png().toBuffer()
).toString('base64');
const pages = [
  {
    title: 'iPhone 12 & 13',
    subtitle: 'Refurbished collection',
    rows: source.refurbished.filter((r) => /^(12|13)( |$)/.test(r[0])),
    markup: 500,
  },
  {
    title: 'iPhone 14 & 15',
    subtitle: 'Refurbished collection',
    rows: source.refurbished.filter((r) => /^(14|15)( |$)/.test(r[0])),
    markup: 500,
  },
  {
    title: 'iPhone 16 & 17',
    subtitle: 'Refurbished collection',
    rows: source.refurbished.filter((r) => /^(16|17)( |$)/.test(r[0])),
    markup: 500,
  },
  {
    title: 'iPhone 18 series',
    subtitle: 'Brand-new collection',
    rows: source.brandNew,
    markup: 1000,
  },
];
const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
pdf.setProperties({
  title: 'Sure Imports — iPhone Price List — 22 September 2026',
  author: 'Sure Imports',
  subject: 'Nigeria delivery-inclusive iPhone prices',
});
const text = (
  x,
  y,
  value,
  size = 28,
  fill = '#182035',
  weight = 400,
  extra = '',
) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</text>`;
for (const [index, page] of pages.entries()) {
  const top = 590,
    step = page.rows.length > 15 ? 64 : 88;
  let rows = '';
  page.rows.forEach(([model, storage, rmb, colour], i) => {
    const y = top + i * step;
    rows += `<rect x="80" y="${y - 42}" width="1440" height="${step}" fill="${i % 2 ? '#f5f5fa' : '#fff'}"/>`;
    rows += text(
      108,
      y,
      `iPhone ${model}${colour ? ' · ' + colour : ''}`,
      30,
      '#182035',
      550,
    );
    rows += text(
      1070,
      y,
      `${storage} GB`,
      27,
      '#606779',
      400,
      'text-anchor="end"',
    );
    rows += text(
      1488,
      y,
      `₦${((rmb + page.markup) * source.ngnPerRmb).toLocaleString('en-NG')}`,
      32,
      '#48439b',
      650,
      'text-anchor="end"',
    );
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2263" viewBox="0 0 1600 2263">
    <rect width="1600" height="2263" fill="#fff"/><rect width="1600" height="14" fill="#48439b"/>
    <g font-family="Arial, Helvetica, sans-serif">
    <image href="data:image/png;base64,${logo}" x="80" y="70" width="480" height="77"/>
    ${text(1520, 115, '22 SEPTEMBER 2026', 22, '#606779', 600, 'text-anchor="end"')}
    ${text(80, 240, page.subtitle.toUpperCase(), 23, '#48439b', 700, 'letter-spacing="3"')}
    ${text(76, 335, page.title, 76, '#182035', 700, 'letter-spacing="-2"')}
    ${text(80, 393, 'Your next iPhone. Delivered to your door.', 30, '#606779')}
    <rect x="80" y="432" width="1440" height="72" rx="14" fill="#efedf9"/>
    ${text(110, 478, 'NIGERIA DELIVERY INCLUDED', 23, '#48439b', 700, 'letter-spacing="1"')}
    ${text(1488, 478, 'ONE-YEAR LIMITED WARRANTY*', 23, '#48439b', 700, 'text-anchor="end"')}
    ${text(108, 544, 'MODEL / COLOUR', 19, '#606779', 700, 'letter-spacing="2"')}
    ${text(1070, 544, 'STORAGE', 19, '#606779', 700, 'text-anchor="end" letter-spacing="2"')}
    ${text(1488, 544, 'YOUR PRICE', 19, '#606779', 700, 'text-anchor="end" letter-spacing="2"')}
    ${rows}
    <rect x="80" y="1830" width="1440" height="236" rx="18" fill="#171922"/>
    ${text(112, 1878, '*One year of limited warranty cover from delivery.', 27, '#fff', 650)}
    ${text(112, 1922, 'Covers motherboard and internal components, subject to our warranty policy.', 23, '#c6c8d3')}
    ${text(112, 1960, 'Exclusions apply. Customer pays warranty-claim transport to and from Lagos.', 23, '#c6c8d3')}
    ${text(112, 1998, 'Please read the full terms before ordering:', 23, '#c6c8d3')}
    ${text(112, 2036, 'sureimports.com/warranty-policy', 24, '#c1baff', 600)}
    ${text(80, 2122, 'Prices include doorstep delivery anywhere in Nigeria. Subject to availability and price changes.', 22, '#606779')}
    <line x1="80" y1="2155" x2="1520" y2="2155" stroke="#e4e4eb"/>
    ${text(80, 2205, 'sureimports.com/shop', 27, '#48439b', 700)}
    ${text(800, 2205, 'hello@sureimports.com', 23, '#606779', 400, 'text-anchor="middle"')}
    ${text(1520, 2205, `${index + 1} / ${pages.length}`, 23, '#606779', 400, 'text-anchor="end"')}
    </g></svg>`;
  const file = `Sure-Imports-iPhones-${index + 1}`;
  await fs.writeFile(path.join(out, `${file}.svg`), svg);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await fs.writeFile(path.join(out, `${file}.png`), png);
  if (index) pdf.addPage();
  pdf.addImage(png, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  pdf.link(14, 266, 90, 8, {
    url: 'https://www.sureimports.com/warranty-policy',
  });
  pdf.link(10, 285, 70, 10, { url: 'https://www.sureimports.com/shop' });
}
await fs.writeFile(
  path.join(out, 'Sure-Imports-iPhone-Price-List.pdf'),
  Buffer.from(pdf.output('arraybuffer')),
);
console.log(`Created ${pages.length} shareable images and PDF in ${out}`);
