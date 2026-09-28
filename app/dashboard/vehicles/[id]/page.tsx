import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { checkAuth } from '@/lib/auth/checkAuth';
import { customerVehicleOrder } from '@/lib/vehicles/customer';
import { STAGE_LABELS, VEHICLE_STAGES, naira } from '@/lib/vehicles/policy';
import PaymentProof from './PaymentProof';
export default async function VehicleOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auth = await checkAuth();
  if (!auth) redirect('/auth/login');
  const order = await customerVehicleOrder(id, auth.pidUser);
  if (!order) notFound();
  const expired = order.quoteExpiresAt
    ? order.quoteExpiresAt < new Date()
    : false;
  const current = VEHICLE_STAGES.indexOf(
    order.status as (typeof VEHICLE_STAGES)[number],
  );
  return (
    <main className="vehicles-site vehicle-workspace">
      <Link href="/dashboard/vehicles" className="vehicle-back">
        ← My vehicle orders
      </Link>
      <p className="vehicle-eyebrow">{order.id}</p>
      <h1>{order.vehicleName}</h1>
      <p>{order.quantity} vehicle(s) · Arrival: Lagos</p>
      <p className="vehicle-footnote">
        You arrange collection and any onward delivery from Lagos.
      </p>
      <span className="vehicle-status">
        {STAGE_LABELS[order.status] || order.status}
      </span>
      <div className="vehicle-order-columns">
        <div>
          <section className="vehicle-order-panel">
            <h2>Your journey</h2>
            <p>
              {order.eta
                ? `Estimated Lagos arrival: ${order.eta}`
                : 'Delivery timing will be confirmed with your quotation.'}
            </p>
            <ol className="vehicle-timeline">
              {VEHICLE_STAGES.map((stage, i) => (
                <li key={stage} className={i <= current ? 'complete' : ''}>
                  <strong>{STAGE_LABELS[stage]}</strong>
                  <span>
                    {i < current
                      ? 'Completed'
                      : i === current
                        ? 'Current stage'
                        : 'Upcoming'}
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <section className="vehicle-order-panel">
            <h2>Order updates</h2>
            {order.events
              .slice()
              .reverse()
              .map((event) => (
                <article className="vehicle-order-event" key={event.id}>
                  <small>
                    {event.createdAt.toLocaleString('en-GB', {
                      timeZone: 'Africa/Lagos',
                    })}{' '}
                    WAT
                  </small>
                  <h3>{STAGE_LABELS[event.type] || event.type}</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{event.message}</p>
                </article>
              ))}
          </section>
        </div>
        <div>
          {order.invoice ? (
            <section className="vehicle-order-panel">
              <h2>Price & payments</h2>
              <dl className="vehicle-order-totals">
                <div>
                  <dt>Vehicle price</dt>
                  <dd>{naira(Number(order.price?.vehicleNgn || 0))}</dd>
                </div>
                <div>
                  <dt>Estimated shipping</dt>
                  <dd>{naira(Number(order.price?.shippingNgn || 0))}</dd>
                </div>
                <div>
                  <dt>Estimated landed total</dt>
                  <dd>{naira(Number(order.invoice.grandTotal))}</dd>
                </div>
                <div>
                  <dt>Confirmed payments</dt>
                  <dd>{naira(Number(order.invoice.amountPaid))}</dd>
                </div>
                <div>
                  <dt>Balance due</dt>
                  <dd>{naira(Number(order.invoice.balanceDue))}</dd>
                </div>
              </dl>
              <p className="vehicle-footnote">
                Shipping includes clearing, all duties and taxes.
              </p>
              {order.invoiceUrl && (
                <Link className="vehicle-button mt-5" href={order.invoiceUrl}>
                  View invoice & receipts ↗
                </Link>
              )}
              <p className="vehicle-footnote">
                Quote valid until{' '}
                {order.quoteExpiresAt?.toLocaleString('en-GB', {
                  timeZone: 'Africa/Lagos',
                })}{' '}
                WAT.
              </p>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {order.invoice.customerNotes}
              </p>
            </section>
          ) : (
            <section className="vehicle-order-panel">
              <h2>Your request is with us.</h2>
              <p>
                We’ll confirm manufacturer pricing, availability and the
                supplied configuration. Your quotation and payment instructions
                will appear here.
              </p>
            </section>
          )}
          {order.invoice &&
            Number(order.invoice.balanceDue) > 0 &&
            order.status === 'QUOTED' && (
              <PaymentProof
                orderId={order.id}
                reference={order.invoice.invoiceNumber}
                balance={Number(order.invoice.balanceDue)}
                banks={order.banks}
                expired={expired}
              />
            )}
          {order.claims.length > 0 && (
            <section className="vehicle-order-panel">
              <h2>Submitted payments</h2>
              {order.claims.map((c) => (
                <div className="vehicle-order-event" key={c.pidClaim}>
                  <strong>{naira(Number(c.claimedAmount))}</strong>
                  <p>{c.status.replaceAll('_', ' ')}</p>
                  {c.reviewNote && <p>{c.reviewNote}</p>}
                  {order.proofs.find((p) => p.claimId === c.pidClaim) && (
                    <a
                      href={`/api/vehicles/proofs/${order.proofs.find((p) => p.claimId === c.pidClaim)!.id}`}
                    >
                      Download submitted proof
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
