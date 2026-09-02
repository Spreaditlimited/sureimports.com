'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ClipboardCheck,
  Loader2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import countries from '@/lib/data/countries';
import {
  PENDING_SUPPLIER_VERIFICATION_KEY,
  POST_AUTH_REDIRECT_KEY,
  SUPPLIER_VERIFICATION_DRAFT_VERSION,
  SUPPLIER_VERIFICATION_RESUME_PATH,
} from '@/lib/auth/loginRedirect';

type FormState = {
  supplierName: string;
  supplierNameChinese: string;
  registrationNumber: string;
  supplierPhone: string;
  supplierEmail: string;
  supplierWechat: string;
  supplierAddress: string;
  supplierAddressChinese: string;
  supplierProduct: string;
  supplierWebsite: string;
  marketplaceUrls: string;
  supplierDetails: string;
  verificationType: 'ONLINE' | 'PHYSICAL';
  billingCountry: string;
  termsAccepted: boolean;
};

const initialForm: FormState = {
  supplierName: '',
  supplierNameChinese: '',
  registrationNumber: '',
  supplierPhone: '',
  supplierEmail: '',
  supplierWechat: '',
  supplierAddress: '',
  supplierAddressChinese: '',
  supplierProduct: '',
  supplierWebsite: '',
  marketplaceUrls: '',
  supplierDetails: '',
  verificationType: 'ONLINE',
  billingCountry: 'Nigeria',
  termsAccepted: false,
};

function requestPayload(form: FormState) {
  return {
    ...form,
    marketplaceUrls: form.marketplaceUrls
      .split(/\n|,/)
      .map((value) => value.trim())
      .filter(Boolean),
  };
}

