import * as React from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
}

interface DefinitionItem {
  term: string;
  description: string;
}

interface DefinitionsProps {
  items: DefinitionItem[];
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
}) => (
  <header className="flex flex-col self-center px-5 max-md:max-w-full">
    <h1 className="text-4xl font-[860] capitalize text-slate-800 max-md:max-w-full">
      {title}
    </h1>
    {description && (
      <p className="mt-2 self-center text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
        {description}
      </p>
    )}
  </header>
);

const Definitions: React.FC<DefinitionsProps> = ({ items }) => (
  <dl className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
    {items.map((item, index) => (
      <div
        key={index}
        className="mt-3 w-full tracking-normal max-md:max-w-full"
      >
        <dt className="font-bold">{item.term}</dt>
        <dd>{item.description}</dd>
      </div>
    ))}
  </dl>
);

const TermsConditions: React.FC = () => (
  <article className="flex max-w-[923px] flex-col text-center">
    <SectionHeading
      title="sureimports.com Terms and Conditions"
      description="These are the terms and conditions that govern your use of our website."
    />

    <section className="mt-10 flex w-full flex-col max-md:max-w-full">
      <header className="flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Introduction
        </h2>
        <p className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          Welcome to Sure Importers Limited&apos;s website, sureimports.com.
          These terms and conditions (&quot;Terms&quot;) govern your use of our
          website and services provided by Sure Importers Limited. By accessing
          or using our website and services, you agree to be bound by these
          Terms. If you do not agree to these Terms, please refrain from using
          our website and services.
        </p>
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Definitions
        </h2>
        <Definitions
          items={[
            {
              term: 'Sure Importers Limited',
              description:
                'refers to the company providing product sourcing services as described herein, with offices in Nigeria, the USA, and China.',
            },
            { term: 'Website', description: 'refers to sureimports.com.' },
            {
              term: 'User',
              description:
                "refers to any individual or entity accessing or using Sure Importers Limited's website or services.",
            },
            {
              term: 'Goods',
              description:
                'refers to products procured by Sure Importers Limited on behalf of its users.',
            },
            {
              term: 'Special sourcing service',
              description:
                'refers to a customized procurement service offered by Sure Importers Limited.',
            },
            {
              term: 'Commission',
              description:
                'refers to the fee charged by Sure Importers Limited for its procurement services.',
            },
          ]}
        />
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Scope of Services
        </h2>
        <p className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          Sure Importers Limited is a product sourcing company that facilitates
          the procurement and shipping of products primarily from China, but
          also from the USA, South Korea, and the UAE. Sure Importers Limited
          serves individuals and businesses globally. We purchase goods on
          behalf of our users, who must fully pay for the products. Shipping
          fees for goods destined for Nigeria can be paid upon arrival, while
          full payment is required for goods shipped outside Nigeria.
        </p>
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Commission
        </h2>
        <p className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          Sure Importers Limited charges a commission for every procurement
          transaction completed on behalf of our users. The commission amount is
          disclosed prior to the initiation of the procurement process and is
          non-negotiable.
        </p>
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Refunds and Replacements
        </h2>
        <p className="mt-3 w-full leading-6 tracking-normal max-md:max-w-full">
          Sure Importers Limited will facilitate refunds and/or replacements for
          procured goods under the following circumstances:
        </p>
        <ul className="mt-3 w-full list-inside list-disc text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          <li>
            Goods purchased under Sure Importers Limited&apos;s special sourcing
            service are eligible for refunds or replacements if they do not meet
            the specified criteria.
          </li>
          <li>
            Refunds will be issued if our system overestimates the shipping cost
            at the time of order placement.
          </li>
        </ul>
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          User Obligations
        </h2>
        <ul className="mt-3 w-full list-inside list-disc text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          <li>
            Provide accurate and up-to-date information during the procurement
            process.
          </li>
          <li>
            Abide by all relevant laws and regulations governing international
            trade and shipping.
          </li>
          <li>
            Pay all fees and charges associated with the procurement and
            shipping of goods.
          </li>
          <li>Accept delivery of goods within the specified timeframe.</li>
        </ul>
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Limitation of Liability
        </h2>
        <p className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          Sure Importers Limited shall not be liable for any direct, indirect,
          incidental, special, or consequential damages arising out of or in any
          way connected with the use of our website or services, including but
          not limited to procurement errors, shipping delays, or product
          defects.
        </p>
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Governing Law and Dispute Resolution
        </h2>
        <p className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          These Terms shall be governed by and construed in accordance with the
          laws of Nigeria. Any dispute arising out of or relating to these Terms
          shall be resolved through arbitration in Nigeria, with each party
          bearing its own costs.
        </p>
      </header>

      <header className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Amendments
        </h2>
        <p className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          Sure Importers Limited reserves the right to amend these Terms at any
          time without prior notice. Amendments will be effective upon posting
          on our website. Users are encouraged to review these Terms
          periodically for updates.
        </p>
      </header>
    </section>

    <section className="mt-9 flex w-full flex-col px-5 max-md:max-w-full">
      <header className="flex flex-col max-md:max-w-full">
        <h2 className="self-center text-xl font-[590] leading-6 text-neutral-950">
          Contact Information
        </h2>
        <p className="mt-3 w-full text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          If you have any questions or concerns about these Terms, please
          contact us at hello@sureimports.com.
        </p>
      </header>

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
          China: Guangzhou baiyun area NO.111 airport load jiangfa plaza office
          NO.3FB3-1 广州市白云区机场路111号建发广场3FB3-1.
          {/* China: Room 323 3/F Mingsheng Business Centre, 12-20 Guangyang Road,
          M. Baiyun District, Guangzhou, China.
          (广州市白云区广源中路18号明圣商贸城明圣商贸城323档) */}
        </address>
      </section>
    </section>
  </article>
);

export default TermsConditions;
