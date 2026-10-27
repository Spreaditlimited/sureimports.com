let pending: Promise<void> | undefined;

/** Load checkout only after a customer chooses this payment method. */
export function loadFlutterwave(): Promise<void> {
  if (typeof window.FlutterwaveCheckout === 'function')
    return Promise.resolve();
  if (pending) return pending;
  pending = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    const timeout = window.setTimeout(() => fail(), 15000);
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      pending = undefined;
      reject(
        new Error(
          'Unable to load checkout. Please check your connection and try again.',
        ),
      );
    };
    script.onerror = fail;
    script.onload = () => {
      window.clearTimeout(timeout);
      if (typeof window.FlutterwaveCheckout === 'function') resolve();
      else fail();
    };
    document.head.appendChild(script);
  });
  return pending;
}
