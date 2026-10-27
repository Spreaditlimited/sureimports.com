import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), true, {
  info() {},
  error() {},
});
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
const source = JSON.parse(
  fs.readFileSync(new URL('./samsung-prices-2026-10-24.json', import.meta.url)),
);
const apply = process.argv.includes('--apply');
const samsung = (r) =>
  /samsung/i.test(r.productBrand || '') ||
  /\bsamsung\b/i.test(r.productName || '');
// Existing refurbished records; null entries receive a new, condition-correct listing.
const targets = [
  'STORE1750673669967',
  'STORE1758660373257',
  'STORE1746656287019',
  null,
  'STORE1763882728724',
  null,
  null,
  'STORE1758663185671',
  'STORE1743977515337',
  'STORE1743976279135',
  'STORE1760027816130',
  null,
  'STORE1764423374205',
];
const donors = {
  'Z Fold 6': 'STORE1744310453733',
  'Z Fold 7': 'STORE1758789583375',
  'S25 Ultra': 'STORE1764423374205',
};
try {
  if (source.status !== 'CONFIRMED') throw Error('Source unconfirmed');
  const rate = await db.exchange_rate.findUnique({ where: { id: 1 } });
  if (Number(rate.exNairaToYuan) !== source.ngnPerRmb)
    throw Error('Exchange rate changed');
  const all = await db.store.findMany({ orderBy: { id: 'asc' } });
  const before = all.filter(samsung);
  const changes = source.rows.map(([model, gb, sim, rmb, margin], i) => {
    const id = targets[i] || `SAMSUNG_20261024_${i}`;
    const existing = all.find((r) => r.pidProduct === id);
    if (
      targets[i] &&
      (!existing ||
        existing.productCondition !== 'PRE_OWNED' ||
        !samsung(existing))
    )
      throw Error('Unexpected target ' + id);
    const donor = existing || all.find((r) => r.pidProduct === donors[model]);
    if (!donor?.productImage) throw Error('Missing image ' + model);
    const simLabel =
      sim === 'SIM unspecified' ? 'SIM configuration to be confirmed' : sim;
    const data = {
      productName: `Samsung Galaxy ${model} ${gb}GB - ${simLabel} - Refurbished`,
      productPrice: (rmb + margin) * source.ngnPerRmb,
      productCondition: 'PRE_OWNED',
      productBrand: 'Samsung',
      productCategory: 'phone',
      productVisibility: true,
      productStatus: 'available',
      productMOQ: 1,
      productDescription: `Refurbished Samsung Galaxy ${model} with ${gb}GB storage. ${simLabel}. Please confirm available colours before ordering.`,
      productFeature: `${gb}GB storage\nRefurbished\n${simLabel}`,
      productSpecification: `Model: Samsung Galaxy ${model}\nStorage: ${gb}GB\nCondition: Refurbished\nSIM: ${simLabel}`,
      updatedAt: new Date(),
    };
    return { id, existing, data, image: donor.productImage };
  });
  const keep = new Set(changes.map((c) => c.id));
  const hide = before.filter(
    (r) => r.productVisibility && !keep.has(r.pidProduct),
  );
  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        rate: source.ngnPerRmb,
        changes: changes.map((c) => ({
          id: c.id,
          existing: !!c.existing,
          name: c.data.productName,
          price: c.data.productPrice,
        })),
        hide: hide.map((r) => ({ id: r.pidProduct, name: r.productName })),
      },
      null,
      2,
    ),
  );
  if (apply) {
    fs.mkdirSync('.catalogue-backups', { recursive: true });
    const backup = `.catalogue-backups/samsung-${Date.now()}.json`;
    fs.writeFileSync(
      backup,
      JSON.stringify(
        {
          before,
          createdIds: changes.filter((c) => !c.existing).map((c) => c.id),
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );
    await db.$transaction(
      async (tx) => {
        const current = await tx.store.findMany({ orderBy: { id: 'asc' } });
        if (JSON.stringify(current.filter(samsung)) !== JSON.stringify(before))
          throw Error('Concurrent Samsung changes');
        const currentRate = await tx.exchange_rate.findUnique({
          where: { id: 1 },
        });
        if (Number(currentRate.exNairaToYuan) !== source.ngnPerRmb)
          throw Error('Rate changed');
        for (const c of changes) {
          if (c.existing) {
            const result = await tx.store.updateMany({
              where: { pidProduct: c.id, updatedAt: c.existing.updatedAt },
              data: c.data,
            });
            if (result.count !== 1) throw Error('Concurrent edit ' + c.id);
          } else
            await tx.store.create({
              data: { ...c.data, pidProduct: c.id, productImage: c.image },
            });
        }
        for (const r of hide) {
          const result = await tx.store.updateMany({
            where: { pidProduct: r.pidProduct, updatedAt: r.updatedAt },
            data: { productVisibility: false, updatedAt: new Date() },
          });
          if (result.count !== 1)
            throw Error('Concurrent edit ' + r.pidProduct);
        }
        const after = await tx.store.findMany({ orderBy: { id: 'asc' } });
        const visible = after.filter((r) => samsung(r) && r.productVisibility);
        if (
          visible.length !== changes.length ||
          changes.some(
            (c) =>
              !visible.some(
                (r) =>
                  r.pidProduct === c.id &&
                  r.productPrice === c.data.productPrice &&
                  r.productCondition === 'PRE_OWNED',
              ),
          )
        )
          throw Error('Verification failed');
        if (
          JSON.stringify(after.filter((r) => !samsung(r))) !==
          JSON.stringify(current.filter((r) => !samsung(r)))
        )
          throw Error('Other products changed');
      },
      { timeout: 60000 },
    );
    console.log(
      JSON.stringify({
        verified: true,
        visible: changes.length,
        hidden: hide.length,
        backup,
      }),
    );
  }
} finally {
  await db.$disconnect();
}
