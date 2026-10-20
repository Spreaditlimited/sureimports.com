import { customerIdentity } from '@/lib/support/server';
import { claimGuest } from '@/lib/support/guest';
import { publicSupportRequest } from '@/lib/support/public-http';
import { SupportError } from '@/lib/support/policy';
export async function POST(request: Request) {
  return publicSupportRequest(request, async () => {
    const identity = await customerIdentity();
    if (!identity) throw new SupportError(403, 'Sign in first.');
    await claimGuest(identity.actor.id);
    return { ok: true };
  });
}
