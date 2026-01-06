"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Destination = "NG" | "GH" | "UK" | "US" | "CA";
type RateBasis = "perKg" | "perCbm";

type ShippingOption = {
  key: string;
  label: string;
  basis: RateBasis;
  rateUsd: number;
};

const DESTINATIONS: { key: Destination; label: string }[] = [
  { key: "NG", label: "Nigeria" },
  { key: "GH", label: "Ghana" },
  { key: "UK", label: "UK" },
  { key: "US", label: "USA" },
  { key: "CA", label: "Canada" },
];

const SHIPPING_OPTIONS: Record<Destination, ShippingOption[]> = {
  NG: [
    { key: "air_cargo", label: "Air Cargo ($10/kg)", basis: "perKg", rateUsd: 10 },
    { key: "express", label: "Express ($15/kg)", basis: "perKg", rateUsd: 15 },
    { key: "sea", label: "Sea ($350/CBM)", basis: "perCbm", rateUsd: 350 },
  ],
  GH: [
    { key: "air_cargo", label: "Air Cargo ($15/kg)", basis: "perKg", rateUsd: 15 },
    { key: "express", label: "Express ($20/kg)", basis: "perKg", rateUsd: 20 },
    { key: "sea", label: "Sea ($250/CBM)", basis: "perCbm", rateUsd: 250 },
  ],
  UK: [
    { key: "air", label: "Air ($10/kg)", basis: "perKg", rateUsd: 10 },
    { key: "sea_vol", label: "Sea (Volumetric) ($5/kg)", basis: "perKg", rateUsd: 5 },
  ],
  US: [
    { key: "air", label: "Air ($10/kg)", basis: "perKg", rateUsd: 10 },
    { key: "sea_vol", label: "Sea (Volumetric) ($5/kg)", basis: "perKg", rateUsd: 5 },
  ],
  CA: [
    { key: "air", label: "Air ($10/kg)", basis: "perKg", rateUsd: 10 },
    { key: "sea_vol", label: "Sea (Volumetric) ($5/kg)", basis: "perKg", rateUsd: 5 },
  ],
};

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, handler]);
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(wrapRef, () => setOpen(false));

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, options.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const opt = options[active];
        if (opt) onChange(opt.value);
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, active, options, onChange]);

  return (
    <div style={{ display: "grid", gap: 6, position: "relative" }} ref={wrapRef}>
      <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{label}</div>

      <button
        type="button"
        onClick={() => {
          const idx = options.findIndex((o) => o.value === value);
          setActive(Math.max(0, idx));
          setOpen((s) => !s);
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "13px 14px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(7,11,20,0.55)",
          color: "rgba(255,255,255,0.95)",
          fontWeight: 900,
          fontSize: 15,
          textAlign: "left",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected?.label ?? "Select"}
        </span>
        <span style={{ opacity: 0.75, transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            borderRadius: 14,
            background: "rgba(10,16,30,0.96)",
            border: "1px solid rgba(255,255,255,0.14)",
            overflow: "hidden",
            zIndex: 9999,
            boxShadow: "0 20px 55px rgba(0,0,0,0.6)",
            maxHeight: 260,
            overflowY: "auto",
          }}
          role="listbox"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === active;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(37,99,235,0.55), rgba(168,85,247,0.55))"
                    : isSelected
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.92)",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 14,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LandedCostEstimatorPage() {
  const [destination, setDestination] = useState<Destination>("NG");
  const shippingOptions = SHIPPING_OPTIONS[destination];
  const [openFaq, setOpenFaq] = useState<string | null>("faq-landed-cost");
  const [shippingKey, setShippingKey] = useState<string>(shippingOptions[0].key);

  useEffect(() => {
    const next = SHIPPING_OPTIONS[destination];
    if (!next.some((o) => o.key === shippingKey)) setShippingKey(next[0].key);
  }, [destination, shippingKey]);

  const selectedShipping = useMemo(() => {
    return shippingOptions.find((o) => o.key === shippingKey) ?? shippingOptions[0];
  }, [shippingOptions, shippingKey]);

  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [chargeableKg, setChargeableKg] = useState("");
  const [cbm, setCbm] = useState("");

  const u = toNumber(unitPrice);
  const q = toNumber(quantity);
  const kg = toNumber(chargeableKg);
  const m3 = toNumber(cbm);

  const canCalculate = Boolean(u && q && (selectedShipping.basis === "perKg" ? kg : m3));

  const nf2 = useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
    []
  );

  const result = useMemo(() => {
    if (!canCalculate) return null;

    const productCost = u! * q!;
    const shippingCost =
      selectedShipping.basis === "perKg" ? selectedShipping.rateUsd * kg! : selectedShipping.rateUsd * m3!;
    const landed = productCost + shippingCost;

    return { productCost, shippingCost, landed, perUnit: landed / q! };
  }, [canCalculate, selectedShipping, u, q, kg, m3]);

  async function copyEstimate() {
    if (!result) return;

    const destLabel = DESTINATIONS.find((d) => d.key === destination)?.label ?? destination;
    const basisLine = selectedShipping.basis === "perKg" ? `Chargeable weight: ${kg} kg` : `Total CBM: ${m3} m³`;

    const text = `
Landed Cost Estimate (All-in)
Destination: ${destLabel}
Shipping: ${selectedShipping.label}
${basisLine}

Product cost: $${result.productCost.toFixed(2)}
All-in shipping (includes duties & taxes): $${result.shippingCost.toFixed(2)}
Estimated landed cost: $${result.landed.toFixed(2)}
Estimated landed cost per unit: $${result.perUnit.toFixed(2)}

Tool: https://sureimports.com/tools/landed-cost-estimator
`.trim();

    try {
      await navigator.clipboard.writeText(text);
      alert("Estimate copied");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  }

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

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "36px 16px 64px", color: "rgba(255,255,255,0.92)" }}>
      <style jsx>{`
        :global(body) {
          background: radial-gradient(1200px 700px at 30% 20%, rgba(99, 102, 241, 0.18), transparent 60%),
            radial-gradient(900px 600px at 70% 35%, rgba(168, 85, 247, 0.16), transparent 55%),
            linear-gradient(180deg, #0b1220 0%, #070b14 100%);
        }

        /* Responsive 2-col row without extra <style jsx> blocks */
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
      `}</style>

      <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        Landed Cost Estimator
      </h1>
      <p style={{ margin: "0 0 24px", opacity: 0.85, lineHeight: 1.65, fontSize: 15, maxWidth: 820 }}>
        Estimate total landed cost using all-in rates (shipping, duties, and taxes included).
      </p>

      <section
        style={{
          display: "grid",
          gap: 16,
          borderRadius: 20,
          padding: 20,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 16px 50px rgba(0,0,0,0.45)",
        }}
      >
        <Select
          label="Destination"
          value={destination}
          onChange={(v) => setDestination(v)}
          options={DESTINATIONS.map((d) => ({ value: d.key, label: d.label }))}
        />

        <Select
          label="Shipping method"
          value={shippingKey}
          onChange={(v) => setShippingKey(v)}
          options={shippingOptions.map((o) => ({ value: o.key, label: o.label }))}
        />

        <div className="twoCol">
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Product Unit Price (USD)</div>
            <input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} inputMode="decimal" placeholder="e.g. 25" style={inputStyle} />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Quantity</div>
            <input value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="numeric" placeholder="e.g. 100" style={inputStyle} />
          </div>
        </div>

        {selectedShipping.basis === "perKg" ? (
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
              Total chargeable weight (kg)
            </div>
            <input
              value={chargeableKg}
              onChange={(e) => setChargeableKg(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 120"
              style={inputStyle}
            />
            <div style={{ fontSize: 13, opacity: 0.78, lineHeight: 1.55 }}>
              Chargeable weight is the higher of actual weight and volumetric weight.
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Total CBM (m³)</div>
            <input value={cbm} onChange={(e) => setCbm(e.target.value)} inputMode="decimal" placeholder="e.g. 1.8" style={inputStyle} />
          </div>
        )}

        <div
          style={{
            padding: 16,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
          }}
          aria-live="polite"
        >
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Estimate</div>

          {!result ? (
            <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
              Enter unit price, quantity, and {selectedShipping.basis === "perKg" ? "chargeable kg" : "CBM"} to see estimate.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8, lineHeight: 1.7 }}>
              <div>
                <b>Product cost:</b> ${nf2.format(result.productCost)}
              </div>
              <div>
                <b>All-in shipping (includes duties & taxes):</b> ${nf2.format(result.shippingCost)}
              </div>
              <div style={{ paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <b>Estimated landed cost:</b> ${nf2.format(result.landed)}
              </div>
              <div>
                <b>Estimated landed cost per unit:</b> ${nf2.format(result.perUnit)}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Share or bookmark this for quick planning.</div>
                <button
                  type="button"
                  onClick={copyEstimate}
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "linear-gradient(90deg, rgba(37,99,235,0.9), rgba(168,85,247,0.9))",
                    color: "white",
                    fontWeight: 900,
                    borderRadius: 14,
                    padding: "11px 14px",
                    cursor: "pointer",
                  }}
                >
                  Copy estimate
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: 14,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(7,11,20,0.35)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Helpful links</div>
          <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.6 }}>
            Need CBM or chargeable kg first? Use our{" "}
            <a
              href="/tools/cbm-volumetric-weight-calculator"
              style={{ color: "rgba(255,255,255,0.95)", fontWeight: 900, textDecoration: "underline" }}
            >
              CBM & Volumetric Weight Calculator
            </a>
            .
          </div>
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
  }}
