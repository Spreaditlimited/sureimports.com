import { customerIdentity } from '@/lib/support/server';
import { guestIdentity, createGuest, guestContact } from '@/lib/support/guest';
import { publicSupportRequest } from '@/lib/support/public-http';
export async function GET(request: Request) {
  return publicSupportRequest(request, async () => ({
    signedIn: Boolean(await customerIdentity()),
    hasGuest: Boolean(await guestIdentity()),
    guestContact: await guestContact(),
  }));
}
export async function POST(request: Request) {
  return publicSupportRequest(request, async () => {
    const customer = await customerIdentity();
    if (!customer) await createGuest();
    return {
      signedIn: Boolean(customer),
      hasGuest: Boolean(await guestIdentity()),
      guestContact: customer ? null : await guestContact(),
    };
  });
}
