// Old clients must use the authenticated email-code and Paystack validation flow.
export async function POST() {
  return Response.json(
    {
      responsex: {
        status: 'VERIFICATION_REQUIRED',
        message:
          'Update your bank details through Profile → Bank Details and complete email verification.',
      },
      successx: false,
    },
    { status: 410 },
  );
}
