import { normalizeNigerianPhone } from '@/lib/wallet/phone';

type WalletCustomer = {
  userEmail: string | null;
  userFirstname?: string | null;
  userLastname?: string | null;
  phone?: string | null;
  userPhone?: string | null;
};

type ProvisioningResult =
  | { status: 'READY'; created: boolean }
  | {
      status: 'PROFILE_REQUIRED' | 'FAILED';
      message: string;
      actionHref?: string;
      actionLabel?: string;
    };

type PaystackCustomer = {
  customer_code?: string;
  dedicated_accounts?: unknown[];
};

const paystackHeaders = (secretKey: string) => ({
  Authorization: `Bearer ${secretKey}`,
  'Content-Type': 'application/json',
});

async function getPaystackCustomer(email: string, secretKey: string) {
  const response = await fetch(
    `https://api.paystack.co/customer/${encodeURIComponent(email)}`,
    {
      headers: paystackHeaders(secretKey),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    },
  );
  const body = await response.json();

  return {
    ok: response.ok && body?.status === true,
    missing: response.status === 404,
    customer: (body?.data || null) as PaystackCustomer | null,
    message: String(body?.message || ''),
  };
}

export async function ensurePaystackWalletAccount(
  user: WalletCustomer,
): Promise<ProvisioningResult> {
  const email = String(user.userEmail || '')
    .trim()
    .toLowerCase();
  const firstName = String(user.userFirstname || '').trim();
  const lastName = String(user.userLastname || '').trim() || firstName;
  const phone =
    normalizeNigerianPhone(user.phone) ||
    normalizeNigerianPhone(user.userPhone);

  if (!phone) {
    return {
      status: 'PROFILE_REQUIRED',
      message:
        'Add a valid Nigerian phone number to your profile before activating your wallet.',
      actionHref: '/dashboard/profile-update',
      actionLabel: 'Update Profile',
    };
  }

  if (!email || !firstName) {
    return {
      status: 'PROFILE_REQUIRED',
      message:
        'Complete your name, email, and Nigerian phone number in your profile before activating your wallet.',
      actionHref: '/dashboard/profile-update',
      actionLabel: 'Update Profile',
    };
  }

  const secretKey =
    process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY ||
    process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return {
      status: 'FAILED',
      message:
        'Wallet activation is temporarily unavailable. Please try again or contact support.',
    };
  }

  try {
    let lookup = await getPaystackCustomer(email, secretKey);
    if (
      lookup.ok &&
      Array.isArray(lookup.customer?.dedicated_accounts) &&
      lookup.customer.dedicated_accounts.length > 0
    ) {
      return { status: 'READY', created: false };
    }

    if (!lookup.ok && !lookup.missing) {
      throw new Error('Customer lookup unavailable');
    }

    let customerCode = lookup.ok ? lookup.customer?.customer_code : undefined;

    if (!customerCode) {
      const createResponse = await fetch('https://api.paystack.co/customer', {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        headers: paystackHeaders(secretKey),
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
        }),
      });
      const createBody = await createResponse.json();
      customerCode = createBody?.data?.customer_code;

      if (!createResponse.ok || !customerCode) {
        // A concurrent request may have created the customer already.
        lookup = await getPaystackCustomer(email, secretKey);
        customerCode = lookup.ok ? lookup.customer?.customer_code : undefined;
      }
    }

    if (!customerCode) {
      return {
        status: 'FAILED',
        message:
          'We could not create your wallet right now. Please try again or contact support.',
      };
    }

    // Refresh existing customers too: their saved phone/name may predate verification.
    const updateResponse = await fetch(
      `https://api.paystack.co/customer/${encodeURIComponent(customerCode)}`,
      {
        method: 'PUT',
        signal: AbortSignal.timeout(15000),
        headers: paystackHeaders(secretKey),
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
        }),
      },
    );
    const updateBody = await updateResponse.json();
    if (!updateResponse.ok || updateBody?.status !== true) {
      throw new Error('Customer update failed');
    }

    const accountResponse = await fetch(
      'https://api.paystack.co/dedicated_account',
      {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        headers: paystackHeaders(secretKey),
        body: JSON.stringify({
          customer: customerCode,
          preferred_bank: 'wema-bank',
        }),
      },
    );
    const accountBody = await accountResponse.json();

    if (
      accountResponse.ok &&
      accountBody?.status === true &&
      accountBody?.data?.account_number
    ) {
      return { status: 'READY', created: true };
    }

    // Treat an account created by a concurrent request as success.
    lookup = await getPaystackCustomer(email, secretKey);
    if (
      lookup.ok &&
      Array.isArray(lookup.customer?.dedicated_accounts) &&
      lookup.customer.dedicated_accounts.length > 0
    ) {
      return { status: 'READY', created: false };
    }

    return {
      status: 'FAILED',
      message:
        'We could not activate your wallet right now. Please try again or contact support.',
    };
  } catch {
    return {
      status: 'FAILED',
      message:
        'Wallet activation is temporarily unavailable. Please try again or contact support.',
    };
  }
}
