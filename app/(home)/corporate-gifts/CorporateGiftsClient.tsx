'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Button } from '@/app/(home)/components/ui/button';
import { Input } from '@/app/(home)/components/ui/input';
import { Label } from '@/app/(home)/components/ui/label';
import { Textarea } from '@/app/(home)/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/(home)/components/ui/select';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type FormErrors = Record<string, string>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

type FormValues = {
  business_name: string;
  contact_person_full_name: string;
  product_or_item_needed: string;
  detailed_specifications: string;
  quantity_needed: string;
  preferred_quality_level: string;
  branding_customization_required: string;
  expected_delivery_date: string;
  final_delivery_location_nigeria: string;
  contact_email: string;
  whatsapp_number: string;
  proceed_timeline: string;
  hear_about_sureimports: string;
  additional_notes: string;
};

const initialValues: FormValues = {
  business_name: '',
  contact_person_full_name: '',
  product_or_item_needed: '',
  detailed_specifications: '',
  quantity_needed: '',
  preferred_quality_level: '',
  branding_customization_required: '',
  expected_delivery_date: '',
  final_delivery_location_nigeria: '',
  contact_email: '',
  whatsapp_number: '',
  proceed_timeline: '',
  hear_about_sureimports: '',
  additional_notes: '',
};

const qualityOptions = [
  'Basic but decent',
  'Mid-range corporate quality',
  'Premium executive gift',
  'Not sure, advise us',
];

const brandingOptions = [
  'Yes, with our logo',
  'Yes, but we need design guidance',
  'No branding needed',
  'Not sure yet',
];

const proceedOptions = [
  'Immediately',
  'Within 1 week',
  'Within 2 - 4 weeks',
  'Still comparing options',
];

const sourceOptions = [
  'Facebook',
  'Instagram',
  'Google',
  'Referral',
  'Existing customer',
  'WhatsApp',
  'Other',
];

