import * as React from 'react';
import Image from 'next/image';

interface HeaderSectionProps {
  imageUrl: string;
  altText: string;
  title: string;
}

const MiniHeaderSection: React.FC<HeaderSectionProps> = ({
  imageUrl,
  altText,
  title,
}) => {
  return (
    <section className="relative flex min-h-[304px] flex-col items-center justify-center overflow-hidden px-16 pb-20 pt-40 text-center text-6xl font-bold capitalize text-white max-lg:text-5xl max-md:max-w-full max-md:px-5 max-md:pt-28 max-md:text-3xl max-md:text-4xl">
      <Image
        src={imageUrl}
        alt={altText}
        layout="fill"
        objectFit="cover"
        priority={true}
        className="absolute inset-0 z-[-1]"
      />
      {title}
    </section>
  );
};

export default MiniHeaderSection;
