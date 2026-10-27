import fs from 'node:fs/promises';
import sharp from 'sharp';
import { jsPDF } from 'jspdf';

const iphone = JSON.parse(
  await fs.readFile(
    new URL('./iphone-prices-2026-09-22.json', import.meta.url),
  ),
);
const samsung = JSON.parse(
  await fs.readFile(
    new URL('./samsung-prices-2026-10-24.json', import.meta.url),
  ),
);
const out = 'deliverables/rmb-price-lists';
await fs.mkdir(out, { recursive: true });
const logo = (
  await sharp('public/images/svg-logo.svg').resize(580).png().toBuffer()
).toString('base64');
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
const groups = [
  {
    brand: 'iPhone',
    pages: [
      ...[
        [12, 13],
        [14, 15],
        [16, 17],
      ].map((nums) => ({
        title: `iPhone ${nums[0]} & ${nums[1]}`,
        condition: 'Refurbished collection',
        rows: iphone.refurbished
          .filter((r) => nums.includes(parseInt(r[0])))
          .map(([model, gb, rmb]) => [`iPhone ${model}`, gb, '', rmb]),
      })),
      {
        title: 'iPhone 18 series',
        condition: 'Brand-new collection',
        rows: iphone.brandNew.map(([model, gb, rmb, colour]) => [
          `iPhone ${model}${colour ? ' - ' + colour : ''}`,
          gb,
          '',
          rmb,
        ]),
      },
    ],
  },
  {
    brand: 'Samsung',
    pages: ['Z', 'S'].map((prefix) => ({
      title: prefix === 'Z' ? 'Galaxy Z Fold' : 'Galaxy S Ultra',
      condition: 'Refurbished collection',
      rows: samsung.rows
        .filter((r) => r[0].startsWith(prefix))
        .map(([model, gb, sim, rmb]) => [`Galaxy ${model}`, gb, sim, rmb]),
    })),
  },
];
const audit = [];
for (const group of groups) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  pdf.setProperties({
    title: `Sure Imports ${group.brand} RMB Price List`,
    author: 'Sure Imports',
    subject: 'Product prices in RMB. Shipping and clearing excluded.',
  });
  for (const [index, page] of group.pages.entries()) {
    const step = page.rows.length > 15 ? 64 : page.rows.length > 9 ? 88 : 130;
    const rows = page.rows
      .map(([model, gb, sim, base], i) => {
        const price = Math.round(base * 110) / 100;
        if (price !== (base * 11) / 10) throw Error('Calculation mismatch');
        audit.push({
          brand: group.brand,
          model,
          gb,
          sim,
          baseRmb: base,
          priceRmb: price,
        });
        const y = 610 + i * step;
        return (
          `<rect x="80" y="${y - 42}" width="1440" height="${step}" fill="${i % 2 ? '#f5f5fa' : 'white'}"/>` +
          text(108, y, model, 30, '#182035', 600) +
          (sim ? text(108, y + 38, sim, 23, '#606779') : '') +
          text(1070, y, `${gb} GB`, 27, '#606779', 400, 'text-anchor="end"') +
          text(
            1488,
            y,
            price.toLocaleString('en-GB', { maximumFractionDigits: 2 }),
            32,
            '#48439b',
            700,
            'text-anchor="end"',
          )
        );
      })
      .join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2263"><rect width="1600" height="2263" fill="white"/><rect width="1600" height="14" fill="#48439b"/><g font-family="Arial,Helvetica,sans-serif">
   <image href="data:image/png;base64,${logo}" x="80" y="70" width="480" height="77"/>
   ${text(1520, 115, '26 OCTOBER 2026', 22, '#606779', 600, 'text-anchor="end"')}
   ${text(80, 240, page.condition.toUpperCase(), 23, '#48439b', 700, 'letter-spacing="3"')}
   ${text(76, 335, page.title, 76, '#182035', 700)}
   ${text(80, 395, 'RMB PRICE LIST', 28, '#606779', 600)}
   <rect x="80" y="432" width="1440" height="72" rx="14" fill="#efedf9"/>
   ${text(110, 478, 'PRODUCT PRICES ONLY', 23, '#48439b', 700)}
   ${text(1488, 478, 'SHIPPING & CLEARING EXCLUDED', 23, '#48439b', 700, 'text-anchor="end"')}
   ${text(108, 555, group.brand === 'Samsung' ? 'MODEL / SIM' : 'MODEL / COLOUR', 20, '#606779', 700)}
   ${text(1070, 555, 'STORAGE', 20, '#606779', 700, 'text-anchor="end"')}
   ${text(1488, 555, 'PRICE (RMB)', 20, '#606779', 700, 'text-anchor="end"')}
   ${rows}
   <rect x="80" y="1840" width="1440" height="225" rx="18" fill="#171922"/>
   ${text(112, 1895, 'All prices are in Chinese Yuan (RMB).', 29, 'white', 600)}
   ${text(112, 1945, 'Shipping and clearing charges are not included in the listed prices.', 25, '#c6c8d3')}
   ${text(112, 1990, 'Please contact us for shipping and clearing costs before ordering.', 25, '#c6c8d3')}
   ${text(112, 2035, 'Confirm availability, colours and SIM configuration when placing your order.', 24, '#c6c8d3')}
   ${text(80, 2120, 'Prices are subject to availability and price changes.', 23, '#606779')}
   <line x1="80" y1="2155" x2="1520" y2="2155" stroke="#e4e4eb"/>
   ${text(80, 2205, 'sureimports.com/shop', 27, '#48439b', 700)}
   ${text(800, 2205, 'hello@sureimports.com', 23, '#606779', 400, 'text-anchor="middle"')}
   ${text(1520, 2205, `${index + 1} / ${group.pages.length}`, 23, '#606779', 400, 'text-anchor="end"')}
   </g></svg>`;
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    await fs.writeFile(`${out}/${group.brand}-RMB-${index + 1}.png`, png);
    if (index) pdf.addPage();
    pdf.addImage(png, 'PNG', 0, 0, 210, 297);
  }
  await fs.writeFile(
    `${out}/Sure-Imports-${group.brand}-RMB-Price-List.pdf`,
    Buffer.from(pdf.output('arraybuffer')),
  );
}
await fs.writeFile(
  `${out}/calculation-audit.json`,
  JSON.stringify(audit, null, 2),
);
console.log(
  JSON.stringify({
    files: groups.map(
      (g) => `${out}/Sure-Imports-${g.brand}-RMB-Price-List.pdf`,
    ),
    verifiedPrices: audit.length,
  }),
);
