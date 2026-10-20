export async function GET() {
  try {
    const response = await fetch('https://www.sureimports.com/api/admin-whatsapp', { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Contact service unavailable');
    const body = await response.json();
    return Response.json({ data: Array.isArray(body.data) ? body.data : [] });
  } catch {
    return Response.json({ data: [{ id: 'general', label: 'General enquiries', messageId: 'CUR7YKW3K3RBA1' }] });
  }
}
