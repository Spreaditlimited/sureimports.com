'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import styles from './ProductImage.module.css';

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
  return (
    <div
      className={`${styles.stage} ${detail ? styles.detail : ''}`}
      data-product-image
    >
      {src && failedSource !== src ? (
        <div className={styles.frame}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={
              detail
                ? '(max-width: 1023px) 80vw, 500px'
                : '(max-width: 639px) 80vw, (max-width: 1023px) 40vw, 260px'
            }
            priority={priority}
            className={styles.image}
            onError={() => setFailedSource(src)}
          />
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
