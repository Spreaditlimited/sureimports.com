import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { authBrand } from './brand';
import styles from './AuthUI.module.css';

export default function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.layout} ${inter.className}`}>
      <aside className={styles.story} aria-label={authBrand.name}>
        <Image
          src={authBrand.photo}
          alt=""
          fill
          sizes="50vw"
          priority
          className={styles.photo}
        />
        <div className={styles.shade} />
        <Link
          href={authBrand.home}
          className={styles.storyLogo}
          aria-label={`${authBrand.name} home`}
        >
          <Image
            src={authBrand.whiteLogo}
            alt="Sure Imports"
            width={194}
            height={32}
            priority
          />
        </Link>
        <div className={styles.storyCopy}>
          <h2>
            {authBrand.headline}
            <br />
            <span>{authBrand.highlight}</span>
          </h2>
          <p>{authBrand.description}</p>
        </div>
      </aside>
      <section className={styles.workspace} aria-label="Your account">
        <div className={styles.content}>
          <Link
            href={authBrand.home}
            className={styles.mobileLogo}
            aria-label={`${authBrand.name} home`}
          >
            <Image
              src={authBrand.logo}
              alt="Sure Imports"
              width={194}
              height={32}
              priority
              className={styles.lightLogo}
            />
            <Image
              src={authBrand.whiteLogo}
              alt="Sure Imports"
              width={194}
              height={32}
              className={styles.darkLogo}
            />
          </Link>
          {children}
        </div>
      </section>
    </div>
  );
}
