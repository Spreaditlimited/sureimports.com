import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from '../ui/button';

interface BackButtonProps {
  className?: string;
}

const BackButton: FC<BackButtonProps> = ({ className = '' }) => {
  const router = useRouter();

  const handleBack = () => {
    //router.back();
    router.push('/dashboard/store?id=laptop');
  };

  return (
    <Button
      onClick={handleBack}
      className={`mt-8 h-14 rounded px-4 py-3.5 ${className}`}
    >
      Back
    </Button>
  );
};

export default BackButton;
