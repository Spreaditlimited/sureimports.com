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
          sureimports.com Privacy Policy
        </h1>
        <p className="mt-2 w-full text-base leading-6 tracking-normal text-slate-600">
          We are committed to protecting the privacy and security of our
          users&apos; personal information. This Privacy Policy outlines how we
          collect, use, and safeguard the information you provide to us when
          using our website and services.
        </p>
      </header>
      <main className="mt-10 flex w-full max-w-[923px] flex-col self-center max-md:max-w-full">
        <Section title="Information We Collect">
          We collect personal information from users in various ways, including
          when you register on our website, place an order, or communicate with
          us via email or other channels. The types of personal information we
          may collect include:
          <ul className="mt-3 list-inside list-disc tracking-normal">
            <li>
              Contact information (such as name, email address, phone number)
            </li>
            <li>Billing and shipping address</li>
            <li>Payment information</li>
            <li>Order details and preferences</li>
            <li>Communications and correspondence with us</li>
          </ul>
        </Section>
        <Section title="How We Use Your Information">
          We use the information we collect for the following purposes:
          <ul className="mt-3 list-inside list-disc tracking-normal">
            <li>To process and fulfill orders for products and services.</li>
            <li>
              To communicate with users regarding their orders, inquiries, or
              requests.
            </li>
            <li>To provide customer support and assistance.</li>
            <li>To improve our website, services, and user experience.</li>
            <li>
              To personalize your experience and tailor our offerings to your
              preferences.
            </li>
            <li>
              To send periodic emails and updates regarding our products,
              services, promotions, or other relevant information.
            </li>
          </ul>
        </Section>
        <Section title="Data Security">
          We implement a variety of security measures to maintain the safety and
          integrity of your personal information. These measures include
          encryption, secure socket layer (SSL) technology, firewalls, and
          regular security audits. We restrict access to your personal
          information to authorized personnel only and ensure that our
          third-party service providers adhere to strict security standards.
        </Section>
        <Section title="Data Sharing and Disclosure">
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as required or permitted
          by law. We may share your information with trusted third-party service
          providers who assist us in operating our website, conducting business,
          or servicing you, as long as they agree to keep your information
          confidential.
        </Section>
        <Section title="Cookies and Tracking Technologies">
          We use cookies and similar tracking technologies to enhance your
          browsing experience, analyze website traffic, and gather information
          about how you interact with our website. You can choose to disable
          cookies through your browser settings; however, please note that some
          features of our website may not function properly if cookies are
          disabled.
        </Section>
        <Section title="Third-Party Links">
          Our website may contain links to third-party websites or services that
          are not operated or controlled by Sure Importers Limited. We are not
          responsible for the privacy practices or content of these third-party
          sites and encourage you to review their privacy policies before
          providing any personal information.
        </Section>
        <Section title="Children's Privacy">
          Our website and services are not intended for children under the age
          of 18. We do not knowingly collect personal information from children,
          and if we become aware that we have inadvertently collected
          information from a child, we will take steps to delete it promptly.
        </Section>
        <Section title="Your Rights">
          You have the right to access, update, or delete your personal
          information at any time. If you would like to exercise any of these
          rights or have any questions or concerns about our Privacy Policy,
          please contact us using the information provided below.
        </Section>
        <Section title="Changes to This Privacy Policy">
          We reserve the right to update or revise this Privacy Policy at any
          time without prior notice. Any changes will be posted on this page,
          and the effective date will be updated accordingly. We encourage you
          to review this Privacy Policy periodically for any updates or changes.
        </Section>
        <Section title="Contact Us">
          If you have any questions, comments, or concerns about our Privacy
          Policy or our practices regarding your personal information, please
          contact us at hello@sureimports.com.
          <p className="mx-8 mt-5 text-base leading-6 tracking-normal text-slate-600">
            By using our website and services, you acknowledge that you have
            read, understood, and agree to be bound by this Privacy Policy.
          </p>
        </Section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
