export function getWhatsAppHref(value?: string | null) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}
