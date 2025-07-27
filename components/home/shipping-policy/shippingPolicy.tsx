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
          sureimports.com Shipping Policy
        </h1>
        <p className="mt-2 w-full text-base leading-6 tracking-normal text-slate-600">
          Sure Importers Limited is a product sourcing company registered in
          Nigeria and the USA, with offices in Nigeria, USA, and China.
        </p>
      </header>

      <main className="mt-10 flex w-full max-w-[923px] flex-col self-center max-md:max-w-full">
        <Section title="Company Information">
          <i>Registered Offices:</i>
          <br />
          <br />
          <b>1. Nigeria:</b>
          <br />
          Sure Importers Limited 5 Olutosin Ajayi Street, Ajao Estate Lagos,
          Nigeria <br />
          <br />
          {/* <b>2. USA:</b>
          <br />
          Sure Importers Limited LLC 1942 Broadway Street, Suite 314C 80302,
          Boulder, Colorado <br />
          <br /> */}
          <b>3. China:</b>
          <br />
          Guangzhou baiyun area NO.111 airport load jiangfa plaza office
          NO.3FB3-1 广州市白云区机场路111号建发广场3FB3-1.
          <br />
          <br />
          <b>4. United Kingdom:</b>
          <br />
          33 Bevan Court, Dunlop Street, WA4 6AA, Warrington, England. <br />
          <br />
          <b>Website:</b> www.sureimports.com <br />
        </Section>

        <section className="mt-5 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          <p>Sure Importers Limited Offices:</p>
          <address className="mt-5 w-full not-italic">
            Nigeria: 5 Olutosin Ajayi Street, Ajao Estate, Lagos.
          </address>
          {/* <address className="mt-5 w-full not-italic">
          Colorado, USA: Spreadit Sourcing LLC, 1942 Broadway Street, Suite
          314C, Boulder, Colorado, 80302.
        </address> */}
          <address className="mt-5 w-full not-italic">
            United Kingdom: 33 Bevan Court, Dunlop Street, WA4 6AA, Warrington,
            England.
            {/* Spreadit Sourcing Limited, 85 Great Portland Street, London W1W 7LT
          United Kingdom */}
          </address>
          <address className="mt-5 w-full not-italic">
            China: Guangzhou baiyun area NO.111 airport load jiangfa plaza
            office NO.3FB3-1 广州市白云区机场路111号建发广场3FB3-1.
            {/* China: Room 323 3/F Mingsheng Business Centre, 12-20 Guangyang Road,
          M. Baiyun District, Guangzhou, China.
          (广州市白云区广源中路18号明圣商贸城明圣商贸城323档) */}
          </address>
        </section>

        <Section title="Shipping Methods">
          Sure Importers Limited offers various shipping methods to accommodate
          different types of goods and customer needs:
          <br />
          <b>1. Normal Air Cargo</b>
          <br />- <b>Suitable for:</b> Normal goods without batteries, liquids,
          or gas -<b>Shipping via:</b> Cargo planes -{' '}
          <b>Estimated delivery time:</b> Within 7 business days to most
          countries
          <br />
          <br />
          <b>2. Special Air Cargo (via Hong Kong)</b>
          <br />- <b>Suitable for:</b> Goods containing batteries, liquids, or
          gas -<b>Shipping via:</b> Cargo planes through Hong Kong -{' '}
          <b>Estimated delivery time:</b> 3 to 4 weeks
          <br />
          <br />
          <b>3. Sea Shipping</b>
          <br />- <b>Suitable for:</b> Bulky goods - <b>Options:</b> Full
          container load or groupage (depending on shipment volume) -{' '}
          <b>Estimated delivery time:</b>
          60 to 90 days
          <br />
          <br />
          <b>4. Express Shipping</b>
          <br />- <b>Suitable for:</b> Certain goods that can be carried via
          passenger airlines - <b>Primary destinations:</b> Nigeria and many
          African countries - <b>Estimated delivery time:</b> Within 5 business
          days
          <br />
          <br />
          <b>5. Partner Shipping (DHL, UPS, FedEx)</b>
          <br />-<b>Suitable for:</b> Shipments to Europe, USA, Australia, and
          other non-African countries - <b>Services:</b> End-to-end shipping or
          last-mile delivery -<b>Note:</b> This includes South Africa for phone
          shipments
          <br />
          <br />
        </Section>

        <Section title="Shipping Procedures">
          For USA, UK, Europe, Australia, and South Africa (Phones only):
          <br />
          <ol>
            <li>1. Order confirmation and consolidation</li>
            <li>2. Packaging for shipping</li>
            <li>3. Determination of volumetric weight and pricing</li>
            <li>4. Payment by customer</li>
            <li>5. Remittance to shipping partners</li>
            <li>6. Shipment to Hong Kong</li>
            <li>7. Creation of shipping label (including tracking number)</li>
            <li>8. Customs clearance</li>
            <li>9. Handover to shipping partners</li>
          </ol>
          <br />
          <br />
          <b>Important Notes:</b>
          <br />
          - Shipping label generation takes 2-3 BUSINESS days after payment
          <br />
          - Tracking information becomes available only after our partners
          receive the shipment
          <br />
          - Initial tracking may show that partners have not yet taken
          possession of the shipment
          <br />
          <br />
          <b>For Sea Shipping:</b>
          <br />
          - The time between shipping label generation and visible tracking
          movement can take 25 to 35 days
          <br />
          <br />
        </Section>

        <Section title="Payment and Tracking">
          <b>1.</b> Customers will be provided with a quote based on the
          volumetric weight of their shipment
          <br />
          <b>2.</b> Full payment is required before shipping commences
          <br />
          <b>3.</b> A tracking number will be provided once the shipping label
          is generated
          <br />
          <b>4.</b> Customers can track their shipments using the provided
          tracking number on our partners' websites
          <br />
        </Section>

        <Section title="Customer Support">
          For any questions or concerns regarding your shipment, please contact
          our customer <br />
          support team through our website www.sureimports.com or via the
          contact <br />
          information provided for our office locations.
        </Section>

        <Section title="Disclaimer">
          Shipping times are estimates and may vary due to factors beyond our
          control, <br />
          such as customs procedures, weather conditions, or unforeseen
          logistical issues. <br />
          Sure Importers Limited will make every effort to ensure timely
          delivery but cannot guarantee specific delivery dates.
        </Section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
