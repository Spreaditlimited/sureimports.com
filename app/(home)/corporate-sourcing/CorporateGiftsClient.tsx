'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowRight, ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import {
  getCorporateSourcingDraft,
  saveCorporateSourcingDraft,
  type CorporateSourcingDraft,
} from '@/lib/corporateSourcing/pendingDraft';
import countries from '@/lib/data/countries';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_DELIVERY_LEAD_DAYS = 60;

type FormErrors = Record<string, string>;
type Status = 'idle' | 'submitting' | 'error';

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
  business_name: '', contact_person_full_name: '', product_or_item_needed: '',
  detailed_specifications: '', quantity_needed: '', preferred_quality_level: '',
  branding_customization_required: '', expected_delivery_date: '',
  final_delivery_location_nigeria: '', contact_email: '', whatsapp_number: '',
  proceed_timeline: '', hear_about_sureimports: '', additional_notes: '',
};

const qualityOptions = ['Budget-conscious', 'Commercial grade', 'Heavy-duty or premium', 'Not sure, advise us'];
const brandingOptions = ['Yes, with our logo', 'Yes, product or machine customization', 'Yes, but we need guidance', 'No branding or customization needed', 'Not sure yet'];
const proceedOptions = ['Immediately', 'Within 1 week', 'Within 2 - 4 weeks', 'Still comparing options'];
const sourceOptions = ['Facebook', 'Instagram', 'Google', 'Referral', 'Existing customer', 'WhatsApp', 'Other'];

