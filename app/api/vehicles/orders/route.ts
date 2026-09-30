import { getPlanSettings } from '@/lib/vehicles/plans';
import { createHash } from 'node:crypto';
import { normalizeNigerianPhone } from '@/lib/wallet/phone';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth/checkAuth';
import { vehicleCatalogue } from '@/lib/vehicles/data';
import { vehicleEvent, vehicleId } from '@/lib/vehicles/events';
import { sameOrigin, inputText, failure } from '@/lib/vehicles/http';

export async function POST(request: Request) {
  const auth = await checkAuth();
  if (!auth)
    return Response.json({ message: 'Sign in to continue.' }, { status: 401 });
  let body;
  let paySmallSmall = false;
  try {
    sameOrigin(request);
    const input = await request.json();
    if (
      input.paymentOption &&
      !['FULL', 'PAY_SMALL_SMALL'].includes(input.paymentOption)
    )
      throw new Error('Choose a valid payment option.');
    paySmallSmall = input.paymentOption === 'PAY_SMALL_SMALL';
    body = {
      modelSlug: inputText(input.modelSlug, 'model', 100),
      variantId: inputText(input.variantId, 'configuration', 100),
      requestKey: createHash('sha256')
        .update(
          `${auth.pidUser}:${inputText(input.requestKey, 'request reference', 36)}`,
        )
        .digest('hex'),
      customerName: inputText(input.customerName, 'name', 160),
      phone: inputText(input.phone, 'phone number', 40),
      destination: 'Lagos',
      notes: inputText(input.notes || '', 'notes', 2000, false),
      whatsappConsent: input.whatsappConsent === true,
      quantity: Number(input.quantity),
    };
    if (!/^\+?[\d\s()-]{8,25}$/.test(body.phone))
      throw new Error('Enter a valid phone number including country code.');
    body.phone =
      normalizeNigerianPhone(body.phone) || body.phone.replace(/[\s()-]/g, '');
    if (body.whatsappConsent && !/^\+[1-9]\d{7,14}$/.test(body.phone))
      throw new Error(
        'Include your country code for WhatsApp updates, for example +234.',
      );
    if (
      !Number.isInteger(body.quantity) ||
      body.quantity < 1 ||
      body.quantity > 100
    )
      throw new Error('Choose between 1 and 100 vehicles.');
  } catch (e) {
    return Response.json({ message: (e as Error).message }, { status: 400 });
  }
  try {
    const existing = await prisma.vehicle_orders.findUnique({
      where: { requestKey: body.requestKey },
    });
    if (existing) return Response.json({ id: existing.id });
    const model = (await vehicleCatalogue()).find(
      (m) => m.slug === body.modelSlug && m.published,
    );
    const variant = model?.variants.find((v) => v.id === body.variantId);
    if (!model || !variant)
      return Response.json(
        { message: 'This configuration is no longer available.' },
        { status: 409 },
      );
    const user = await prisma.users.findUnique({
      where: { pidUser: auth.pidUser },
    });
    if (!user)
      return Response.json({ message: 'Sign in again.' }, { status: 401 });
    const order = await prisma.$transaction(async (tx) => {
      // Serialize requests per customer and bound repeated enquiry submissions.
      await tx.$queryRaw`SELECT id FROM users WHERE pidUser = ${auth.pidUser} FOR UPDATE`;
      const repeated = await tx.vehicle_orders.findUnique({
        where: { requestKey: body.requestKey },
      });
      if (repeated) return repeated;
      const count = await tx.vehicle_orders.count({
        where: {
          pidUser: auth.pidUser,
          createdAt: { gte: new Date(Date.now() - 3600000) },
        },
      });
      if (count >= 10) throw new Error('Too many requests');
      // Persist a bundled fallback model before an order references it. Existing
      // catalogue records (including admin prices and publication state) win.
      const savedModel = await tx.vehicle_models.upsert({
        where: { slug: model.slug },
        create: {
          slug: model.slug,
          name: model.name,
          category: model.category,
          powertrain: model.powertrain,
          description: model.description,
          images: model.images,
          youtubeUrls: model.youtubeUrls,
          variants: JSON.parse(JSON.stringify(model.variants)),
          published: model.published,
        },
        update: {},
      });
      if (
        !savedModel.published ||
        !(savedModel.variants as unknown as { id: string }[]).some(
          (v) => v.id === body.variantId,
        )
      ) {
        throw new Error('This configuration is no longer available.');
      }
      if (paySmallSmall && !(await getPlanSettings(tx)).enabled)
        throw new Error(
          'Pay Small Small is currently unavailable. Choose pay in full or contact us.',
        );
      const row = await tx.vehicle_orders.create({
        data: {
          ...body,
          id: vehicleId('VO'),
          pidUser: auth.pidUser,
          email: user.userEmail,
          vehicleName: `${model.name} — ${variant.name}`,
        },
      });
      if (paySmallSmall)
        await tx.$executeRaw`INSERT INTO vehicle_payment_plans (orderId) VALUES (${row.id})`;
      await vehicleEvent(
        tx,
        row.id,
        'ENQUIRY',
        'We have received your vehicle request. We will confirm availability and send your Naira quotation here.',
        auth.pidUser,
      );
      return row;
    });
    return Response.json({ id: order.id }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