export default function PublicSupplierVerificationFlow({
  feeNaira,
  feeUsd,
  onlineEnabled,
  physicalEnabled,
}: {
  feeNaira: number;
  feeUsd: number;
  onlineEnabled: boolean;
  physicalEnabled: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    verificationType: onlineEnabled ? 'ONLINE' : 'PHYSICAL',
  }));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(
      PENDING_SUPPLIER_VERIFICATION_KEY,
    );
    if (!saved) return;
    try {
      const savedDraft = JSON.parse(saved) as {
        version?: number;
        form?: Partial<FormState>;
      };
      if (
        savedDraft.version !== SUPPLIER_VERIFICATION_DRAFT_VERSION ||
        !savedDraft.form
      ) {
        throw new Error('Unsupported verification draft.');
      }
      setForm((current) => {
        const restored = { ...current, ...savedDraft.form };
        if (restored.verificationType === 'ONLINE' && !onlineEnabled) {
          restored.verificationType = 'PHYSICAL';
        }
        if (restored.verificationType === 'PHYSICAL' && !physicalEnabled) {
          restored.verificationType = 'ONLINE';
        }
        return restored;
      });
    } catch {
      window.localStorage.removeItem(PENDING_SUPPLIER_VERIFICATION_KEY);
    }
  }, [onlineEnabled, physicalEnabled]);

  const update = (name: keyof FormState, value: string | boolean) =>
    setForm((current) => ({ ...current, [name]: value }));

  const saveForAuthentication = () => {
    window.localStorage.setItem(
      PENDING_SUPPLIER_VERIFICATION_KEY,
      JSON.stringify({
        version: SUPPLIER_VERIFICATION_DRAFT_VERSION,
        form,
      }),
    );
    window.localStorage.setItem(
      POST_AUTH_REDIRECT_KEY,
      SUPPLIER_VERIFICATION_RESUME_PATH,
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.termsAccepted) {
      toast.error('Accept the verification terms to continue.');
      return;
    }
    setSubmitting(true);
    try {
      const authResponse = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!authResponse.ok) {
        saveForAuthentication();
        toast.info(
          'Please sign in or create an account to save your verification request.',
        );
        router.push(
          `/auth/login?next=${encodeURIComponent(SUPPLIER_VERIFICATION_RESUME_PATH)}`,
        );
        return;
      }

      const response = await fetch('/api/supplier-verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload(form)),
      });
      const data = await response.json();
      if (response.status === 401) {
        saveForAuthentication();
        router.push(
          `/auth/login?next=${encodeURIComponent(SUPPLIER_VERIFICATION_RESUME_PATH)}`,
        );
        return;
      }
      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit your request.');
      }

      window.localStorage.removeItem(PENDING_SUPPLIER_VERIFICATION_KEY);
      window.localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
      toast.success('Verification request created. Continue to payment.');
      router.push('/dashboard/verify-supplier');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to submit your request right now.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-7 text-left">
      <div className="flex items-start gap-3 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange-50 text-brand-orange-500 dark:bg-brand-orange-500/10">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            Start your Supplier Verification
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Use the registered Chinese name and address where possible. Your
            draft will be preserved if you need to sign in or create an account.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Supplier/trading name (English)"
          required
          value={form.supplierName}
          onChange={(value) => update('supplierName', value)}
        />
        <Field
          label="Registered company name (Chinese)"
          value={form.supplierNameChinese}
          onChange={(value) => update('supplierNameChinese', value)}
          placeholder="例如：广州…有限公司"
        />
        <Field
          label="Unified Social Credit Code"
          value={form.registrationNumber}
          onChange={(value) => update('registrationNumber', value)}
        />
        <Field
          label="Product or service supplied"
          required
          value={form.supplierProduct}
          onChange={(value) => update('supplierProduct', value)}
        />
        <Field
          label="Phone"
          value={form.supplierPhone}
          onChange={(value) => update('supplierPhone', value)}
        />
        <Field
          label="Email"
          type="email"
          value={form.supplierEmail}
          onChange={(value) => update('supplierEmail', value)}
        />
        <Field
          label="WeChat ID"
          value={form.supplierWechat}
          onChange={(value) => update('supplierWechat', value)}
        />
        <Field
          label="Website"
          type="url"
          value={form.supplierWebsite}
          onChange={(value) => update('supplierWebsite', value)}
          placeholder="https://"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Area
          label="Supplier address (English)"
          required
          value={form.supplierAddress}
          onChange={(value) => update('supplierAddress', value)}
        />
        <Area
          label="Registered address (Chinese)"
          value={form.supplierAddressChinese}
          onChange={(value) => update('supplierAddressChinese', value)}
          placeholder="Used for registry matching and physical-visit research"
        />
      </div>

      <Area
        label="Marketplace links"
        value={form.marketplaceUrls}
        onChange={(value) => update('marketplaceUrls', value)}
        placeholder="One Alibaba, 1688 or Made-in-China URL per line"
      />
      <Area
        label="What should we investigate?"
        required
        value={form.supplierDetails}
        onChange={(value) => update('supplierDetails', value)}
        placeholder="Describe the proposed transaction, concerns, quotation or beneficiary details that should be checked."
      />

      <fieldset>
        <legend className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Verification method
        </legend>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Choice
            selected={form.verificationType === 'ONLINE'}
            disabled={!onlineEnabled}
            onClick={() => update('verificationType', 'ONLINE')}
            icon={ClipboardCheck}
            title="Online checks in China"
            description="Company identity, registry, contact and transaction consistency checks."
          />
          <Choice
            selected={form.verificationType === 'PHYSICAL'}
            disabled={!physicalEnabled}
            onClick={() => update('verificationType', 'PHYSICAL')}
            icon={MapPin}
            title="Physical visit requested"
            description="Pay standard checks first, then approve or decline the separate travel and lodging quote."
          />
        </div>
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
        <CountrySelect
          value={form.billingCountry}
          onChange={(value) => update('billingCountry', value)}
        />
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Standard verification fee
          </p>
          <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">
            {!form.billingCountry
              ? 'Select a billing country'
              : form.billingCountry.toLowerCase() === 'nigeria'
                ? `₦${feeNaira.toLocaleString()} via Paystack`
                : `$${feeUsd.toFixed(2)} via PayPal`}
          </p>
          {form.verificationType === 'PHYSICAL' ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              The optional travel and lodging quote is researched only after
              this standard fee is paid.
            </p>
          ) : null}
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm leading-6 dark:border-slate-800">
        <input
          type="checkbox"
          checked={form.termsAccepted}
          onChange={(event) => update('termsAccepted', event.target.checked)}
          className="mt-1 h-4 w-4 accent-brand-orange-500"
        />
        <span className="text-slate-700 dark:text-slate-300">
          I understand that verification reports findings available at the time
          of the checks and is not a guarantee of future supplier performance.
        </span>
      </label>

      <button
        type="submit"
        disabled={
          submitting ||
          !form.termsAccepted ||
          (!onlineEnabled && !physicalEnabled)
        }
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-7 text-base font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        {submitting ? 'Saving your request…' : 'Save request and continue'}
      </button>
      <p className="text-sm leading-6 text-slate-500">
        You’ll sign in or create an account if needed, then choose payment from
        your secure dashboard.
      </p>
    </form>
  );
}

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        Billing country <span className="text-red-500">*</span>
      </span>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        <option value="">Select billing country</option>
        {countries
          .filter((country) => country.optionValue)
          .map((country) => (
            <option key={country.optionValue} value={country.optionValue}>
              {country.optionName}
            </option>
          ))}
      </select>
      <span className="mt-1 block text-xs text-slate-500">
        Nigeria pays in NGN. Every other country pays in USD.
      </span>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <textarea
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function Choice({
  selected,
  disabled,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: typeof ClipboardCheck;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-2xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? 'border-brand-orange-500 bg-brand-orange-50 ring-2 ring-brand-orange-500/15 dark:bg-brand-orange-500/10'
          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60'
      }`}
    >
      <Icon
        className={`h-5 w-5 ${selected ? 'text-brand-orange-500' : 'text-slate-500'}`}
      />
      <span className="mt-3 block font-black text-slate-950 dark:text-white">
        {title}
      </span>
      <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-400">
        {disabled ? 'Temporarily unavailable.' : description}
      </span>
    </button>
  );
}
