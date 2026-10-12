// Consent is always re-read by the admin service from the shared database.
// A failed notification is retried by its five-minute reconciliation job.
export async function notifyMarketingConsentChange(email: string) {
  const secret = process.env.MARKETING_CONTACT_SYNC_SECRET;
  if (!secret) return;
  try {
    const response = await fetch('https://admin.sureimports.com/api/marketing/email/brevo/sync', {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    });
    if (!response.ok) console.error('Marketing consent sync pending reconciliation', { status: response.status });
  } catch {
    console.error('Marketing consent sync pending reconciliation');
  }
}
