type HeroTitleProps = {
  lines: string[];
};

export default function HeroTitle({ lines }: HeroTitleProps) {
  return (
    <h1
      aria-label={lines.join(' ')}
      className="si-body-hero-title mt-4 font-semibold"
    >
      {lines.map((line) => (
        <span key={line}>
          {line}{' '}
        </span>
      ))}
    </h1>
  );
}
