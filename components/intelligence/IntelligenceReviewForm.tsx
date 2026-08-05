'use client';

import { useMemo, useState } from 'react';
import type { ElementType } from 'react';
import {
  BadgeCheck,
  ClipboardCheck,
  FileSearch,
  MessageSquareText,
  ReceiptText,
  UploadCloud,
} from 'lucide-react';

type ReviewType =
  | 'supplier_review'
  | 'quote_review'
  | 'category_request'
  | 'invoice_check';

type IntelligenceReviewFormProps = {
  action: (formData: FormData) => void;
  defaultType?: string;
  nicheSlug?: string;
  nicheName?: string;
};

const reviewTypes: Array<{
  value: ReviewType;
  label: string;
  description: string;
  icon: ElementType;
}> = [
  {
    value: 'supplier_review',
    label: 'Supplier review',
    description: 'Check company identity, contact path and buying risk.',
    icon: BadgeCheck,
  },
  {
    value: 'quote_review',
    label: 'Quote review',
    description: 'Review price, MOQ, lead time and hidden cost questions.',
    icon: ClipboardCheck,
  },
  {
    value: 'category_request',
    label: 'Priority category',
    description: 'Ask Sure Imports to research a new product category.',
    icon: FileSearch,
  },
  {
    value: 'invoice_check',
    label: 'Invoice check',
    description: 'Check invoice, payment details and supplier match.',
    icon: ReceiptText,
  },
];

const fieldsByType: Record<
  ReviewType,
  {
    intro: string;
    showSupplier: boolean;
    showAddress: boolean;
    showWebsite: boolean;
    showContact: boolean;
    showProduct: boolean;
    showQuote: boolean;
    showQuantity: boolean;
    showBudget: boolean;
    showAttachments: boolean;
    attachmentLabel?: string;
    attachmentDescription?: string;
    decisionLabel: string;
    decisionPlaceholder: string;
  }
> = {
  supplier_review: {
    intro:
      'Use this when you want Sure Imports to look at a supplier before you begin serious discussion or payment.',
    showSupplier: true,
    showAddress: true,
    showWebsite: true,
    showContact: true,
    showProduct: true,
    showQuote: false,
    showQuantity: false,
    showBudget: false,
    showAttachments: false,
    decisionLabel: 'Decision needed',
    decisionPlaceholder:
      'Example: Is this supplier worth contacting further, and what should I verify first?',
  },
  quote_review: {
    intro:
      'Use this when a supplier has already sent price, MOQ, lead time, payment terms or related quote details.',
    showSupplier: true,
    showAddress: true,
    showWebsite: true,
    showContact: true,
    showProduct: true,
    showQuote: true,
    showQuantity: true,
    showBudget: true,
    showAttachments: true,
    attachmentLabel: 'Quote files',
    attachmentDescription:
      'Upload quote sheets, supplier screenshots, chat screenshots, product photos or PDFs. Max 5 files, 10MB each.',
    decisionLabel: 'Decision needed',
    decisionPlaceholder:
      'Example: Does this quote look reasonable, and what hidden costs or risks should I check?',
  },
  category_request: {
    intro:
      'Use this to ask Sure Imports to prioritize a new product category for supplier research.',
    showSupplier: false,
    showAddress: false,
    showWebsite: false,
    showContact: false,
    showProduct: true,
    showQuote: false,
    showQuantity: true,
    showBudget: true,
    showAttachments: false,
    decisionLabel: 'What should Sure Imports research?',
    decisionPlaceholder:
      'Example: I need reliable manufacturers for rechargeable fans with lithium batteries that meet my destination market requirements.',
  },
  invoice_check: {
    intro:
      'Use this before paying when you need invoice name, receiving account, company identity or payment terms reviewed.',
    showSupplier: true,
    showAddress: true,
    showWebsite: true,
    showContact: true,
    showProduct: false,
    showQuote: true,
    showQuantity: false,
    showBudget: false,
    showAttachments: true,
    attachmentLabel: 'Invoice or payment files',
    attachmentDescription:
      'Upload invoice, payment details, supplier screenshots, chat screenshots or PDFs. Max 5 files, 10MB each.',
    decisionLabel: 'Decision needed',
    decisionPlaceholder:
      'Example: Does the invoice/payment detail match the supplier, and what should I confirm before paying?',
  },
};