export default function CorporateGiftsClient({
  researchFee,
}: {
  researchFee: { priceNaira: number; priceUsdCents: number };
}) {
  const [liveResearchFee, setLiveResearchFee] = useState(researchFee);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [billingCountry, setBillingCountry] = useState('');

  const minDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + MIN_DELIVERY_LEAD_DAYS);
    return date.toISOString().split('T')[0];
  }, []);

  const steps = ['Business Details', 'Product or Machine', 'Customization & Files', 'Delivery Info'];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    fetch('/api/corporate-sourcing/checkout', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success && data?.data) setLiveResearchFee(data.data);
      })
      .catch(() => undefined);
    getCorporateSourcingDraft()
      .then((draft) => {
        if (!draft) return;
        setValues((current) => ({ ...current, ...draft.values } as FormValues));
        setReferenceFile(draft.referenceFile || null);
        setLogoFile(draft.logoFile || null);
        setCurrentStep(steps.length - 1);
      })
      .catch(() => undefined);
  }, []);

  const onChange = (name: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (stepIndex?: number) => {
    const nextErrors: FormErrors = {};
    const requiredByStep: [keyof FormValues, string][][] = [
      [['business_name', 'Business name is required.'], ['contact_person_full_name', 'Full name is required.']],
      [['product_or_item_needed', 'Product or machine needed is required.'], ['detailed_specifications', 'Specifications are required.'], ['quantity_needed', 'Quantity is required.'], ['preferred_quality_level', 'Quality or duty level is required.']],
      [['branding_customization_required', 'Please choose a customization option.']],
      [['expected_delivery_date', 'Delivery date is required.'], ['final_delivery_location_nigeria', 'Location is required.'], ['contact_email', 'Email is required.'], ['whatsapp_number', 'WhatsApp number is required.']],
    ];

    const requiredSet = typeof stepIndex === 'number' ? requiredByStep[stepIndex] : requiredByStep.flat();

    requiredSet.forEach(([key, message]) => {
      if (!values[key].trim()) nextErrors[key] = message;
    });

    if ((stepIndex === undefined || stepIndex === 3) && values.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact_email)) {
      nextErrors.contact_email = 'Please enter a valid email address.';
    }

    if (stepIndex === undefined || stepIndex === 1) {
      const quantity = Number(values.quantity_needed);
      if (!values.quantity_needed || Number.isNaN(quantity) || quantity <= 0) {
        nextErrors.quantity_needed = 'Quantity must be a positive number.';
      }
    }

    if ((stepIndex === undefined || stepIndex === 3) && values.expected_delivery_date) {
      const selectedDate = new Date(`${values.expected_delivery_date}T00:00:00`);
      const minAllowedDate = new Date(`${minDeliveryDate}T00:00:00`);
      if (Number.isNaN(selectedDate.getTime())) {
        nextErrors.expected_delivery_date = 'Please select a valid date.';
      } else if (selectedDate < minAllowedDate) {
        nextErrors.expected_delivery_date = 'Must be at least 2 months from today.';
      }
    }

    if ((stepIndex === undefined || stepIndex === 2)) {
      if (referenceFile && referenceFile.size > MAX_FILE_SIZE) nextErrors.reference_image_upload = 'File must be 10MB or less.';
      if (logoFile && logoFile.size > MAX_FILE_SIZE) nextErrors.company_logo_upload = 'File must be 10MB or less.';
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validate(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    setSubmissionError('');

    try {
      const draft: CorporateSourcingDraft = {
        values,
        referenceFile,
        logoFile,
      };

      await saveCorporateSourcingDraft(draft);
      setCheckoutReady(true);
      setStatus('idle');
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'Submission failed',
      );
      setStatus('error');
    }
  };

  const startCheckout = async () => {
    if (!billingCountry) {
      setSubmissionError('Select your billing country to continue.');
      return;
    }
    setStatus('submitting');
    setSubmissionError('');
    try {
      const names = values.contact_person_full_name.trim().split(/\s+/);
      const response = await fetch('/api/corporate-sourcing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.contact_email,
          firstName: names[0],
          lastName: names.slice(1).join(' '),
          billingCountry,
          companyWebsite: '',
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.authorizationUrl) {
        throw new Error(data?.message || 'Unable to start secure checkout.');
      }
      window.localStorage.setItem(
        'sureimports:corporateSourcingCheckout',
        JSON.stringify({
          pidPayment: data.pidPayment,
          submissionToken: data.submissionToken,
        }),
      );
      window.location.href = data.authorizationUrl;
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to start checkout.');
      setStatus('error');
    }
  };

  if (checkoutReady) {
    const isNigeria = billingCountry.toLowerCase() === 'nigeria';
    const amount = isNigeria
      ? `₦${liveResearchFee.priceNaira.toLocaleString()}`
      : `$${(liveResearchFee.priceUsdCents / 100).toFixed(0)}`;
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-slate-950 p-7 text-white dark:border-slate-800 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-brand-orange-400">Research fee</p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">Your sourcing brief is saved.</h3>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
            The research fee covers the specialist work required to review your brief, identify suitable manufacturers and prepare the sourcing process. Your request reaches our team only after payment is confirmed.
          </p>
        </div>
        <div className="space-y-5 p-7 sm:p-9">
          <PremiumSelect
            label="Billing country"
            required
            value={billingCountry}
            onValueChange={setBillingCountry}
            options={countries.filter((item) => item.optionValue).map((item) => item.optionName)}
            placeholder="Select billing country..."
          />
          {billingCountry ? (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Corporate Sourcing research fee</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Secure payment with {isNigeria ? 'Paystack' : 'PayPal'}</p>
              </div>
              <span className="text-2xl font-black text-slate-950 dark:text-white">{amount}</span>
            </div>
          ) : null}
          {submissionError ? <p className="text-sm font-semibold text-red-600">{submissionError}</p> : null}
          <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
            <Button type="button" variant="outline" onClick={() => setCheckoutReady(false)} className="h-12 rounded-xl px-5 font-bold">
              <ArrowLeft className="mr-2 h-4 w-4" /> Review brief
            </Button>
            <Button type="button" onClick={startCheckout} disabled={!billingCountry || status === 'submitting'} className="h-12 rounded-xl bg-brand-orange-500 font-bold text-white hover:bg-brand-orange-600">
              {status === 'submitting' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
              {status === 'submitting' ? 'Preparing secure checkout...' : `Pay ${billingCountry ? amount : 'research fee'}`}
            </Button>
          </div>
          <p className="text-center text-xs leading-relaxed text-slate-500">Payment is verified securely before your sourcing request is submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="rounded-2xl border border-brand-orange-200 bg-brand-orange-50 p-5 text-sm leading-relaxed text-slate-700 dark:border-brand-orange-500/20 dark:bg-brand-orange-500/10 dark:text-slate-300">
        <p className="font-bold text-slate-950 dark:text-white">This form is for established organisations.</p>
        <p className="mt-1">
          If you are an individual or small business sourcing white-label products,
          wholesale stock or machines,{' '}
          <a
            href="https://linescout.sureimports.com/sourcing-project?route_type=simple_sourcing"
            className="font-bold text-brand-orange-600 underline underline-offset-4 dark:text-brand-orange-400"
          >
            start your project in LineScout
          </a>
          .
        </p>
      </div>
      
      {/* Progress Indicator */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span className="text-brand-orange-500">{steps[currentStep]}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {steps.map((_, index) => (
            <div key={index} className={`h-2 rounded-full transition-colors duration-300 ${index <= currentStep ? 'bg-brand-orange-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {status === 'error' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
          {submissionError || 'We could not submit your request. Please check your connection and try again.'}
        </div>
      )}

      {/* Form Steps */}
      <div className="min-h-[300px]">
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tell us about your organisation</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField label="Business/Organization Name" required value={values.business_name} onChange={(v) => onChange('business_name', v)} placeholder="E.g. Zenith Bank" error={errors.business_name} />
              <TextField label="Your Full Name" required value={values.contact_person_full_name} onChange={(v) => onChange('contact_person_full_name', v)} placeholder="John Doe" error={errors.contact_person_full_name} />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">What product or machine do you want to source?</h3>
            <TextField label="Product or Machine Name" required value={values.product_or_item_needed} onChange={(v) => onChange('product_or_item_needed', v)} placeholder="E.g. Sachet packaging machine or branded ceramic mugs" error={errors.product_or_item_needed} />
            <div>
              <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Detailed specifications <span className="text-rose-500">*</span></Label>
              <Textarea value={values.detailed_specifications} onChange={(e) => onChange('detailed_specifications', e.target.value)} rows={4} placeholder="Include intended use, output capacity, power/voltage, dimensions, material, model, color or packaging requirements..." className="resize-none rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-brand-orange-500/40 dark:border-slate-800 dark:bg-slate-900" />
              <ErrorText text={errors.detailed_specifications} />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField label="Quantity / Number of Units" required value={values.quantity_needed} onChange={(v) => onChange('quantity_needed', v)} type="number" min={1} placeholder="Enter number of units" error={errors.quantity_needed} />
              <PremiumSelect label="Preferred Quality / Duty Level" required value={values.preferred_quality_level} onValueChange={(v) => onChange('preferred_quality_level', v)} options={qualityOptions} placeholder="Select level..." error={errors.preferred_quality_level} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Customization and Supporting Files</h3>
            <PremiumSelect label="Do you need branding or product customization?" required value={values.branding_customization_required} onValueChange={(v) => onChange('branding_customization_required', v)} options={brandingOptions} placeholder="Select an option..." error={errors.branding_customization_required} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FileField label="Reference Image or Specification Sheet (Optional)" accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf" onChange={setReferenceFile} error={errors.reference_image_upload} />
              <FileField label="Company Logo for Branded Orders (Optional)" accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf" onChange={setLogoFile} error={errors.company_logo_upload} />
            </div>
            <p className="text-xs font-semibold text-slate-500">Accepted: Images & PDFs. Max size: 10MB per file.</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Delivery & Contact Info</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <TextField label="Expected Delivery Date" required value={values.expected_delivery_date} onChange={(v) => onChange('expected_delivery_date', v)} type="date" min={minDeliveryDate} error={errors.expected_delivery_date} />
                <p className="mt-1 text-[10px] font-semibold text-slate-500">Must allow 2+ months; complex machines may take longer.</p>
              </div>
              <TextField label="Delivery City/State" required value={values.final_delivery_location_nigeria} onChange={(v) => onChange('final_delivery_location_nigeria', v)} placeholder="E.g. Lekki, Lagos" error={errors.final_delivery_location_nigeria} />
              <TextField label="Work Email" required value={values.contact_email} onChange={(v) => onChange('contact_email', v)} type="email" placeholder="you@company.com" error={errors.contact_email} />
              <TextField label="WhatsApp Number" required value={values.whatsapp_number} onChange={(v) => onChange('whatsapp_number', v)} placeholder="+234..." error={errors.whatsapp_number} />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <PremiumSelect label="Project Timeline" value={values.proceed_timeline} onValueChange={(v) => onChange('proceed_timeline', v)} options={proceedOptions} placeholder="When do you need quotes?" />
              <PremiumSelect label="How did you find us?" value={values.hear_about_sureimports} onValueChange={(v) => onChange('hear_about_sureimports', v)} options={sourceOptions} placeholder="Select source..." />
            </div>
            <div>
              <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Additional Notes (Optional)</Label>
              <Textarea value={values.additional_notes} onChange={(e) => onChange('additional_notes', e.target.value)} rows={3} placeholder="Add installation, certification, testing or other requirements..." className="resize-none rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-brand-orange-500/40 dark:border-slate-800 dark:bg-slate-900" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        {currentStep > 0 && (
          <Button type="button" onClick={handlePrevStep} variant="outline" className="h-12 w-full sm:w-32 rounded-xl font-bold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        
        {isLastStep ? (
          <Button type="submit" disabled={status === 'submitting'} className="h-12 flex-1 rounded-xl bg-brand-orange-500 text-white font-bold hover:bg-brand-orange-600 border-0 shadow-lg shadow-brand-orange-500/20 active:scale-95 transition-all">
            {status === 'submitting' ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</> : 'Continue to payment'}
          </Button>
        ) : (
          <Button type="button" onClick={handleNextStep} className="h-12 flex-1 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 border-0 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}

// Helpers
function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1.5 text-[11px] font-bold text-rose-500">{text}</p>;
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'date';
  min?: string | number;
};

function TextField({
  label,
  value,
  onChange,
  required,
  error,
  placeholder,
  type = 'text',
  min,
}: TextFieldProps) {
  return (
    <div>
      <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">{label} {required && <span className="text-rose-500">*</span>}</Label>
      <Input type={type} min={min} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-brand-orange-500/40 dark:border-slate-800 dark:bg-slate-900" />
      <ErrorText text={error} />
    </div>
  );
}

type PremiumSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
};

function PremiumSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  required,
  error,
}: PremiumSelectProps) {
  return (
    <div>
      <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">{label} {required && <span className="text-rose-500">*</span>}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-brand-orange-500/40 dark:border-slate-800 dark:bg-slate-900">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
          {options.map((opt: string) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
        </SelectContent>
      </Select>
      <ErrorText text={error} />
    </div>
  );
}

type FileFieldProps = {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  error?: string;
};

function FileField({ label, accept, onChange, error }: FileFieldProps) {
  return (
    <div>
      <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">{label}</Label>
      <Input type="file" accept={accept} onChange={(e) => onChange(e.target.files?.[0] ?? null)} className="h-12 rounded-xl border-slate-200 bg-slate-50 pt-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-xs file:font-bold file:text-indigo-700 hover:file:bg-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:file:bg-indigo-900/30 dark:file:text-indigo-400" />
      <ErrorText text={error} />
    </div>
  );
}
