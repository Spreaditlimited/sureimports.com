import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export const SUPPLIER_VERIFICATION_SETTINGS_KEY = 'supplier_verification';
export const SUPPLIER_VERIFICATION_TERMS_VERSION = '2026-09-02';
export const DEFAULT_SUPPLIER_VERIFICATION_FEE_NGN_KOBO = 40_000_000;
export const DEFAULT_SUPPLIER_VERIFICATION_FEE_USD_CENTS = 25_000;
export const DEFAULT_GUANGZHOU_OFFICE_ADDRESS_CHINESE =
  '广州市白云区机场路111号建发广场3FB3-1';
export const DEFAULT_GUANGZHOU_OFFICE_LATITUDE = 23.168905;
export const DEFAULT_GUANGZHOU_OFFICE_LONGITUDE = 113.259741;

export const VERIFICATION_TYPES = ['ONLINE', 'PHYSICAL'] as const;
export type VerificationType = (typeof VERIFICATION_TYPES)[number];
export const SUPPLIER_PAYMENT_PURPOSES = {
  VERIFICATION: 'VERIFICATION',
  PHYSICAL_VISIT: 'PHYSICAL_VISIT',
  LEGACY_COMBINED: 'LEGACY_COMBINED',
} as const;

export const CUSTOMER_VISIBLE_STATUSES = [
  'AWAITING_TRAVEL_QUOTE',
  'QUOTE_READY',
  'AWAITING_PAYMENT',
  'PAYMENT_PENDING',
  'PAID',
  'IN_REVIEW',
  'VISIT_SCHEDULED',
  'REPORT_READY',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
  'DISPUTED',
] as const;

export function supplierVerificationId(prefix: string) {
  return `${prefix}${Date.now().toString(36).toUpperCase()}${randomBytes(6).toString('hex').toUpperCase()}`;
}

export async function getSupplierVerificationSettings() {
  return prisma.supplier_verification_settings.upsert({
    where: { settingKey: SUPPLIER_VERIFICATION_SETTINGS_KEY },
    update: {},
    create: {
      settingKey: SUPPLIER_VERIFICATION_SETTINGS_KEY,
      feeNgnKobo: DEFAULT_SUPPLIER_VERIFICATION_FEE_NGN_KOBO,
      feeUsdCents: DEFAULT_SUPPLIER_VERIFICATION_FEE_USD_CENTS,
      officeAddressChinese: DEFAULT_GUANGZHOU_OFFICE_ADDRESS_CHINESE,
      officeLatitude: DEFAULT_GUANGZHOU_OFFICE_LATITUDE,
      officeLongitude: DEFAULT_GUANGZHOU_OFFICE_LONGITUDE,
    },
  });
}

export async function createSupplierVerificationEvent(input: {
  requestId: string;
  eventType: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  message?: string | null;
  visibility?: 'CUSTOMER' | 'INTERNAL';
  actorId?: string | null;
  actorEmail?: string | null;
}) {
  return prisma.supplier_verification_events.create({
    data: {
      pidEvent: supplierVerificationId('SVE'),
      requestId: input.requestId,
      eventType: input.eventType,
      fromStatus: input.fromStatus || null,
      toStatus: input.toStatus || null,
      message: input.message || null,
      visibility: input.visibility || 'CUSTOMER',
      actorId: input.actorId || null,
      actorEmail: input.actorEmail || null,
    },
  });
}

type AmapEstimate = {
  supplierLatitude: number;
  supplierLongitude: number;
  distanceMeters: number | null;
  durationSeconds: number | null;
  roundTripCnyFen: number | null;
};

export async function estimateSupplierTransport(
  supplierAddressChinese: string,
): Promise<AmapEstimate | null> {
  const key = process.env.AMAP_WEB_SERVICE_KEY?.trim();
  if (!key || !supplierAddressChinese.trim()) return null;
  const settings = await getSupplierVerificationSettings();
  if (settings.officeLatitude == null || settings.officeLongitude == null)
    return null;

  const geocodeUrl = new URL('https://restapi.amap.com/v3/geocode/geo');
  geocodeUrl.searchParams.set('key', key);
  geocodeUrl.searchParams.set('address', supplierAddressChinese.trim());
  geocodeUrl.searchParams.set('output', 'JSON');
  const geocodeResponse = await fetch(geocodeUrl, { cache: 'no-store' });
  const geocode = await geocodeResponse.json().catch(() => null);
  const location = String(geocode?.geocodes?.[0]?.location || '');
  const [longitude, latitude] = location.split(',').map(Number);
  if (
    !geocodeResponse.ok ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  )
    return null;

  const routeUrl = new URL('https://restapi.amap.com/v5/direction/driving');
  routeUrl.searchParams.set('key', key);
  routeUrl.searchParams.set(
    'origin',
    `${settings.officeLongitude},${settings.officeLatitude}`,
  );
  routeUrl.searchParams.set('destination', `${longitude},${latitude}`);
  routeUrl.searchParams.set('strategy', '32');
  routeUrl.searchParams.set('show_fields', 'cost');
  const routeResponse = await fetch(routeUrl, { cache: 'no-store' });
  const route = await routeResponse.json().catch(() => null);
  if (!routeResponse.ok || String(route?.status) !== '1') return null;
  const path = route?.route?.paths?.[0];
  const taxiCost = Number(route?.route?.taxi_cost);
  const distance = Number(path?.distance);
  const duration = Number(path?.cost?.duration || path?.duration);
  return {
    supplierLatitude: latitude,
    supplierLongitude: longitude,
    distanceMeters: Number.isFinite(distance) ? Math.round(distance) : null,
    durationSeconds: Number.isFinite(duration) ? Math.round(duration) : null,
    roundTripCnyFen: Number.isFinite(taxiCost)
      ? Math.round(taxiCost * 2 * 100)
      : null,
  };
}

