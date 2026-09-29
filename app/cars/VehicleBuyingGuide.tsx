import Link from 'next/link';
import type { PublicVehicle } from '@/lib/vehicles/data';
import { naira } from '@/lib/vehicles/policy';
import { vehicleEditorial } from '@/lib/vehicles/editorial';

export default function VehicleBuyingGuide({
  model,
  related,
}: {
  model: PublicVehicle;
  related: { slug: string; name: string }[];
}) {
  const editorial = vehicleEditorial[model.slug];
  const isElectric = model.powertrain === 'Electric';
  return (
    <section
      className="vehicle-buying-guide"
      aria-labelledby="vehicle-buying-title"
    >
      <p className="vehicle-eyebrow">
        BUYING {model.name.toUpperCase()} IN NIGERIA
      </p>
      <h2 id="vehicle-buying-title">
        {editorial?.title ||
          `${model.name}: specifications and importing to Nigeria`}
      </h2>
      {(editorial?.paragraphs || [model.description]).map((text) => (
        <p key={text}>{text}</p>
      ))}
      {editorial && (
        <ul>
          {editorial.checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      )}
      {model.variants.some((v) => v.dimensionsSource) && (
        <p>
          Shipping estimates use published model dimensions. The supplied model
          year and body configuration will be checked before the final
          quotation. Dimension references:{' '}
          {model.variants
            .filter((v) => v.dimensionsSource)
            .map((v) => (
              <a
                key={v.id}
                href={v.dimensionsSource}
                target="_blank"
                rel="noreferrer"
              >
                {model.name} published specifications
              </a>
            ))}
          .
        </p>
      )}
      <h3>Compare all {model.name} configurations</h3>
      <p>
        Rows show supplier configurations or explicitly labelled model-level
        estimates. Range is supplier stated; unconfirmed information is shown
        explicitly. Prices are estimates for one vehicle.
      </p>
      <div
        className="vehicle-config-table"
        role="region"
        aria-label={`${model.name} configuration specifications`}
        tabIndex={0}
      >
        <table>
          <caption className="sr-only">
            {model.name} configurations, battery, range and estimated landed
            price in Nigeria
          </caption>
          <thead>
            <tr>
              <th scope="col">Configuration</th>
              <th scope="col">Battery</th>
              <th scope="col">Supplier range</th>
              <th scope="col">Seats</th>
              <th scope="col">Exterior L × W × H</th>
              <th scope="col">Estimated landed price</th>
            </tr>
          </thead>
          <tbody>
            {model.variants.map((v) => (
              <tr key={v.id}>
                <th scope="row">
                  <Link
                    href={`/cars/models/${model.slug}?configuration=${encodeURIComponent(v.id)}#enquire`}
                  >
                    {v.name}
                  </Link>
                </th>
                <td>
                  {v.batteryKwh ? `${v.batteryKwh} kWh` : 'To be confirmed'}
                </td>
                <td>
                  {v.rangeKm
                    ? `${v.rangeKm} km · ${v.rangeStandard || 'test standard unconfirmed'}`
                    : 'To be confirmed'}
                </td>
                <td>{v.seats || 'To be confirmed'}</td>
                <td>
                  {v.lengthMm && v.widthMm && v.heightMm
                    ? `${v.lengthMm} × ${v.widthMm} × ${v.heightMm} mm`
                    : 'To be confirmed'}
                </td>
                <td>
                  {v.price
                    ? naira(v.price.totalNgn)
                    : v.indicativePrice?.landedMinNgn != null
                      ? `${naira(v.indicativePrice.landedMinNgn)} – ${naira(v.indicativePrice.landedMaxNgn!)} (indicative)`
                      : 'Price on request'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="vehicle-buying-columns">
        <div>
          <h3>Vehicle price and landed cost</h3>
          <p>
            The Naira estimate combines the vehicle price with shipping
            calculated from the exterior volume. Shipping includes clearing,
            duties and taxes. The selected configuration’s price breakdown
            appears above; the quotation records the final agreed amounts and
            validity.
          </p>
          <p>
            All vehicles arrive in Lagos. You arrange collection and any onward
            delivery from Lagos. Confirm registration and insurance separately.
            For ongoing expenses, read our{' '}
            <Link href="/blog/ev-vs-petrol-diesel-cost-nigeria">
              EV, petrol and diesel ownership-cost comparison
            </Link>
            .
          </p>
        </div>
        <div>
          <h3>
            {isElectric
              ? 'Charging your vehicle in Nigeria'
              : 'Plan your operating costs'}
          </h3>
          {isElectric ? (
            <>
              <p>
                Every EV we supply includes a compatible wall-mountable charger
                for standard Nigerian mains electricity. Arrange proper
                installation and confirm its power rating before planning your
                charging timetable.
              </p>
              <p>
                Read our{' '}
                <Link href="/blog/ev-home-charging-nigeria">
                  home-charging guide
                </Link>
                ,{' '}
                <Link href="/blog/charging-ev-with-generator-nigeria">
                  generator-charging guide
                </Link>{' '}
                and{' '}
                <Link href="/blog/solar-ev-charging-nigeria">
                  solar-charging guide
                </Link>{' '}
                to plan your supply.
              </p>
            </>
          ) : (
            <p>
              Match the vehicle’s fuel and maintenance requirements to your
              route and support arrangements. Confirm the service schedule and
              parts availability before ordering.
            </p>
          )}
        </div>
      </div>
      <h3>Ordering {model.name} from China</h3>
      <p>
        All vehicles are shipped from China when ordered. Choose a
        configuration, request your quotation and pay by bank transfer using the
        company account shown in your dashboard. Submit payment proof for
        finance review, then follow your order’s fulfilment timeline. Email
        updates are included, with WhatsApp updates when you opt in.
      </p>
      <div className="vehicle-model-faqs">
        <details>
          <summary>Is {model.name} available for viewing in Nigeria?</summary>
          <p>
            We do not hold local stock for viewing or test drives. Use the
            gallery and any available videos to explore the model, and contact
            us to confirm the exact configuration and supplier availability.
          </p>
        </details>
        <details>
          <summary>What range should I plan for with {model.name}?</summary>
          <p>
            Use the supplier figures for comparison, then assess your route,
            load and charging opportunities. Actual range varies with
            conditions. Our{' '}
            <Link href="/blog/ev-range-nigeria-real-world-planning">
              range-planning guide
            </Link>{' '}
            explains how to create a working energy budget.
          </p>
        </details>
        <details>
          <summary>
            What warranty and parts support comes with {model.name}?
          </summary>
          <p>
            Ask for the written terms for your configuration, including who
            handles claims in Nigeria, service access and parts lead times. Our{' '}
            <Link href="/blog/ev-maintenance-battery-warranty-nigeria">
              maintenance and warranty checklist
            </Link>{' '}
            covers the questions to resolve before payment.
          </p>
        </details>
      </div>
      {related.length > 0 && (
        <nav className="vehicle-related-links" aria-label="Related vehicles">
          <h3>Other vehicles to compare</h3>
          {related.map((item) => (
            <Link key={item.slug} href={`/cars/models/${item.slug}`}>
              {item.name} →
            </Link>
          ))}
        </nav>
      )}
      <p>
        <Link href="/cars#faqs">Read all vehicle importing FAQs</Link> or{' '}
        <Link href="/contact-us">ask about your requirements</Link>.
      </p>
    </section>
  );
}
