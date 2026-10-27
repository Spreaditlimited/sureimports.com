import fs from 'node:fs/promises';
import sharp from 'sharp';
import { jsPDF } from 'jspdf';

const data = JSON.parse(
  await fs.readFile(
    new URL('./samsung-prices-2026-10-24.json', import.meta.url),
  ),
);
const draft = data.status !== 'CONFIRMED';
const out = 'deliverables/samsung-price-list';
await fs.mkdir(out, { recursive: true });
const logo = (
  await sharp('public/images/svg-logo.svg').resize(580).png().toBuffer()
).toString('base64');
const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
const text = (
  x,
  y,
  s,
  size = 28,
  color = '#182035',
  weight = 400,
  extra = '',
) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" ${extra}>${String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</text>`;
const money = (n) => `₦${n.toLocaleString('en-NG')}`;
for (const [index, title] of ['Galaxy Z Fold', 'Galaxy S Ultra'].entries()) {
  const rows = data.rows.filter((r) =>
    r[0].startsWith(index === 0 ? 'Z' : 'S'),
  );
  const body = rows
    .map(([model, gb, sim, rmb, margin], i) => {
      const y = 610 + i * 135;
      return (
        `<rect x="80" y="${y - 55}" width="1440" height="135" fill="${i % 2 ? '#f5f5fa' : '#fff'}"/>` +
        text(108, y, `Galaxy ${model}`, 34, '#182035', 600) +
        text(108, y + 42, sim, 24, '#606779') +
        text(
          1060,
          y + 12,
          `${gb} GB`,
          28,
          '#606779',
          400,
          'text-anchor="end"',
        ) +
        text(
          1488,
          y + 12,
          money((rmb + margin) * data.ngnPerRmb),
          36,
          '#48439b',
          700,
          'text-anchor="end"',
        )
      );
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2263"><rect width="1600" height="2263" fill="white"/><rect width="1600" height="14" fill="#48439b"/><g font-family="Arial,Helvetica,sans-serif">
  <image href="data:image/png;base64,${logo}" x="80" y="70" width="480" height="77"/>
  ${text(1520, 115, '24 OCTOBER 2026', 22, '#606779', 600, 'text-anchor="end"')}
  ${text(80, 240, 'SAMSUNG PRICE LIST', 23, '#48439b', 700, 'letter-spacing="3"')}
  ${text(76, 335, title, 76, '#182035', 700)}
  ${text(80, 400, draft ? 'DRAFT - source prices and stock condition awaiting confirmation' : 'REFURBISHED COLLECTION', 27, '#606779')}
  ${text(108, 520, 'MODEL / SIM', 21, '#606779', 700)}${text(1060, 520, 'STORAGE', 21, '#606779', 700, 'text-anchor="end"')}${text(1488, 520, 'YOUR PRICE', 21, '#606779', 700, 'text-anchor="end"')}
  ${body}
  <rect x="80" y="1670" width="1440" height="240" rx="18" fill="#171922"/>
  ${text(112, 1725, 'Choose your model, storage and SIM configuration.', 30, 'white', 600)}
  ${text(112, 1780, 'SIM unspecified: please confirm your preferred configuration with us.', 25, '#c6c8d3')}
  ${text(112, 1830, 'All devices are refurbished. Please confirm available colours before ordering.', 25, '#c6c8d3')}
  ${text(80, 2040, 'Prices are subject to availability and price changes.', 25, '#606779')}
  <line x1="80" y1="2155" x2="1520" y2="2155" stroke="#e4e4eb"/>
  ${text(80, 2205, 'sureimports.com/shop', 27, '#48439b', 700)}${text(800, 2205, 'hello@sureimports.com', 23, '#606779', 400, 'text-anchor="middle"')}${text(1520, 2205, `${index + 1} / 2`, 23, '#606779', 400, 'text-anchor="end"')}
  </g></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await fs.writeFile(
    `${out}/Sure-Imports-Samsung-${index + 1}${draft ? '-Draft' : ''}.png`,
    png,
  );
  if (index) pdf.addPage();
  pdf.addImage(png, 'PNG', 0, 0, 210, 297);
}
const file = `${out}/Sure-Imports-Samsung-Price-List${draft ? '-Draft' : ''}.pdf`;
await fs.writeFile(file, Buffer.from(pdf.output('arraybuffer')));
console.log(file);
