'use client';

import { useMemo, useState } from 'react';

type ShippingMode = 'both' | 'sea' | 'air';

function toNumber(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function clampPositive(n: number | null): number | null {
  if (n === null) return null;
  return n > 0 ? n : null;
}

export default function CbmVolumetricWeightCalculatorPage() {
  const [mode, setMode] = useState<ShippingMode>('both');

  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [actualWeightPerCartonKg, setActualWeightPerCartonKg] = useState('');

  const nf2 = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    [],
  );
  const nf4 = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 4,
        minimumFractionDigits: 4,
      }),
    [],
  );

  const inputs = useMemo(() => {
    return {
      L: clampPositive(toNumber(lengthCm)),
      W: clampPositive(toNumber(widthCm)),
      H: clampPositive(toNumber(heightCm)),
      Q: clampPositive(toNumber(quantity)),
      actualKg: clampPositive(toNumber(actualWeightPerCartonKg)),
    };
  }, [lengthCm, widthCm, heightCm, quantity, actualWeightPerCartonKg]);

  const canCalculate =
    inputs.L !== null &&
    inputs.W !== null &&
    inputs.H !== null &&
    inputs.Q !== null;

  const calculated = useMemo(() => {
    if (!canCalculate) return null;

    const L = inputs.L!;
    const W = inputs.W!;
    const H = inputs.H!;
    const Q = inputs.Q!;
    const actualKg = inputs.actualKg;

    // CBM (meters)
    const cbmPerCarton = (L / 100) * (W / 100) * (H / 100);
    const totalCbm = cbmPerCarton * Q;

    // Volumetric weight (cm) / 6000
    const volumetricKgPerCarton = (L * W * H) / 6000;
    const totalVolumetricKg = volumetricKgPerCarton * Q;

    const totalActualKg = actualKg !== null ? actualKg * Q : null;

    // Chargeable for air is max(actual, volumetric) when actual is provided
    const chargeableKg =
      totalActualKg !== null
        ? Math.max(totalActualKg, totalVolumetricKg)
        : totalVolumetricKg;

    return {
      cbmPerCarton,
      totalCbm,
      volumetricKgPerCarton,
      totalVolumetricKg,
      totalActualKg,
      chargeableKg,
    };
  }, [canCalculate, inputs]);

  function reset() {
    setMode('both');
    setLengthCm('');
    setWidthCm('');
    setHeightCm('');
    setQuantity('1');
    setActualWeightPerCartonKg('');
  }

  return (
    <main className="wrap">
      <style jsx>{`
        :global(body) {
          background: radial-gradient(
              1200px 700px at 30% 20%,
              rgba(99, 102, 241, 0.18),
              transparent 60%
            ),
            radial-gradient(
              900px 600px at 70% 35%,
              rgba(168, 85, 247, 0.16),
              transparent 55%
            ),
            linear-gradient(180deg, #0b1220 0%, #070b14 100%);
        }

        .wrap {
          max-width: 980px;
          margin: 0 auto;
          padding: 34px 16px 60px;
          color: rgba(255, 255, 255, 0.92);
        }

        .title {
          font-size: 34px;
          font-weight: 900;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }

        .sub {
          margin: 0 0 22px;
          opacity: 0.82;
          line-height: 1.6;
          font-size: 15px;
          max-width: 720px;
        }

        .card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
        }

        .modeRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .pill {
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.88);
          font-weight: 800;
          cursor: pointer;
          font-size: 14px;
        }

        .pillActive {
          border-color: rgba(255, 255, 255, 0.22);
          background: linear-gradient(
            90deg,
            rgba(37, 99, 235, 0.85),
            rgba(168, 85, 247, 0.85)
          );
          color: white;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 720px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .label {
          font-weight: 900;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.82);
        }

        .hint {
          font-size: 13px;
          opacity: 0.72;
          line-height: 1.45;
        }

        .input {
          padding: 12px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(7, 11, 20, 0.55);
          color: rgba(255, 255, 255, 0.92);
          font-size: 15px;
          outline: none;
        }

        .input::placeholder {
          color: rgba(255, 255, 255, 0.38);
        }

        .input:focus {
          border-color: rgba(168, 85, 247, 0.45);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.18);
        }

        .actions {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .btn {
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 900;
          cursor: pointer;
        }

        .btnPrimary {
          border-color: rgba(255, 255, 255, 0.22);
          background: linear-gradient(
            90deg,
            rgba(37, 99, 235, 0.9),
            rgba(168, 85, 247, 0.9)
          );
          color: white;
        }

        .results {
          margin-top: 16px;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
        }

        .resultsTitle {
          font-weight: 900;
          margin-bottom: 10px;
        }

        .resultGrid {
          display: grid;
          gap: 12px;
        }

        .resultBox {
          padding: 12px;
          border-radius: 16px;
          background: rgba(7, 11, 20, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .resultBoxTitle {
          font-weight: 900;
          margin-bottom: 6px;
        }

        .line {
          line-height: 1.8;
          font-size: 15px;
        }

        .meaning {
          font-size: 13px;
          opacity: 0.82;
          line-height: 1.55;
        }

        .divider {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .below {
          margin-top: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 22px;
        }

        .h2 {
          font-size: 20px;
          font-weight: 900;
          margin: 0 0 8px;
        }

        .p {
          margin: 0 0 12px;
          line-height: 1.75;
          opacity: 0.88;
          max-width: 820px;
        }

        .ul {
          margin: 0 0 12px 18px;
          padding: 0;
          line-height: 1.75;
          opacity: 0.9;
          max-width: 820px;
        }

        .faq {
          display: grid;
          gap: 10px;
          margin-top: 10px;
          max-width: 880px;
        }

        .qa {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
        }

        .q {
          font-weight: 900;
          margin: 0 0 6px;
        }

        .a {
          margin: 0;
          opacity: 0.88;
          line-height: 1.75;
        }

        .note {
          margin-top: 14px;
          font-size: 13px;
          opacity: 0.72;
          line-height: 1.6;
        }
      `}</style>

      <h1 className="title">CBM & Volumetric Weight Calculator</h1>
      <p className="sub">
        Use this tool to calculate CBM for sea freight and volumetric weight for
        air freight using carton dimensions. This helps you estimate space and
        chargeable weight before you buy from China.
      </p>

      <section className="card" aria-label="Calculator">
        <div className="modeRow" role="tablist" aria-label="Shipping mode">
          {[
            { key: 'both' as const, label: 'Sea + Air (Recommended)' },
            { key: 'sea' as const, label: 'Sea Only (CBM)' },
            { key: 'air' as const, label: 'Air Only (Volumetric)' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`pill ${mode === opt.key ? 'pillActive' : ''}`}
              onClick={() => setMode(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid">
          <div className="field">
            <label className="label">Length (cm)</label>
            <input
              className="input"
              inputMode="decimal"
              placeholder="e.g. 60"
              value={lengthCm}
              onChange={(e) => setLengthCm(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Width (cm)</label>
            <input
              className="input"
              inputMode="decimal"
              placeholder="e.g. 40"
              value={widthCm}
              onChange={(e) => setWidthCm(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Height (cm)</label>
            <input
              className="input"
              inputMode="decimal"
              placeholder="e.g. 35"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Quantity (cartons)</label>
            <input
              className="input"
              inputMode="numeric"
              placeholder="e.g. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {(mode === 'both' || mode === 'air') && (
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label className="label">
                Actual weight per carton (kg){' '}
                <span style={{ fontWeight: 700, opacity: 0.6 }}>
                  (optional)
                </span>
              </label>
              <input
                className="input"
                inputMode="decimal"
                placeholder="e.g. 18"
                value={actualWeightPerCartonKg}
                onChange={(e) => setActualWeightPerCartonKg(e.target.value)}
              />
              <div className="hint">
                Air freight chargeable weight is the higher of actual weight and
                volumetric weight.
              </div>
            </div>
          )}
        </div>

        <div className="actions">
          <button type="button" className="btn" onClick={reset}>
            Reset
          </button>
          <button
            type="button"
            className={`btn ${canCalculate ? 'btnPrimary' : ''}`}
            onClick={() => {
              const el = document.getElementById('results');
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            disabled={!canCalculate}
            aria-disabled={!canCalculate}
            style={{
              opacity: canCalculate ? 1 : 0.6,
              cursor: canCalculate ? 'pointer' : 'not-allowed',
            }}
          >
            View Results
          </button>
        </div>

        <div id="results" className="results" aria-live="polite">
          <div className="resultsTitle">Results</div>

          {!canCalculate || !calculated ? (
            <div className="meaning">
              Enter length, width, height, and quantity to see results.
            </div>
          ) : (
            <div className="resultGrid">
              {(mode === 'both' || mode === 'sea') && (
                <div className="resultBox">
                  <div className="resultBoxTitle">Sea freight (CBM)</div>
                  <div className="line">
                    <div>
                      <b>CBM per carton:</b>{' '}
                      {nf4.format(calculated.cbmPerCarton)} m³
                    </div>
                    <div>
                      <b>Total CBM:</b> {nf4.format(calculated.totalCbm)} m³ (
                      {inputs.Q} cartons)
                    </div>
                  </div>
                  <div className="meaning" style={{ marginTop: 8 }}>
                    CBM measures space. Sea freight is usually priced by CBM,
                    especially for bulky shipments.
                  </div>
                </div>
              )}

              {(mode === 'both' || mode === 'air') && (
                <div className="resultBox">
                  <div className="resultBoxTitle">
                    Air freight (Volumetric weight)
                  </div>
                  <div className="line">
                    <div>
                      <b>Volumetric weight per carton:</b>{' '}
                      {nf2.format(calculated.volumetricKgPerCarton)} kg
                    </div>
                    <div>
                      <b>Total volumetric weight:</b>{' '}
                      {nf2.format(calculated.totalVolumetricKg)} kg ({inputs.Q}{' '}
                      cartons)
                    </div>

                    {calculated.totalActualKg !== null && (
                      <div>
                        <b>Total actual weight:</b>{' '}
                        {nf2.format(calculated.totalActualKg)} kg
                      </div>
                    )}

                    <div className="divider">
                      <b>Chargeable weight:</b>{' '}
                      {nf2.format(calculated.chargeableKg)} kg
                      <div className="meaning" style={{ marginTop: 4 }}>
                        Airlines charge the higher of actual weight and
                        volumetric weight.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="meaning">
                <b>Quick meaning:</b> Your carton size determines space (CBM).
                For air freight, large cartons can be charged as heavier than
                they really are because the airline bills by space used.
              </div>
            </div>
          )}
        </div>

        <div className="note">
          Provided by Sure Imports for education. Results are estimates based on
          standard formulas, not a freight quote.
        </div>
      </section>

      {/* SEO content */}
      <section className="below" aria-label="How it works">
        <h2 className="h2">What is CBM?</h2>
        <p className="p">
          CBM means Cubic Meter. It tells you how much space your cartons
          occupy. Sea freight and container planning often depends on CBM,
          especially when the shipment is bulky.
        </p>
        <ul className="ul">
          <li>Convert your carton dimensions from cm to meters.</li>
          <li>Multiply length × width × height to get CBM per carton.</li>
          <li>Multiply by quantity to get total CBM.</li>
        </ul>

        <h2 className="h2">What is volumetric weight?</h2>
        <p className="p">
          Volumetric weight is how airlines convert space into weight for
          billing. If your cartons are big but not heavy, you can still be
          charged as if they were heavy because they take up space on the
          aircraft.
        </p>
        <p className="p">
          The standard formula used by many forwarders is: (L × W × H) ÷ 6000,
          where dimensions are in centimeters.
        </p>

        <h2 className="h2">Common mistakes importers make</h2>
        <ul className="ul">
          <li>Using product dimensions instead of carton dimensions.</li>
          <li>Forgetting to multiply by quantity.</li>
          <li>Assuming air freight is priced only by actual kg.</li>
          <li>Mixing inches with centimeters without converting.</li>
        </ul>

        <h2 className="h2">FAQs</h2>
        <div className="faq">
          <div className="qa">
            <p className="q">
              Why is my air freight chargeable weight higher than my actual
              weight?
            </p>
            <p className="a">
              Because airlines charge the higher of actual weight and volumetric
              weight. If your carton is large, the volumetric calculation can
              exceed your actual kg.
            </p>
          </div>

          <div className="qa">
            <p className="q">Is CBM the same as weight?</p>
            <p className="a">
              No. CBM is space. Weight is kg. A light but bulky carton can have
              low kg but high CBM, and it can be expensive to ship.
            </p>
          </div>

          <div className="qa">
            <p className="q">
              Should I use carton dimensions or product dimensions?
            </p>
            <p className="a">
              Use carton dimensions (the packaged box). Freight pricing is based
              on the shipped package, not the bare product.
            </p>
          </div>

          <div className="qa">
            <p className="q">
              Can this calculator give me exact shipping cost?
            </p>
            <p className="a">
              No. It gives you CBM and chargeable weight, which are the numbers
              you need before requesting a freight quote.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
