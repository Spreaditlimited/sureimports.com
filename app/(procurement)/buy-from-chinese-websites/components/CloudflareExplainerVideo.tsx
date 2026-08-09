const playerUrl =
  'https://customer-1vkeaflxib2kotwm.cloudflarestream.com/2f9049540b0587a11a1975527906ea2a/iframe';

export default function CloudflareExplainerVideo() {
  return (
    <div className="relative aspect-[1108/720] w-full overflow-hidden bg-slate-950">
      <iframe
        src={playerUrl}
        title="How Buy From Chinese Websites works at Sure Imports"
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
