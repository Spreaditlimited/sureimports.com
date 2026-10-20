'use client';

import DeviceProductShippingNote from '@/components/DeviceProductShippingNote';
import { usesDeviceFlatFee } from '@/lib/procurement/deviceShipping';
import {
  goodsCategories,
  isShippingPlanAllowed,
  requiresSpecialHandling,
  shippingEligibilityMessage,
} from '@/lib/procurement/shippingEligibility';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Link2,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import styles from './PublicOrderFlow.module.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  PENDING_PROCUREMENT_CHECKOUT_KEY,
  POST_AUTH_REDIRECT_KEY,
  PROCUREMENT_RESUME_CHECKOUT_PATH,
} from '@/lib/auth/loginRedirect';
import { buildFacebookLeadMeta } from '@/lib/marketing/facebookLeadMeta';
import { createBrowserDraftId } from '@/lib/procurement/browserDraftId';
import {
  emptyProduct,
  inspectProductLink,
  productProblem,
  PUBLIC_DRAFT_KEY,
  publicDraftSchema,
  shops,
  type PublicDraft,
  type ProductDraft,
} from '@/lib/procurement/publicDraft';

type Country = {
  pidCountry: string;
  countryName: string;
  deviceRates?: { phoneNgn: number; laptopNgn: number } | null;
  shippingPlans: {
    pidShippingPlan: string;
    shippingPlanName: string;
    shippingPlanUnit?: string;
    shippingPlanRate?: number | string | null;
    shippingPlanCurrency?: string;
  }[];
};
function shippingRateLabel(plan: Country['shippingPlans'][number]) {
  const rate = Number(plan.shippingPlanRate);
  const currency = plan.shippingPlanCurrency;
  const unit = plan.shippingPlanUnit?.toUpperCase();
  if (
    !Number.isFinite(rate) ||
    rate <= 0 ||
    !currency ||
    !['KG', 'CBM'].includes(unit || '')
  )
    return 'Rate unavailable';
  return `${currency} ${rate.toLocaleString('en-GB', { maximumFractionDigits: 4 })} / ${unit === 'CBM' ? 'CBM' : 'kg'}`;
}
const shippingMethodGuide: Record<
  string,
  { label: string; description: string }
> = {
  NORMAL_SHIPPING: {
    label: 'Normal',
    description:
      'Cargo air shipping for products without batteries or liquids.',
  },
  EXPRESS_SHIPPING: {
    label: 'Express',
    description: 'For phones, laptops and urgent products.',
  },
  SPECIAL_SHIPPING: {
    label: 'Special',
    description:
      'Cargo air shipping for products containing batteries or liquids.',
  },
  SEA_SHIPPING: { label: 'Sea', description: 'For bulk and heavy cargo.' },
};
const initial: PublicDraft = {
  version: 1,
  draftId: '',
  shop: '',
  currency: 'CNY',
  destinationCountry: '',
  shippingPlan: '',
  orderCategory: 'Other Goods',
  products: [],
  current: emptyProduct(),
};
const panel = styles.panel;
const selectClass =
  'mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-800';

