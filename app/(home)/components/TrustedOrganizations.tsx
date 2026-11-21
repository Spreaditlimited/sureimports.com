'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './TrustedOrganizations.module.css';

// Visible artwork bounds exclude transparent export margins. Originals stay intact.
const clients = [
  {
    name: 'Kitcha',
    src: '/home/kitcha-logo-transparent.png',
    width: 1679,
    height: 937,
    crop: [132, 163, 1491, 555],
    displayWidth: 180,
  },
  {
    name: 'Moppet',
    src: '/Moppet.PNG',
    width: 1536,
    height: 1024,
    crop: [61, 282, 1412, 348],
    displayWidth: 180,
  },
  {
    name: 'Microware',
    src: '/Microware.PNG',
    width: 1536,
    height: 1024,
    crop: [289, 336, 975, 250],
    displayWidth: 200,
  },
  {
    name: 'Sterling',
    src: '/Sterling.PNG',
    width: 1536,
    height: 1024,
    crop: [204, 322, 1069, 332],
    displayWidth: 180,
  },
  {
    name: 'CafeOne',
    src: '/cafeOne.PNG',
    width: 1536,
    height: 1024,
    crop: [522, 162, 491, 578],
    displayWidth: 76,
  },
  {
    name: 'Dr. Muibat Adeniran',
    src: '/Dr-Muibat-Adeniran-OBGYN-p.png',
    width: 1080,
    height: 257,
    crop: [61, 7, 911, 239],
    displayWidth: 240,
  },
];

export default function TrustedOrganizations({
  embedded = false,
  label = 'Trusted by organizations across Nigeria',
}: {
  embedded?: boolean;
  label?: string;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className={`${styles.trust} ${embedded ? styles.embedded : ''}`}
      aria-label="Organizations that trust Sure Imports"
    >
      <p>{label}</p>
      <div
        className={styles.logos}
        role="region"
        aria-label="Organization logos"
        tabIndex={0}
      >
        <div className={styles.track} data-paused={paused}>
          {[false, true].map((duplicate) => (
            <div
              key={String(duplicate)}
              className={styles.group}
              aria-hidden={duplicate || undefined}
            >
              {clients.map(
                ({
                  name,
                  src,
                  width,
                  height,
                  crop: [x, y, cropWidth, cropHeight],
                  displayWidth,
                }) => (
                  <div key={name}>
                    <div
                      className={styles.logoArtwork}
                      style={{
                        width: displayWidth,
                        aspectRatio: `${cropWidth} / ${cropHeight}`,
                      }}
                    >
                      <Image
                        src={src}
                        alt={duplicate ? '' : name}
                        width={width}
                        height={height}
                        sizes={`${Math.ceil((displayWidth * width) / cropWidth)}px`}
                        style={{
                          width: `${(width / cropWidth) * 100}%`,
                          height: `${(height / cropHeight) * 100}%`,
                          left: `${(-x / cropWidth) * 100}%`,
                          top: `${(-y / cropHeight) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles.motionControl}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? 'Resume logos' : 'Pause logos'}
      </button>
    </section>
  );
}
