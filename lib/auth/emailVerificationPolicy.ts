export type EmailVerificationLinkStatus =
  | 'already_verified'
  | 'valid'
  | 'invalid';

export function getEmailVerificationLinkStatus(
  storedCid: string | null | undefined,
  linkCid: string,
): EmailVerificationLinkStatus {
  if (storedCid === 'VERIFIED') return 'already_verified';
  if (storedCid && linkCid && storedCid === linkCid) return 'valid';
  return 'invalid';
}
