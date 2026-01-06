'use client';

import { useMemo, useState } from 'react';

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function floorInt(n: number) {
  return Math.floor(n);
}

export default function CartonOptimizationTool() {
  // Product dimensions (cm)
  const [pL, setPL] = useState('');
  const [pW, setPW] = useState('');
  const [pH, setPH] = useState('');

  // Carton inner dimensions (cm)
  const [cL, setCL] = useState('');
  const [cW, setCW] = useState('');
  const [cH, setCH] = useState('');

  // Quantity
  const [qty, setQty] = useState('1');

  // Optional packing efficiency (accounts for padding/voids)
  const [eff, setEff] = useState('90'); // percent

  const productDims = [toNumber(pL), toNumber(pW), toNumber(pH)];
  const cartonDims = [toNumber(cL), toNumber(cW), toNumber(cH)];
  const q = toNumber(qty);
  const e = toNumber(eff);

  const canCalc =
    productDims.every((x) => x !== null) &&
    cartonDims.every((x) => x !== null) &&
    q !== null &&
    e !== null &&
    e! > 0 &&
    e! <= 100;

  const nf2 = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

  const result = useMemo(() => {
    if (!canCalc) return null;

    const [PL, PW, PH] = productDims as number[];
    const [CL, CW, CH] = cartonDims as number[];
    const Q = q as number;
    const efficiency = (e as number) / 100;

    // Try all 6 orientations of the product in the carton
    const orientations: [number, number, number][] = [
      [PL, PW, PH],
      [PL, PH, PW],
      [PW, PL, PH],
      [PW, PH, PL],
      [PH, PL, PW],
      [PH, PW, PL],
    ];

    let best = {
      perCarton: 0,
      unitsL: 0,
      unitsW: 0,
      unitsH: 0,
      usedVol: 0,
      cartonVol: 0,
      wastePct: 100,
      orientation: orientations[0],
    };

    const cartonVolCm3 = CL * CW * CH;

    for (const [a, b, c] of orientations) {
      const unitsL = floorInt(CL / a);
      const unitsW = floorInt(CW / b);
      const unitsH = floorInt(CH / c);
      const perCartonRaw = unitsL * unitsW * unitsH;

      if (perCartonRaw <= 0) continue;

      const productVolCm3 = a * b * c;
      const usedVol = perCartonRaw * productVolCm3;

      // Apply packing efficiency (padding/voids reduce usable volume)
      const effectiveUsedVol = usedVol / efficiency;

      const wastePct = Math.max(
        0,
        Math.min(100, ((cartonVolCm3 - usedVol) / cartonVolCm3) * 100),
      );

      // Choose best by most units per carton, then lowest waste
      if (
        perCartonRaw > best.perCarton ||
        (perCartonRaw === best.perCarton && wastePct < best.wastePct)
      ) {
        best = {
          perCarton: perCartonRaw,
          unitsL,
          unitsW,
          unitsH,
          usedVol,
          cartonVol: cartonVolCm3,
          wastePct,
          orientation: [a, b, c],
        };
      }
    }

    if (best.perCarton <= 0) return { fits: false as const };

    const cartonsNeeded = Math.ceil((q as number) / best.perCarton);

    // Total CBM (based on carton OUTER dims — here we assume inner ~ outer for estimation)
    // Convert cm to meters: (cm/100)
    const cartonCbm = (CL / 100) * (CW / 100) * (CH / 100);
    const totalCbm = cartonCbm * cartonsNeeded;

    // Units packed (last carton may be partial)
    const packedCapacity = cartonsNeeded * best.perCarton;

    return {
      fits: true as const,
      perCarton: best.perCarton,
      cartonsNeeded,
      packedCapacity,
      cartonCbm,
      totalCbm,
      wastePct: best.wastePct,
      layout: `${best.unitsL} × ${best.unitsW} × ${best.unitsH}`,
      orientation: best.orientation,
    };
  }, [canCalc, productDims, cartonDims, q, e]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 14px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(7,11,20,0.55)',
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 13,
    opacity: 0.85,
    marginBottom: 6,
  };

  return (
    <main
      style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: '36px 16px 64px',
        color: 'rgba(255,255,255,0.92)',
      }}
    >
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
        .card {
          display: grid;
          gap: 16px;
          border-radius: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.45);
        }
        .twoCol {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 720px) {
          .twoCol {
            grid-template-columns: 1fr 1fr;
          }
        }
        .threeCol {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 720px) {
          .threeCol {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>

      <h1
        style={{
          fontSize: 34,
          fontWeight: 900,
          margin: '0 0 10px',
          letterSpacing: '-0.02em',
        }}
      >
        Carton Optimization Tool
      </h1>
      <p
        style={{
          margin: '0 0 22px',
          opacity: 0.85,
          lineHeight: 1.7,
          maxWidth: 860,
        }}
      >
        Estimate how many units fit per carton (based on dimensions), cartons
        needed, total CBM, and wasted space. Use this to adjust carton size and
        reduce shipping costs.
      </p>

      <section className="card">
        <div>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>
            Product size (cm)
          </div>
          <div className="threeCol">
            <div>
              <div style={labelStyle}>Length (cm)</div>
              <input
                value={pL}
                onChange={(e) => setPL(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 20"
                style={inputStyle}
              />
            </div>
            <div>
              <div style={labelStyle}>Width (cm)</div>
              <input
                value={pW}
                onChange={(e) => setPW(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 10"
                style={inputStyle}
              />
            </div>
            <div>
              <div style={labelStyle}>Height (cm)</div>
              <input
                value={pH}
                onChange={(e) => setPH(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 5"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>
            Carton inner size (cm)
          </div>
          <div className="threeCol">
            <div>
              <div style={labelStyle}>Length (cm)</div>
              <input
                value={cL}
                onChange={(e) => setCL(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 60"
                style={inputStyle}
              />
            </div>
            <div>
              <div style={labelStyle}>Width (cm)</div>
              <input
                value={cW}
                onChange={(e) => setCW(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 40"
                style={inputStyle}
              />
            </div>
            <div>
              <div style={labelStyle}>Height (cm)</div>
              <input
                value={cH}
                onChange={(e) => setCH(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 30"
                style={inputStyle}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              opacity: 0.78,
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            Use inner dimensions if you have them. If you only know outer
            dimensions, this still works as a planning estimate.
          </div>
        </div>

        <div className="twoCol">
          <div>
            <div style={labelStyle}>Quantity (units)</div>
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 500"
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>Packing efficiency (%)</div>
            <input
              value={eff}
              onChange={(e) => setEff(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 90"
              style={inputStyle}
            />
            <div
              style={{
                fontSize: 13,
                opacity: 0.78,
                marginTop: 8,
                lineHeight: 1.6,
              }}
            >
              This accounts for padding, voids, imperfect stacking, and carton
              strength. 85–95% is realistic for many products.
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
          }}
          aria-live="polite"
        >
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Result</div>

          {!result ? (
            <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
              Enter product dimensions, carton dimensions, quantity and
              efficiency to see results.
            </div>
          ) : !result.fits ? (
            <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.6 }}>
              Your product does not fit inside the carton using any orientation.
              Increase carton dimensions or reduce product packing.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8, lineHeight: 1.75 }}>
              <div>
                <b>Units per carton:</b> {result.perCarton} ({result.layout})
              </div>
              <div>
                <b>Cartons needed:</b> {result.cartonsNeeded}
              </div>
              <div>
                <b>Total carton capacity:</b> {result.packedCapacity} units
              </div>

              <div
                style={{
                  paddingTop: 8,
                  borderTop: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <b>Carton CBM (each):</b> {nf2.format(result.cartonCbm)} m³
              </div>
              <div>
                <b>Total CBM (all cartons):</b> {nf2.format(result.totalCbm)} m³
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(7,11,20,0.35)',
                  opacity: 0.92,
                }}
              >
                <b>Wasted space estimate:</b> {nf2.format(result.wastePct)}%
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.82,
                    marginTop: 6,
                    lineHeight: 1.6,
                  }}
                >
                  Lower wasted space usually means lower shipping cost and fewer
                  damages from movement inside cartons.
                </div>
              </div>

              <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.6 }}>
                Want to price shipping next? Use{' '}
                <a
                  href="/tools/landed-cost-estimator"
                  style={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 900,
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Landed Cost Estimator
                </a>{' '}
                or{' '}
                <a
                  href="/tools/air-vs-sea-calculator"
                  style={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 900,
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Air vs Sea Calculator
                </a>
                .
              </div>
            </div>
          )}
        </div>
      </section>
      <section
        style={{
          marginTop: 18,
          padding: 20,
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.04)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.25)',
          color: 'rgba(255,255,255,0.92)',
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 10px' }}>
          Why Carton Optimization Matters When Shipping
        </h2>

        <p style={{ margin: '0 0 12px', opacity: 0.86, lineHeight: 1.75 }}>
          Carton optimization is the process of fitting as many units as
          possible into a carton without damaging the product. Poor carton
          planning leads to wasted space, higher CBM, and unnecessary shipping
          costs. Even small improvements in packing efficiency can significantly
          reduce your total freight bill.
        </p>

        <p style={{ margin: '0 0 12px', opacity: 0.86, lineHeight: 1.75 }}>
          Shipping companies charge based on volume or chargeable weight. That
          means empty space inside cartons still costs money. Optimizing your
          carton size helps you reduce CBM, lower shipping costs, and minimize
          product movement that can cause damage during transit.
        </p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '14px 0 8px' }}>
          How This Carton Optimization Tool Works
        </h3>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            opacity: 0.86,
            lineHeight: 1.75,
          }}
        >
          <li>It tests multiple product orientations inside the carton.</li>
          <li>It calculates how many units fit per carton.</li>
          <li>It estimates total cartons needed and total CBM.</li>
          <li>It shows an estimated wasted space percentage.</li>
        </ul>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '14px 0 8px' }}>
          Carton Optimization FAQ
        </h3>

        <div style={{ display: 'grid', gap: 10 }}>
          {[
            {
              q: 'Why does wasted space increase shipping cost?',
              a: 'Shipping is priced by volume or chargeable weight. Empty space inside cartons still counts toward CBM, which increases the amount you pay.',
            },
            {
              q: 'Should I use inner or outer carton dimensions?',
              a: 'Inner carton dimensions are more accurate. If you only know outer dimensions, the calculator still works as a planning estimate.',
            },
            {
              q: 'What is packing efficiency?',
              a: 'Packing efficiency accounts for padding, carton strength, and imperfect stacking. Most products fall between 85% and 95% efficiency.',
            },
            {
              q: 'Can carton optimization really reduce shipping cost?',
              a: 'Yes. Reducing CBM by even a small amount can save money, especially for sea freight or large shipments.',
            },
          ].map((item) => (
            <div
              key={item.q}
              style={{
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 16,
                background: 'rgba(7,11,20,0.35)',
                padding: 14,
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{item.q}</div>
              <div style={{ opacity: 0.86, lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>

        <p style={{ margin: '14px 0 0', opacity: 0.86, lineHeight: 1.75 }}>
          After optimizing cartons, calculate your shipping and selling price
          using the{' '}
          <a
            href="/tools/landed-cost-estimator"
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 900,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Landed Cost Estimator
          </a>{' '}
          or compare shipping options with the{' '}
          <a
            href="/tools/air-vs-sea-calculator"
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 900,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Air vs Sea Calculator
          </a>
          .
        </p>
      </section>
    </main>
  );
}
