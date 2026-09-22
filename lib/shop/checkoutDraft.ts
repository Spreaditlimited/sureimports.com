export const SHOP_CHECKOUT_RESUME = '/shop/checkout?resumeCheckout=1';
export const SHOP_CHECKOUT_DRAFT_KEY = 'sureimports:shopCheckoutDraft:v1';
export type ShopCheckoutDraft = {
  name: string;
  email: string;
  address: string;
};

export function readShopCheckoutDraft(): ShopCheckoutDraft | null {
  try {
    const raw = window.localStorage.getItem(SHOP_CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (
      value.version !== 1 ||
      !Number.isFinite(value.expiresAt) ||
      value.expiresAt < Date.now() ||
      typeof value.name !== 'string' ||
      typeof value.email !== 'string' ||
      typeof value.address !== 'string' ||
      value.name.length > 240 ||
      value.email.length > 254 ||
      value.address.length > 2000
    ) {
      clearShopCheckoutDraft();
      return null;
    }
    return { name: value.name, email: value.email, address: value.address };
  } catch {
    return null;
  }
}

export function saveShopCheckoutDraft(draft: ShopCheckoutDraft): boolean {
  try {
    window.localStorage.setItem(
      SHOP_CHECKOUT_DRAFT_KEY,
      JSON.stringify({
        ...draft,
        version: 1,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearShopCheckoutDraft() {
  try {
    window.localStorage.removeItem(SHOP_CHECKOUT_DRAFT_KEY);
  } catch {
    /* Storage may be unavailable. */
  }
}

export function splitShopContactName(name: string) {
  const [firstName = '', ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}
