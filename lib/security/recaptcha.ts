export async function verifyRecaptchaToken(
  token: string | undefined | null,
): Promise<boolean> {
  const secret = process.env.GOOGLE_CAPTCHA_SECRET_KEY;

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
    };

    if (!payload.success) return false;

    // Optional v3 score gate. If score is absent (v2), accept.
    if (typeof payload.score === 'number' && payload.score < 0.5) return false;

    return true;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}