>
  <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 10px" }}>
    What Is Landed Cost and Why It Matters When Importing
  </h2>

  <p style={{ margin: "0 0 12px", opacity: 0.86, lineHeight: 1.75 }}>
    Landed cost is the real total cost of getting a product to your hands, not just the price you paid the supplier.
    When importing, many people focus on the unit price and forget that shipping, duties, taxes, and clearance can easily
    change the final cost per unit. That difference is what makes some imports profitable and others a painful mistake.
  </p>

  <h3 style={{ fontSize: 17, fontWeight: 900, margin: "14px 0 8px" }}>
    What’s Included in Landed Cost
  </h3>

  <p style={{ margin: "0 0 12px", opacity: 0.86, lineHeight: 1.75 }}>
    In practical terms, your landed cost typically includes your supplier cost (product unit price times quantity) plus
    the shipping plan you choose. On Sure Imports all in routes, the shipping rate already includes duties and taxes, so
    your estimate is simpler and more predictable. You just need accurate inputs.
  </p>

  <h3 style={{ fontSize: 17, fontWeight: 900, margin: "14px 0 8px" }}>
    Why Landed Cost Is the Only Number That Matters
  </h3>

  <p style={{ margin: "0 0 12px", opacity: 0.86, lineHeight: 1.75 }}>
    If you price your goods based only on supplier price, you can underprice and lose money, or overprice and struggle to
    sell. Landed cost helps you set a realistic selling price, calculate your margin, compare shipping methods, and decide
    whether to import at all. It’s also how serious importers compare suppliers fairly because a cheaper supplier is not
    always cheaper after shipping.
  </p>

  <h3 style={{ fontSize: 17, fontWeight: 900, margin: "14px 0 8px" }}>
    Tips for Better Estimates
  </h3>

  <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.86, lineHeight: 1.75 }}>
    <li>Use chargeable weight for air and volumetric based routes, not only actual weight.</li>
    <li>For sea by CBM, total up your carton volume correctly before estimating.</li>
    <li>Always estimate cost per unit so you can price properly and compare options.</li>
  </ul>

  <p style={{ margin: "14px 0 0", opacity: 0.86, lineHeight: 1.75 }}>
    Need to calculate CBM or volumetric weight first? Use the{" "}
    <a
      href="/tools/cbm-volumetric-weight-calculator"
      style={{ color: "rgba(255,255,255,0.95)", fontWeight: 900, textDecoration: "underline" }}
    >
      CBM & Volumetric Weight Calculator
    </a>
    .
  </p>