export async function confirmSupplierVerificationPayment(input: {
  pidPayment: string;
  providerCaptureReference?: string | null;
  providerEventId?: string | null;
  paidAt?: Date | null;
}) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.supplier_verification_payments.findUnique({
      where: { pidPayment: input.pidPayment },
      include: { request: true },
    });
    if (!payment)
      throw new Error('Supplier Verification payment was not found.');
    if (payment.status === 'paid') return payment;
    const updatedPayment = await tx.supplier_verification_payments.update({
      where: { pidPayment: payment.pidPayment },
      data: {
        status: 'paid',
        providerCaptureReference:
          input.providerCaptureReference || payment.providerCaptureReference,
        providerEventId: input.providerEventId || payment.providerEventId,
        paidAt: input.paidAt || new Date(),
      },
    });
    const isPhysicalVisitPayment =
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.PHYSICAL_VISIT;
    const isLegacyCombined =
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.LEGACY_COMBINED;
    const nextStatus = isPhysicalVisitPayment ? payment.request.status : 'PAID';
    const nextTransportQuoteStatus = isPhysicalVisitPayment
      ? 'PAID'
      : isLegacyCombined && payment.request.verificationType === 'PHYSICAL'
        ? 'PAID'
        : payment.request.verificationType === 'PHYSICAL' &&
            payment.request.transportQuoteStatus ===
              'LOCKED_UNTIL_VERIFICATION_PAID'
          ? 'PENDING'
          : payment.request.transportQuoteStatus;
    await tx.verify_supplier.update({
      where: { pidVerifySupplier: payment.requestId },
      data: {
        status: nextStatus,
        transportQuoteStatus: nextTransportQuoteStatus,
        updatedAt: new Date(),
      },
    });
    const message = isPhysicalVisitPayment
      ? 'Physical-visit payment confirmed. Our China team can now schedule the visit.'
      : payment.request.verificationType === 'PHYSICAL' && !isLegacyCombined
        ? 'Standard verification payment confirmed. Online checks can begin, and our China team can now research the optional physical-visit cost.'
        : 'Standard verification payment confirmed. Your request is ready for review.';
    await tx.supplier_verification_events.create({
      data: {
        pidEvent: supplierVerificationId('SVE'),
        requestId: payment.requestId,
        eventType: isPhysicalVisitPayment
          ? 'PHYSICAL_VISIT_PAYMENT_CONFIRMED'
          : 'VERIFICATION_PAYMENT_CONFIRMED',
        fromStatus: payment.request.status,
        toStatus: nextStatus,
        message,
        visibility: 'CUSTOMER',
      },
    });
    return updatedPayment;
  });
}

export function publicVerificationRequest<T extends Record<string, any>>(
  request: T,
) {
  const {
    adminNotes: _adminNotes,
    assignedTo: _assignedTo,
    supplierLatitude,
    supplierLongitude,
    travelEstimateJson,
    payments,
    ...safeRequest
  } = request;
  const travel = travelEstimateJson as Record<string, any> | null;
  const selectedOption = Array.isArray(travel?.options)
    ? travel.options.find(
        (option: Record<string, any>) =>
          option.mode === travel?.recommendedMode,
      )
    : null;
  return {
    ...safeRequest,
    payments: Array.isArray(payments)
      ? payments.map((payment: Record<string, any>) => ({
          pidPayment: payment.pidPayment,
          paymentProvider: payment.paymentProvider,
          paymentPurpose: payment.paymentPurpose,
          amountMinor: payment.amountMinor,
          currency: payment.currency,
          status: payment.status,
          paidAt: payment.paidAt,
          createdAt: payment.createdAt,
        }))
      : [],
    travelEstimate:
      travel &&
      ['READY', 'PAID', 'DECLINED'].includes(
        String(request.transportQuoteStatus || ''),
      )
        ? {
            recommendedMode: travel.recommendedMode || null,
            roundTripDistanceKm: travel.roundTripDistanceKm || null,
            lodgingNights: selectedOption?.lodgingNights ?? null,
            estimatedTotalCny: selectedOption?.totalCny ?? null,
            pricingAsOf: travel.pricingAsOf || null,
          }
        : null,
  };
}
