'use client';

import { useMemo, useState } from 'react';

function toNumber(v: string): number | null {
  const cleaned = v.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function hpToKw(hp: number) {
  // common quick conversion
  return hp * 0.746;
}

type StartMethod = 'DOL' | 'STAR_DELTA' | 'SOFT_STARTER' | 'VFD';

function startMultiplier(method: StartMethod) {
  // conservative, practical multipliers for generator sizing
  // (not motor physics, but planning values that reduce under-sizing)
  if (method === 'DOL') return 3.0;
  if (method === 'STAR_DELTA') return 1.8;
  if (method === 'SOFT_STARTER') return 1.4;
  return 1.2; // VFD
}

export default function GeneratorSizingTool() {
  const [phase, setPhase] = useState<'single' | 'three'>('three');

  // Running load
  const [runningKw, setRunningKw] = useState('');
  const [pf, setPf] = useState('0.80');

  // Largest motor
  const [motorUnit, setMotorUnit] = useState<'kW' | 'HP'>('kW');
  const [largestMotor, setLargestMotor] = useState('');
  const [startMethod, setStartMethod] = useState<StartMethod>('DOL');

  // Operating behavior
  const [startStyle, setStartStyle] = useState<'sequential' | 'random'>(
    'sequential',
  );

  // Safety margin
  const [headroomPct, setHeadroomPct] = useState('30');

  const [mode, setMode] = useState<'quick' | 'engineer'>('quick');

  const rKw = toNumber(runningKw);
  const powerFactor = toNumber(pf);
  const lm = toNumber(largestMotor);
  const headroom = toNumber(headroomPct);

  const canCalc =
    rKw !== null &&
    rKw! > 0 &&
    powerFactor !== null &&
    powerFactor! > 0 &&
    powerFactor! <= 1 &&
    lm !== null &&
    lm! > 0 &&
    headroom !== null &&
    headroom! >= 0 &&
    headroom! <= 80;

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

    const runningKva = (rKw as number) / (powerFactor as number);

    const motorKw = motorUnit === 'kW' ? (lm as number) : hpToKw(lm as number);
    const motorRunningKva = motorKw / (powerFactor as number);

    // Starting surge requirement
    const mult = startMultiplier(startMethod);
    const motorStartKva = motorRunningKva * mult;

    /**
     * Combine running + starting:
     * If sequential: assume we can control start order, so worst case is running load + incremental start surge.
     * If random: assume more stress and less discipline, so inflate start requirement.
     */
    const randomnessFactor = startStyle === 'random' ? 1.25 : 1.0;

    // The generator must handle existing running kVA plus the additional kVA needed during a start.
    // A conservative way is to take max(runningKva, motorStartKva) plus a portion of runningKva already online.
    const combinedKva = (runningKva + motorStartKva) * randomnessFactor;

    // Apply headroom
    const minRecommendedKva = combinedKva * (1 + (headroom as number) / 100);

    // Comfortable recommendation (a bit extra)
    const comfortableKva = minRecommendedKva * 1.15;

    // Translate kVA to approximate kW at PF
    const approxKwAtPf = minRecommendedKva * (powerFactor as number);

    // Risk messages
    const motorShare = motorRunningKva / runningKva;
    let risk = 'Low';
    if (motorShare >= 0.5) risk = 'High';
    else if (motorShare >= 0.25) risk = 'Medium';

    const warnings: string[] = [];

    if (phase === 'single') {
      warnings.push(
        'Single-phase generators are rarely suitable for factories with industrial motors. If you have any 3-phase machines, use a 3-phase generator.',
      );
    } else {
      warnings.push(
        'If you use a 3-phase generator, phase balancing and correct cable sizing matter as much as generator size.',
      );
    }

    if (startMethod === 'DOL') {
      warnings.push(
        'DOL starting creates the highest surge. If your biggest motor is large, consider a soft starter or VFD to reduce starting stress.',
      );
    }

    if ((powerFactor as number) < 0.8) {
      warnings.push(
        'Low power factor reduces usable kW from the generator. If unsure, 0.8 is a common planning value for mixed motor loads.',
      );
    }

    warnings.push(
      'In Nigeria, voltage dips from undersized generators can reset control panels (PLCs), drop contactors, and damage motors over time.',
    );

    return {
      runningKva,
      motorKw,
      motorRunningKva,
      motorStartKva,
      combinedKva,
      minRecommendedKva,
      comfortableKva,
      approxKwAtPf,
      risk,
      warnings,
    };
  }, [
    canCalc,
    rKw,
    powerFactor,
    lm,
    motorUnit,
    startMethod,
    startStyle,
    headroom,
    phase,
  ]);

  function copyResult() {
    if (!result) return;

    const lines = [
      'Factory Generator Sizing Result',
      '',
      `Phase: ${phase === 'three' ? '3-Phase' : 'Single-Phase'}`,
      `Total running load: ${runningKw} kW`,
      `Power factor (PF): ${pf}`,
      `Largest motor: ${motorUnit === 'kW' ? largestMotor + ' kW' : largestMotor + ' HP'}`,
      `Starting method: ${startMethod}`,
      `Start style: ${startStyle === 'sequential' ? 'Sequential' : 'Random'}`,
      `Safety headroom: ${headroomPct}%`,
      '',
      `Running load (kVA): ${result.runningKva.toFixed(2)} kVA`,
      `Estimated motor start surge (kVA): ${result.motorStartKva.toFixed(2)} kVA`,
      '',
      `Minimum recommended generator: ${result.minRecommendedKva.toFixed(2)} kVA`,
      `Comfortable recommendation: ${result.comfortableKva.toFixed(2)} kVA`,
      `Approx usable kW at PF ${pf}: ${result.approxKwAtPf.toFixed(2)} kW`,
      '',
      `Starting surge risk: ${result.risk}`,
      '',
      'Calculated with Sure Imports Generator Sizing Tool',
      'https://sureimports.com/tools/generator-sizing',
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    alert('Generator recommendation copied');
  }

  type LoadType =
    | 'MOTOR'
    | 'COMPRESSOR'
    | 'HEATER'
    | 'WELDER'
    | 'LIGHTING'
    | 'OTHER';
  type MotorStart = 'DOL' | 'STAR_DELTA' | 'SOFT_STARTER' | 'VFD';

  type LoadRow = {
    id: string;
    name: string;
    type: LoadType;
    qty: number;
    // user enters either kW or HP for motors; for non-motors we use kW
    unit: 'kW' | 'HP';
    kwOrHp: number;
    pf?: number; // optional
    startMethod?: MotorStart; // motors/compressors
    includeInStartStack: boolean; // whether this load is assumed ON during motor start
  };

  function defaultPf(type: LoadType) {
    if (type === 'HEATER') return 0.95;
    if (type === 'LIGHTING') return 0.9;
    if (type === 'WELDER') return 0.85;
    // motors/compressors/other
    return 0.8;
  }

  function isMotorLike(type: LoadType) {
    return type === 'MOTOR' || type === 'COMPRESSOR';
  }

  function uid() {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }

  const [rows, setRows] = useState<LoadRow[]>([
    {
      id: uid(),
      name: 'Main motor',
      type: 'MOTOR',
      qty: 1,
      unit: 'kW',
      kwOrHp: 7.5,
      pf: 0.8,
      startMethod: 'DOL',
      includeInStartStack: true,
    },
  ]);

  const [engineerPfFallback, setEngineerPfFallback] = useState('0.80');
  const [engineerHeadroomPct, setEngineerHeadroomPct] = useState('30');
  const [startScenario, setStartScenario] = useState<
    'largest_plus_base' | 'largest_only'
  >('largest_plus_base');

  const engPfFallback = toNumber(engineerPfFallback);
  const engHeadroom = toNumber(engineerHeadroomPct);

  const engineerResult = useMemo(() => {
    if (!rows.length) return null;
    if (engPfFallback === null || engPfFallback <= 0 || engPfFallback > 1)
      return null;
    if (engHeadroom === null || engHeadroom < 0 || engHeadroom > 80)
      return null;

    // Compute running totals
    let totalKw = 0;
    let totalKva = 0;

    // Identify largest motor running kVA (for surge)
    let largestMotorRow: LoadRow | null = null;
    let largestMotorRunningKva = 0;

    for (const r of rows) {
      const qty = Number.isFinite(r.qty) && r.qty > 0 ? r.qty : 0;
      const val = Number.isFinite(r.kwOrHp) && r.kwOrHp > 0 ? r.kwOrHp : 0;
      if (!qty || !val) continue;

      const pfUsed = r.pf && r.pf > 0 && r.pf <= 1 ? r.pf : defaultPf(r.type);
      const kwEach = r.unit === 'kW' ? val : hpToKw(val);
      const kw = kwEach * qty;

      const kva = kw / pfUsed;

      totalKw += kw;
      totalKva += kva;

      if (isMotorLike(r.type)) {
        if (kva > largestMotorRunningKva) {
          largestMotorRunningKva = kva;
          largestMotorRow = r;
        }
      }
    }

    if (totalKw <= 0 || totalKva <= 0) return null;

    // Surge
    let motorStartKva = 0;
    if (largestMotorRow) {
      const sm = (largestMotorRow.startMethod ?? 'DOL') as MotorStart;
      const mult = startMultiplier(sm as any);
      motorStartKva = largestMotorRunningKva * mult;
    }

    // Base load assumed already ON during start (only rows marked includeInStartStack)
    let baseKw = 0;
    let baseKva = 0;

    for (const r of rows) {
      if (!r.includeInStartStack) continue;

      const qty = Number.isFinite(r.qty) && r.qty > 0 ? r.qty : 0;
      const val = Number.isFinite(r.kwOrHp) && r.kwOrHp > 0 ? r.kwOrHp : 0;
      if (!qty || !val) continue;

      const pfUsed = r.pf && r.pf > 0 && r.pf <= 1 ? r.pf : defaultPf(r.type);
      const kwEach = r.unit === 'kW' ? val : hpToKw(val);
      const kw = kwEach * qty;
      const kva = kw / pfUsed;

      baseKw += kw;
      baseKva += kva;
    }

    // If scenario is "largest_only", assume start happens before base is fully online
    const startStackKva =
      startScenario === 'largest_only'
        ? motorStartKva
        : baseKva + motorStartKva;

    // Headroom
    const minRecommendedKva = startStackKva * (1 + engHeadroom / 100);
    const comfortableKva = minRecommendedKva * 1.15;

    const approxKwAtPf = minRecommendedKva * engPfFallback;

    // Risk grading
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    const share = largestMotorRunningKva / totalKva;
    if (share >= 0.5) risk = 'High';
    else if (share >= 0.25) risk = 'Medium';

    // Warnings
    const warnings: string[] = [];
    if (phase === 'single') {
      warnings.push(
        'Single-phase generators are rarely suitable for factories with industrial motors. If you have any 3-phase machines, use a 3-phase generator.',
      );
    } else {
      warnings.push(
        '3-phase systems require phase balancing, proper ATS sizing, and correct cable sizing. Bad installation can destroy equipment even when generator size is correct.',
      );
    }

    if (largestMotorRow && (largestMotorRow.startMethod ?? 'DOL') === 'DOL') {
      warnings.push(
        'Your largest motor is set to DOL. Consider soft starter or VFD for large motors to reduce starting surge and voltage dip.',
      );
    }

    warnings.push(
      'Nigeria tip: If your generator is ‘big enough’ but control panels reset, your alternator/AVR response and installation quality are usually the real issue.',
    );

    return {
      totalKw,
      totalKva,
      baseKw,
      baseKva,
      largestMotorRow,
      largestMotorRunningKva,
      motorStartKva,
      startStackKva,
      minRecommendedKva,
      comfortableKva,
      approxKwAtPf,
      risk,
      warnings,
    };
  }, [rows, engPfFallback, engHeadroom, startScenario, phase]);

  function updateRow(id: string, patch: Partial<LoadRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        id: uid(),
        name: 'New load',
        type: 'OTHER',
        qty: 1,
        unit: 'kW',
        kwOrHp: 1,
        pf: undefined,
        startMethod: undefined,
        includeInStartStack: true,
      },
    ]);
  }

  function removeRow(id: string) {
    setRows((prev) => {
      if (prev.length <= 1) return prev; // keep at least one row
      return prev.filter((r) => r.id !== id);
    });
  }

  function copyEngineerResult() {
    if (!engineerResult) return;

    const lm = engineerResult.largestMotorRow;
    const lmName = lm ? lm.name : 'N/A';

    const lines = [
      'Factory Generator Sizing (Engineer Mode)',
      '',
      `Phase: ${phase === 'three' ? '3-Phase' : 'Single-Phase'}`,
      `Start scenario: ${startScenario === 'largest_only' ? 'Largest motor start only' : 'Largest motor + base load'}`,
      `Headroom: ${engineerHeadroomPct}%`,
      '',
      `Total running load: ${engineerResult.totalKw.toFixed(2)} kW`,
      `Total running kVA: ${engineerResult.totalKva.toFixed(2)} kVA`,
      '',
      `Largest motor load: ${lmName}`,
      `Largest motor running kVA: ${engineerResult.largestMotorRunningKva.toFixed(2)} kVA`,
      `Estimated start surge kVA: ${engineerResult.motorStartKva.toFixed(2)} kVA`,
      '',
      `Start stack kVA: ${engineerResult.startStackKva.toFixed(2)} kVA`,
      '',
      `Minimum recommended generator: ${engineerResult.minRecommendedKva.toFixed(2)} kVA`,
      `Comfortable recommendation: ${engineerResult.comfortableKva.toFixed(2)} kVA`,
      `Approx usable kW at PF ${engineerPfFallback}: ${engineerResult.approxKwAtPf.toFixed(2)} kW`,
      '',
      `Risk: ${engineerResult.risk}`,
      '',
      'https://sureimports.com/tools/generator-sizing',
      'Machine spec qualification: https://linescout.sureimports.com/machine-sourcing',
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    alert('Engineer result copied');
  }

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
        Factory Generator Sizing Calculator
      </h1>
      <p
        style={{
          margin: '0 0 22px',
          opacity: 0.85,
          lineHeight: 1.7,
          maxWidth: 900,
        }}
      >
        Quick estimate for generator size using running load, power factor, and
        the starting surge of your largest motor. This is designed for real
        Nigerian factory conditions where voltage dips can reset control panels
        and damage motors.
      </p>

      <div className="pillRow" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`pill ${mode === 'quick' ? 'pillActive' : ''}`}
          onClick={() => setMode('quick')}
        >
          Quick Estimate
        </button>
        <button
          type="button"
          className={`pill ${mode === 'engineer' ? 'pillActive' : ''}`}
          onClick={() => setMode('engineer')}
        >
          Engineer Mode
        </button>
      </div>

      {mode === 'quick' && (
        <section className="card">
          <div>
            <div style={labelStyle}>Factory supply type</div>
            <div className="pillRow">
              <button
                type="button"
                className={`pill ${phase === 'three' ? 'pillActive' : ''}`}
                onClick={() => setPhase('three')}
              >
                3-Phase
              </button>
              <button
                type="button"
                className={`pill ${phase === 'single' ? 'pillActive' : ''}`}
                onClick={() => setPhase('single')}
              >
                Single-Phase
              </button>
            </div>
          </div>

          <div className="twoCol">
            <div>
              <div style={labelStyle}>Total Running Load (kW)</div>
              <input
                value={runningKw}
                onChange={(e) => setRunningKw(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 45"
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
                Use the load that will realistically run together, not the
                theoretical maximum.
              </div>
            </div>

            <div>
              <div style={labelStyle}>Power Factor (PF)</div>
              <input
                value={pf}
                onChange={(e) => setPf(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 0.80"
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
                If you don’t know, 0.80 is a safe planning default for mixed
                motor loads.
              </div>
            </div>
          </div>

          <div style={{ paddingTop: 2 }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>
              Largest Motor (most important for surge)
            </div>

            <div className="twoCol">
              <div>
                <div style={labelStyle}>Largest motor value</div>
                <input
                  value={largestMotor}
                  onChange={(e) => setLargestMotor(e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g. 7.5"
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={labelStyle}>Motor unit</div>
                <div className="pillRow">
                  <button
                    type="button"
                    className={`pill ${motorUnit === 'kW' ? 'pillActive' : ''}`}
                    onClick={() => setMotorUnit('kW')}
                  >
                    kW
                  </button>
                  <button
                    type="button"
                    className={`pill ${motorUnit === 'HP' ? 'pillActive' : ''}`}
                    onClick={() => setMotorUnit('HP')}
                  >
                    HP
                  </button>
                </div>
              </div>
            </div>

            <div className="twoCol" style={{ marginTop: 12 }}>
              <div>
                <div style={labelStyle}>Starting method</div>
                <select
                  value={startMethod}
                  onChange={(e) =>
                    setStartMethod(e.target.value as StartMethod)
                  }
                  style={inputStyle}
                >
                  <option value="DOL">DOL (Direct-On-Line)</option>
                  <option value="STAR_DELTA">Star-Delta</option>
                  <option value="SOFT_STARTER">Soft Starter</option>
                  <option value="VFD">VFD (Inverter Drive)</option>
                </select>
              </div>

              <div>
                <div style={labelStyle}>How machines are started</div>
                <select
                  value={startStyle}
                  onChange={(e) => setStartStyle(e.target.value as any)}
                  style={inputStyle}
                >
                  <option value="sequential">
                    Sequential (one-by-one with pause)
                  </option>
                  <option value="random">
                    Random (operators start anytime)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="twoCol">
            <div>
              <div style={labelStyle}>Safety headroom (%)</div>
              <input
                value={headroomPct}
                onChange={(e) => setHeadroomPct(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 30"
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
                Nigeria tip: 25–35% headroom is sensible for most factories
                because people add loads and installation quality varies.
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                alignSelf: 'flex-start',
              }}
              aria-live="polite"
            >
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Result</div>

              {!result ? (
                <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
                  Enter running load, PF, and your largest motor to get a
                  generator recommendation.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 8, lineHeight: 1.75 }}>
                  <div>
                    <b>Running load:</b> {nf2.format(result.runningKva)} kVA
                  </div>
                  <div>
                    <b>Largest motor:</b> {nf2.format(result.motorKw)} kW
                  </div>
                  <div>
                    <b>Estimated motor start surge:</b>{' '}
                    {nf2.format(result.motorStartKva)} kVA
                  </div>

                  <div
                    style={{
                      paddingTop: 8,
                      borderTop: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    <b>Minimum recommended generator:</b>{' '}
                    {nf2.format(result.minRecommendedKva)} kVA
                  </div>
                  <div>
                    <b>Comfortable recommendation:</b>{' '}
                    {nf2.format(result.comfortableKva)} kVA
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.82 }}>
                    Approx usable kW at PF {pf}:{' '}
                    {nf2.format(result.approxKwAtPf)} kW
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(7,11,20,0.35)',
                    }}
                  >
                    <b>Starting surge risk:</b> {result.risk}
                  </div>
                  <button
                    type="button"
                    onClick={copyResult}
                    style={{
                      marginTop: 8,
                      width: 'fit-content',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.14)',
                      background:
                        'linear-gradient(90deg, rgba(37, 99, 235, 0.9), rgba(168, 85, 247, 0.9))',
                      color: '#fff',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    Copy result
                  </button>
                </div>
              )}
            </div>
          </div>

          {result && (
            <div
              style={{
                padding: 14,
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(7,11,20,0.30)',
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 8 }}>
                Practical notes (Nigeria reality)
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  opacity: 0.86,
                  lineHeight: 1.7,
                }}
              >
                {result.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.82,
                  marginTop: 10,
                  lineHeight: 1.6,
                }}
              >
                If you’re sourcing industrial machines from China and you want
                to confirm power requirements, wiring, and motor starting
                behavior before import, Sure Importers Limited can help you plan
                properly and avoid costly generator and installation mistakes.
                You can also use{' '}
                <a
                  href="https://linescout.sureimports.com/machine-sourcing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 900,
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  LineScout
                </a>{' '}
                (AI machine sourcing assistant) to qualify your machine specs
                before you buy.
              </div>
            </div>
          )}
        </section>
      )}

      {mode === 'engineer' && (
        <section className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            Engineer Mode (Load Table)
          </div>
          <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.6 }}>
            Add major loads (motors, heaters, compressors, welding, lighting).
            PF is optional, defaults are applied by type. Mark loads that are
            assumed ON during a motor start.
          </div>

          <div className="twoCol">
            <div>
              <div style={labelStyle}>Start scenario</div>
              <select
                value={startScenario}
                onChange={(e) => setStartScenario(e.target.value as any)}
                style={inputStyle}
              >
                <option value="largest_plus_base">
                  Largest motor + base load
                </option>
                <option value="largest_only">Largest motor start only</option>
              </select>
            </div>

            <div>
              <div style={labelStyle}>Engineer headroom (%)</div>
              <input
                value={engineerHeadroomPct}
                onChange={(e) => setEngineerHeadroomPct(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 30"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="twoCol">
            <div>
              <div style={labelStyle}>
                PF fallback (only used for kW estimate display)
              </div>
              <input
                value={engineerPfFallback}
                onChange={(e) => setEngineerPfFallback(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 0.80"
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={addRow}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(7,11,20,0.35)',
                  color: '#fff',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                + Add load
              </button>

              <button
                type="button"
                onClick={() =>
                  setRows([
                    {
                      id: uid(),
                      name: 'Main motor',
                      type: 'MOTOR',
                      qty: 1,
                      unit: 'kW',
                      kwOrHp: 7.5,
                      pf: 0.8,
                      startMethod: 'DOL',
                      includeInStartStack: true,
                    },
                    {
                      id: uid(),
                      name: 'Compressor',
                      type: 'COMPRESSOR',
                      qty: 1,
                      unit: 'kW',
                      kwOrHp: 3,
                      pf: 0.8,
                      startMethod: 'STAR_DELTA',
                      includeInStartStack: true,
                    },
                    {
                      id: uid(),
                      name: 'Heaters / sealing',
                      type: 'HEATER',
                      qty: 1,
                      unit: 'kW',
                      kwOrHp: 5,
                      pf: 0.95,
                      includeInStartStack: true,
                    },
                    {
                      id: uid(),
                      name: 'Lighting + office',
                      type: 'LIGHTING',
                      qty: 1,
                      unit: 'kW',
                      kwOrHp: 2,
                      pf: 0.9,
                      includeInStartStack: true,
                    },
                  ])
                }
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Load sample factory
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: 980,
                borderCollapse: 'separate',
                borderSpacing: 0,
                tableLayout: 'fixed',
              }}
            >
              <thead>
                <tr style={{ textAlign: 'left', fontSize: 13, opacity: 0.85 }}>
                  <th style={{ padding: '10px 8px', width: 220 }}>Load</th>
                  <th style={{ padding: '10px 8px', width: 170 }}>Type</th>
                  <th style={{ padding: '10px 8px' }}>Qty</th>
                  <th style={{ padding: '10px 8px' }}>Unit</th>
                  <th style={{ padding: '10px 8px' }}>kW/HP each</th>
                  <th style={{ padding: '10px 8px' }}>PF (optional)</th>
                  <th style={{ padding: '10px 8px' }}>Start method</th>
                  <th style={{ padding: '10px 8px' }}>On during start?</th>
                  <th style={{ padding: '10px 8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <td style={{ padding: '8px', width: 220 }}>
                      <input
                        value={r.name}
                        onChange={(e) =>
                          updateRow(r.id, { name: e.target.value })
                        }
                        style={{
                          ...inputStyle,
                          padding: '10px 12px',
                          minWidth: 200,
                        }}
                      />
                    </td>

                    <td style={{ padding: '8px', width: 170 }}>
                      <select
                        value={r.type}
                        onChange={(e) => {
                          const t = e.target.value as LoadType;
                          updateRow(r.id, {
                            type: t,
                            pf: undefined,
                            startMethod: isMotorLike(t)
                              ? (r.startMethod ?? 'DOL')
                              : undefined,
                            unit: isMotorLike(t) ? r.unit : 'kW',
                          });
                        }}
                        style={{
                          ...inputStyle,
                          padding: '10px 12px',
                          minWidth: 150,
                        }}
                      >
                        <option value="MOTOR">Motor</option>
                        <option value="COMPRESSOR">Compressor</option>
                        <option value="HEATER">Heater / Resistive</option>
                        <option value="WELDER">Welder</option>
                        <option value="LIGHTING">Lighting / General</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </td>

                    <td style={{ padding: '8px', width: 90 }}>
                      <input
                        value={String(r.qty)}
                        onChange={(e) =>
                          updateRow(r.id, {
                            qty: Math.max(1, Number(e.target.value || 1)),
                          })
                        }
                        inputMode="numeric"
                        style={{ ...inputStyle, padding: '10px 12px' }}
                      />
                    </td>

                    <td style={{ padding: '8px', width: 110 }}>
                      <select
                        value={r.unit}
                        onChange={(e) =>
                          updateRow(r.id, { unit: e.target.value as any })
                        }
                        style={{ ...inputStyle, padding: '10px 12px' }}
                        disabled={!isMotorLike(r.type)}
                        title={
                          !isMotorLike(r.type)
                            ? 'Only motors/compressors support HP input'
                            : undefined
                        }
                      >
                        <option value="kW">kW</option>
                        <option value="HP">HP</option>
                      </select>
                    </td>

                    <td style={{ padding: '8px', width: 140 }}>
                      <input
                        value={String(r.kwOrHp)}
                        onChange={(e) =>
                          updateRow(r.id, {
                            kwOrHp: Number(e.target.value || 0),
                          })
                        }
                        inputMode="decimal"
                        style={{ ...inputStyle, padding: '10px 12px' }}
                      />
                    </td>

                    <td style={{ padding: '8px', width: 130 }}>
                      <input
                        value={r.pf ?? ''}
                        onChange={(e) =>
                          updateRow(r.id, {
                            pf: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        inputMode="decimal"
                        placeholder={String(defaultPf(r.type))}
                        style={{ ...inputStyle, padding: '10px 12px' }}
                      />
                    </td>

                    <td style={{ padding: '8px', width: 170 }}>
                      <select
                        value={(r.startMethod ?? 'DOL') as any}
                        onChange={(e) =>
                          updateRow(r.id, {
                            startMethod: e.target.value as any,
                          })
                        }
                        style={{ ...inputStyle, padding: '10px 12px' }}
                        disabled={!isMotorLike(r.type)}
                        title={
                          !isMotorLike(r.type)
                            ? 'Only motors/compressors have start method'
                            : undefined
                        }
                      >
                        <option value="DOL">DOL</option>
                        <option value="STAR_DELTA">Star-Delta</option>
                        <option value="SOFT_STARTER">Soft Starter</option>
                        <option value="VFD">VFD</option>
                      </select>
                    </td>

                    <td style={{ padding: '8px', width: 150 }}>
                      <label
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                          fontWeight: 900,
                          fontSize: 13,
                          opacity: 0.9,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={r.includeInStartStack}
                          onChange={(e) =>
                            updateRow(r.id, {
                              includeInStartStack: e.target.checked,
                            })
                          }
                        />
                        Yes
                      </label>
                    </td>

                    <td style={{ padding: '8px', width: 90 }}>
                      <button
                        type="button"
                        onClick={() => removeRow(r.id)}
                        style={{
                          padding: '10px 10px',
                          borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.14)',
                          background: 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          fontWeight: 900,
                          cursor: 'pointer',
                        }}
                        title="Remove row"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <div style={{ fontWeight: 900, marginBottom: 10 }}>
              Engineer Result
            </div>

            {!engineerResult ? (
              <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
                Add loads and ensure headroom/PF values are valid to see
                recommendations.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 8, lineHeight: 1.75 }}>
                <div>
                  <b>Total running load:</b>{' '}
                  {nf2.format(engineerResult.totalKw)} kW
                </div>
                <div>
                  <b>Total running:</b> {nf2.format(engineerResult.totalKva)}{' '}
                  kVA
                </div>

                <div
                  style={{
                    paddingTop: 8,
                    borderTop: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <b>Largest motor (identified):</b>{' '}
                  {engineerResult.largestMotorRow?.name ?? 'None'}
                </div>
                <div>
                  <b>Largest motor start surge:</b>{' '}
                  {nf2.format(engineerResult.motorStartKva)} kVA
                </div>
                <div>
                  <b>Start stack kVA:</b>{' '}
                  {nf2.format(engineerResult.startStackKva)} kVA
                </div>

                <div
                  style={{
                    paddingTop: 8,
                    borderTop: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <b>Minimum recommended generator:</b>{' '}
                  {nf2.format(engineerResult.minRecommendedKva)} kVA
                </div>
                <div>
                  <b>Comfortable recommendation:</b>{' '}
                  {nf2.format(engineerResult.comfortableKva)} kVA
                </div>
                <div style={{ fontSize: 13, opacity: 0.82 }}>
                  Approx usable kW at PF {engineerPfFallback}:{' '}
                  {nf2.format(engineerResult.approxKwAtPf)} kW
                </div>

                <div
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(7,11,20,0.35)',
                  }}
                >
                  <b>Starting surge risk:</b> {engineerResult.risk}
                </div>

                <button
                  type="button"
                  onClick={copyEngineerResult}
                  style={{
                    marginTop: 8,
                    width: 'fit-content',
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.14)',
                    background:
                      'linear-gradient(90deg, rgba(37, 99, 235, 0.9), rgba(168, 85, 247, 0.9))',
                    color: '#fff',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  Copy engineer result
                </button>

                <div style={{ paddingTop: 10 }}>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      opacity: 0.86,
                      lineHeight: 1.7,
                    }}
                  >
                    {engineerResult.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.6 }}>
                  If you’re importing machines from China, validate motor power,
                  phase, and start method before shipping. You can use{' '}
                  <a
                    href="https://linescout.sureimports.com/machine-sourcing"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'rgba(255,255,255,0.95)',
                      fontWeight: 900,
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                    }}
                  >
                    LineScout
                  </a>{' '}
                  to qualify the machine specs first.
                </div>
              </div>
            )}
          </div>
        </section>
      )}

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
          How to Size the Right Generator for a Nigerian Factory
        </h2>

        <p style={{ margin: '0 0 12px', opacity: 0.86, lineHeight: 1.75 }}>
          Generator sizing for a factory is not about adding up the “kW” written
          on machines and buying the next big generator you see. Factories are
          dominated by motor loads: pumps, compressors, conveyors, mixers,
          mills, blowers, and gear motors. The big problem is not the running
          load. The big problem is what happens when the largest motor starts.
        </p>

        <p style={{ margin: '0 0 12px', opacity: 0.86, lineHeight: 1.75 }}>
          When a motor starts, it can demand a short burst of power that is much
          higher than its normal running power. If your generator cannot supply
          that burst, you get a voltage dip. In Nigerian factories, voltage dips
          don’t just “slow the motor.” They often: trip contactors, reset PLCs,
          drop relays, cause nuisance shutdowns, and over time damage motor
          windings and control boards. That’s why many factories have a
          generator that “runs the load” but cannot start the line reliably.
        </p>

        <p style={{ margin: '0 0 12px', opacity: 0.86, lineHeight: 1.75 }}>
          This calculator uses your realistic running load, power factor, and
          the largest motor in your plant to estimate a minimum generator size
          in kVA, then adds headroom. Headroom matters in Nigeria because
          installation quality varies (cable sizing, earthing, ATS sizing, phase
          balancing), and because most factories expand and add loads without
          re-planning.
        </p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '14px 0 8px' }}>
          What the calculator assumes (so you don’t size blindly)
        </h3>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            opacity: 0.86,
            lineHeight: 1.75,
          }}
        >
          <li>
            <b>Power factor matters:</b> generators are rated in kVA, and motors
            consume reactive power. If you guess PF too high, you under-size.
          </li>
          <li>
            <b>Starting method matters:</b> DOL creates the highest surge,
            star-delta reduces it, soft starters reduce it more, VFD is lowest
            at start.
          </li>
          <li>
            <b>Operating behavior matters:</b> if operators start machines
            randomly, the generator needs more “stiffness” than when you start
            sequentially.
          </li>
          <li>
            <b>Headroom matters:</b> Nigerian factories typically need 25–35%
            margin for expansion, wiring realities, and generator quality
            differences.
          </li>
        </ul>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '14px 0 8px' }}>
          Generator sizing FAQ
        </h3>

        <div style={{ display: 'grid', gap: 10 }}>
          {[
            {
              q: 'Why are generators rated in kVA but people talk in kW?',
              a: 'kW is real power used to do work. kVA is apparent power, which includes reactive power. Motors and industrial loads draw reactive power, so you can hit the generator’s kVA limit before you reach the kW you expected.',
            },
            {
              q: 'My generator can run the factory, but it struggles when starting machines. Why?',
              a: 'Starting surge. Motors demand a high burst at startup. If the generator cannot handle that burst, voltage dips and contactors/controls drop out.',
            },
            {
              q: 'If I don’t know power factor, what should I use?',
              a: 'For a typical mixed factory load (motors + lighting + small electronics), 0.80 is a safe planning value. If you assume 0.95 without proof, you risk under-sizing.',
            },
            {
              q: 'Do I need a 3-phase generator?',
              a: 'If you have any 3-phase machines, yes. But generator size is not enough. Phase balancing, cable sizing, and earthing are critical to stable operation.',
            },
            {
              q: 'What is the easiest way to reduce generator size risk without buying a bigger generator?',
              a: 'Start machines sequentially and use soft starters or VFDs for large motors. This reduces startup surge and stabilizes voltage during start.',
            },
            {
              q: 'Why do Nigerian factories see more failures even with ‘big’ generators?',
              a: 'Because the generator is only one part. Poor installation, undersized cables, weak ATS, bad earthing, and unbalanced phases create heat and instability that damage equipment over time.',
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
          If you are sourcing machines from China, confirm power requirements
          (kW/HP), phase, and starting method before you ship. You can use{' '}
          <a
            href="https://linescout.sureimports.com/machine-sourcing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 900,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            LineScout
          </a>{' '}
          to qualify machine specs and reduce generator and installation
          mistakes.
        </p>
      </section>

      <section
        style={{
          marginTop: 14,
          padding: 18,
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(7,11,20,0.30)',
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '0 0 8px' }}>
          Helpful planning tools
        </h3>
        <p style={{ margin: 0, opacity: 0.86, lineHeight: 1.75 }}>
          For shipping and import planning, also use:{' '}
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
          ,{' '}
          <a
            href="/tools/carton-optimization"
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 900,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Carton Optimization Tool
          </a>
          ,{' '}
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
          , and{' '}
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
          </a>
          .
        </p>
      </section>
    </main>
  );
}
