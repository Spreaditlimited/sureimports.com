'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ShieldCheck, Play } from 'lucide-react';
import type { PublicVehicle } from '@/lib/vehicles/data';
import { cbm, naira, youtubeId } from '@/lib/vehicles/policy';
import {
  PENDING_VEHICLE_REQUEST_KEY,
  POST_AUTH_REDIRECT_KEY,
  VEHICLE_RESUME_PATH,
} from '@/lib/auth/loginRedirect';
import { readVehicleDraft } from '@/lib/vehicles/requestDraft';
import { createVehicleRequestKey } from '@/lib/vehicles/requestKey';
import VehiclePicker from '@/components/vehicles/VehiclePicker';

export default function VehicleDetail({
  model,
  children,
}: {
  model: PublicVehicle;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [selected, setSelected] = useState(
    model.variants.some((v) => v.id === search.get('configuration'))
      ? search.get('configuration')!
      : model.variants[0].id,
  );
  const [photo, setPhoto] = useState(0);
  const [quantity, setQuantity] = useState(
    Math.max(1, Math.min(100, Math.trunc(Number(search.get('quantity')) || 1))),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [video, setVideo] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(() => createVehicleRequestKey());
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    try {
      const draft = readVehicleDraft(
        window.localStorage.getItem(PENDING_VEHICLE_REQUEST_KEY),
      );
      if (
        !draft ||
        draft.modelSlug !== model.slug ||
        !model.variants.some((v) => v.id === draft.variantId)
      )
        return;
      setSelected(draft.variantId);
      setQuantity(draft.quantity);
      setRequestKey(draft.requestKey);
      for (const name of ['customerName', 'phone', 'notes'] as const) {
        const field = formRef.current?.elements.namedItem(name) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;
        if (field) field.value = draft[name];
      }
      const consent = formRef.current?.elements.namedItem(
        'whatsappConsent',
      ) as HTMLInputElement | null;
      if (consent) consent.checked = draft.whatsappConsent;
    } catch {
      /* The public form remains usable if storage is unavailable. */
    }
  }, [model.slug, model.variants]);
  const v = model.variants.find((v) => v.id === selected)!;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const payload = {
        customerName: String(form.get('customerName') || ''),
        phone: String(form.get('phone') || ''),
        notes: String(form.get('notes') || ''),
        modelSlug: model.slug,
        variantId: selected,
        quantity,
        requestKey,
        whatsappConsent: form.get('whatsappConsent') === 'on',
      };
      const authenticate = () => {
        try {
          window.localStorage.setItem(
            PENDING_VEHICLE_REQUEST_KEY,
            JSON.stringify(payload),
          );
          window.localStorage.setItem(
            POST_AUTH_REDIRECT_KEY,
            VEHICLE_RESUME_PATH,
          );
        } catch {
          throw new Error(
            'Please enable browser storage so we can keep your request while you sign in.',
          );
        }
        router.push(
          `/auth/login?next=${encodeURIComponent(VEHICLE_RESUME_PATH)}`,
        );
      };
      const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
      if (authResponse.status === 401) {
        authenticate();
        return;
      }
      if (!authResponse.ok)
        throw new Error('We could not check your account. Please try again.');
      const r = await fetch('/api/vehicles/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.status === 401) {
        authenticate();
        return;
      }
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      try {
        window.localStorage.removeItem(PENDING_VEHICLE_REQUEST_KEY);
        if (
          window.localStorage.getItem(POST_AUTH_REDIRECT_KEY) ===
          VEHICLE_RESUME_PATH
        )
          window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
      } catch {
        /* The request has already been saved. */
      }
      router.push(`/dashboard/vehicles/${data.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="vehicle-detail">
      <Link className="vehicle-back" href="/cars">
        <ArrowLeft size={16} />
        Back to the range
      </Link>
      <div className="vehicle-detail-grid">
        <div>
          <div className="vehicle-detail-image">
            {model.images[photo] ? (
              <Image
                src={model.images[photo]}
                alt={`${model.name} view ${photo + 1}`}
                fill
                priority
                sizes="(max-width: 800px) 100vw, 60vw"
              />
            ) : (
              <div className="vehicle-image-placeholder">{model.name}</div>
            )}
          </div>
          <div className="vehicle-thumbnails">
            {model.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setPhoto(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={photo === i}
              >
                <Image src={src} alt="" width={100} height={75} />
              </button>
            ))}
          </div>
          <p className="vehicle-footnote">
            Photos show examples from the model range. Final configuration is
            confirmed in your quotation.
          </p>
        </div>
        <div className="vehicle-detail-intro">
          <p className="vehicle-eyebrow">
            {model.powertrain} / {model.category}
          </p>
          <h1>{model.name}</h1>
          <p>{model.description}</p>
          <VehiclePicker
            label="Choose your configuration"
            value={selected}
            onValueChange={setSelected}
            options={model.variants.map((variant) => ({
              value: variant.id,
              label: variant.name,
            }))}
          />
          <label className="vehicle-field">
            Number of vehicles
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(100, Number(e.target.value) || 1)),
                )
              }
            />
          </label>
          <div className="vehicle-price-box">
            {v.price ? (
              <>
                <small>
                  Estimated landed price · {quantity} vehicle
                  {quantity > 1 ? 's' : ''}
                </small>
                <h2>{naira(v.price.totalNgn * quantity)}</h2>
                <dl>
                  <div>
                    <dt>Vehicle price</dt>
                    <dd>{naira(v.price.vehicleNgn * quantity)}</dd>
                  </div>
                  <div>
                    <dt>Estimated shipping</dt>
                    <dd>{naira(v.price.shippingNgn * quantity)}</dd>
                  </div>
                </dl>
              </>
            ) : v.indicativePrice ? (
              <>
                <small>
                  Indicative{' '}
                  {v.indicativePrice.landedMinNgn !== null
                    ? 'landed'
                    : 'vehicle'}{' '}
                  price range · {quantity} vehicle{quantity > 1 ? 's' : ''}
                </small>
                <h2>
                  {naira(
                    (v.indicativePrice.landedMinNgn ??
                      v.indicativePrice.minNgn) * quantity,
                  )}{' '}
                  –{' '}
                  {naira(
                    (v.indicativePrice.landedMaxNgn ??
                      v.indicativePrice.maxNgn) * quantity,
                  )}
                </h2>
                <dl>
                  <div>
                    <dt>Vehicle price range</dt>
                    <dd>
                      {naira(v.indicativePrice.minNgn * quantity)} –{' '}
                      {naira(v.indicativePrice.maxNgn * quantity)}
                    </dd>
                  </div>
                  <div>
                    <dt>Estimated shipping</dt>
                    <dd>
                      {v.indicativePrice.shippingNgn !== null
                        ? naira(v.indicativePrice.shippingNgn * quantity)
                        : 'To be confirmed'}
                    </dd>
                  </div>
                </dl>
                <p>
                  Budget estimate across the supplier’s model range. We confirm
                  the model year, exact trim, battery, availability and final
                  price before issuing your quotation.
                </p>
                <p>{v.dimensionsNote}</p>
              </>
            ) : (
              <>
                <small>PRICING UPDATE IN PROGRESS</small>
                <h2>Let’s get your quotation.</h2>
                <p>
                  We’re confirming manufacturer pricing for this configuration.
                  Register your interest and we’ll follow up with a Naira
                  quotation.
                </p>
              </>
            )}
            <p className="vehicle-included">
              <ShieldCheck size={18} /> Shipping includes clearing, all duties
              and taxes.
            </p>
          </div>
          <Link className="vehicle-button" href="#enquire">
            {v.price ? 'Request this vehicle' : 'Request a quotation'}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <section className="vehicle-spec-section">
        <p className="vehicle-eyebrow">THE DETAILS THAT MATTER</p>
        <h2>{v.name}</h2>
        <dl className="vehicle-spec-grid">
          {[
            [
              'Battery',
              v.batteryKwh ? `${v.batteryKwh} kWh` : 'To be confirmed',
            ],
            [
              'Supplier-stated range',
              v.rangeKm
                ? `${v.rangeKm} km ${v.rangeStandard || ''}`
                : 'To be confirmed',
            ],
            ['Seats', v.seats ?? 'To be confirmed'],
            [
              'Exterior dimensions',
              v.lengthMm && v.widthMm && v.heightMm
                ? `${v.lengthMm} × ${v.widthMm} × ${v.heightMm} mm`
                : 'To be confirmed',
            ],
            [
              'Shipping volume',
              cbm(v) ? `${cbm(v)!.toFixed(3)} CBM` : 'To be confirmed',
            ],
            [
              'Cargo capacity',
              v.cargoM3 ? `${v.cargoM3} m³` : 'Confirm with quotation',
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="vehicle-footnote">
          Range is a supplier-stated figure, not a guaranteed real-world
          distance. Charging compatibility, equipment, warranty and support
          arrangements will be confirmed with your quotation.
        </p>
      </section>
      {children}
      {model.youtubeUrls.length > 0 && (
        <section className="vehicle-spec-section">
          <h2>See it in action</h2>
          {model.youtubeUrls.map((url) => {
            const id = youtubeId(url);
            return id ? (
              <div key={id} className="vehicle-video">
                {video === id ? (
                  <iframe
                    title={`${model.name} walkthrough`}
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    allowFullScreen
                  />
                ) : (
                  <button
                    className="vehicle-button"
                    onClick={() => setVideo(id)}
                  >
                    <Play size={18} />
                    Watch walkthrough
                  </button>
                )}
              </div>
            ) : null;
          })}
        </section>
      )}
      <section id="enquire" className="vehicle-enquiry">
        <div>
          <p className="vehicle-eyebrow">YOUR NEXT MOVE</p>
          <h2>
            Tell us where
            <br />
            you want to go.
          </h2>
          <p>
            One vehicle or a fleet. Your request goes directly to our team, and
            you can follow the response in your dashboard.
          </p>
        </div>
        <form ref={formRef} onSubmit={submit}>
          <label className="vehicle-field">
            Full name
            <input
              name="customerName"
              autoComplete="name"
              required
              maxLength={160}
            />
          </label>
          <label className="vehicle-field">
            Phone / WhatsApp number
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+234"
              required
              maxLength={40}
            />
          </label>
          <p className="vehicle-footnote">
            All vehicles arrive in Lagos. You arrange collection and any onward
            delivery from Lagos; last-mile delivery is not included.
          </p>
          <label className="vehicle-field">
            Anything else we should know?
            <textarea
              name="notes"
              maxLength={2000}
              placeholder="Business use, colour preference, delivery timing…"
            />
          </label>
          <label className="vehicle-check">
            <input name="whatsappConsent" type="checkbox" />
            Send me order updates on WhatsApp. Email updates are included.
          </label>
          {error && (
            <p role="alert" className="vehicle-error">
              {error}
            </p>
          )}
          <button className="vehicle-button" disabled={busy}>
            {busy
              ? 'Submitting…'
              : `Request ${quantity} vehicle${quantity > 1 ? 's' : ''}`}
            <ArrowUpRight size={18} />
          </button>
          <small>
            Complete your request, then sign in or create an account if needed.
            No payment is taken at this stage.
          </small>
        </form>
      </section>
    </main>
  );
}