export default function IntelligenceReviewForm({
  action,
  defaultType,
  nicheSlug = '',
  nicheName = '',
}: IntelligenceReviewFormProps) {
  const normalizedDefaultType = reviewTypes.some(
    (item) => item.value === defaultType,
  )
    ? (defaultType as ReviewType)
    : 'supplier_review';
  const [reviewType, setReviewType] = useState<ReviewType>(
    normalizedDefaultType,
  );
  const config = useMemo(() => fieldsByType[reviewType], [reviewType]);

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="nicheSlug" value={nicheSlug} />
      <input type="hidden" name="nicheName" value={nicheName} />

      <input type="hidden" name="requestType" value={reviewType} />

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Review type
        </p>
        <div className="mt-3 grid gap-3">
          {reviewTypes.map((type) => {
            const isSelected = reviewType === type.value;
            const Icon = type.icon;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setReviewType(type.value)}
                className={`group relative overflow-hidden rounded-2xl border p-4 pr-10 text-left transition-all ${
                  isSelected
                    ? 'border-brand-orange-400 bg-brand-orange-50 shadow-lg shadow-brand-orange-500/10 ring-2 ring-brand-orange-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                      isSelected
                        ? 'border-brand-orange-200 bg-brand-orange-500 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-extrabold ${
                        isSelected ? 'text-slate-950' : 'text-slate-800'
                      }`}
                    >
                      {type.label}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                      {type.description}
                    </span>
                  </span>
                </div>
                {isSelected ? (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange-500 text-white">
                    <BadgeCheck className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
        {config.intro}
      </p>

      {config.showSupplier ? (
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Supplier name (in Chinese)
          </span>
          <input
            name="supplierName"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
            placeholder="Example: 深圳某某电子有限公司"
          />
        </label>
      ) : null}

      {config.showAddress ? (
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Supplier address (in Chinese)
          </span>
          <textarea
            name="supplierAddress"
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
            placeholder="Paste the registered or factory address in Chinese if available."
          />
        </label>
      ) : null}

      {config.showWebsite ? (
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Supplier link
          </span>
          <input
            name="supplierWebsite"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
            placeholder="Website, Alibaba, 1688, Made-in-China, etc."
          />
        </label>
      ) : null}

      {config.showContact ? (
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Supplier contact
          </span>
          <input
            name="supplierContact"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
            placeholder="Email, WhatsApp, WeChat, phone or contact person"
          />
        </label>
      ) : null}

      {config.showProduct ? (
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {reviewType === 'category_request'
              ? 'Product/category needed'
              : 'Product details'}
          </span>
          <textarea
            name="productDetails"
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
            placeholder={
              reviewType === 'category_request'
                ? 'Describe the product category, target quality, use case and destination market.'
                : 'Product, specs, target quality, destination, packaging or customization needs.'
            }
          />
        </label>
      ) : null}

      {config.showQuote ? (
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quote or payment details
          </span>
          <textarea
            name="quoteDetails"
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
            placeholder="Paste quoted price, MOQ, lead time, payment terms, invoice name, bank details, or anything the supplier sent."
          />
        </label>
      ) : null}

      {config.showQuantity || config.showBudget ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {config.showQuantity ? (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quantity
              </span>
              <input
                name="targetQuantity"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
                placeholder="Example: 500 units"
              />
            </label>
          ) : null}
          {config.showBudget ? (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Budget
              </span>
              <input
                name="budgetRange"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
                placeholder="Example: $2,000 - $4,000"
              />
            </label>
          ) : null}
        </div>
      ) : null}

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {config.decisionLabel}
        </span>
        <textarea
          name="decisionNeeded"
          rows={3}
          required
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange-400 focus:ring-2 focus:ring-brand-orange-100"
          placeholder={config.decisionPlaceholder}
        />
      </label>

      {config.showAttachments ? (
        <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-brand-orange-300 hover:bg-brand-orange-50/40">
          <span className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-orange-500 shadow-sm">
              <UploadCloud className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {config.attachmentLabel || 'Supporting files'}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                {config.attachmentDescription ||
                  'Upload supporting screenshots, documents or PDFs. Max 5 files, 10MB each.'}
              </span>
            </span>
          </span>
          <input
            name="attachments"
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt,image/*,application/pdf"
            className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-orange-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-brand-orange-600"
          />
        </label>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange-500/20 transition hover:bg-brand-orange-600"
      >
        <MessageSquareText className="h-4 w-4" />
        Submit for review
      </button>
    </form>
  );
}
