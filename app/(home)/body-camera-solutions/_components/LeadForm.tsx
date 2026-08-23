'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const fieldClass =
  'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-orange-500 focus:ring-4 focus:ring-brand-orange-500/10';

const pickerTriggerClass =
  'mt-2 h-[46px] rounded-xl border-slate-300 bg-white px-4 text-slate-950 shadow-none transition hover:border-slate-400 focus:ring-4 focus:ring-brand-orange-500/10 data-[state=open]:border-brand-orange-500 data-[state=open]:ring-4 data-[state=open]:ring-brand-orange-500/10';

const pickerContentClass =
  'z-[100] rounded-2xl border-slate-200 bg-white p-1.5 text-slate-950 shadow-2xl shadow-slate-950/15';

const fleetSizeOptions = [
  '1–20',
  '21–100',
  '101–500',
  '501–1,000',
  'More than 1,000',
  'Not yet known',
];

const liveCommandOptions = [
  'Undecided',
  'Yes',
  'No',
  'For selected users only',
];

const timeframeOptions = [
  'Researching',
  'Within 30 days',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Active tender/RFP',
];

type PremiumPickerProps = {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
  placeholder?: string;
};

function PremiumPicker({
  label,
  name,
  options,
  defaultValue,
  placeholder,
}: PremiumPickerProps) {
  const labelId = `${name}-label`;

  return (
    <div>
      <p id={labelId} className="text-sm font-semibold text-slate-700">
        {label}
      </p>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger aria-labelledby={labelId} className={pickerTriggerClass}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={pickerContentClass}>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              showIndicator={false}
              className="rounded-xl px-3 py-2.5 font-medium focus:bg-brand-orange-50 focus:text-brand-orange-800 data-[state=checked]:bg-brand-orange-50 data-[state=checked]:text-brand-orange-800"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function LeadForm({
  source = 'body-camera-solutions',
}: {
  source?: string;
}) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/body-camera-assessment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...payload, source }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(
          result.message || 'Please check the form and try again.',
        );
      form.reset();
      setStatus('success');
      setMessage(
        result.message || 'Your assessment request has been received.',
      );
      window.dispatchEvent(
        new CustomEvent('sureimports:body-camera-lead', {
          detail: { source },
        }),
      );
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'We could not submit your request. Please try again.',
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-slate-50 p-8 text-center dark:bg-slate-950">
        <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        <h3 className="mt-5 text-2xl font-bold text-slate-950">
          Assessment request received
        </h3>
        <p className="mt-3 max-w-md text-slate-600">{message}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-7 text-sm font-bold text-brand-orange-600 hover:text-brand-orange-700"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-transparent">
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Full name *
          <input
            className={fieldClass}
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Work email *
          <input
            className={fieldClass}
            name="email"
            required
            type="email"
            maxLength={160}
            autoComplete="email"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Organisation *
          <input
            className={fieldClass}
            name="organisation"
            required
            minLength={2}
            maxLength={160}
            autoComplete="organization"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Phone number *
          <input
            className={fieldClass}
            name="phone"
            required
            maxLength={40}
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Country *
          <input
            className={fieldClass}
            name="country"
            required
            maxLength={80}
            defaultValue="Nigeria"
            autoComplete="country-name"
          />
        </label>
        <PremiumPicker
          label="Estimated camera users"
          name="fleetSize"
          placeholder="Select a range"
          options={fleetSizeOptions}
        />
        <PremiumPicker
          label="Live command required?"
          name="liveCommand"
          defaultValue="Undecided"
          options={liveCommandOptions}
        />
        <PremiumPicker
          label="Target timeframe"
          name="timeframe"
          defaultValue="Researching"
          options={timeframeOptions}
        />
        <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
          What should the solution achieve? *
          <textarea
            className={`${fieldClass} min-h-28 resize-y`}
            name="requirements"
            required
            minLength={20}
            maxLength={3000}
            placeholder="Tell us about your sites, users, incidents, retention needs, deployment preference or tender requirements."
          />
        </label>
      </div>

      {message ? (
        <p
          className={`mt-5 text-sm ${status === 'error' ? 'text-red-600' : 'text-slate-600'}`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <button
        disabled={status === 'submitting'}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-4 text-sm font-bold text-white transition hover:bg-brand-orange-600 disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}
        {status === 'submitting'
          ? 'Submitting…'
          : 'Request a solution assessment'}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Your information is used only to assess and respond to this project
        enquiry.
      </p>
    </form>
  );
}
