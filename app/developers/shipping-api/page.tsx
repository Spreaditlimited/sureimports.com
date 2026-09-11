import type { Metadata } from 'next';
import { CodeXml } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './shipping-api.module.css';

export const metadata: Metadata = {
  title: 'Partner Shipping API Reference',
  description:
    'Technical reference for creating affiliate-owned Sure Imports shipping requests.',
  robots: { index: false, follow: false },
};

const createRequest = `curl --request POST \\
  --url https://www.sureimports.com/api/v1/shipping-requests \\
  --header "Authorization: Bearer si_live_REPLACE_ME" \\
  --header "Idempotency-Key: order-88421" \\
  --header "Content-Type: application/json" \\
  --data '{
    "customer": {
      "firstName": "Ada",
      "lastName": "Okafor",
      "email": "ada@example.com",
      "phone": "+2348012345678"
    },
    "shipment": {
      "shippingName": "Ada Stores",
      "destinationCountry": "Nigeria",
      "shippingPlanId": "REPLACE_WITH_PLAN_ID",
      "estimatedQuantity": 32.5,
      "description": "Two cartons of fashion accessories"
    },
    "externalReference": "partner-order-88421"
  }'`;

const createdResponse = `{
  "requestId": "shr_01K4...",
  "externalReference": "partner-order-88421",
  "status": "PENDING",
  "customerId": "usr_01K4...",
  "ownership": {
    "attributionId": "attr_01K4...",
    "lockedAt": "2026-09-11T12:00:00.000Z",
    "source": "PARTNER_API"
  }
}`;

function Endpoint({
  method,
  path,
  title,
  children,
}: {
  method: 'GET' | 'POST';
  path: string;
  title: string;
  children: React.ReactNode;
}) {
  const id = path
    .replace(/[^a-z]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return (
    <article className={styles.endpoint} id={id}>
      <header>
        <span data-method={method}>{method}</span>
        <code>{path}</code>
      </header>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </article>
  );
}

export default function PartnerShippingApiReference() {
  return (
    <div className="public-site-theme">
      <Navbar forceLightNavbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <div className={styles.heroIcon}>
              <CodeXml size={32} aria-hidden="true" />
            </div>
            <span className={styles.eyebrow}>Partner API · Version 1</span>
            <h1>Turn shipping opportunities into owned requests.</h1>
            <p>
              Create shipping-only requests from your own product while Sure
              Imports permanently attributes each accepted request to your
              affiliate account.
            </p>
            <nav className={styles.actions} aria-label="Developer resources">
              <a href="https://affiliate.sureimports.com/dashboard/developers">
                Affiliate dashboard
              </a>
              <a href="/api/v1/openapi" target="_blank" rel="noreferrer">
                OpenAPI JSON
              </a>
            </nav>
          </div>
          <aside>
            <small>Base URL</small>
            <code>https://www.sureimports.com/api/v1</code>
            <span>OpenAPI 3.1</span>
          </aside>
        </section>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <strong>API reference</strong>
            <a href="#authentication">Authentication</a>
            <a href="#shipping-plans">Shipping plans</a>
            <a href="#shipping-requests">Create request</a>
            <a href="#shipping-requests-requestid">Request status</a>
            <a href="#ownership">Ownership</a>
            <a href="#errors">Errors</a>
          </aside>

          <div className={styles.content}>
            <section className={styles.section} id="authentication">
              <span className={styles.index}>01</span>
              <h2>Authentication</h2>
              <p>
                Use a secret key created in your affiliate dashboard. Send it
                from your server in the Bearer authorization header. Never place
                the key in browser code, a mobile application bundle, a public
                repository, or a screenshot.
              </p>
              <pre>
                <code>Authorization: Bearer si_live_REPLACE_ME</code>
              </pre>
              <div className={styles.callout}>
                <strong>Every key identifies its owner.</strong>
                <span>
                  Customers cannot submit or replace an affiliate ID. Ownership
                  comes from the authenticated key and is locked when the
                  request is accepted.
                </span>
              </div>
            </section>

            <section className={styles.section}>
              <span className={styles.index}>02</span>
              <h2>Endpoints</h2>
              <Endpoint
                method="GET"
                path="/shipping-plans"
                title="List supported shipping plans"
              >
                <p>
                  Returns the valid plan IDs and authoritative billing unit for
                  a destination. Call this before creating a request.
                </p>
                <div className={styles.parameters}>
                  <div>
                    <code>destinationCountry</code>
                    <span>query · string</span>
                  </div>
                  <p>
                    Optional country filter, such as <code>Nigeria</code>.
                  </p>
                </div>
              </Endpoint>
              <Endpoint
                method="POST"
                path="/shipping-requests"
                title="Create an affiliate-owned shipping request"
              >
                <p>
                  Creates a customer and shipping opportunity, then permanently
                  assigns the accepted request to the affiliate account behind
                  the API key.
                </p>
                <div className={styles.parameters}>
                  <div>
                    <code>Idempotency-Key</code>
                    <span>header · required</span>
                  </div>
                  <p>
                    A unique value between 8 and 120 characters. Reuse it only
                    when retrying the identical request.
                  </p>
                </div>
                <h4>Example request</h4>
                <pre>
                  <code>{createRequest}</code>
                </pre>
                <h4>201 · Request accepted</h4>
                <pre>
                  <code>{createdResponse}</code>
                </pre>
              </Endpoint>
              <Endpoint
                method="GET"
                path="/shipping-requests/{requestId}"
                title="Read an owned shipping request"
              >
                <p>
                  Returns the current status of a request owned by the
                  authenticated affiliate. Requests belonging to another
                  affiliate are never exposed.
                </p>
              </Endpoint>
            </section>

            <section className={styles.section} id="ownership">
              <span className={styles.index}>03</span>
              <h2>Ownership and earnings</h2>
              <p>
                The API key permanently establishes who owns the opportunity.
                When the resulting shipping invoice is fully paid, commission is
                calculated from the final billed shipping quantity—not the
                estimate originally submitted.
              </p>
              <ul>
                <li>Both air and sea shipments are eligible.</li>
                <li>
                  Per-KG and Nigeria per-CBM commission rates are configured
                  centrally.
                </li>
                <li>
                  Duties, storage, verification, penalties, and unrelated fees
                  are excluded.
                </li>
                <li>
                  Reversed or refunded payments void the associated commission.
                </li>
              </ul>
            </section>

            <section className={styles.section} id="errors">
              <span className={styles.index}>04</span>
              <h2>Errors</h2>
              <div className={styles.errors}>
                <code>400</code>
                <p>Invalid fields, country, shipping plan, or request body.</p>
                <code>401</code>
                <p>API key is missing, invalid, expired, or revoked.</p>
                <code>403</code>
                <p>The key does not have the required scope.</p>
                <code>404</code>
                <p>
                  The request does not exist or is not owned by this affiliate.
                </p>
                <code>409</code>
                <p>
                  Idempotency key or external reference conflicts with an
                  existing request.
                </p>
                <code>429</code>
                <p>
                  Rate limit exceeded. Respect the returned{' '}
                  <code>Retry-After</code> value.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
