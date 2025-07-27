import * as React from 'react';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="mt-9 flex max-w-full flex-col px-5">
    <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
      {title}
    </h2>
    <div className="mt-3 text-base leading-6 tracking-normal text-slate-600">
      {children}
    </div>
  </section>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex max-w-[951px] flex-col text-center">
      <header className="flex w-full flex-col px-5 max-md:max-w-full">
        <h1 className="self-center text-4xl font-[860] capitalize text-slate-800">
          Faya Warranty Policy
        </h1>
        <p className="mt-2 w-full text-base leading-6 tracking-normal text-slate-600">
          Sure Importers Limited provides a straightforward warranty for all
          FAYA products that is processed in the most hassle-free way possible.
          Please refer to the Warranty Timeline section below for the warranty
          timelines of various products, as warranty periods may differ
          according to products.
          <br />
          This limited warranty provided by the manufacturer in no way affects a
          potential statutory warranty provided by law.
        </p>
      </header>
      <main className="mt-10 flex w-full max-w-[923px] flex-col self-center max-md:max-w-full">
        <Section title="Warranty Timelines">
          <ul className="mt-3 list-inside list-disc tracking-normal">
            <li>FAYA Charging Cable – 12 months</li>
            <li>FAYA Charger – 12 months</li>
            <li>FAYA Power banks – 12 months</li>
            <li>FAYA Phone – 12 months</li>
          </ul>
        </Section>
        <Section title="Warranty Claims for Quality-Related Issues">
          <p>
            All quality-related defects on items sold directly by Sure Importers
            Limited or Sure Importers Limited’s authorized resellers are covered
            by an extensive warranty, starting from the date of purchase (see
            top of page for your product’s warranty timeline).
          </p>

          <p>
            Quality-related warranty claims on purchases made through Sure
            Importers Limited’s authorized distributors and retailers are
            handled through Sure Importers Limited.
          </p>
          <p>
            For quality-related warranty claims, items will be replaced with a
            factory refurbished model of equal value when available, otherwise a
            new item will be sent. In situations where a replacement is not an
            available or preferred option, Sure Importers Limited will offer a
            partial refund according to the usage time of the device.
          </p>
          <p>
            Warranties on all replacements follow the same warranty timeframe of
            the original defective item. Warranties on products are void after
            having been fully refunded.
          </p>
        </Section>

        <Section title="Process">
          <ul className="mt-3 list-inside list-disc tracking-normal">
            <li>Buyer must provide sufficient proof of purchase</li>
            <li>
              Sure Importers must document what happens when buyers troubleshoot
              the product
            </li>
            <li>
              The defective item’s serial number and/or visible proof depicting
              the defect are required
            </li>
            <li>
              It may be necessary to return an item for quality inspection
            </li>
            <li>
              For defective items that Sure Importers needs to have returned,
              warranties on those replacements are voided if the wrong item is
              returned to Sure Importers or if the defective item is not
              returned.
            </li>
          </ul>
        </Section>

        <Section title="Valid proof of purchase">
          <ul>
            <li>
              Order number from online purchases made through Sure Importers or
              Sure Importers’ authorized dealers
            </li>
            <li>Sales invoice</li>
            <li>
              Dated sales receipt from an authorized Sure Importers dealer that
              shows a description of the product along with its price
            </li>
          </ul>
          <p>
            Please note that more than one type of proof of purchase may be
            required to process a warranty claim (such as receipt of money
            transfer and confirmation of address item was originally shipped
            to).
          </p>
          <p>
            Warranty claims for product defects expire 90 days after opening a
            warranty claim. It is not possible to process a warranty claim for
            items that have expired their original warranty timeframe or 90-day
            warranty claim request period, whichever is longer.
          </p>
        </Section>

        <Section title="Delivery cost must be covered by buyer in the following situations">
          <ul>
            <li>
              Returning products for any reason other than a proven defect
            </li>
            <li>
              Warranty claims on items taken outside the original country of
              purchase
            </li>
            <li>Buyer’s accidental returns</li>
            <li>Returning personal items</li>
            <li>
              Returning items claimed to have defects but found by Sure
              Importers’ quality control to be in working condition
            </li>
            <li>Returning defective items in international shipping</li>
            <li>
              Costs associated with unauthorized returns (any returns made
              outside of the approved warranty process)
            </li>
          </ul>
        </Section>

        <Section title="Not Covered Under Warranty">
          <ul>
            <li>Products without sufficient proof of purchase</li>
            <li>Lost or stolen products</li>
            <li>Items that have expired their warranty period</li>
            <li>Non quality-related issues</li>
            <li>Free products</li>
            <li>Repairs through 3rd parties</li>
            <li>Damage from outside sources</li>
            <li>
              Damage from misuse of products (including, but not limited to:
              falls, extreme temperatures, water, operating devices improperly)
            </li>
          </ul>
        </Section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
