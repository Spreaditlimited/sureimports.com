import { Star, Quote, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// Use string paths from the public folder to avoid StaticImageData in <img> src
const chiomaImage = '/images/new/images/img1.jpg';
const chukwuedozieImage = '/images/new/images/img2.jpg';

// Use the public URL for images placed in the /public folder to keep src a string
const amarachiImage = '/images/new/images/img3.jpg';

interface CustomerReviewsProps {
  onNavigateToSignUp?: () => void;
}

export default function CustomerReviews({ onNavigateToSignUp }: CustomerReviewsProps) {
  const reviews = [
    {
      name: "Chioma Ifeanyi-Eze",
      role: "Founder of Accountinghub and Fresh Eggs Market, Nigeria",
      content: "You want to import equipment? You want to source anything in China? You are so afraid of being defrauded? You just want an honest upright truthful sensible person. You want a person who will listen and execute every line of the agreement. You want a person who is deeply knowledgeable and not audio. You want a person whose integrity allows you pay him N100 million and go to sleep. You want a person who has a team (not audio) in China. You want a person with a brain who can make suggestions and guide you. Nwannem, run to Nkwocha Tochukwu (CEO of Sure Importers Limited). Pay him your money. Buy popcorn, cross leg and chop. Sleep with 2 eyes closed. Kobo no go miss.",
      rating: 5,
      initials: "CI",
      hasImage: true
    },
    {
      name: "Chukwuedozie Nwokoye",
      role: "Business Man, Nigeria",
      content: "Working with Sure Imports was a game-changer for our business. We needed 2,000 custom-branded items to fulfill a client order, and all we provided was a product description, branding requirements, and a reference image. The results exceeded our expectations - the product quality and branding were impeccable, matching exactly what we envisioned. What truly sets Sure Imports apart is their integrity. Not only did they deliver exceptional quality, but their transparent pricing actually came in below what we thought the final cost will be. Their team handles your sourcing needs with the same care and attention they'd give their own business. For anyone looking for reliable product sourcing from China, I can't recommend Sure Imports highly enough.",
      rating: 5,
      initials: "CN",
      hasImage: true
    },
    {
      name: "Amarachi Ndukauba Ogbuagu",
      role: "Business Woman, Canada",
      content: "Dear Sure Importers Limited, I just wanted to take a moment to express my sincere appreciation for the excellent service you provided with my recent shipment. From the moment I placed the order to the delivery, everything was handled with the utmost professionalism and efficiency. The package arrived on time and in perfect condition, which I greatly appreciate. It's clear that your team takes great care in ensuring that each order is processed and delivered with precision. I'm truly impressed with the level of attention to detail and the smoothness of the entire process. Thank you once again for your outstanding service. It's always a pleasure to do business with a company that values its customers and goes above and beyond to deliver. I look forward to continuing to shop with you in the future.",
      rating: 5,
      initials: "AO",
      hasImage: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">4.7/5</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8">
            Join thousands of satisfied customers who trust Sure Imports for their China sourcing needs
          </p>

          {/* Google Rating Card */}
          <div className="flex flex-col sm:flex-row sm:inline-flex items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white/5 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mb-8 sm:mb-12 max-w-full mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-white font-semibold">Google Reviews</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xl sm:text-2xl font-bold text-white">4.7</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
              Based on 60+ reviews
            </div>
          </div>
        </div>

        {/* Reviews - Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8 flex md:flex-none overflow-x-auto md:overflow-x-visible gap-6 pb-4 md:pb-0 scrollbar-hide">
          {reviews.map((review, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group min-w-[320px] md:min-w-0">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start">
                    <Quote className="w-8 h-8 text-blue-400 opacity-50" />
                    <div className="flex space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-300 leading-relaxed text-sm">
                    "{review.content}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-700/50">
                    <Avatar className="w-10 h-10">
                      {review.hasImage ? (
                        <AvatarImage 
                          src={
                            review.name === "Chioma Ifeanyi-Eze" ? chiomaImage :
                            review.name === "Chukwuedozie Nwokoye" ? chukwuedozieImage : amarachiImage
                          } 
                          alt={review.name} 
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {review.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-white font-medium text-sm">{review.name}</div>
                      <div className="text-gray-400 text-xs">{review.role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Join Our Satisfied Customers?</h3>
            <p className="text-gray-300 mb-6">
              Experience the Sure Imports difference and see why thousands of businesses trust us with their China sourcing needs.
            </p>
            <button 
              onClick={onNavigateToSignUp}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}