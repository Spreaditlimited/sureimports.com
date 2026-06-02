function isLocalhostRequest(request?: Request): boolean {
  const hostHeader = request?.headers.get('host')?.toLowerCase();
  const host = hostHeader?.startsWith('[::1]')
    ? '::1'
    : hostHeader?.split(':')[0];
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

export async function verifyRecaptchaToken(
  token: string | undefined | null,
  request?: Request,
  expectedAction?: string,
): Promise<boolean> {
  const secret = process.env.GOOGLE_CAPTCHA_SECRET_KEY;

  if (isLocalhostRequest(request)) return true;

  // If not configured, keep behavior unchanged.
  if (!secret) return true;

  if (!token) return false;

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
      },
    );

    if (!response.ok) return false;

    const payload = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    };

    if (!payload.success) {
      console.error('reCAPTCHA verification rejected:', {
        errorCodes: payload['error-codes'] || [],
      });
      return false;
    }

    if (expectedAction && payload.action !== expectedAction) return false;

    if (expectedAction && typeof payload.score !== 'number') return false;

    if (typeof payload.score === 'number' && payload.score < 0.5) return false;

    return true;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}