export default function PublicOrderFlow() {
  const router = useRouter();
  const [draft, setDraft] = useState<PublicDraft>(initial);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const sending = useRef(false);
  const editor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PUBLIC_DRAFT_KEY);
      const parsed = raw ? publicDraftSchema.safeParse(JSON.parse(raw)) : null;
      if (parsed?.success) setDraft(parsed.data);
      else setDraft({ ...initial, draftId: createBrowserDraftId() });
      if (raw && !parsed?.success)
        toast.error(
          'Your saved draft could not be read. Please check your products before continuing.',
        );
    } catch {
      setDraft({ ...initial, draftId: createBrowserDraftId() });
    }
    setReady(true);
    void fetch('/api/get-data/countries-shipping-plan')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setCountries)
      .catch(() => setLoadError(true));
    void fetch('/api/auth/me')
      .then((r) => setSignedIn(r.ok))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(PUBLIC_DRAFT_KEY, JSON.stringify(draft));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [draft, ready]);

  const country = countries.find(
    (c) => c.pidCountry === draft.destinationCountry,
  );
  const availablePlans =
    country?.shippingPlans.filter((p) =>
      isShippingPlanAllowed(draft.orderCategory, p.shippingPlanName),
    ) || [];
  const plan = availablePlans.find(
    (p) => p.pidShippingPlan === draft.shippingPlan,
  );
  const unit = plan?.shippingPlanUnit?.toUpperCase() === 'CBM' ? 'CBM' : 'kg';
  const current = draft.current;
  const flatFee = usesDeviceFlatFee(country?.countryName, current.productCategory);
  const link = inspectProductLink(current.productLink);
  const needsConfirmation = Boolean(
    current.productLink &&
      (!link.shop || (draft.shop !== 'other' && link.shop.id !== draft.shop)),
  );
  const total = draft.products.reduce(
    (sum, p) => sum + Number(p.productPrice) * Number(p.productQuantity),
    0,
  );
  const hasUnfinished = Boolean(
    current.productName ||
      current.productLink ||
      current.productPrice ||
      current.productWeight ||
      current.productInfo,
  );
  const updateCurrent = (patch: Partial<ProductDraft>) =>
    setDraft((d) => ({ ...d, current: { ...d.current, ...patch } }));

  function changeShop(shop: string, currency: 'CNY' | 'USD') {
    setDraft((d) => ({
      ...d,
      shop,
      currency,
      products: d.products.map((p) => ({
        ...p,
        review: true,
        linkConfirmed: false,
      })),
      current: { ...d.current, review: hasUnfinished, linkConfirmed: false },
    }));
  }
  function changeShipping(destinationCountry: string, shippingPlan: string) {
    setDraft((d) => ({
      ...d,
      destinationCountry,
      shippingPlan,
      products: d.products.map((p) => ({ ...p, measurementReview: true })),
      current: { ...d.current, measurementReview: hasUnfinished },
    }));
  }
  function addProduct() {
    if (!plan || !draft.shop) {
      toast.error(
        'Choose your destination, shipping method and website first.',
      );
      return;
    }
    const product = {
      ...current,
      currency: draft.currency,
      review: false,
      measurementReview: false,
    };
    const problem = productProblem(product, draft.shop, draft.currency, country?.countryName);
    if (problem) {
      toast.error(problem);
      return;
    }
    setDraft((d) => ({
      ...d,
      products: current.id
        ? d.products.map((p) => (p.id === current.id ? product : p))
        : [...d.products, { ...product, id: createBrowserDraftId() }],
      current: emptyProduct(),
    }));
    toast.success(
      current.id
        ? 'Product reviewed and updated.'
        : 'Product added. You can add another to the same order.',
    );
  }
  async function proceed(allowSeparateOrder = false) {
    if (sending.current) return;
    if (!plan || !draft.shop || !draft.products.length) {
      toast.error('Choose your shipping details and add at least one product.');
      return;
    }
    if (hasUnfinished) {
      toast.error('Save the product you are editing before continuing.');
      editor.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const problem = draft.products
      .map((p) => productProblem(p, draft.shop, draft.currency, country?.countryName))
      .find(Boolean);
    if (problem) {
      toast.error(problem);
      return;
    }
    const payload = {
      draftId: draft.draftId,
      shop: draft.shop,
      order: {
        destinationCountry: draft.destinationCountry,
        shippingPlan: draft.shippingPlan,
        currencyType: draft.currency,
        orderCategory: draft.orderCategory,
      },
      products: draft.products,
      allowSeparateOrder,
      ...buildFacebookLeadMeta(),
    };
    sending.current = true;
    setBusy(true);
    try {
      localStorage.setItem(
        PENDING_PROCUREMENT_CHECKOUT_KEY,
        JSON.stringify(payload),
      );
      localStorage.setItem(
        POST_AUTH_REDIRECT_KEY,
        PROCUREMENT_RESUME_CHECKOUT_PATH,
      );
      const auth = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!auth.ok) {
        router.push(
          `/auth/login?next=${encodeURIComponent(PROCUREMENT_RESUME_CHECKOUT_PATH)}`,
        );
        return;
      }
      const response = await fetch('/api/public/procurement/bootstrap-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.statusx === 'SUCCESS') {
        localStorage.removeItem(PUBLIC_DRAFT_KEY);
        localStorage.removeItem(PENDING_PROCUREMENT_CHECKOUT_KEY);
        localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
        router.push(data.redirectTo);
      } else if (data.statusx === 'EXISTING_SAVED_ORDERS') setDuplicate(true);
      else throw new Error(data.message || 'Unable to save your order.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to continue. Your draft is still here.',
      );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  if (!ready) return <p role="status">Loading your saved products…</p>;
  return (
    <div className={`si-public-form ${styles.flow}`}>
      <header className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>YOUR NEXT SHIPMENT STARTS HERE</span>
          <h2>Let’s build your order.</h2>
          <p>One order. All your product links. We’ll take it from there.</p>
        </div>
        <div
          className={`${styles.saveStatus} ${!saved ? styles.saveWarning : ''}`}
          role="status"
        >
          <ShieldCheck size={17} aria-hidden="true" />
          <span>
            {saved
              ? 'Draft saved on this browser'
              : 'Keep this page open — saving unavailable'}
          </span>
        </div>
      </header>
      <ol className={styles.steps} aria-label="Order steps">
        <li className={styles.activeStep}>
          <span>1</span>Choose shipping
        </li>
        <li>
          <span>2</span>Add your products
        </li>
        <li>
          <span>3</span>Sign in & finish
        </li>
      </ol>
      <section className={panel}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon}>
            <Globe2 size={22} aria-hidden="true" />
          </span>
          <div>
            <h3>Where are we shipping?</h3>
            <p>
              Choose your destination, delivery method and shopping website.
            </p>
          </div>
          <span className={styles.stepLabel}>STEP 01</span>
        </div>
        {loadError && (
          <p role="alert">
            Shipping options could not load. Please refresh to try again; your
            products are saved if browser saving is available.
          </p>
        )}
        <div className={styles.shippingFields}>
          <label>
            Destination country
            <select
              className={selectClass}
              value={draft.destinationCountry}
              onChange={(e) => changeShipping(e.target.value, '')}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.pidCountry} value={c.pidCountry}>
                  {c.countryName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Goods category
            <select
              className={selectClass}
              value={draft.orderCategory}
              onChange={(e) => {
                const orderCategory = e.target
                  .value as PublicDraft['orderCategory'];
                const compatible = isShippingPlanAllowed(
                  orderCategory,
                  plan?.shippingPlanName,
                );
                setDraft((d) => ({
                  ...d,
                  orderCategory,
                  shippingPlan: compatible ? d.shippingPlan : '',
                  products: compatible
                    ? d.products
                    : d.products.map((p) => ({
                        ...p,
                        measurementReview: true,
                      })),
                  current: compatible
                    ? d.current
                    : { ...d.current, measurementReview: hasUnfinished },
                }));
              }}
            >
              {goodsCategories.map((category) => (
                <option key={category} value={category}>
                  {category === 'Other Goods' ? 'Non Battery/liquid' : category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Shipping method
            <select
              className={selectClass}
              disabled={!country}
              aria-describedby={
                country?.shippingPlans.length
                  ? 'shipping-method-guide'
                  : undefined
              }
              value={draft.shippingPlan}
              onChange={(e) =>
                changeShipping(draft.destinationCountry, e.target.value)
              }
            >
              <option value="">
                {country ? 'Select shipping method' : 'Choose country first'}
              </option>
              {availablePlans.map((p) => (
                <option key={p.pidShippingPlan} value={p.pidShippingPlan}>
                  {shippingMethodGuide[p.shippingPlanName.trim().toUpperCase()]
                    ?.label ||
                    p.shippingPlanName.replaceAll('_', ' ').toLowerCase()}{' '}
                  · {shippingRateLabel(p)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Shopping website
            <select
              className={selectClass}
              value={draft.shop}
              onChange={(e) =>
                changeShop(
                  e.target.value,
                  (shops.find((s) => s.id === e.target.value)?.currency ||
                    draft.currency) as 'CNY' | 'USD',
                )
              }
            >
              <option value="">Select website</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {requiresSpecialHandling(draft.orderCategory) && (
          <p className="mt-3 text-sm text-slate-500">
            {shippingEligibilityMessage}
          </p>
        )}
        {country && availablePlans.length > 0 && (
          <div id="shipping-method-guide" className={styles.shippingGuide}>
            <p className={styles.shippingGuideTitle}>
              Shipping methods available for {country.countryName}
            </p>
            <dl>
              {availablePlans.map((shipping) => {
                const guide = shippingMethodGuide[
                  shipping.shippingPlanName.trim().toUpperCase()
                ] || {
                  label: shipping.shippingPlanName.replaceAll('_', ' '),
                  description: 'Available for this destination.',
                };
                return (
                  <div
                    key={shipping.pidShippingPlan}
                    className={
                      draft.shippingPlan === shipping.pidShippingPlan
                        ? styles.selectedShippingGuide
                        : undefined
                    }
                  >
                    <dt>
                      {guide.label}
                      {draft.shippingPlan === shipping.pidShippingPlan && (
                        <CheckCircle2 size={14} aria-label="Selected" />
                      )}
                    </dt>
                    <dd className={styles.shippingRate}>
                      {shippingRateLabel(shipping)}
                    </dd>
                    <dd>{guide.description}</dd>
                  </div>
                );
              })}
            </dl>
            <p className={styles.shippingRateNote}>
              Rates include freight, customs clearance and taxes. Product prices
              are separate. Your shipping estimate is calculated from the weight
              or volume before payment.
            </p>
          </div>
        )}
        {draft.shop === 'other' && (
          <label className="mt-4 block">
            Supplier’s quoted currency
            <select
              className={selectClass}
              value={draft.currency}
              onChange={(e) =>
                changeShop('other', e.target.value as 'CNY' | 'USD')
              }
            >
              <option value="CNY">RMB / Yuan (CNY)</option>
              <option value="USD">US dollars (USD)</option>
            </select>
          </label>
        )}
        {draft.shop && (
          <p className={styles.currencyNote}>
            <CheckCircle2 size={17} aria-hidden="true" /> Prices for this order
            are in{' '}
            <strong>
              {draft.currency === 'CNY'
                ? 'RMB / Yuan (CNY)'
                : 'US dollars (USD)'}
            </strong>
            . RMB and Yuan refer to China’s currency. 1688, Taobao and Chinese
            domestic shops generally quote in Yuan; Alibaba orders here use USD.
          </p>
        )}
        <p className={styles.currencyHelp}>
          Please keep products in this order in the same currency. Buying
          products priced in another currency? Simply create a separate order
          for those items.
        </p>
      </section>
      {draft.products.some((p) => p.review) && (
        <p role="alert" className="rounded-xl bg-amber-50 p-4 text-amber-950">
          You’ve changed the shopping website. Please review each product’s link
          and price to make sure they match your selection. Your products are
          still saved.
        </p>
      )}
      <div className={styles.workspace}>
        <section ref={editor} className={panel}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <PackagePlus size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>{current.id ? 'Review your product' : 'Add a product'}</h3>
              <p>Found something you like? Paste its link below.</p>
            </div>
            <span className={styles.stepLabel}>STEP 02</span>
          </div>
          <div className={styles.productForm}>
            <label className="block">
              <span className={styles.fieldTitle}>
                <Link2 size={15} aria-hidden="true" />
                Product link
              </span>
              <Input
                className="mt-2"
                value={current.productLink}
                placeholder="https://detail.1688.com/offer/…"
                onChange={(e) =>
                  updateCurrent({
                    productLink: e.target.value,
                    linkConfirmed: false,
                  })
                }
              />
            </label>
            {current.productLink && (
              <p className={styles.linkStatus} role="status">
                {link.shop
                  ? `Detected ${link.shop.name} · expected currency ${link.shop.currency}.`
                  : 'We cannot identify this website from the link. Paste the full product URL if this is a shortened link.'}{' '}
                Website detection does not verify a supplier’s quoted price.
              </p>
            )}
            {link.shop && link.shop.currency !== draft.currency && (
              <p role="alert" className="text-red-600">
                This link uses a different currency. Please use a separate
                order.
              </p>
            )}
            {needsConfirmation && (
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={current.linkConfirmed}
                  onChange={(e) =>
                    updateCurrent({ linkConfirmed: e.target.checked })
                  }
                />
                I have checked this link’s website and confirm the supplier’s
                price is in {draft.currency}.
              </label>
            )}
            <label className="block">
              Product name
              <Input
                className="mt-2"
                value={current.productName}
                onChange={(e) => updateCurrent({ productName: e.target.value })}
              />
            </label>
            {country?.deviceRates && (
              <p className="text-sm">
                Nigeria shipping: ₦
                {country.deviceRates.phoneNgn.toLocaleString()} per phone and ₦
                {country.deviceRates.laptopNgn.toLocaleString()} per laptop,
                instead of weight-based freight. Other goods use the selected
                shipping rate.
              </p>
            )}
            {country?.countryName.trim().toLowerCase() === 'nigeria' && (
              <label>
                Product type
                <select
                  className="mt-2 w-full px-4"
                  value={current.productCategory || 'OTHER'}
                  onChange={(e) =>
                    updateCurrent({
                      productCategory: e.target.value as
                        | 'OTHER'
                        | 'PHONE'
                        | 'LAPTOP',
                    })
                  }
                >
                  <option value="OTHER">
                    Other goods (including accessories)
                  </option>
                  <option value="PHONE">Phone</option>
                  <option value="LAPTOP">Laptop</option>
                </select>
              </label>
            )}
            <div className={styles.priceFields}>
              <label>
                Unit price ({draft.currency})
                <Input
                  className="mt-2"
                  type="number"
                  min="0.01"
                  step="any"
                  value={current.productPrice}
                  onChange={(e) =>
                    updateCurrent({
                      productPrice: e.target.value,
                      currency: draft.currency,
                    })
                  }
                />
              </label>
              <label>
                Quantity
                <Input
                  className="mt-2"
                  type="number"
                  min="1"
                  step="1"
                  value={current.productQuantity}
                  onChange={(e) =>
                    updateCurrent({ productQuantity: e.target.value })
                  }
                />
              </label>
              {!flatFee && <label>
                {unit === 'CBM'
                  ? 'Volume per item (CBM)'
                  : 'Weight per item (kg)'}
                <Input
                  className="mt-2"
                  disabled={!plan}
                  type="number"
                  min="0.0001"
                  step="any"
                  value={current.productWeight}
                  onChange={(e) =>
                    updateCurrent({ productWeight: e.target.value })
                  }
                />
              </label>}
            </div>
            {flatFee ? <DeviceProductShippingNote rates={country?.deviceRates || null} productType={current.productCategory} quantity={current.productQuantity} /> : <p className="text-xs text-slate-500">
              Enter the measurement for one item. Divide a whole shipment’s
              measurement by its quantity.{' '}
              {unit === 'CBM'
                ? 'Sea volume is measured in cubic metres (CBM), not kilograms.'
                : ''}
            </p>}
            <label className="block">
              Variants and notes (optional)
              <Textarea
                className="mt-2"
                value={current.productInfo}
                placeholder="Colour, size, model or other instructions"
                onChange={(e) => updateCurrent({ productInfo: e.target.value })}
              />
            </label>
            {(current.review || current.measurementReview) && (
              <p className="text-amber-700">
                The entered price was {current.currency || draft.currency}{' '}
                {current.productPrice || '—'}. Check the link, confirm or
                correct the price in {draft.currency}, and review the
                measurement in {unit}. Saving confirms these details for your
                current selections.
              </p>
            )}
            <Button className={styles.addButton} onClick={addProduct}>
              <Plus size={18} aria-hidden="true" />
              {current.id
                ? 'Confirm details and save product'
                : 'Add product to this order'}
            </Button>
            {current.id && (
              <Button
                variant="outline"
                onClick={() => updateCurrent(emptyProduct())}
              >
                Cancel editing
              </Button>
            )}
          </div>
        </section>
        <section className={`${panel} ${styles.summary}`}>
          <div className={styles.summaryHeading}>
            <span className={styles.summaryIcon}>
              <ShoppingBag size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>Products in this order</h3>
              <p>One shipment, everything together.</p>
            </div>
            <span className={styles.count}>{draft.products.length}</span>
          </div>
          {!draft.products.length && (
            <div className={styles.emptyState}>
              <span>
                <Package size={30} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h4>Your next find goes here</h4>
              <p>
                Add your first product, then keep adding.
                <br />
                They’ll all be part of this order.
              </p>
              <div className={styles.emptyHint}>
                <Plus size={14} aria-hidden="true" /> Start with a product link
              </div>
            </div>
          )}
          <ol className={styles.productList}>
            {draft.products.map((p, index) => (
              <li
                key={p.id}
                className={`${styles.productCard} ${p.review || p.measurementReview ? styles.needsReview : ''}`}
              >
                <div className={styles.productCardTop}>
                  <span className={styles.productNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.productIdentity}>
                    <strong>{p.productName}</strong>
                    <p title={p.productLink}>
                      <Link2 size={12} aria-hidden="true" />
                      {p.productLink}
                    </p>
                  </div>
                  {!p.review && !p.measurementReview && (
                    <CheckCircle2
                      size={17}
                      className={styles.productCheck}
                      aria-label="Product details complete"
                    />
                  )}
                </div>
                <div className={styles.productMetrics}>
                  <div>
                    <span>UNIT PRICE</span>
                    <strong>
                      {p.currency || draft.currency}{' '}
                      {Number(p.productPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>
                  <div>
                    <span>QUANTITY</span>
                    <strong>
                      {p.productQuantity} <small>items</small>
                    </strong>
                  </div>
                  <div>
                    <span>LINE TOTAL</span>
                    <strong>
                      {p.review
                        ? 'Review price'
                        : `${p.currency || draft.currency} ${(Number(p.productPrice) * Number(p.productQuantity)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </strong>
                  </div>
                </div>
                {p.review && (
                  <p className="text-sm text-amber-700">
                    Link and price need review
                  </p>
                )}
                {p.measurementReview && (
                  <p className="text-sm text-amber-700">
                    Shipping measurement needs review
                  </p>
                )}
                <div className={styles.cardActions}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (hasUnfinished) {
                        toast.error(
                          'Save or cancel your current product first.',
                        );
                        return;
                      }
                      updateCurrent(p);
                      editor.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Pencil size={14} aria-hidden="true" />
                    {p.review || p.measurementReview
                      ? 'Review product'
                      : 'Edit details'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        products: d.products.filter((item) => item.id !== p.id),
                        current:
                          d.current.id === p.id ? emptyProduct() : d.current,
                      }))
                    }
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ol>
          <Button
            variant="outline"
            className={styles.anotherButton}
            onClick={() => {
              editor.current?.scrollIntoView({ behavior: 'smooth' });
              editor.current?.querySelector('input')?.focus();
            }}
          >
            <Plus size={17} aria-hidden="true" /> Add another product
          </Button>
          {draft.products.length > 0 &&
            !draft.products.some((p) => p.review) && (
              <div className={styles.total}>
                <div>
                  <span>Estimated goods value</span>
                  <small>
                    {draft.products.length} product
                    {draft.products.length === 1 ? '' : 's'} in your order
                  </small>
                </div>
                <strong>
                  <small>{draft.currency}</small>{' '}
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            )}
          <p className={styles.feeNote}>
            Shipping and fees are calculated before payment.
          </p>
          <Button
            className={styles.checkoutButton}
            disabled={busy}
            onClick={() => void proceed()}
          >
            {busy
              ? 'Saving…'
              : signedIn
                ? 'Save order & continue'
                : 'Sign in to save your order'}
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
          <p className={styles.nextStep}>
            {!signedIn && 'New here? You can create an account next. '}Then add
            your delivery address and review your order.
          </p>
          <div className={styles.summaryFooter}>
            <ShieldCheck size={15} aria-hidden="true" /> Your products stay
            saved while you sign in
          </div>
          {duplicate && (
            <div role="alert" className="mt-5 space-y-3">
              <p>
                You already have a saved order. Your new products are safely
                kept here. You can save these as a separate order and review or
                merge compatible orders in your dashboard.
              </p>
              <Button disabled={busy} onClick={() => void proceed(true)}>
                Save these as a separate order
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push('/dashboard/procurement/view-orders/saved')
                }
              >
                Review saved orders
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
