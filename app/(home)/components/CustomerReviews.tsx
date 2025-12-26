import { Star, Quote, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// Use string paths from the public folder to avoid StaticImageData in <img> src
const chiomaImage = '/images/new/images/img1.jpg';
const chukwuedozieImage = '/images/new/images/img2.jpg';

// Use the public URL for images placed in the /public folder to keep src a string
const amarachiImage = '/images/new/images/img3.jpg';

interface CustomerReviewsProps {
  onNavigateToSignUp?: () => void;
}

export default function CustomerReviews({
  onNavigateToSignUp,
}: CustomerReviewsProps) {
  const reviews = [
    {
      name: 'Chioma Ifeanyi-Eze',
      role: 'Founder of Accountinghub and Fresh Eggs Market, Nigeria',
      content:
        'You want to import equipment? You want to source anything in China? You are so afraid of being defrauded? You just want an honest upright truthful sensible person. You want a person who will listen and execute every line of the agreement. You want a person who is deeply knowledgeable and not audio. You want a person whose integrity allows you pay him N100 million and go to sleep. You want a person who has a team (not audio) in China. You want a person with a brain who can make suggestions and guide you. Nwannem, run to Nkwocha Tochukwu (CEO of Sure Importers Limited). Pay him your money. Buy popcorn, cross leg and chop. Sleep with 2 eyes closed. Kobo no go miss.',
      rating: 5,
      initials: 'CI',
      hasImage: true,
    },
    {
      name: 'Chukwuedozie Nwokoye',
      role: 'Business Man, Nigeria',
      content:
        "Working with Sure Imports was a game-changer for our business. We needed 2,000 custom-branded items to fulfill a client order, and all we provided was a product description, branding requirements, and a reference image. The results exceeded our expectations - the product quality and branding were impeccable, matching exactly what we envisioned. What truly sets Sure Imports apart is their integrity. Not only did they deliver exceptional quality, but their transparent pricing actually came in below what we thought the final cost will be. Their team handles your sourcing needs with the same care and attention they'd give their own business. For anyone looking for reliable product sourcing from China, I can't recommend Sure Imports highly enough.",
      rating: 5,
      initials: 'CN',
      hasImage: true,
    },
    {
      name: 'Amarachi Ndukauba Ogbuagu',
      role: 'Business Woman, Canada',
      content:
        "Dear Sure Importers Limited, I just wanted to take a moment to express my sincere appreciation for the excellent service you provided with my recent shipment. From the moment I placed the order to the delivery, everything was handled with the utmost professionalism and efficiency. The package arrived on time and in perfect condition, which I greatly appreciate. It's clear that your team takes great care in ensuring that each order is processed and delivered with precision. I'm truly impressed with the level of attention to detail and the smoothness of the entire process. Thank you once again for your outstanding service. It's always a pleasure to do business with a company that values its customers and goes above and beyond to deliver. I look forward to continuing to shop with you in the future.",
      rating: 5,
      initials: 'AO',
      hasImage: true,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">4.7/5</span>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            What Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>

          <p className="mx-auto mb-6 max-w-3xl text-xl text-gray-300 sm:mb-8">
            Join thousands of satisfied customers who trust Sure Imports for
            their China sourcing needs
          </p>

          {/* Google Rating Card */}
          <div className="mx-auto mb-8 flex max-w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-700/50 bg-white/5 px-4 py-3 backdrop-blur-sm sm:mb-12 sm:inline-flex sm:flex-row sm:space-x-4 sm:space-y-0 sm:px-6 sm:py-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-yellow-500">
                <span className="text-sm font-bold text-white">G</span>
              </div>
              <span className="font-semibold text-white">Google Reviews</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold text-white sm:text-2xl">
                4.7
              </span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-gray-400 sm:text-left sm:text-base">
              Based on 60+ reviews
            </div>
          </div>
        </div>

        {/* Reviews - Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4 md:grid md:flex-none md:grid-cols-1 md:gap-8 md:overflow-x-visible md:pb-0 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="group min-w-[320px] border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 md:min-w-0"
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <div className="flex items-start justify-between">
                    <Quote className="h-8 w-8 text-blue-400 opacity-50" />
                    <div className="flex space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-sm leading-relaxed text-gray-300">
                    "{review.content}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center space-x-3 border-t border-slate-700/50 pt-4">
                    <Avatar className="h-10 w-10">
                      {review.hasImage ? (
                        <AvatarImage
                          src={
                            review.name === 'Chioma Ifeanyi-Eze'
                              ? chiomaImage
                              : review.name === 'Chukwuedozie Nwokoye'
                                ? chukwuedozieImage
                                : amarachiImage
                          }
                          alt={review.name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {review.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {review.name}
                      </div>
                      <div className="text-xs text-gray-400">{review.role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-8">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Ready to Join Our Satisfied Customers?
            </h3>
            <p className="mb-6 text-gray-300">
              Experience the Sure Imports difference and see why thousands of
              businesses trust us with their China sourcing needs.
            </p>
            <button
              onClick={onNavigateToSignUp}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
