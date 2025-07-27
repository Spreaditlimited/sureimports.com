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
  images: ImageProps[];
  containerClasses: string;
  imageWrapperClasses: string;
  linkHref: string;
};

const ImageComponent: React.FC<ImageProps> = ({ src, alt, className }) => (
  <div className={`relative ${className}`} style={{ height: '67.1px' }}>
    <Image
      loading="lazy"
      src={src}
      alt={alt}
      layout="fill"
      objectFit="contain"
      className="object-contain"
      quality={100}
    />
  </div>
);

const SectionType4: React.FC<SectionProps> = ({
  title,
  description,
  linkText,
  images,
  containerClasses,
  imageWrapperClasses,
  linkHref,
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
        href={linkHref}
        className="mt-3 font-[590] leading-[150%] text-indigo-800 underline"
      >
        {linkText}
      </Link>
    </div>
    <div
      className={`mt-12 flex flex-col flex-wrap content-start ${imageWrapperClasses}`}
    >
      <div className="flex flex-wrap gap-5 max-lg:gap-2 max-md:gap-1">
        {images.map((img, idx) => (
          <ImageComponent key={idx} {...img} />
        ))}
      </div>
    </div>
  </section>
);

export { SectionType4 };
