import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ImageProps = {
  src: string;
  alt: string;
  className?: React.HTMLProps<HTMLElement>['className'];
};

type SectionProps = {
  title: string;
  description: string;
  linkText: string;
  image: ImageProps;
  containerClasses: string;
  imageWrapperClasses: string;
};

const SectionType5: React.FC<SectionProps> = ({
  title,
  description,
  linkText,
  image,
  containerClasses,
  imageWrapperClasses,
}) => (
  <section
    className={`${containerClasses} transition-transform duration-300 hover:scale-105`}
  >
    <div className="flex flex-col pr-40 text-base tracking-normal max-lg:pr-20">
      <h2 className="text-3xl font-[860] capitalize leading-10 tracking-tight text-slate-900 max-lg:pr-20">
        {title}
      </h2>
      <p className="mt-3 leading-6 text-slate-600">{description}</p>
      <Link
        href="#"
        className="mt-3 font-[590] leading-[150%] text-indigo-800 underline"
      >
        {linkText}
      </Link>
    </div>
    <div
      className={`mt-12 flex flex-col flex-wrap content-start ${imageWrapperClasses}`}
    >
      <div
        className={`relative ${image.className}`}
        style={{ height: '67.1px' }}
      >
        <Image
          loading="lazy"
          src={image.src}
          alt={image.alt}
          layout="fill"
          objectFit="contain"
          className="object-contain"
          quality={100}
        />
      </div>
    </div>
  </section>
);

export { SectionType5 };
