import { currentUser } from '@/lib/auth/current-user';
export async function bankSession(request: Request) {
  if (
    request.headers.get('origin') !== new URL(request.url).origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  )
    return null;
  return currentUser();
}
export function bankResponse(message: string, status: string, code = 400) {
  return Response.json(
    { responsex: { message, status }, successx: code === 200 },
    { status: code },
  );
}
export function submittedBank(form: FormData) {
  const bankCode = String(form.get('bank_code') || '').trim(),
    accountNumber = String(form.get('bank_account_number') || '').trim();
  if (!/^\d{3,10}$/.test(bankCode) || !/^\d{10}$/.test(accountNumber))
    throw new Error('Enter a valid bank and ten-digit account number.');
  return { bankCode, accountNumber };
}
