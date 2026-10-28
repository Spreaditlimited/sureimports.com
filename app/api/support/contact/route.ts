import { ZodError } from 'zod';
import { saveGuestContact } from '@/lib/support/guest';
import { publicSupportRequest } from '@/lib/support/public-http';
import { SupportError } from '@/lib/support/policy';
export async function POST(request: Request) {
  return publicSupportRequest(request, async () => {
    try {
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))
        throw new SupportError(415, 'Send contact details as JSON.');
      const reader = request.body?.getReader();
      if (!reader) throw new SupportError(400, 'Enter your name and email address.');
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 2000) {
          await reader.cancel();
          throw new SupportError(413, 'Contact details are too long.');
        }
        chunks.push(value);
      }
      const raw = new TextDecoder('utf-8', { fatal: true }).decode(
        Buffer.concat(chunks),
      );
      return await saveGuestContact(JSON.parse(raw));
    } catch (error) {
      if (error instanceof ZodError || error instanceof SyntaxError || error instanceof TypeError)
        throw new SupportError(400, 'Enter your name and a valid email address.');
      throw error;
    }
  });
}