</section>

<section
  style={{
    marginTop: 18,
    padding: 20,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 16px 50px rgba(0,0,0,0.25)",
  }}
>
  <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 12px" }}>
    Landed Cost FAQ
  </h2>

  {[
    {
      id: "faq-landed-cost",
      q: "What is landed cost?",
      a: "Landed cost is the total cost of getting your goods to you, not just the supplier price. It combines product cost plus shipping and any duties, taxes, and clearance costs. If you want accurate pricing and margins, landed cost is the number to use.",
    },
    {
      id: "faq-all-in",
      q: "Do these rates include duties and taxes?",
      a: "Yes. The rates used in this calculator are all in rates, meaning duties and taxes are included. You still need to enter accurate chargeable weight or CBM so the estimate reflects your shipment.",
    },
    {
      id: "faq-chargeable",
      q: "What does chargeable weight mean?",
      a: "Chargeable weight is the higher of actual weight and volumetric weight. Couriers and air cargo often charge by whichever is higher because bulky cartons take up space even if they are light.",
    },
    {
      id: "faq-nigeria",
      q: "How do I estimate landed cost for Nigeria imports?",
      a: "Use your product unit price and quantity, then select Nigeria and your shipping method. For air cargo or express, enter total chargeable kg. For sea, enter total CBM. The calculator will show total landed cost and cost per unit.",
    },
    {
      id: "faq-uk",
      q: "How do I estimate landed cost for the UK and why is sea charged by volumetric weight?",
      a: "For UK sea on this tool, the pricing is modeled as volumetric weight per kg. That means you should enter the chargeable kg. This makes it easier to estimate door delivery when carriers price sea shipments by volume converted into kg.",
    },
    {
      id: "faq-margin",
      q: "Should I price my goods based on supplier price or landed cost?",
      a: "Always price based on landed cost. Supplier price alone will cause underpricing or overpricing. Landed cost lets you set a realistic selling price and calculate your true margin.",
    },
  ].map((item) => {
    const isOpen = openFaq === item.id;

    return (
      <div
        key={item.id}
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          background: "rgba(7,11,20,0.35)",
          marginTop: 10,
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => setOpenFaq((cur) => (cur === item.id ? null : item.id))}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: "14px 14px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.95)",
            fontWeight: 900,
            fontSize: 15,
            textAlign: "left",
          }}
          aria-expanded={isOpen}
        >
          <span>{item.q}</span>
          <span style={{ opacity: 0.8 }}>{isOpen ? "–" : "+"}</span>
        </button>

        {isOpen && (
          <div style={{ padding: "0 14px 14px", opacity: 0.86, lineHeight: 1.75, fontSize: 14 }}>
            {item.a}
          </div>
        )}
      </div>
    );
  })}

  <p style={{ margin: "14px 0 0", opacity: 0.86, lineHeight: 1.75 }}>
    If you want to compute chargeable weight or CBM first, use the{" "}
    <a
      href="/tools/cbm-volumetric-weight-calculator"
      style={{ color: "rgba(255,255,255,0.95)", fontWeight: 900, textDecoration: "underline" }}
    >
      CBM & Volumetric Weight Calculator
    </a>
    .
  </p>
</section>

    </main>
  );
}