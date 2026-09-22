'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import styles from './ProductImage.module.css';
import phoneLayouts from '@/lib/shop/phone-image-layouts.json';

/** One non-destructive presentation for the entire shop catalogue. */
export default function ProductImage({
  src,
  alt,
  priority = false,
  detail = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  detail?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const key =
    src
      .split('/image/upload/')
      .pop()
      ?.replace(/^v\d+\//, '') || '';
  const bounds = (phoneLayouts as Record<string, number[]>)[key];
  const cropStyle = bounds
    ? ({ '--phone-ratio': bounds[2] / bounds[3] } as CSSProperties)
    : undefined;
  const imageStyle = bounds
    ? {
        position: 'absolute' as const,
        left: `${(-bounds[0] / bounds[2]) * 100}%`,
        top: `${(-bounds[1] / bounds[3]) * 100}%`,
        width: `${(bounds[4] / bounds[2]) * 100}%`,
        height: `${(bounds[5] / bounds[3]) * 100}%`,
        maxWidth: 'none',
      }
    : undefined;
  return (
    <div
      className={`${styles.stage} ${detail ? styles.detail : ''}`}
      data-product-image
    >
      {src && failedSource !== src ? (
        <div className={`${styles.frame} ${bounds ? styles.phoneFrame : ''}`}>
          <div
            className={bounds ? styles.phoneCrop : styles.uncropped}
            style={cropStyle}
          >
            <Image
              src={src}
              alt={alt}
              fill={!bounds}
              width={bounds?.[4]}
              height={bounds?.[5]}
              sizes={
                detail
                  ? '(max-width: 1023px) 80vw, 500px'
                  : '(max-width: 639px) 80vw, (max-width: 1023px) 40vw, 260px'
              }
              priority={priority}
              className={styles.image}
              style={imageStyle}
              onError={() => setFailedSource(src)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>
          <Package size={40} strokeWidth={1} />
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
}
