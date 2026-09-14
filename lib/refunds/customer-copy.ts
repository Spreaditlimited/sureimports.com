/** Customer-facing wording only. Never pass provider or database messages through here. */
export function refundProgressMessage(status: string, method: string) {
  if (status === 'SETTLED') return method === 'WALLET'
    ? 'Your refund has been added to your Sure Imports wallet.'
    : 'Your refund has been processed. Your bank or PayPal may need additional time to make it available.';
  if (status === 'PROCESSING') return 'Your refund is being processed. We will notify you when it is confirmed.';
  if (status === 'REQUESTED') return 'We have received your refund request and are reviewing it.';
  return 'Your refund needs a review. Please contact support with your refund reference for an update.';
}
