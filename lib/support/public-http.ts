import 'server-only';
import { SupportError, trustedSupportMutation } from './policy';
export async function publicSupportRequest(
  request: Request,
  work: () => Promise<unknown>,
) {
  const headers = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };
  try {
    if (process.env.SUPPORT_CHAT_ENABLED !== 'true')
      throw new SupportError(404, 'Support is not available.');
    if (request.method !== 'GET' && !trustedSupportMutation(request))
      throw new SupportError(403, 'Please use the support page.');
    return Response.json(await work(), { headers });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof SupportError
            ? error.message
            : 'Support is temporarily unavailable. Please retry or use WhatsApp.',
      },
      { status: error instanceof SupportError ? error.status : 503, headers },
    );
  }
}
