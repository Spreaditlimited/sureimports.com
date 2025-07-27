'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react'; // Importing the spinner icon from lucide-react
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface CardProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  className?: string;
  onClick: () => void;
  isSelected: boolean;
}

const CategoryCard: React.FC<CardProps> = ({
  src,
  alt,
  title,
  description,
  className,
  onClick,
  isSelected,
}) => (
  <Card
    className={`flex h-56 w-60 grow cursor-pointer flex-col justify-center rounded-3xl border-0 py-12 text-center text-xl font-semibold capitalize transition-transform duration-300 hover:scale-105 hover:border hover:border-indigo-800 hover:bg-indigo-800 hover:bg-opacity-10 hover:font-bold max-md:h-44 max-md:w-40 md:px-11 ${
      isSelected
        ? 'border border-indigo-800 bg-indigo-800 bg-opacity-10'
        : 'bg-slate-100 text-slate-800'
    } ${className}`}
    onClick={onClick}
  >
    <CardContent className="mt-0 p-0 text-center">
      <Link href="/" className="self-center">
        <Image
          loading="lazy"
          src="/images/svg-logo.svg"
          alt="Logo"
          width={144}
          height={48}
          className="mb-4 h-12 w-96 self-center"
        />
      </Link>
      <div className="mt-4">{title}</div>
      <div className="mt-3">{description}</div>
    </CardContent>
  </Card>
);

interface SelectCategoryPageProps {
  categories: {
    src: string;
    alt: string;
    title: string;
    description: string;
    className: string;
  }[];
}

////////////////// SELECT CATEGORY PAGE /////////////////
const SelectCategoryPage: React.FC<SelectCategoryPageProps> = ({
  categories,
}) => {
  ////////////////// DASHBOARD RE-DIRECT CONTROL //////////////////
  const { user, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);
  //if (!user) {return null;}
  ////////////////// DASHBOARD RE-DIRECT CONTROL //////////////////

  //LOGOUT
  const Logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.push('../auth/login');
  };

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const [isLoading, setLoading] = React.useState(false);

  const { toast } = useToast();

  const selectCard = (title: string) => {
    setSelectedCategory(title);
  };

  const handleSubmit = async () => {
    if (selectedCategory) {
      setLoading(true);
      console.log('Selected category:', selectedCategory);

      // Determine the redirect path based on the selected category
      let redirectPath = '/dashboard/special-sourcing/pending';
      switch (selectedCategory.toLowerCase()) {
        case 'special sourcing':
          redirectPath = '/dashboard/special-sourcing/pending';
          break;
        case 'verify supplier':
          redirectPath = '/dashboard/verify-supplier/pending-payment';
          break;
        // case 'general procurement':
        //   redirectPath = '/dashboard/procurement';
        //   break;
        case 'pay supplier':
          redirectPath = '/dashboard/pay-supplier/saved';
          break;
        case 'shipping':
          redirectPath = '/dashboard/shipping-only/request-received';
          break;
        case 'Buy laptops and phones':
          redirectPath = '/dashboard/store?id=laptop';
          break;
      }

      // Simulate an async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
      router.push(redirectPath);
    } else {
      toast({
        title: 'Select a category',
        variant: 'destructive',
        description: 'Please select a category to continue',
      });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white">
      <Image
        loading="lazy"
        src="/images/background.png"
        alt=""
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative flex w-full max-w-full flex-col items-center px-2 sm:px-16">
        <Card className="w-lg relative my-5 rounded-3xl bg-white p-5 shadow-2xl sm:p-10">
          <CardHeader className="mt-0 p-0 text-center">
            <Link href="/" className="self-center">
              <Image
                loading="lazy"
                src="/images/svg-logo.svg"
                alt="Logo"
                width={144}
                height={48}
                className="mb-4 h-12 w-96 self-center"
              />
            </Link>
            <div className="text-sm font-bold text-indigo-800">Tell us</div>
            <h1 className="mt-1.5 text-3xl font-extrabold text-slate-800 max-sm:text-2xl">
              What do you want to do?
            </h1>
          </CardHeader>

          <CardContent className="mb-0 mt-10 px-0 py-0">
            <div className="flex flex-col space-y-5 max-md:items-center max-md:space-y-2">
              <div className="flex flex-row gap-5 max-md:gap-2">
                {categories.slice(0, 2).map((category, index) => (
                  <CategoryCard
                    key={index}
                    {...category}
                    isSelected={selectedCategory === category.title}
                    onClick={() => selectCard(category.title)}
                  />
                ))}
              </div>

              <div className="flex flex-row gap-5 max-md:gap-2">
                {categories.slice(2, 4).map((category, index) => (
                  <CategoryCard
                    key={index}
                    {...category}
                    isSelected={selectedCategory === category.title}
                    onClick={() => selectCard(category.title)}
                  />
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-8 flex w-full items-center justify-center">
            <Button
              className="h-14 w-full py-3.5"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const SelectCategoryPageContainer: React.FC = () => {
  const categories = [
    {
      src: '/icons/special-sourcing.svg',
      alt: 'Special Sourcing icon',
      title: 'Special Sourcing (Popular)',
      description: 'Best for sourcing unique products',
      className: '',
    },
    {
      src: '/icons/special-sourcing.svg',
      alt: 'Special Sourcing icon',
      title: 'Verify Supplier',
      description: '',
      className: '',
    },
    // {
    //   src: '/icons/general-procurement.svg',
    //   alt: 'General procurement icon',
    //   title: 'General procurement',
    //   description: '',
    //   className: '',
    // },
    {
      src: '/icons/pay-supplier.svg',
      alt: 'Pay Supplier icon',
      title: 'Pay Supplier',
      description: '',
      className: '',
    },
    {
      src: '/icons/shipping.svg',
      alt: 'Shipping icon',
      title: 'Shipping',
      description: '',
      className: '',
    },
    {
      src: '/icons/special-sourcing.svg',
      alt: 'Special Sourcing icon',
      title: 'Buy Laptops and Phones',
      description: '',
      className: '',
    },
  ];

  return <SelectCategoryPage categories={categories} />;
};

export default SelectCategoryPageContainer;
