export type PartnerGate = {
  status: string;
  country: string;
  settlementCurrency: string;
  approvedAt: Date | null;
  bankVerifiedAt: Date | null;
  paystackSubaccountCode: string | null;
  liveCollectionEnabled: boolean;
  settlementPolicy: string;
};

/** Standard settlement explicitly authorised; not escrow or a delivery hold. */
const supportedSettlementPolicies: ReadonlySet<string> = new Set(['PAYSTACK_AUTO_SPLIT']);

export function partnerCollectionBlockReason(
  partner: PartnerGate,
): string | null {
  if (partner.country !== 'NG' || partner.settlementCurrency !== 'NGN')
    return 'NIGERIA_ONLY';
  if (partner.status !== 'ACTIVE' || !partner.approvedAt)
    return 'PARTNER_NOT_APPROVED';
  if (!partner.bankVerifiedAt || !partner.paystackSubaccountCode)
    return 'BANK_NOT_VERIFIED';
  if (!partner.liveCollectionEnabled) return 'COLLECTION_DISABLED';
  if (!supportedSettlementPolicies.has(partner.settlementPolicy))
    return 'SETTLEMENT_POLICY_UNCONFIRMED';
  return null;
}

/** Domain names are stored lowercase without ports, paths or trailing dots. */
export function normalizePartnerHostname(value: string): string | null {
  const host = value.trim().toLowerCase().replace(/\.$/, '');
  if (host.length > 191 || !host.includes('.')) return null;
  const labels = host.split('.');
  if (
    labels.some(
      (label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label),
    )
  )
    return null;
  if (labels.every((label) => /^\d+$/.test(label))) return null;
  return host;
}
