import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const chiomaImage = '/images/new/images/img1.jpg';
const chukwuedozieImage = '/images/new/images/img2.jpg';
const amarachiImage = '/images/new/images/img3.jpg';

interface CustomerReviewsProps {
  onNavigateToSignUp?: () => void;
}

export default function CustomerReviews(_: CustomerReviewsProps) {
  const reviews = [
    {
      name: 'Chioma Ifeanyi-Eze',
      role: 'Founder, Accountinghub & Fresh Eggs Market',
      content: 'You want a person whose integrity allows you pay him N100 million and go to sleep. You want a person who has a team in China. Nwannem, run to Nkwocha Tochukwu (CEO of Sure Importers Limited). Pay him your money. Sleep with 2 eyes closed. Kobo no go miss.',
      image: chiomaImage,
    },
    {
      name: 'Chukwuedozie Nwokoye',
      role: 'Business Owner',
      content: "Working with Sure Imports was a game-changer. We needed 2,000 custom-branded items. Not only did they deliver exceptional quality, but their transparent pricing came in below what we expected. I can't recommend them highly enough.",
      image: chukwuedozieImage,
    },
    {
      name: 'Amarachi Ndukauba',
      role: 'Entrepreneur, Canada',
      content: "From the moment I placed the order to the delivery, everything was handled with the utmost professionalism. The package arrived on time and in perfect condition. It's always a pleasure to do business with a company that values its customers.",
      image: amarachiImage,
    },
  ];

  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">G</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Google Reviews</span>
            <div className="ml-2 flex items-center gap-0.5">
              <span className="font-black">4.7</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Don't just take our word for it.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <div key={index} className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <Quote className="mb-4 h-8 w-8 text-indigo-200 dark:text-indigo-900/50" />
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">"{review.content}"</p>
              </div>
              <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                <Image
                  src={review.image}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{review.name}</div>
                  <div className="text-xs text-slate-500">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="mx-auto max-w-3xl rounded-[32px] bg-indigo-900 p-10 text-white shadow-2xl sm:p-16">
            <h3 className="mb-4 text-3xl font-black">Ready to scale your business?</h3>
            <p className="mb-8 text-indigo-200">Join thousands of businesses importing effortlessly from China.</p>
            <Link
              href="/auth/login"
              className="inline-flex h-14 items-center justify-center rounded-full border-0 bg-brand-orange-500 px-10 text-base font-bold text-white shadow-lg shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 hover:shadow-brand-orange-500/40 active:scale-[0.98]"
            >
              Start Sourcing Today
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
