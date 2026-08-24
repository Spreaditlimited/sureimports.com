type HeroTitleProps = {
  lines: string[];
};

export default function HeroTitle({ lines }: HeroTitleProps) {
  return (
    <h1
      aria-label={lines.join(' ')}
      className="mt-4 text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[4.5rem]"
    >
      {lines.map((line) => (
        <span key={line} className="block sm:whitespace-nowrap">
          {line}
        </span>
      ))}
    </h1>
  );
}
