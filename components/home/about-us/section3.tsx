import React from 'react';

interface ValueCardProps {
  number: number;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({
  number,
  title,
  description,
}) => (
  <div className="flex w-full grow flex-col rounded-3xl bg-white p-5 drop-shadow-lg max-md:mt-5">
    <div className="flex h-[60px] w-[60px] flex-col items-center justify-center whitespace-nowrap rounded-full bg-slate-100 text-2xl font-[860] capitalize leading-7 tracking-tight text-slate-400">
      <div className="h-full w-full place-content-center justify-center rounded-full border border-solid border-indigo-800 border-opacity-10 text-center">
        <div>{number}</div>
      </div>
    </div>
    <div className="mt-4 flex flex-col">
      <h3 className="text-2xl font-[860] capitalize leading-7 tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-3 text-base leading-6 tracking-normal text-slate-600">
        {description}
      </p>
    </div>
  </div>
);

const Section3: React.FC = () => {
  const values = [
    {
      number: 1,
      title: 'Reliability',
      description:
        'We understand the importance of reliability in international trade. Therefore, we strive to deliver on our promises and ensure that our clients can trust us to fulfill their procurement needs efficiently and effectively.',
    },
    {
      number: 2,
      title: 'Transparency',
      description:
        'Transparency is at the core of our business operations. We believe in open communication and providing our clients with clear and accurate information throughout the procurement process.',
    },
    {
      number: 3,
      title: 'Integrity',
      description:
        'Integrity is non-negotiable in everything we do. We adhere to the highest ethical standards, ensuring honesty, fairness, and accountability in all our interactions with clients, suppliers, and partners.',
    },
    {
      number: 4,
      title: 'Innovation',
      description:
        'In a rapidly evolving global marketplace, innovation is key to staying ahead. We embrace innovation in our processes and technologies, constantly seeking new ways to improve efficiency and deliver value to our clients.',
    },
    {
      number: 5,
      title: 'Customer Centricity',
      description:
        'Our clients are at the heart of everything we do. We are committed to understanding their unique needs and delivering personalized solutions that exceed their expectations.',
    },
    {
      number: 6,
      title: 'Quality',
      description:
        'We are dedicated to maintaining the highest standards of quality in all aspects of our business, from the products we source to the services we provide. Quality assurance is central to our commitment to client satisfaction.',
    },
    {
      number: 7,
      title: 'Global Citizenship',
      description:
        'As a global company, we recognize our responsibility to contribute positively to the communities and environments in which we operate. We are committed to sustainable business practices and social responsibility initiatives that create lasting impact.',
    },
  ];

  return (
    <main className="flex flex-col justify-center bg-white px-20 pb-10 pt-20 max-xl:px-12 max-xl:pb-10 max-lg:px-10 max-md:px-5">
      <section className="flex flex-col self-center text-center max-md:max-w-full">
        <h1 className="self-center text-4xl font-[860] capitalize text-slate-800 max-md:max-w-full">
          Our Core Values
        </h1>
        <p className="mt-2.5 text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          Here are the ways we make product sourcing from China a breeze for
          you.
        </p>
      </section>
      <section className="mt-10 w-full max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {values.slice(0, 3).map((value) => (
            <div
              className="flex w-[33%] flex-col max-md:ml-0 max-md:w-full"
              key={value.number}
            >
              <ValueCard
                number={value.number}
                title={value.title}
                description={value.description}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="mt-5 w-full max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {values.slice(3, 6).map((value) => (
            <div
              className="flex w-[33%] flex-col max-md:ml-0 max-md:w-full"
              key={value.number}
            >
              <ValueCard
                number={value.number}
                title={value.title}
                description={value.description}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="mt-5 flex w-full flex-col rounded-3xl bg-white px-5 py-6 text-base leading-6 tracking-normal shadow-xl max-md:max-w-full">
        <div className="flex gap-4 self-start text-2xl font-[860] capitalize leading-7 tracking-tight">
          <div className="flex h-[60px] w-[60px] flex-col items-center justify-center whitespace-nowrap rounded-full bg-slate-100 text-2xl font-[860] capitalize leading-7 tracking-tight text-slate-400">
            <div className="h-full w-full place-content-center justify-center rounded-full border border-solid border-indigo-800 border-opacity-10 text-center">
              {values[6].number}
            </div>
          </div>
          <div className="my-auto flex-auto text-slate-900">
            {values[6].title}
          </div>
        </div>
        <p className="mt-6 text-slate-600 max-md:max-w-full">
          {values[6].description}
        </p>
        <p className="mt-5 text-slate-600 max-md:max-w-full">
          Sure Importers Limited is more than just a product sourcing company;
          we are a partner you can rely on to navigate the complexities of
          international trade and help you achieve your business objectives.
          With our unwavering commitment to excellence and our core values
          guiding our every decision, we are confident in our ability to deliver
          exceptional results for our clients, wherever they may be in the
          world.
        </p>
      </section>
    </main>
  );
};

export default Section3;
