'use client';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
function Icon({ kind }: { kind: 'mail' | 'lock' | 'eye' | 'hidden' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'mail' ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </>
      ) : kind === 'lock' ? (
        <>
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      ) : (
        <>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {kind === 'hidden' ? <path d="m3 3 18 18" /> : null}
        </>
      )}
    </svg>
  );
}
import SocialButtons from '@/components/apple/SocialButtons';
import AuthHeading from './AuthHeading';
import styles from './AuthUI.module.css';

type Props = {
  description: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  email?: string;
  password?: string;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  busy?: boolean;
  disabled?: boolean;
  error?: string;
  forgotHref: string;
  signupHref: string;
  next?: string;
  extra?: ReactNode;
};
export default function AuthSignIn(props: Props) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <>
      <AuthHeading title="Welcome back" description={props.description} />
      <SocialButtons next={props.next} rememberMe={rememberMe} />
      <div className={styles.divider}>or log in with email</div>
      <form
        className={styles.form}
        onSubmit={props.onSubmit}
        aria-busy={props.busy || undefined}
      >
        <label htmlFor={`${id}-email`}>Email address</label>
        <div className={styles.inputWrap}>
          <Icon kind="mail" />
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={props.email}
            onChange={
              props.onEmailChange
                ? (e) => props.onEmailChange!(e.target.value)
                : undefined
            }
            required
          />
        </div>
        <label htmlFor={`${id}-password`}>Password</label>
        <div className={styles.inputWrap}>
          <Icon kind="lock" />
          <input
            id={`${id}-password`}
            type={visible ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={props.password}
            onChange={
              props.onPasswordChange
                ? (e) => props.onPasswordChange!(e.target.value)
                : undefined
            }
            required
          />
          <button
            className={styles.eye}
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            <Icon kind={visible ? 'hidden' : 'eye'} />
          </button>
        </div>
        <div className={styles.options}>
          <label className={styles.remember}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <Link className={styles.recovery} href={props.forgotHref}>
            Forgot password?
          </Link>
        </div>
        {props.error ? (
          <p className={styles.error} role="alert">
            {props.error}
          </p>
        ) : null}
        <button
          className={styles.submit}
          type="submit"
          disabled={props.busy || props.disabled}
        >
          {props.busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className={styles.switch}>
        Don’t have an account? <Link href={props.signupHref}>Sign up</Link>
      </p>
      <p className={styles.legal}>
        Protected by reCAPTCHA. Google’s{' '}
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </p>
      {props.extra ? <div className={styles.extra}>{props.extra}</div> : null}
    </>
  );
}
