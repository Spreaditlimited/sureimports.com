import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const source = JSON.parse(
  fs.readFileSync(new URL('./iphone-prices-2026-09-22.json', import.meta.url)),
);
const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');
const isIphone = (r) => /\biphone\b/i.test(r.productName || '');
const key = (model, storage, condition, colour = '') =>
  `${model}|${storage}|${condition}|${colour}`;
function identify(row) {
  const name = row.productName || '';
  const m = name.match(/iphone\s+(\d+)(?:\s+(pro\s+max|pro|plus))?/i);
  const s = name.match(/\b(64|128|256|512)\s*GB\b/i);
  if (!m || !s || /esim/i.test(name)) return null;
  const model =
    m[1] +
    (m[2]
      ? ' ' + m[2].toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
      : '');
  const colour =
    row.productCondition === 'BRAND_NEW'
      ? name.match(
          /\b(Black|Silver|Glacier|Burgundy|White|Blue|Red)\b/i,
        )?.[1] || ''
      : '';
  return key(model, Number(s[1]), row.productCondition, colour);
}
const entries = [
  ...source.refurbished.map(([model, storage, rmb]) => ({
    model,
    storage,
    rmb,
    colour: '',
    condition: 'PRE_OWNED',
    markup: source.refurbishedMarkupRmb,
  })),
  ...source.brandNew.map(([model, storage, rmb, colour]) => ({
    model,
    storage,
    rmb,
    colour,
    condition: 'BRAND_NEW',
    markup:
      source.brandNewMarkupOverridesRmb?.[model] ?? source.brandNewMarkupRmb,
  })),
];
const warranty =
  'One-year Sure Imports limited warranty from delivery, subject to our warranty policy: https://www.sureimports.com/warranty-policy. Covers motherboard and internal components. Exclusions include screen damage, liquid damage, age- or misuse-related battery degradation, mishandling and unauthorised repairs or modifications. Claim transport to and from our Lagos office is paid by the customer; installation costs apply if a replacement part is supplied.';
try {
  const all = await prisma.store.findMany({ orderBy: { id: 'asc' } });
  const iphones = all.filter(isIphone);
  const keep = new Set();
  const changes = entries.map((e) => {
    const match = iphones.find(
      (r) =>
        identify(r) === key(e.model, e.storage, e.condition, e.colour) &&
        !keep.has(r.pidProduct),
    );
    if (match) keep.add(match.pidProduct);
    const donor = iphones.find(
      (r) =>
        new RegExp(`iphone\\s+${e.model.replaceAll(' ', '\\s+')}\\b`, 'i').test(
          r.productName || '',
        ) &&
        identify(r)?.split('|')[0] === e.model &&
        r.productImage,
    );
    const condition = e.condition === 'PRE_OWNED' ? 'Refurbished' : 'Brand new';
    const name = `iPhone ${e.model} ${e.storage}GB${e.colour ? ' — ' + e.colour : ''} — ${condition}`;
    const price = (e.rmb + e.markup) * source.ngnPerRmb;
    if (!Number.isSafeInteger(price) || price <= 0)
      throw Error('Invalid price');
    const category = (
      match?.productCategory ||
      donor?.productCategory ||
      'phone'
    ).replace(/^Phones$/, 'phone');
    const data = {
      productName: name,
      productPrice: price,
      productCategory: category,
      productCondition: e.condition,
      warrantyPeriod: 'MONTHS12',
      productVisibility: true,
      productDescription: `${condition} iPhone ${e.model} with ${e.storage}GB storage${e.colour ? ', in ' + e.colour.toLowerCase() : ''}, shipped from China. The displayed price includes doorstep delivery anywhere in Nigeria.\n\n${warranty}`,
      productFeature: `${e.storage}GB storage\n${condition}${e.colour ? '\nColour: ' + e.colour : ''}\nDoorstep delivery anywhere in Nigeria included\n12-month limited warranty, subject to policy`,
      productSpecification: `Model: iPhone ${e.model}\nStorage: ${e.storage}GB\nCondition: ${condition}${e.colour ? '\nColour: ' + e.colour : ''}\nDelivery destination: Nigeria\nPlease confirm SIM configuration, available colours and device condition with us before ordering.`,
      updatedAt: new Date(),
    };
    return {
      id:
        match?.pidProduct ||
        `IPHONE_${crypto
          .createHash('sha256')
          .update(key(e.model, e.storage, e.condition, e.colour))
          .digest('hex')
          .slice(0, 18)}`,
      existing: !!match,
      data,
      image: donor?.productImage || null,
      category,
    };
  });
  const hide = iphones.filter(
    (r) => !keep.has(r.pidProduct) && r.productVisibility,
  );
  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        update: changes.filter((c) => c.existing).length,
        create: changes.filter((c) => !c.existing).length,
        hide: hide.map((r) => ({ id: r.pidProduct, name: r.productName })),
        missingImages: changes
          .filter((c) => !c.existing && !c.image)
          .map((c) => c.data.productName),
      },
      null,
      2,
    ),
  );
  if (apply) {
    const backup = path.resolve(
      '.catalogue-backups',
      `iphones-${Date.now()}.json`,
    );
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.writeFileSync(
      backup,
      JSON.stringify(
        {
          before: iphones,
          createdIds: changes.filter((c) => !c.existing).map((c) => c.id),
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );
    const nonIphones = all.filter((r) => !isIphone(r));
    await prisma.$transaction(
      async (tx) => {
        for (const c of changes) {
          if (c.existing)
            await tx.store.update({
              where: { pidProduct: c.id },
              data: c.data,
            });
          else
            await tx.store.create({
              data: {
                ...c.data,
                pidProduct: c.id,
                productBrand: 'Apple',
                productCategory: c.category,
                productImage: c.image,
                productMOQ: 1,
                productStatus: 'available',
              },
            });
        }
        for (const row of hide)
          await tx.store.update({
            where: { pidProduct: row.pidProduct },
            data: { productVisibility: false, updatedAt: new Date() },
          });
        for (const c of changes) {
          const r = await tx.store.findUnique({ where: { pidProduct: c.id } });
          if (!r?.productVisibility || r.productPrice !== c.data.productPrice)
            throw Error('Price verification failed');
        }
        const after = await tx.store.findMany({ orderBy: { id: 'asc' } });
        if (
          JSON.stringify(after.filter((r) => !isIphone(r))) !==
          JSON.stringify(nonIphones)
        )
          throw Error('Non-iPhone records changed; aborting');
      },
      { timeout: 60000 },
    );
    console.log(
      JSON.stringify({
        verified: true,
        visibleIphones: changes.length,
        otherProductsUnchanged: true,
        backup,
      }),
    );
  }
} finally {
  await prisma.$disconnect();
}
