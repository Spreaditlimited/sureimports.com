type ReportCoverProps = {
  title: string;
  editionLabel: string;
  supplierCount: number;
  coverImageUrl?: string | null;
  compact?: boolean;
};

export default function ReportCover({
  title,
  editionLabel,
  supplierCount,
  coverImageUrl,
  compact = false,
}: ReportCoverProps) {
  const coverTitle = title.replace(/\s+Supplier Intelligence Report$/i, '');
  return (
    <div
      className={`relative isolate aspect-[1/1.414] overflow-hidden rounded-2xl bg-[#071426] text-white shadow-2xl ${compact ? 'p-5' : 'p-8 sm:p-10'}`}
    >
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={`${coverTitle} supplier intelligence report cover`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-[#071426]/20" />
      <div className="absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-[#071426] via-[#071426]/95 to-[#071426]/70" />
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#071426] via-[#071426]/90 to-transparent" />
      <div className="relative flex h-full flex-col">
        <img
          src="/assets/img/logo.svg"
          alt="Sure Imports"
          className={`${compact ? 'w-32' : 'w-44'} brightness-0 invert`}
        />
        <p
          className={`${compact ? 'mt-10 text-[8px]' : 'mt-16 text-xs'} font-black uppercase tracking-[0.24em] text-brand-orange-400`}
        >
          Supplier Intelligence
        </p>
        <h2
          className={`${compact ? 'mt-3 text-xl' : 'mt-5 text-3xl sm:text-4xl'} font-black leading-tight tracking-tight`}
        >
          {coverTitle}
        </h2>
        <div className="mt-auto">
          <span
            className={`${compact ? 'text-[8px]' : 'text-xs'} inline-flex rounded-full bg-brand-orange-500 px-3 py-2 font-black uppercase tracking-wider`}
          >
            {editionLabel} · {supplierCount} verified manufacturers
          </span>
          {!compact ? (
            <div className="mt-6 space-y-1 text-xs text-slate-400">
              <p>www.sureimports.com</p>
              <p>WhatsApp: +234 803 764 9956</p>
              <p>hello@sureimports.com</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
