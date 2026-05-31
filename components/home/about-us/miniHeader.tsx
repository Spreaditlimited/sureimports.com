import * as React from 'react';
import Hero from '@/components/Hero';

interface HeaderSectionProps {
  imageUrl: string;
  altText: string;
  title: string;
}

const MiniHeaderSection: React.FC<HeaderSectionProps> = ({
  imageUrl,
  title,
}) => {
  return (
    <Hero title={title} imageUrl={imageUrl} size="small" showCTA={false} />
  );
};

export default MiniHeaderSection;
