import Image from 'next/image';

interface ImageProps {
  src: string;
  alt: string;
  className: string;
}

const CustomImage: React.FC<ImageProps> = ({ src, alt, className }) => (
  <Image
    src={src}
    alt={alt}
    layout="responsive"
    width={500}
    height={500}
    quality={100}
    className={className}
  />
);

export default CustomImage;
