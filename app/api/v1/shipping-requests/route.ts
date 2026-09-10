import { Prisma } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { after, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authenticatePartnerApi, checkPartnerRateLimit, stablePayloadHash } from '@/lib/affiliate/partnerApi';
import { createShippingRequestInTransaction } from '@/lib/shipping/createShippingRequest';
import { notifyNewShippingOnlyRequest } from '@/lib/notifications/shippingOnly';
import { sendAffiliateAccountNotification } from '@/lib/affiliate/emailNotifications';
import { measurementUnitForNewOrder } from '@/lib/procurement/shippingMath';

const payloadSchema = z.object({
  customer: z.object({ firstName: z.string().trim().min(1).max(100), lastName: z.string().trim().max(100).optional().default(''), email: z.string().trim().email().max(255), phone: z.string().trim().min(7).max(40) }),
  shipment: z.object({ shippingName: z.string().trim().min(2).max(180), destinationCountry: z.string().trim().min(2).max(100), shippingPlanId: z.string().trim().min(2).max(191), estimatedQuantity: z.coerce.number().positive().max(1_000_000).optional(), estimatedWeightKg: z.coerce.number().positive().max(1_000_000).optional(), trackingNumber: z.string().trim().max(191).optional().default(''), description: z.string().trim().min(3).max(4000), expectedShipments: z.string().trim().max(4000).optional().default(''), wantProductVerification: z.boolean().optional().default(false), wantConsolidation: z.boolean().optional().default(false), multipleSuppliers: z.boolean().optional().default(false) }).strict().refine((shipment) => shipment.estimatedQuantity !== undefined || shipment.estimatedWeightKg !== undefined, { message: 'estimatedQuantity is required.', path: ['estimatedQuantity'] }),
  externalReference: z.string().trim().min(3).max(191),
}).strict();

function response(code: string, message: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ code, message, ...extra }, { status });
}