export default function CorporateGiftsClient() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [currentStep, setCurrentStep] = useState(0);

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const steps = [
    'Business Details',
    'Product Details',
    'Branding and Files',
    'Delivery and Contact',
  ] as const;
  const isLastStep = currentStep === steps.length - 1;

  const onChange = (name: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validate = (stepIndex?: number) => {
    const nextErrors: FormErrors = {};

    const requiredByStep: [keyof FormValues, string][][] = [
      [
        ['business_name', 'Business name is required.'],
        ['contact_person_full_name', 'Contact person full name is required.'],
      ],
      [
        ['product_or_item_needed', 'Product or item needed is required.'],
        ['detailed_specifications', 'Detailed specifications are required.'],
        ['quantity_needed', 'Quantity needed is required.'],
        ['preferred_quality_level', 'Preferred quality level is required.'],
      ],
      [
        [
          'branding_customization_required',
          'Please choose if branding/customization is required.',
        ],
      ],
      [
        ['expected_delivery_date', 'Expected delivery date is required.'],
        [
          'final_delivery_location_nigeria',
          'Final delivery location in Nigeria is required.',
        ],
        ['contact_email', 'Contact email is required.'],
        ['whatsapp_number', 'WhatsApp number is required.'],
      ],
    ];

    const requiredSet =
      typeof stepIndex === 'number'
        ? requiredByStep[stepIndex]
        : requiredByStep.flat();

    requiredSet.forEach(([key, message]) => {
      if (!values[key].trim()) nextErrors[key] = message;
    });

    const shouldCheckEmail = typeof stepIndex !== 'number' || stepIndex === 3;
    if (
      shouldCheckEmail &&
      values.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact_email)
    ) {
      nextErrors.contact_email = 'Please enter a valid email address.';
    }

    const shouldCheckQuantity =
      typeof stepIndex !== 'number' || stepIndex === 1;
    if (shouldCheckQuantity) {
      const quantity = Number(values.quantity_needed);
      if (!values.quantity_needed || Number.isNaN(quantity) || quantity <= 0) {
        nextErrors.quantity_needed = 'Quantity must be a positive number.';
      }
    }

    const shouldCheckFiles = typeof stepIndex !== 'number' || stepIndex === 2;
    if (
      shouldCheckFiles &&
      referenceFile &&
      referenceFile.size > MAX_FILE_SIZE
    ) {
      nextErrors.reference_image_upload =
        'Reference file must be 10MB or less.';
    }

    if (shouldCheckFiles && logoFile && logoFile.size > MAX_FILE_SIZE) {
      nextErrors.company_logo_upload =
        'Company logo file must be 10MB or less.';
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setReferenceFile(null);
    setLogoFile(null);
    setErrors({});
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    setStatus('idle');
    const isValid = validate(currentStep);
    if (!isValid) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setStatus('idle');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('idle');

    if (!validate()) return;

    setStatus('submitting');

    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (referenceFile)
        formData.append('reference_image_upload', referenceFile);
      if (logoFile) formData.append('company_logo_upload', logoFile);

      const searchParams = new URLSearchParams(window.location.search);
      formData.append('page_url', window.location.href);
      formData.append('utm_source', searchParams.get('utm_source') || '');
      formData.append('utm_medium', searchParams.get('utm_medium') || '');
      formData.append('utm_campaign', searchParams.get('utm_campaign') || '');
      formData.append('utm_content', searchParams.get('utm_content') || '');
      formData.append('utm_term', searchParams.get('utm_term') || '');
      formData.append('submitted_at', new Date().toISOString());

      const response = await fetch('/api/corporate-gifts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Submission failed');

      setStatus('success');
      resetForm();
    } catch (error) {
      console.error('Corporate gifts submission failed', error);
      setStatus('error');
    }
  };

  return (
    <div
      id="corporate-gifts-form"
      className="rounded-[24px] border border-white/15 bg-[#111429]/85 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Submit Your Sourcing Request
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          We only use the information you submit to review your request and
          contact you about this sourcing enquiry.
        </p>
        <p className="mt-1 text-sm text-slate-300">
          We will follow up mainly on WhatsApp because it is faster for
          confirming product details and timelines.
        </p>
      </div>

      {status === 'success' ? (
        <div className="mb-6 rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Thank you. Your corporate gift sourcing request has been received. Our
          team will review the details and reach out on WhatsApp.
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="mb-6 rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
          We could not submit your request. Please try again or contact us on
          WhatsApp.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{steps[currentStep]}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  if (index <= currentStep) setCurrentStep(index);
                }}
                className={`h-2 rounded-full transition ${
                  index <= currentStep ? 'bg-blue-400' : 'bg-white/15'
                }`}
                aria-label={`Go to ${step}`}
              />
            ))}
          </div>
        </div>

        {currentStep === 0 ? (
          <Section title="Business Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="Business name"
                required
                value={values.business_name}
                onChange={(next) => onChange('business_name', next)}
                placeholder="Your business or organisation name"
                error={errors.business_name}
              />
              <TextField
                label="Contact person full name"
                required
                value={values.contact_person_full_name}
                onChange={(next) => onChange('contact_person_full_name', next)}
                placeholder="Full name"
                error={errors.contact_person_full_name}
              />
            </div>
          </Section>
        ) : null}

        {currentStep === 1 ? (
          <Section title="Product Details">
            <TextField
              label="Product or item needed"
              required
              value={values.product_or_item_needed}
              onChange={(next) => onChange('product_or_item_needed', next)}
              placeholder="E.g. branded mugs, notebooks, power banks"
              error={errors.product_or_item_needed}
            />

            <div>
              <Label className="mb-2 block text-sm font-medium text-slate-100">
                Detailed specifications *
              </Label>
              <Textarea
                value={values.detailed_specifications}
                onChange={(e) =>
                  onChange('detailed_specifications', e.target.value)
                }
                rows={5}
                placeholder="Include size, color, material, packaging, branding position, preferred quality, or any other important detail."
                className="border-white/20 bg-white/5 text-white placeholder:text-slate-400 focus-visible:ring-blue-400/40"
              />
              <ErrorText text={errors.detailed_specifications} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="Quantity needed"
                required
                value={values.quantity_needed}
                onChange={(next) => onChange('quantity_needed', next)}
                type="number"
                placeholder="E.g. 500"
                error={errors.quantity_needed}
                min={1}
              />
              <PremiumSelect
                label="Preferred quality level"
                required
                value={values.preferred_quality_level}
                onValueChange={(next) =>
                  onChange('preferred_quality_level', next)
                }
                options={qualityOptions}
                placeholder="Select quality level"
                error={errors.preferred_quality_level}
              />
            </div>
          </Section>
        ) : null}

        {currentStep === 2 ? (
          <Section title="Branding and Files">
            <PremiumSelect
              label="Is branding/customization required?"
              required
              value={values.branding_customization_required}
              onValueChange={(next) =>
                onChange('branding_customization_required', next)
              }
              options={brandingOptions}
              placeholder="Choose an option"
              error={errors.branding_customization_required}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FileField
                label="Reference image upload"
                accept="image/*,.pdf"
                onChange={setReferenceFile}
                error={errors.reference_image_upload}
              />
              <FileField
                label="Company logo upload"
                accept=".png,.jpg,.jpeg,.svg,.pdf"
                onChange={setLogoFile}
                error={errors.company_logo_upload}
              />
            </div>
            <p className="text-xs text-slate-400">
              Accepted files: image formats and PDF. Max file size: 10MB per
              file.
            </p>
          </Section>
        ) : null}

        {currentStep === 3 ? (
          <Section title="Delivery and Contact">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="Expected delivery date"
                required
                value={values.expected_delivery_date}
                onChange={(next) => onChange('expected_delivery_date', next)}
                type="date"
                min={minDate}
                error={errors.expected_delivery_date}
              />
              <TextField
                label="Final delivery location in Nigeria"
                required
                value={values.final_delivery_location_nigeria}
                onChange={(next) =>
                  onChange('final_delivery_location_nigeria', next)
                }
                placeholder="City and state, e.g. Lekki, Lagos or GRA, Port Harcourt"
                error={errors.final_delivery_location_nigeria}
              />
              <TextField
                label="Contact email"
                required
                value={values.contact_email}
                onChange={(next) => onChange('contact_email', next)}
                type="email"
                placeholder="you@company.com"
                error={errors.contact_email}
              />
              <TextField
                label="WhatsApp number"
                required
                value={values.whatsapp_number}
                onChange={(next) => onChange('whatsapp_number', next)}
                placeholder="Include country code if outside Nigeria"
                error={errors.whatsapp_number}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PremiumSelect
                label="When do you plan to proceed if the quote is acceptable?"
                value={values.proceed_timeline}
                onValueChange={(next) => onChange('proceed_timeline', next)}
                options={proceedOptions}
                placeholder="Select timeline"
              />
              <PremiumSelect
                label="How did you hear about Sure Imports?"
                value={values.hear_about_sureimports}
                onValueChange={(next) =>
                  onChange('hear_about_sureimports', next)
                }
                options={sourceOptions}
                placeholder="Select source"
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-slate-100">
                Additional notes
              </Label>
              <Textarea
                value={values.additional_notes}
                onChange={(e) => onChange('additional_notes', e.target.value)}
                rows={4}
                className="border-white/20 bg-white/5 text-white placeholder:text-slate-400 focus-visible:ring-blue-400/40"
                placeholder="Any extra context we should know"
              />
            </div>
          </Section>
        ) : null}

        <div className="sticky bottom-4 z-20 rounded-xl border border-blue-400/30 bg-[#1f2f69]/90 p-3 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
          <div className="flex gap-3">
            {currentStep > 0 ? (
              <Button
                type="button"
                onClick={handlePrevStep}
                className="h-12 flex-1 border border-white/20 bg-white/5 text-base font-semibold text-white hover:bg-white/10"
              >
                Back
              </Button>
            ) : null}
            {isLastStep ? (
              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="h-12 flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-base font-semibold text-white transition hover:from-blue-400 hover:to-indigo-400 disabled:opacity-60"
              >
                {status === 'submitting'
                  ? 'Submitting request...'
                  : 'Submit Your Sourcing Request'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNextStep}
                className="h-12 flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-base font-semibold text-white transition hover:from-blue-400 hover:to-indigo-400"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {children}
    </section>
  );
}

function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-xs text-red-300">{text}</p>;
}

function FileField({
  label,
  accept,
  onChange,
  error,
}: {
  label: string;
  accept: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (...args: [File | null]) => void;
  error?: string;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-slate-100">
        {label}
      </Label>
      <Input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="border-white/20 bg-white/5 text-white file:mr-4 file:rounded-md file:border-0 file:bg-blue-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-100 hover:file:bg-blue-500/30"
      />
      <ErrorText text={error} />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  error,
  placeholder,
  type = 'text',
  min,
}: {
  label: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (...args: [string]) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  type?: string;
  min?: string | number;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-slate-100">
        {label}
        {required ? ' *' : ''}
      </Label>
      <Input
        type={type}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 border-white/20 bg-white/5 text-white placeholder:text-slate-400 focus-visible:ring-blue-400/40"
      />
      <ErrorText text={error} />
    </div>
  );
}

function PremiumSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (...args: [string]) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-slate-100">
        {label}
        {required ? ' *' : ''}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-11 border-white/20 bg-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/10 focus-visible:ring-blue-400/40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="cursor-pointer rounded-md focus:bg-slate-700 focus:text-white"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ErrorText text={error} />
    </div>
  );
}
