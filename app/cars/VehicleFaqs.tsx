'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react';
import { vehicleFaqs } from '@/lib/vehicles/faqs';

const categories = [...new Set(vehicleFaqs.map((faq) => faq.category))];

export default function VehicleFaqs() {
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState('');
  const search = query.trim().toLowerCase();
  const results = vehicleFaqs.filter((faq) =>
    search
      ? `${faq.question} ${faq.answer.join(' ')} ${faq.category}`
          .toLowerCase()
          .includes(search)
      : category === 'All questions' || faq.category === category,
  );
  return (
    <section
      id="faqs"
      className="vehicle-faqs"
      aria-labelledby="vehicle-faq-title"
    >
      <div className="vehicle-faq-heading">
        <div>
          <p className="vehicle-eyebrow">ANSWERS BEFORE YOU COMMIT</p>
          <h2 id="vehicle-faq-title">A clearer road to ownership.</h2>
        </div>
        <p>
          From your first quotation to charging at your depot. Practical answers
          for importing and owning a vehicle in Nigeria.
        </p>
      </div>
      <div className="vehicle-faq-layout">
        <aside className="vehicle-faq-sidebar">
          <nav aria-label="FAQ topics">
            {[...categories, 'All questions'].map((topic) => (
              <button
                key={topic}
                type="button"
                aria-pressed={!search && category === topic}
                onClick={() => {
                  setCategory(topic);
                  setQuery('');
                }}
              >
                <span>{topic}</span>
                <small>
                  {topic === 'All questions'
                    ? vehicleFaqs.length
                    : vehicleFaqs.filter((faq) => faq.category === topic)
                        .length}
                </small>
              </button>
            ))}
          </nav>
          <div className="vehicle-faq-help">
            <h3>Have a specific requirement?</h3>
            <p>
              Tell us about your route, load and charging plans. For an existing
              order, include your order reference.
            </p>
            <Link href="/contact-us">
              Talk to our team <ArrowUpRight size={17} />
            </Link>
            <Link href="/dashboard/vehicles">
              View your vehicle orders <ArrowUpRight size={17} />
            </Link>
          </div>
        </aside>
        <div className="vehicle-faq-answers">
          <div className="vehicle-faq-search">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search all vehicle FAQs"
              placeholder="Search charging, payment, shipping…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear FAQ search"
                onClick={() => setQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="vehicle-faq-results" role="status">
            {search
              ? `${results.length} answer${results.length === 1 ? '' : 's'} found across all topics`
              : `${category} · ${results.length} questions`}
          </div>
          <div key={`${category}:${search}`}>
            {results.map((faq) => (
              <details
                key={faq.id}
                className="vehicle-faq-item"
                open={search ? true : undefined}
              >
                <summary>
                  <span>{faq.question}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <div className="vehicle-faq-answer">
                  {(search || category === 'All questions') && (
                    <span className="vehicle-faq-topic">{faq.category}</span>
                  )}
                  {faq.answer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {faq.source && (
                    <Link href={faq.source.href}>
                      {faq.source.label} <ArrowUpRight size={14} />
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>
          {!results.length && (
            <div className="vehicle-faq-empty">
              <h3>No matching answers yet.</h3>
              <p>
                Try a shorter phrase such as “charging” or “bank”, or contact
                our team for help with your specific question.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All questions');
                }}
              >
                Browse all questions
              </button>
            </div>
          )}
          <p className="vehicle-faq-note">
            Your confirmed quotation sets out the specification, inclusions and
            terms for your order. General charging guidance does not replace the
            vehicle manual or a site assessment.
          </p>
        </div>
      </div>
    </section>
  );
}
