'use client';

import { useEffect, useRef, useState } from 'react';

type Player = {
  playVideo(): void;
  destroy(): void;
  getIframe(): HTMLIFrameElement;
};
type PlayerOptions = {
  host: string;
  videoId: string;
  width: string;
  height: string;
  playerVars: { origin: string; playsinline: number; rel: number };
  events: { onReady(): void; onError(): void };
};
type YouTubeApi = {
  Player: new (element: HTMLElement, options: PlayerOptions) => Player;
};
type YouTubeWindow = Window & {
  YT?: YouTubeApi;
  onYouTubeIframeAPIReady?: () => void;
};
let apiPromise: Promise<YouTubeApi> | undefined;
function loadApi() {
  const host = window as YouTubeWindow;
  if (host.YT?.Player) return Promise.resolve(host.YT);
  if (!apiPromise) {
    apiPromise = new Promise<YouTubeApi>((resolve, reject) => {
      const previous = host.onYouTubeIframeAPIReady;
      const timer = window.setTimeout(
        () => reject(new Error('YouTube unavailable')),
        15000,
      );
      host.onYouTubeIframeAPIReady = () => {
        window.clearTimeout(timer);
        previous?.();
        if (host.YT?.Player) resolve(host.YT);
        else reject(new Error('YouTube unavailable'));
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error('YouTube unavailable'));
      };
      document.head.appendChild(script);
    }).catch((error) => {
      apiPromise = undefined;
      throw error;
    });
  }
  return apiPromise;
}

export default function YouTubePosterPlayer({
  videoId,
  poster,
  title,
  className,
}: {
  videoId: string;
  poster: string;
  title: string;
  className: string;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    let instance: Player | undefined;
    setReady(false);
    setStarted(false);
    setFailed(false);
    // The API owns only this child, leaving React's wrapper intact on cleanup.
    const target = document.createElement('div');
    mount.current?.appendChild(target);
    void loadApi()
      .then((api) => {
        if (disposed) return;
        instance = new api.Player(target, {
          host: 'https://www.youtube-nocookie.com',
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              if (disposed || !instance) return;
              instance.getIframe().title = title;
              player.current = instance;
              setReady(true);
            },
            onError: () => {
              if (!disposed) setFailed(true);
            },
          },
        });
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      player.current = null;
      instance?.destroy();
      target.remove();
    };
  }, [videoId, title]);
  return (
    <div
      className={`relative overflow-hidden bg-slate-950 ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      <div ref={mount} className="absolute inset-0 h-full w-full" />
      {!started && (
        <button
          type="button"
          disabled={!ready || failed}
          aria-label={
            failed
              ? 'Video unavailable'
              : ready
                ? `Play ${title}`
                : 'Preparing video'
          }
          onClick={() => {
            if (!player.current || !ready) return;
            // Invoke playback synchronously within the original click gesture.
            player.current.playVideo();
            setStarted(true);
          }}
          className="group absolute inset-0 block h-full w-full bg-cover bg-center focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-white disabled:cursor-wait"
          style={{ backgroundImage: `url(${poster})` }}
        >
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <span
              style={{ backgroundColor: '#ff0000', color: '#ffffff' }}
              className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105 md:h-24 md:w-24"
            >
              {ready && !failed ? (
                <svg
                  style={{ fill: '#ffffff' }}
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  className="ml-1 h-10 w-10 fill-white md:h-12 md:w-12"
                >
                  <path d="M9 5v22l19-11z" />
                </svg>
              ) : (
                <span className="text-xs font-semibold text-white">
                  {failed ? 'Unavailable' : 'Loading…'}
                </span>
              )}
            </span>
            {ready && !failed && (
              <span
                style={{ backgroundColor: '#ff0000', color: '#ffffff' }}
                className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-lg"
              >
                Play video
              </span>
            )}
          </span>
        </button>
      )}
      {failed && (
        <a
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white px-4 py-2 text-sm text-slate-950"
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on YouTube
        </a>
      )}
    </div>
  );
}
