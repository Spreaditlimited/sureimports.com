export type VehicleRequestDraft = {
  paymentOption?: 'FULL' | 'PAY_SMALL_SMALL';
  modelSlug: string;
  variantId: string;
  quantity: number;
  requestKey: string;
  customerName: string;
  phone: string;
  notes: string;
  whatsappConsent: boolean;
};

export function readVehicleDraft(
  raw: string | null,
): VehicleRequestDraft | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      !value ||
      typeof value !== 'object' ||
      ![
        'modelSlug',
        'variantId',
        'requestKey',
        'customerName',
        'phone',
        'notes',
      ].every((key) => typeof value[key] === 'string') ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.modelSlug) ||
      !value.variantId ||
      value.variantId.length > 100 ||
      !value.requestKey ||
      value.requestKey.length > 36 ||
      !Number.isInteger(value.quantity) ||
      value.quantity < 1 ||
      value.quantity > 100 ||
      (value.paymentOption !== undefined &&
        !['FULL', 'PAY_SMALL_SMALL'].includes(value.paymentOption)) ||
      typeof value.whatsappConsent !== 'boolean'
    )
      return null;
    return value;
  } catch {
    return null;
  }
}