export async function POST(request: Request) {
  const auth = await authenticatePartnerApi(request, 'shipping:write');
  if (!auth.ok) return response(auth.error, auth.error === 'UNAUTHORIZED' ? 'A valid API key is required.' : auth.error === 'INSUFFICIENT_SCOPE' ? 'This API key cannot create shipping requests.' : 'The API is temporarily unavailable.', auth.error === 'UNAUTHORIZED' ? 401 : auth.error === 'INSUFFICIENT_SCOPE' ? 403 : 503);
  const withinRateLimit = await checkPartnerRateLimit(auth.credential.id);
  if (withinRateLimit === null) return response('SERVICE_UNAVAILABLE', 'The API is temporarily unavailable.', 503);
  if (!withinRateLimit) return NextResponse.json({ code: 'RATE_LIMITED', message: 'Rate limit exceeded. Retry in one minute.' }, { status: 429, headers: { 'retry-after': '60' } });
  const idempotencyKey = (request.headers.get('idempotency-key') || '').trim();
  if (idempotencyKey.length < 8 || idempotencyKey.length > 120) return response('INVALID_REQUEST', 'Idempotency-Key must contain between 8 and 120 characters.', 400);

  let raw: unknown;
  try { raw = await request.json(); } catch { return response('INVALID_REQUEST', 'Request body must be valid JSON.', 400); }
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) return response('INVALID_REQUEST', 'The request payload is invalid.', 400, { errors: parsed.error.flatten().fieldErrors });
  const requestHash = stablePayloadHash(parsed.data);
  try {
  const prior = await prisma.affiliate_api_idempotency.findUnique({ where: { credentialId_idempotencyKey: { credentialId: auth.credential.id, idempotencyKey } } });
  if (prior) {
    if (prior.requestHash !== requestHash) return response('IDEMPOTENCY_CONFLICT', 'This idempotency key was already used with a different payload.', 409);
    return new NextResponse(prior.responseBody, { status: prior.responseStatus, headers: { 'content-type': 'application/json', 'idempotent-replayed': 'true' } });
  }

  const { customer, shipment, externalReference } = parsed.data;
  const existingExternalReference = await prisma.shipping_request_attributions.findUnique({
    where: { affiliateId_sourceType_sourceReference: { affiliateId: auth.credential.affiliateId, sourceType: 'PARTNER_API', sourceReference: externalReference } },
    select: { pidShippingOnly: true },
  });
  if (existingExternalReference) return response('EXTERNAL_REFERENCE_CONFLICT', 'This external reference already belongs to another shipping request.', 409, { requestId: existingExternalReference.pidShippingOnly });
  const normalizedEmail = customer.email.toLowerCase();
  const country = await prisma.country.findFirst({
    where: { countryName: { equals: shipment.destinationCountry }, shippingPlans: { some: { pidShippingPlan: shipment.shippingPlanId } } },
    include: { shippingPlans: { where: { pidShippingPlan: shipment.shippingPlanId }, take: 1 } },
  });
  const plan = country?.shippingPlans[0];
  if (!country || !plan) return response('INVALID_REQUEST', 'The shipping plan is not available for the selected destination.', 400);
  const billingUnit = measurementUnitForNewOrder(country.countryName || shipment.destinationCountry, plan.shippingPlanName || '');
  const estimatedQuantity = shipment.estimatedQuantity ?? (billingUnit === 'KG' ? shipment.estimatedWeightKg : undefined);
  if (!estimatedQuantity) return response('INVALID_REQUEST', `estimatedQuantity is required for plans billed per ${billingUnit}.`, 400);
  const estimatedMeasure = `${estimatedQuantity} ${billingUnit}`;

    const user = await prisma.users.upsert({ where: { userEmail: normalizedEmail }, update: {}, create: { pidUser: `USR${Date.now()}${randomBytes(5).toString('hex').toUpperCase()}`, userFirstname: customer.firstName, userLastname: customer.lastName, userEmail: normalizedEmail, userPhone: customer.phone, phone: customer.phone, userCountry: country.countryName, country: country.countryName, userStatus: 'active', xStatus: 'active', createdAt: new Date(), updatedAt: new Date() } });
    const { created, body } = await prisma.$transaction(async (tx) => {
      const concurrent = await tx.affiliate_api_idempotency.findUnique({ where: { credentialId_idempotencyKey: { credentialId: auth.credential.id, idempotencyKey } } });
      if (concurrent) {
        if (concurrent.requestHash !== requestHash) throw new Error('IDEMPOTENCY_CONFLICT');
        return { created: null, body: concurrent.responseBody };
      }
      const shipping = await createShippingRequestInTransaction(tx, {
        pidUser: user.pidUser, whatsappNumber: customer.phone, shippingName: shipment.shippingName,
        shippingTo: country.countryName || shipment.destinationCountry, grossWeight: estimatedMeasure,
        trackingNumber: shipment.trackingNumber, shippingPlan: plan.pidShippingPlan,
        expectedShipments: shipment.expectedShipments || shipment.description, description: shipment.description,
        wantProductVerification: shipment.wantProductVerification, wantConsolidation: shipment.wantConsolidation,
        multipleSuppliers: shipment.multipleSuppliers,
        owner: { affiliateId: auth.credential.affiliateId, apiCredentialId: auth.credential.id, sourceType: 'PARTNER_API', sourceReference: externalReference },
      });
      const responseBody = JSON.stringify({ requestId: shipping.shippingRequest.pidShippingOnly, externalReference, status: shipping.shippingRequest.status, customerId: user.pidUser, ownership: { attributionId: shipping.attribution?.pidAttribution, lockedAt: shipping.attribution?.lockedAt.toISOString(), source: 'PARTNER_API' } });
      await tx.affiliate_api_idempotency.create({ data: { credentialId: auth.credential.id, idempotencyKey, requestHash, responseStatus: 201, responseBody, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
      return { created: shipping, body: responseBody };
    });
    if (!created) return new NextResponse(body, { status: 201, headers: { 'content-type': 'application/json', 'idempotent-replayed': 'true' } });
    after(() => sendAffiliateAccountNotification({
      affiliateId: auth.credential.affiliateId,
      eventKey: `shipping:owned:${created.attribution!.pidAttribution}`,
      eventType: 'SHIPPING_REQUEST_OWNED', subject: 'Your API created an owned shipping request', title: 'Shipping request accepted',
      message: 'Sure Imports accepted a shipping opportunity from your integration and permanently attributed this request to your affiliate account.',
      facts: [{ label: 'Request', value: created.shippingRequest.pidShippingOnly }, { label: 'Your reference', value: externalReference }, { label: 'Destination', value: country.countryName || shipment.destinationCountry }],
      actionLabel: 'Open developer workspace', actionPath: '/dashboard/developers',
    }).then(() => undefined));
    after(() => notifyNewShippingOnlyRequest({ pidShippingOnly: created.shippingRequest.pidShippingOnly, customerName: `${customer.firstName} ${customer.lastName}`.trim(), customerEmail: normalizedEmail, whatsappNumber: customer.phone, shippingName: shipment.shippingName, shippingTo: country.countryName || shipment.destinationCountry, shippingPlan: plan.pidShippingPlan, grossWeight: estimatedMeasure, trackingNumber: shipment.trackingNumber, expectedShipments: shipment.expectedShipments, description: shipment.description }).then(() => undefined).catch((error) => console.error('partner shipping request notification failed', error)));
    return new NextResponse(body, { status: 201, headers: { 'content-type': 'application/json' } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const replay = await prisma.affiliate_api_idempotency.findUnique({ where: { credentialId_idempotencyKey: { credentialId: auth.credential.id, idempotencyKey } } });
      if (replay && replay.requestHash === requestHash) return new NextResponse(replay.responseBody, { status: replay.responseStatus, headers: { 'content-type': 'application/json', 'idempotent-replayed': 'true' } });
    }
    if (error instanceof Error && error.message === 'IDEMPOTENCY_CONFLICT') return response('IDEMPOTENCY_CONFLICT', 'This idempotency key was already used with a different payload.', 409);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return response('EXTERNAL_REFERENCE_CONFLICT', 'This external reference or idempotency key is already in use.', 409);
    console.error('partner shipping request failed', error);
    return response('INTERNAL_ERROR', 'The shipping request could not be completed safely.', 500);
  }
}
