import { Camera, Database, Radio, Server, ShieldCheck } from 'lucide-react';

type ProductVisualProps = {
  kind?: 'camera' | 'platform' | 'docking' | 'command';
  label: string;
  compact?: boolean;
};

const iconByKind = {
  camera: Camera,
  platform: Database,
  docking: Server,
  command: Radio,
};

export default function ProductVisual({
  kind = 'camera',
  label,
  compact = false,
}: ProductVisualProps) {
  const Icon = iconByKind[kind];

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 ${compact ? 'min-h-56' : 'min-h-[420px]'}`}
      aria-label={`${label} visual placeholder`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(249,90,14,0.22),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(69,121,240,0.18),transparent_35%)]" />
      <div className="absolute -right-20 top-10 h-64 w-64 rounded-full border border-white/10" />
      <div className="absolute -right-8 top-24 h-44 w-44 rounded-full border border-white/10" />
      <div className="min-h-inherit relative flex h-full flex-col items-center justify-center px-8 py-12 text-center">
        <div className="mb-7 grid h-28 w-28 place-items-center rounded-[2rem] border border-white/15 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur">
          <Icon
            className="h-14 w-14 text-brand-orange-400"
            strokeWidth={1.35}
          />
        </div>
        <p className="max-w-sm text-xl font-semibold text-white">{label}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Hytera-approved asset pending
        </div>
      </div>
    </div>
  );
}
