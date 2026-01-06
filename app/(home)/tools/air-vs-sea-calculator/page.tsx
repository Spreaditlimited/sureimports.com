'use client';

import { useMemo, useState } from 'react';

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function AirVsSeaCalculator() {
  const [kg, setKg] = useState('');
  const [cbm, setCbm] = useState('');
  const [airRate, setAirRate] = useState('10'); // user can change
  const [seaRate, setSeaRate] = useState('350'); // user can change
  const [urgent, setUrgent] = useState<'yes' | 'no'>('no');

  const w = toNumber(kg);
  const v = toNumber(cbm);
  const air = toNumber(airRate);
  const sea = toNumber(seaRate);

  const canCalc = Boolean(
    w !== null && v !== null && air !== null && sea !== null,
  );

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

    const airCost = (air as number) * (w as number);
    const seaCost = (sea as number) * (v as number);

    const diff = Math.abs(airCost - seaCost);
    const cheaper =
      airCost < seaCost ? 'air' : airCost > seaCost ? 'sea' : 'equal';

    // Break-even: where airCost == seaCost
    // airRate * kg == seaRate * cbm
    // kg == (seaRate/airRate) * cbm
    // cbm == (airRate/seaRate) * kg
    const kgAtGivenCbm = ((sea as number) / (air as number)) * (v as number);
    const cbmAtGivenKg = ((air as number) / (sea as number)) * (w as number);

    // Recommendation logic (simple + practical)
    let recommendation = '';
    if (cheaper === 'equal')
      recommendation = 'Air and Sea are the same cost based on your inputs.';
    if (cheaper === 'air') {
      recommendation =
        urgent === 'yes'
          ? 'Air is cheaper and also faster. Air makes sense for this shipment.'
          : 'Air is cheaper based on cost. If you are not shipping very bulky cartons, air can make sense.';
    }
    if (cheaper === 'sea') {
      recommendation =
        urgent === 'yes'
          ? 'Sea is cheaper, but you marked this shipment as urgent. If delivery time matters, consider paying extra for air.'
          : 'Sea is cheaper. For bulky shipments, sea usually makes more financial sense.';
    }

    // “Close call” threshold (within 10%)
    const minCost = Math.min(airCost, seaCost);
    const closeCall = minCost > 0 ? diff / minCost <= 0.1 : false;

    return {
      airCost,
      seaCost,
      diff,
      cheaper,
      recommendation,
      closeCall,
      kgAtGivenCbm,
      cbmAtGivenKg,
    };
  }, [canCalc, air, sea, w, v, urgent]);

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
        .label {
          font-weight: 900;
          font-size: 13px;
          opacity: 0.85;
          margin-bottom: 6px;
        }
        .pillRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pill {
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(7, 11, 20, 0.35);
          color: rgba(255, 255, 255, 0.92);
          border-radius: 999px;
          padding: 10px 12px;
          cursor: pointer;
          font-weight: 900;
          font-size: 13px;
        }
        .pillActive {
          background: linear-gradient(
            90deg,
            rgba(37, 99, 235, 0.9),
            rgba(168, 85, 247, 0.9)
          );
          border-color: rgba(255, 255, 255, 0.18);
          color: #fff;
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
        Air vs Sea Shipping Cost Calculator
      </h1>
      <p
        style={{
          margin: '0 0 22px',
          opacity: 0.85,
          lineHeight: 1.7,
          maxWidth: 860,
        }}
      >
        Enter your shipment weight and volume plus your current rates. This tool
        compares estimated air and sea shipping costs and shows which option
        makes more financial sense.
      </p>

      <section className="card">
        <div className="twoCol">
          <div>
            <div className="label">Total Weight (kg)</div>
            <input
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 120"
              style={inputStyle}
            />
          </div>

          <div>
            <div className="label">Total Volume (CBM)</div>
            <input
              value={cbm}
              onChange={(e) => setCbm(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 1.8"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="twoCol">
          <div>
            <div className="label">Air Rate (USD per kg)</div>
            <input
              value={airRate}
              onChange={(e) => setAirRate(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 10"
              style={inputStyle}
            />
          </div>

          <div>
            <div className="label">Sea Rate (USD per CBM)</div>
            <input
              value={seaRate}
              onChange={(e) => setSeaRate(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 350"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <div className="label">Is this shipment urgent?</div>
          <div className="pillRow">
            <button
              type="button"
              className={`pill ${urgent === 'no' ? 'pillActive' : ''}`}
              onClick={() => setUrgent('no')}
            >
              No, I can wait
            </button>
            <button
              type="button"
              className={`pill ${urgent === 'yes' ? 'pillActive' : ''}`}
              onClick={() => setUrgent('yes')}
            >
              Yes, I need it fast
            </button>
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
              Enter weight, CBM, and both rates to compare air vs sea.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8, lineHeight: 1.75 }}>
              <div>
                <b>Air cost:</b> ${nf2.format(result.airCost)}
              </div>
              <div>
                <b>Sea cost:</b> ${nf2.format(result.seaCost)}
              </div>
              <div
                style={{
                  paddingTop: 8,
                  borderTop: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <b>Difference:</b> ${nf2.format(result.diff)}{' '}
                {result.cheaper === 'equal'
                  ? ''
                  : `(${result.cheaper.toUpperCase()} is cheaper)`}
              </div>

              {result.closeCall && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(255,255,255,0.04)',
                    opacity: 0.9,
                  }}
                >
                  <b>Close call:</b> Costs are within ~10%. Delivery time and
                  risk may matter more than price here.
                </div>
              )}

              <div
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(7,11,20,0.35)',
                  opacity: 0.92,
                }}
              >
                <b>Recommendation:</b> {result.recommendation}
              </div>

              <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.6 }}>
                <b>Break-even intuition:</b> At your rates, sea becomes cheaper
                as CBM grows. For your current CBM ({v}), air equals sea at
                about <b>{nf2.format(result.kgAtGivenCbm)}</b> kg. And for your
                current kg ({w}), air equals sea at about{' '}
                <b>{nf2.format(result.cbmAtGivenKg)}</b> CBM.
              </div>

              <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.6 }}>
                Need to calculate CBM or volumetric weight first? Use{' '}
                <a
                  href="/tools/cbm-volumetric-weight-calculator"
                  style={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 900,
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  CBM & Volumetric Weight Calculator
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
          When Should You Ship by Air vs Sea?
        </h2>

        <p style={{ margin: '0 0 12px', opacity: 0.86, lineHeight: 1.75 }}>
          The best shipping method depends on two things: how bulky your cartons
          are and how fast you need delivery. Air freight is usually priced by
          chargeable weight (kg), while sea freight is often priced by volume
          (CBM). That is why a shipment that looks “light” can still be
          expensive by air if it is bulky, and why a shipment can be affordable
          by sea once the volume becomes large enough.
        </p>

        <p style={{ margin: '0 0 12px', opacity: 0.86, lineHeight: 1.75 }}>
          This calculator helps you compare both options using your own rates.
          If the difference is small, then delivery time, damage risk, and
          cashflow can matter more than price. If the difference is large, the
          cheaper method is usually the smarter decision unless you have a
          strict deadline.
        </p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '14px 0 8px' }}>
          Quick rules of thumb
        </h3>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            opacity: 0.86,
            lineHeight: 1.75,
          }}
        >
          <li>If the shipment is urgent, air may be worth the premium.</li>
          <li>
            If the cartons are bulky and you can wait, sea usually wins on cost.
          </li>
          <li>
            If costs are within 10%, choose based on speed and reliability.
          </li>
        </ul>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '14px 0 8px' }}>
          Air vs Sea FAQ
        </h3>

        <div style={{ display: 'grid', gap: 10 }}>
          {[
            {
              q: 'Why is air shipping more expensive for bulky items?',
              a: 'Air freight often charges by chargeable weight. If your carton is large, the volumetric weight can be higher than the actual weight, so you pay more even when it feels “light.”',
            },
            {
              q: 'Why is sea shipping often cheaper for large shipments?',
              a: 'Sea shipping is commonly priced by CBM. Once your total volume increases, sea becomes more cost efficient than paying per kg by air.',
            },
            {
              q: 'What should I use as my inputs?',
              a: 'Use your total shipment weight in kg and your total volume in CBM. Then enter the current rates you are being quoted (air per kg and sea per CBM).',
            },
            {
              q: 'If the calculator says sea is cheaper, should I always choose sea?',
              a: 'Not always. If you need the goods urgently or the shipment is small and time sensitive, air may still be the right move.',
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
          Need CBM or chargeable weight first? Use the{' '}
          <a
            href="/tools/cbm-volumetric-weight-calculator"
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 900,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            CBM & Volumetric Weight Calculator
          </a>
          .
        </p>
      </section>
    </main>
  );
}
