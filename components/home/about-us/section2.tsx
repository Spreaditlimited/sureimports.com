import React from 'react';
import type { FC } from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const Card: FC<CardProps> = ({ title, description, imageSrc, imageAlt }) => (
  <section className="flex w-full grow flex-col justify-between rounded-3xl bg-white px-4 pb-4 pt-7 text-center shadow-xl max-md:mt-9 max-md:max-w-full">
    <div className="mb-5 flex flex-col max-md:max-w-full">
      <h2 className="self-center text-4xl font-[860] capitalize text-slate-800">
        {title}
      </h2>
      <p className="mt-3 text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
        {description}
      </p>
    </div>

    <div className="relative mt-auto aspect-[1.69] w-full rounded-xl max-md:max-w-full">
      <Image
        src={imageSrc}
        alt={imageAlt}
        layout="fill"
        objectFit="cover"
        className="rounded-xl"
      />
    </div>
  </section>
);

const Section2: FC = () => {
  const cardData = [
    {
      title: 'Our Mission',
      description:
        'At Sure Importers Limited, our mission is to simplify the process of procuring and shipping goods from international markets, providing our clients with seamless and efficient solutions that meet their diverse needs.',
      imageSrc: '/home/about-us/section2-our-mission.svg',
      imageAlt: 'Our Mission Image',
    },
    {
      title: 'Our Vision',
      description:
        'We envision a world where businesses and individuals can access a wide range of quality products from global markets with ease and confidence.',
      imageSrc: '/home/about-us/section2-our-vision.svg',
      imageAlt: 'Our Vision Image',
    },
  ];

  return (
    <main>
      <section className="flex gap-5 bg-white px-32 max-xl:px-12 max-lg:px-10 max-md:flex-col max-md:gap-0 max-md:px-5">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col ${index === 1 ? 'ml-5 max-md:ml-0' : ''} w-6/12 max-md:w-full`}
          >
            <Card
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              imageAlt={card.imageAlt}
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default Section2;
