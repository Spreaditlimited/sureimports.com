"use client";

import { useMemo, useState } from "react";

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function RetailPriceBuilder() {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

  // Inputs
  const [landedCost, setLandedCost] = useState(""); // per unit
  const [marketingCost, setMarketingCost] = useState("0"); // per unit
  const [desiredMarginPct, setDesiredMarginPct] = useState("30"); // %
  const [paymentFeesPct, setPaymentFeesPct] = useState("1.5"); // % e.g. Paystack + misc
  const [bufferPct, setBufferPct] = useState("3"); // % for surprises
  const [discountPct, setDiscountPct] = useState("10"); // promo discount %

  // Optional reseller setting
  const [resellerDiscountPct, setResellerDiscountPct] = useState("15"); // reseller buys cheaper

  const lc = toNumber(landedCost);
  const mk = toNumber(marketingCost);
  const mPct = toNumber(desiredMarginPct);
  const feePct = toNumber(paymentFeesPct);
  const bufPct = toNumber(bufferPct);
  const discPct = toNumber(discountPct);
  const resDiscPct = toNumber(resellerDiscountPct);

  const canCalc =
    lc !== null &&
    mk !== null &&
    mPct !== null &&
    feePct !== null &&
    bufPct !== null &&
    discPct !== null &&
    resDiscPct !== null &&
    mPct! >= 0 &&
    mPct! < 95;

  const nf2 = useMemo(
    () => new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    []
  );

  const result = useMemo(() => {
    if (!canCalc) return null;

    const baseCost = (lc as number) + (mk as number);

    // Add buffer as percent of baseCost
    const bufferedCost = baseCost * (1 + (bufPct as number) / 100);

    /**
     * We want a retail price P such that:
     * - After payment fees: P * (1 - feePct) remains
     * - Profit margin target is relative to price:
     *   Profit = (P*(1-feePct)) - bufferedCost
     *   Margin = Profit / P
     *
     * Solve: ((P*(1-feePct)) - bufferedCost) / P = targetMargin
     * => (1 - feePct) - bufferedCost/P = targetMargin
     * => bufferedCost/P = (1 - feePct) - targetMargin
     * => P = bufferedCost / ((1 - feePct) - targetMargin)
     */

    const fee = (feePct as number) / 100;
    const targetMargin = (mPct as number) / 100;

    const denom = (1 - fee) - targetMargin;

    // Prevent divide by zero or negative pricing
    if (denom <= 0.02) {
      return {
        error:
          "Your margin + fees are too high. Reduce margin target or fees to get a realistic price.",
      } as const;
    }

    const retailPrice = bufferedCost / denom;

    const paymentFees = retailPrice * fee;
    const revenueAfterFees = retailPrice - paymentFees;

    const profit = revenueAfterFees - bufferedCost;
    const marginAchieved = profit / retailPrice;

    // Promo discount floor
    const promoPrice = retailPrice * (1 - (discPct as number) / 100);

    // Break-even floor (price that gives zero profit after fees)
    const breakEvenPrice = bufferedCost / (1 - fee);

    // Reseller price (based on discount off retail)
    const resellerPrice = retailPrice * (1 - (resDiscPct as number) / 100);

    // Recommended minimum selling price (don't go below break-even)
    const recommendedFloor = Math.max(breakEvenPrice, promoPrice);

    return {
      baseCost,
      bufferedCost,
      retailPrice,
      paymentFees,
      revenueAfterFees,
      profit,
      marginAchieved,
      breakEvenPrice,
      promoPrice,
      recommendedFloor,
      resellerPrice,
    } as const;
  }, [canCalc, lc, mk, mPct, feePct, bufPct, discPct, resDiscPct]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(7,11,20,0.55)",
    color: "rgba(255,255,255,0.95)",
    fontSize: 15,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = { fontWeight: 900, fontSize: 13, opacity: 0.85, marginBottom: 6 };

  const symbol = currency === "USD" ? "$" : "₦";

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "36px 16px 64px", color: "rgba(255,255,255,0.92)" }}>
      <style jsx>{`
        :global(body) {
          background: radial-gradient(1200px 700px at 30% 20%, rgba(99, 102, 241, 0.18), transparent 60%),
            radial-gradient(900px 600px at 70% 35%, rgba(168, 85, 247, 0.16), transparent 55%),
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
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.9), rgba(168, 85, 247, 0.9));
          border-color: rgba(255, 255, 255, 0.18);
          color: #fff;
        }
      `}</style>

      <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        Retail Price Builder
      </h1>
      <p style={{ margin: "0 0 22px", opacity: 0.85, lineHeight: 1.7, maxWidth: 860 }}>
        Turn your landed cost per unit into a confident selling price. This tool accounts for fees, marketing cost, and a buffer,
        then calculates a retail price that matches your margin target.
      </p>

      <section className="card">
        <div>
          <div style={labelStyle}>Currency display</div>
          <div className="pillRow">
            <button type="button" className={`pill ${currency === "USD" ? "pillActive" : ""}`} onClick={() => setCurrency("USD")}>
              USD
            </button>
            <button type="button" className={`pill ${currency === "NGN" ? "pillActive" : ""}`} onClick={() => setCurrency("NGN")}>
              NGN
            </button>
          </div>
          <div style={{ fontSize: 13, opacity: 0.78, marginTop: 8, lineHeight: 1.6 }}>
            This does not convert exchange rates. It only changes the currency symbol for readability.
          </div>
        </div>

        <div className="twoCol">
          <div>
            <div style={labelStyle}>Landed Cost per Unit</div>
            <input value={landedCost} onChange={(e) => setLandedCost(e.target.value)} inputMode="decimal" placeholder="e.g. 25" style={inputStyle} />
          </div>
          <div>
            <div style={labelStyle}>Marketing Cost per Unit (optional)</div>
            <input value={marketingCost} onChange={(e) => setMarketingCost(e.target.value)} inputMode="decimal" placeholder="e.g. 1.2" style={inputStyle} />
          </div>
        </div>

        <div className="twoCol">
          <div>
            <div style={labelStyle}>Desired Profit Margin (%)</div>
            <input value={desiredMarginPct} onChange={(e) => setDesiredMarginPct(e.target.value)} inputMode="decimal" placeholder="e.g. 30" style={inputStyle} />
          </div>
          <div>
            <div style={labelStyle}>Payment Fees (%)</div>
            <input value={paymentFeesPct} onChange={(e) => setPaymentFeesPct(e.target.value)} inputMode="decimal" placeholder="e.g. 1.5" style={inputStyle} />
          </div>
        </div>

        <div className="twoCol">
          <div>
            <div style={labelStyle}>Buffer for Surprises (%)</div>
            <input value={bufferPct} onChange={(e) => setBufferPct(e.target.value)} inputMode="decimal" placeholder="e.g. 3" style={inputStyle} />
          </div>
          <div>
            <div style={labelStyle}>Promo Discount (%)</div>
            <input value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} inputMode="decimal" placeholder="e.g. 10" style={inputStyle} />
          </div>
        </div>

        <div>
          <div style={labelStyle}>Reseller Discount (%)</div>
          <input value={resellerDiscountPct} onChange={(e) => setResellerDiscountPct(e.target.value)} inputMode="decimal" placeholder="e.g. 15" style={inputStyle} />
          <div style={{ fontSize: 13, opacity: 0.78, marginTop: 8, lineHeight: 1.6 }}>
            If you sell to resellers, this estimates a reseller price based on a discount off retail.
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
          }}
          aria-live="polite"
        >
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Result</div>

          {!result ? (
            <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
              Enter your landed cost per unit to generate a price.
            </div>
          ) : "error" in result ? (
            <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.6 }}>
              <b>Issue:</b> {result.error}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8, lineHeight: 1.75 }}>
              <div>
                <b>Retail price (recommended):</b> {symbol}
                {nf2.format(result.retailPrice)}
              </div>
              <div>
                <b>Estimated profit per unit:</b> {symbol}
                {nf2.format(result.profit)}
              </div>
              <div>
                <b>Margin achieved:</b> {nf2.format(result.marginAchieved * 100)}%
              </div>

              <div style={{ paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <b>Break-even price:</b> {symbol}
                {nf2.format(result.breakEvenPrice)}
              </div>
              <div>
                <b>Promo price (after discount):</b> {symbol}
                {nf2.format(result.promoPrice)}
              </div>
              <div>
                <b>Recommended floor (don’t go below):</b> {symbol}
                {nf2.format(result.recommendedFloor)}
              </div>

              <div style={{ paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <b>Reseller price estimate:</b> {symbol}
                {nf2.format(result.resellerPrice)}
              </div>

              <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.6 }}>
                Want landed cost first? Use{" "}
                <a
                  href="/tools/landed-cost-estimator"
                  style={{ color: "rgba(255,255,255,0.95)", fontWeight: 900, textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  Landed Cost Estimator
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
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 16px 50px rgba(0,0,0,0.25)",
    color: "rgba(255,255,255,0.92)",
  }}
>
  <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 10px" }}>
    How to Price Imported Products Profitably
  </h2>

  <p style={{ margin: "0 0 12px", opacity: 0.86, lineHeight: 1.75 }}>
    The biggest pricing mistake importers make is using supplier price as their “cost price.” Your real cost is your landed cost
    plus the hidden costs of selling: marketing, payment fees, returns, and unexpected losses. If you price too low, you will
    sell fast and still go broke. If you price too high, you will struggle to sell.
  </p>

  <p style={{ margin: "0 0 12px", opacity: 0.86, lineHeight: 1.75 }}>
    This Retail Price Builder helps you work backwards from the margin you want. It estimates a selling price that covers costs,
    includes a buffer, and still hits your profit target. It also shows your break-even price and a recommended discount floor,
    so you don’t discount into losses.
  </p>

  <h3 style={{ fontSize: 17, fontWeight: 900, margin: "14px 0 8px" }}>
    Pricing FAQ
  </h3>

  <div style={{ display: "grid", gap: 10 }}>
    {[
      {
        q: "What is the difference between markup and margin?",
        a: "Markup is profit divided by cost. Margin is profit divided by selling price. Businesses typically target margin because it reflects profitability on revenue.",
      },
      {
        q: "Why should I include payment fees and marketing cost?",
        a: "Because they reduce the money you actually keep. If you ignore them, your “profit” will disappear in advertising spend and transaction charges.",
      },
      {
        q: "What is a break-even price?",
        a: "It is the lowest price you can sell without losing money after costs and fees. Selling below break-even is a guaranteed loss.",
      },
      {
        q: "How should I set a reseller price?",
        a: "Many resellers expect a discount off your retail price. This tool estimates a reseller price based on a reseller discount percentage.",
      },
    ].map((item) => (
      <div
        key={item.q}
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          background: "rgba(7,11,20,0.35)",
          padding: 14,
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 6 }}>{item.q}</div>
        <div style={{ opacity: 0.86, lineHeight: 1.7 }}>{item.a}</div>
      </div>
    ))}
  </div>

  <p style={{ margin: "14px 0 0", opacity: 0.86, lineHeight: 1.75 }}>
    If you haven’t calculated landed cost yet, start with the{" "}
    <a
      href="/tools/landed-cost-estimator"
      style={{ color: "rgba(255,255,255,0.95)", fontWeight: 900, textDecoration: "underline", textUnderlineOffset: 3 }}
    >
      Landed Cost Estimator
    </a>{" "}
    and then use this tool to set a selling price.
  </p>
</section>
    </main>
  );
}