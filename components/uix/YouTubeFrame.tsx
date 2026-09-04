'use client';

import React, { useMemo, useState } from 'react';

interface YouTubeFrameProps {
  videoId?: string;
  src?: string;
  title?: string;
  className?: string;
  thumbnailQuality?:
    | 'default'
    | 'hqdefault'
    | 'mqdefault'
    | 'sddefault'
    | 'maxresdefault';
  width?: string;
  height?: string;
  loadImmediately?: boolean;
}

function getYouTubeVideoId(input: string): string {
  try {
    const url = new URL(input);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '');
    }
    if (url.pathname.startsWith('/embed/')) {
      return url.pathname.split('/embed/')[1]?.split('/')[0] || input;
    }
    return url.searchParams.get('v') || input;
  } catch {
    return input;
  }
}

const YouTubeFrame: React.FC<YouTubeFrameProps> = ({
  videoId,
  src,
  title = 'YouTube video',
  className = '',
  thumbnailQuality = 'hqdefault',
  width = '100%',
  height = '100%',
  loadImmediately = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(loadImmediately);
  const resolvedVideoId = useMemo(
    () => getYouTubeVideoId(videoId || src || ''),
    [src, videoId],
  );
  const thumbnailUrl = `https://i.ytimg.com/vi/${resolvedVideoId}/${thumbnailQuality}.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${resolvedVideoId}?autoplay=1&rel=0`;

  if (!resolvedVideoId) return null;

  return (
    <div
      className={`relative overflow-hidden bg-slate-950 ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      {isLoaded ? (
        <iframe
          src={embedUrl}
          title={title}
          width={width}
          height={height}
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          aria-label={`Play ${title}`}
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 block h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        >
          <span className="absolute inset-0 bg-black/20 transition hover:bg-black/10" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-xl transition hover:scale-105">
            <span className="ml-1 h-0 w-0 border-y-[12px] border-l-[18px] border-y-transparent border-l-slate-950" />
          </span>
        </button>
      )}
    </div>
  );
};

export default YouTubeFrame;
