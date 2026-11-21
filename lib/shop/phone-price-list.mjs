import { jsPDF } from 'jspdf';

const clean = value => String(value || '').replace(/<[^>]*>/g, '').replace(/[\u2010-\u2015]/g, '-').replace(/\s+/g, ' ').trim();
const compare = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare;

export function phonePriceListRows(products) {
  return products.filter(p => p.productVisibility === true &&
    ['phone', 'phones'].includes(String(p.productCategory || '').toLowerCase().trim()) &&
    (!p.productStatus?.trim() || p.productStatus.trim().toLowerCase() === 'available') &&
    typeof p.productPrice === 'number' && Number.isFinite(p.productPrice) && p.productPrice > 0 && p.productName?.trim()
  ).map(p => ({
    id: p.pidProduct,
    name: clean(p.productName).replace(/\s*-\s*(Refurbished|Brand new|Pre-owned)$/i, ''),
    brand: /iphone/i.test(p.productName) ? 'Apple' : /samsung/i.test(p.productBrand || p.productName) ? 'Samsung' : clean(p.productBrand).replace(/\b\w/g, c => c.toUpperCase()) || 'Other phones',
    condition: /refurbished/i.test(p.productName) || p.productCondition === 'REFURBISHED' ? 'Refurbished' :
      ({ BRAND_NEW: 'Brand new', PRE_OWNED: 'Pre-owned', OPEN_BOX: 'Open box' }[p.productCondition] || 'Condition to be confirmed'),
    price: p.productPrice,
    moq: Math.max(1, Math.ceil(p.productMOQ || 1)),
  })).sort((a, b) => compare(a.brand, b.brand) || compare(a.condition, b.condition) || compare(a.name, b.name));
}

export function createPhonePriceList(products, logo, generatedAt = new Date()) {
  const rows = phonePriceListRows(products);
  if (!rows.length) throw new Error('NO_PHONES');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  pdf.setProperties({ title: 'Sure Imports | Phone price list', author: 'Sure Importers Limited', subject: 'Current phone prices in Nigerian Naira' });
  const purple = '#48439B', ink = '#172033', muted = '#617087';
  const date = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }).format(generatedAt);
  let y = 0, group = '', first = true;
  function page(section) {
    if (!first) pdf.addPage();
    first = false;
    pdf.setFillColor(purple); pdf.rect(0, 0, 210, 3, 'F');
    pdf.setFillColor('#F28C28'); pdf.rect(166, 0, 44, 3, 'F');
    const image = pdf.getImageProperties(logo);
    pdf.addImage(logo, 'PNG', 16, 15, 57, 57 * image.height / image.width);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(muted);
    pdf.text('PREPARED ' + date.toUpperCase() + ' WAT', 194, 22, { align: 'right' });
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(29); pdf.setTextColor(ink);
    pdf.text('Phone price list', 16, 47);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.setTextColor(muted);
    pdf.text('Find your next phone. Shop with Sure Imports.', 16, 56);
    pdf.setFillColor('#F1F0FA'); pdf.roundedRect(16, 65, 178, 14, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); pdf.setTextColor(purple);
    pdf.text(section, 20, 74);
    pdf.setFontSize(8); pdf.text('PRICES IN NGN', 190, 74, { align: 'right' });
    pdf.setFillColor(purple); pdf.roundedRect(16, 85, 178, 10, 1.5, 1.5, 'F');
    pdf.setTextColor('#FFFFFF'); pdf.setFontSize(8);
    pdf.text('MODEL / CONFIGURATION', 20, 91.5);
    pdf.text('UNIT PRICE (NGN)', 190, 91.5, { align: 'right' });
    y = 95;
  }
  let stripe = 0;
  for (const row of rows) {
    const section = `${row.brand} / ${row.condition}`;
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9);
    const lines = pdf.splitTextToSize(row.name, 126);
    const height = Math.max(12, lines.length * 4.3 + 6 + (row.moq > 1 ? 4 : 0));
    if (height > 160) throw new Error('Product name exceeds layout limits.');
    if (section !== group || y + height > 260) { page(section); group = section; stripe = 0; }
    if (stripe++ % 2 === 0) { pdf.setFillColor('#F7F7FB'); pdf.rect(16, y, 178, height, 'F'); }
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(ink);
    pdf.text(lines, 20, y + 7, { lineHeightFactor: 1.35 });
    pdf.link(20, y + 1, 126, height - 2, { url: `https://www.sureimports.com/shop/${encodeURIComponent(row.id)}` });
    if (row.moq > 1) { pdf.setFontSize(7.5); pdf.setTextColor(muted); pdf.text(`Minimum order: ${row.moq} units`, 20, y + height - 2.5); }
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(purple);
    pdf.text(row.price.toLocaleString('en-NG', { maximumFractionDigits: 2 }), 190, y + 7, { align: 'right' });
    y += height;
  }
  for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
    pdf.setPage(i); pdf.setDrawColor('#DEDFEB'); pdf.line(16, 268, 194, 268);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(muted);
    pdf.text('Prices current at generation. Tap a model to view its details and order.', 16, 275);
    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(purple);
    pdf.textWithLink('sureimports.com', 16, 284, { url: 'https://www.sureimports.com/shop/category/phones' });
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(muted);
    pdf.text('hello@sureimports.com', 78, 284);
    pdf.text(`${i} / ${pdf.getNumberOfPages()}`, 194, 284, { align: 'right' });
  }
  return new Uint8Array(pdf.output('arraybuffer'));
}
