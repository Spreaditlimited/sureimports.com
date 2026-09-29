'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, SlidersHorizontal, X } from 'lucide-react';
import VehiclePicker from '@/components/vehicles/VehiclePicker';
import type { PublicVehicle } from '@/lib/vehicles/data';
import { cbm, naira } from '@/lib/vehicles/policy';

export default function VehicleComparison({
  models,
  open,
  onClose,
  onRemove,
}: {
  models: PublicVehicle[];
  open: boolean;
  onClose: () => void;
  onRemove: (slug: string) => void;
}) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [differences, setDifferences] = useState(false);
  useEffect(() => {
    if (!dialog) return;
    if (!open) {
      dialog.close();
      return;
    }
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, dialog]);
  const selected = models.map((model) => ({
    model,
    variant:
      model.variants.find((variant) => variant.id === choices[model.slug]) ||
      model.variants[0],
  }));
  const rows = [
    {
      label: 'Vehicle type',
      values: selected.map(({ model }) => model.category),
    },
    {
      label: 'Powertrain',
      values: selected.map(({ model }) => model.powertrain),
    },
    {
      label: 'Battery capacity',
      values: selected.map(({ variant: v }) =>
        v.batteryKwh ? `${v.batteryKwh} kWh` : 'To be confirmed',
      ),
    },
    {
      label: 'Driving range¹',
      values: selected.map(({ variant: v }) =>
        v.rangeKm
          ? `${v.rangeKm} km${v.rangeStandard ? ` · ${v.rangeStandard}` : ' · supplier stated'}`
          : 'To be confirmed',
      ),
    },
    {
      label: 'Seats',
      values: selected.map(({ variant: v }) =>
        v.seats ? String(v.seats) : 'To be confirmed',
      ),
    },
    {
      label: 'Cargo capacity',
      values: selected.map(({ variant: v }) =>
        v.cargoM3 ? `${v.cargoM3} m³` : 'To be confirmed',
      ),
    },
    {
      label: 'Dimensions (L × W × H)',
      values: selected.map(({ variant: v }) =>
        v.lengthMm && v.widthMm && v.heightMm
          ? `${v.lengthMm.toLocaleString()} × ${v.widthMm.toLocaleString()} × ${v.heightMm.toLocaleString()} mm`
          : 'To be confirmed',
      ),
    },
    {
      label: 'Shipping volume',
      values: selected.map(({ variant: v }) =>
        cbm(v) ? `${cbm(v)!.toFixed(2)} CBM` : 'To be confirmed',
      ),
    },
  ];
  const visibleRows = rows.filter(
    (row) => !differences || models.length < 2 || new Set(row.values).size > 1,
  );
  return (
    <dialog
      ref={setDialog}
      className="vehicle-comparison"
      aria-labelledby="vehicle-comparison-title"
      aria-describedby="vehicle-comparison-description"
      onCancel={onClose}
      onClose={onClose}
    >
      <header className="vc-header">
        <div>
          <p className="vc-eyebrow">
            YOUR SHORTLIST · {models.length} OF 3 VEHICLES
          </p>
          <h2 id="vehicle-comparison-title">Find your right fit.</h2>
          <p id="vehicle-comparison-description">
            Compare configurations, capabilities and the cost of bringing them
            home.
          </p>
        </div>
        <button
          type="button"
          className="vc-close"
          autoFocus
          aria-label="Close comparison"
          onClick={onClose}
        >
          <X size={22} />
        </button>
      </header>
      <div className="vc-toolbar">
        <span>
          <SlidersHorizontal size={16} /> Choose a configuration for each model
        </span>
        <label>
          <input
            type="checkbox"
            checked={differences}
            onChange={(event) => setDifferences(event.target.checked)}
            disabled={models.length < 2}
          />{' '}
          Show differences only
        </label>
      </div>
      <p className="vc-mobile-hint">
        Swipe across to compare vehicles side by side →
      </p>
      <div
        className="vc-scroll"
        role="region"
        aria-label="Vehicle comparison table"
        tabIndex={0}
      >
        <table className="vc-table">
          <caption className="sr-only">
            Prices and specifications for your chosen vehicle configurations
          </caption>
          <colgroup>
            <col className="vc-label-column" />
            {selected.map(({ model }) => (
              <col key={model.slug} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="vc-intro">
                <span>
                  The details
                  <br />
                  that matter.
                </span>
                <p>One configuration per model. All prices are per vehicle.</p>
                <button type="button" onClick={onClose}>
                  Edit your shortlist <ArrowUpRight size={15} />
                </button>
              </th>
              {selected.map(({ model, variant }) => (
                <th scope="col" key={model.slug}>
                  <div className="vc-model-image">
                    {model.images[0] && (
                      <Image
                        src={model.images[0]}
                        alt={model.name}
                        fill
                        sizes="(max-width: 800px) 240px, 320px"
                      />
                    )}
                    <button
                      type="button"
                      aria-label={`Remove ${model.name} from comparison`}
                      onClick={() => onRemove(model.slug)}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <p className="vc-model-category">{model.category}</p>
                  <h3>{model.name}</h3>
                  <VehiclePicker
                    label={`Configuration for ${model.name}`}
                    value={variant.id}
                    onValueChange={(value) =>
                      setChoices((current) => ({
                        ...current,
                        [model.slug]: value,
                      }))
                    }
                    options={model.variants.map((v) => ({
                      value: v.id,
                      label: v.name,
                    }))}
                    portalContainer={dialog}
                  />
                  <Link
                    className="vc-explore"
                    href={`/cars/models/${model.slug}?configuration=${encodeURIComponent(variant.id)}`}
                  >
                    Explore vehicle <ArrowUpRight size={16} />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="vc-section">
              <th scope="row">Your investment</th>
              {selected.map(({ model }) => (
                <td key={model.slug} />
              ))}
            </tr>
            <tr className="vc-total">
              <th scope="row">
                Estimated landed price
                <small>Vehicle + inclusive shipping</small>
              </th>
              {selected.map(({ model, variant }) => (
                <td key={model.slug}>
                  <strong>
                    {variant.price
                      ? naira(variant.price.totalNgn)
                      : variant.indicativePrice?.landedMinNgn != null
                        ? `${naira(variant.indicativePrice.landedMinNgn)} – ${naira(variant.indicativePrice.landedMaxNgn!)}`
                        : 'Price on request'}
                  </strong>
                  <small>
                    {variant.price
                      ? 'Estimated total in Nigeria'
                      : variant.indicativePrice
                        ? 'Indicative range · exact trim price pending'
                        : 'Request a confirmed quotation'}
                  </small>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Vehicle price</th>
              {selected.map(({ model, variant }) => (
                <td key={model.slug}>
                  {variant.price
                    ? naira(variant.price.vehicleNgn)
                    : variant.indicativePrice
                      ? `${naira(variant.indicativePrice.minNgn)} – ${naira(variant.indicativePrice.maxNgn)}`
                      : 'To be confirmed'}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">
                Estimated shipping
                <small>Clearing, duties & taxes included</small>
              </th>
              {selected.map(({ model, variant }) => (
                <td key={model.slug}>
                  {variant.price
                    ? naira(variant.price.shippingNgn)
                    : variant.indicativePrice?.shippingNgn != null
                      ? naira(variant.indicativePrice.shippingNgn)
                      : 'To be confirmed'}
                </td>
              ))}
            </tr>
            <tr className="vc-section">
              <th scope="row">Specifications</th>
              {selected.map(({ model }) => (
                <td key={model.slug} />
              ))}
            </tr>
            {visibleRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, i) => (
                  <td key={selected[i].model.slug}>{value}</td>
                ))}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={selected.length + 1} className="vc-identical">
                  These configurations share the same listed specifications.
                  Turn off “Show differences only” to see them all.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="vc-footer">
        <p>
          <Check size={16} /> Shipping estimates include clearing, duties and
          taxes.
        </p>
        <span>
          ¹ Range figures are manufacturer stated. Actual range varies with
          load, driving and conditions. Availability, specifications and final
          pricing are confirmed in your quotation.
        </span>
      </footer>
    </dialog>
  );
}
