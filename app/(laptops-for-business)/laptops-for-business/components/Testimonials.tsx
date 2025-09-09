import { Star, Quote, ShoppingBag, Smartphone, Laptop, Headphones, Clock, Shield, Zap } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Lagos, Nigeria",
    rating: 5,
    service: "MacBook Purchase",
    review: "Absolutely fantastic experience with Sure Imports! I got my MacBook Pro at an incredible price and it arrived exactly as described. The quality verification process gave me confidence in my purchase.",
    date: "2 weeks ago",
    avatar: "🇳🇬",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    name: "David Chen",
    location: "Abuja, Nigeria",
    rating: 5,
    service: "Product Sourcing",
    review: "Sure Imports helped me source 200 units of wireless earbuds for my business. The entire process was transparent, and the quality exceeded my expectations. Highly recommend their sourcing services!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-green-500 to-blue-600"
  },
  {
    id: 3,
    name: "Amina Bello",
    location: "Port Harcourt, Nigeria",
    rating: 5,
    service: "Gadget Purchase",
    review: "I've been buying gadgets from Sure Imports for over a year now. Their customer service is exceptional, and they always deliver authentic products. My go-to for all tech needs!",
    date: "3 days ago",
    avatar: "🇳🇬",
    color: "from-pink-500 to-orange-500"
  },
  {
    id: 4,
    name: "Emmanuel Okafor",
    location: "Kano, Nigeria",
    rating: 5,
    service: "Bulk Orders",
    review: "Ordered 50 smartphones for my store through Sure Imports. The bulk discount was amazing, and every device was properly inspected. My customers are happy, and so am I!",
    date: "1 month ago",
    avatar: "🇳🇬",
    color: "from-yellow-500 to-red-500"
  },
  {
    id: 5,
    name: "Grace Adebayo",
    location: "Ibadan, Nigeria",
    rating: 5,
    service: "Chinese Website Purchase",
    review: "Sure Imports made buying from Chinese websites so easy! They handled everything from translation to quality checks. My laptop bag arrived in perfect condition.",
    date: "5 days ago",
    avatar: "🇳🇬",
    color: "from-indigo-500 to-pink-500"
  },
  {
    id: 6,
    name: "Michael Thompson",
    location: "Jos, Nigeria",
    rating: 5,
    service: "MacBook Purchase",
    review: "Got my dream MacBook Air through Sure Imports at 30% less than local prices. The verification process was thorough, and it came with warranty. Couldn't be happier!",
    date: "2 weeks ago",
    avatar: "🇳🇬",
    color: "from-teal-500 to-blue-600"
  },
  {
    id: 7,
    name: "Fatima Aliyu",
    location: "Kaduna, Nigeria",
    rating: 5,
    service: "Custom Sourcing",
    review: "Needed specific camera equipment for my photography business. Sure Imports found exactly what I was looking for at an unbeatable price. Professional service throughout!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-purple-500 to-green-500"
  },
  {
    id: 8,
    name: "James Williams",
    location: "Enugu, Nigeria",
    rating: 5,
    service: "FAYA Accessories",
    review: "The FAYA phone accessories I bought are top quality. The wireless charger works perfectly, and the phone case is extremely durable. Great value for money!",
    date: "4 days ago",
    avatar: "🇳🇬",
    color: "from-orange-500 to-purple-600"
  },
  {
    id: 9,
    name: "Blessing Okoro",
    location: "Warri, Nigeria",
    rating: 5,
    service: "Smartphone Purchase",
    review: "Bought my iPhone 15 Pro through Sure Imports and saved ₦200,000! The phone is genuine, works perfectly, and came with international warranty. Amazing service!",
    date: "3 weeks ago",
    avatar: "🇳🇬",
    color: "from-red-500 to-pink-600"
  },
  {
    id: 10,
    name: "Abdul Rahman",
    location: "Maiduguri, Nigeria",
    rating: 5,
    service: "Product Sourcing",
    review: "Sure Imports helped me source gaming laptops for my cyber cafe. The quality is excellent, prices were competitive, and delivery was faster than expected. Highly satisfied!",
    date: "2 days ago",
    avatar: "🇳🇬",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 11,
    name: "Jennifer Eze",
    location: "Calabar, Nigeria",
    rating: 5,
    service: "MacBook Purchase",
    review: "As a graphic designer, I needed a reliable MacBook Pro. Sure Imports delivered exactly what I needed at an incredible price. The color accuracy is perfect for my work!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 12,
    name: "Chinedu Obi",
    location: "Onitsha, Nigeria",
    rating: 5,
    service: "Bulk Electronics",
    review: "Ordered electronics worth ₦5M for my store. Sure Imports handled the entire process professionally, from sourcing to quality control. My sales have increased significantly!",
    date: "2 months ago",
    avatar: "🇳🇬",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 13,
    name: "Aisha Yakubu",
    location: "Zaria, Nigeria",
    rating: 5,
    service: "Custom Order",
    review: "Needed a specific tablet model for my research work. Sure Imports found it, verified its authenticity, and delivered it in record time. Outstanding customer service!",
    date: "6 days ago",
    avatar: "🇳🇬",
    color: "from-lime-500 to-green-600"
  },
  {
    id: 14,
    name: "Peter Nwosu",
    location: "Aba, Nigeria",
    rating: 5,
    service: "Gadget Purchase",
    review: "The smartwatch I bought works perfectly. Battery life is excellent, and all features work as advertised. Sure Imports' quality verification process is top-notch!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-rose-500 to-pink-600"
  },
  {
    id: 15,
    name: "Folake Adebayo",
    location: "Abeokuta, Nigeria",
    rating: 5,
    service: "iPhone Purchase",
    review: "Got my iPhone 14 Pro Max at an amazing price! The phone is completely authentic, and Sure Imports provided excellent after-sales support. Will definitely order again!",
    date: "3 weeks ago",
    avatar: "🇳🇬",
    color: "from-sky-500 to-blue-600"
  },
  {
    id: 16,
    name: "Ibrahim Musa",
    location: "Sokoto, Nigeria",
    rating: 5,
    service: "Laptop Purchase",
    review: "Bought a gaming laptop for my son through Sure Imports. The specifications are exactly as described, and the price was unbeatable. Fast delivery too!",
    date: "2 weeks ago",
    avatar: "🇳🇬",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 17,
    name: "Chioma Igwe",
    location: "Awka, Nigeria",
    rating: 5,
    service: "Accessory Purchase",
    review: "The wireless earbuds I purchased are fantastic! Sound quality is crystal clear, and the noise cancellation works perfectly. Sure Imports never disappoints!",
    date: "5 days ago",
    avatar: "🇳🇬",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    id: 18,
    name: "Umar Suleiman",
    location: "Bauchi, Nigeria",
    rating: 5,
    service: "Business Equipment",
    review: "Sourced point-of-sale systems for my retail chain through Sure Imports. The quality is excellent, and the bulk pricing saved me millions. Professional service!",
    date: "1 month ago",
    avatar: "🇳🇬",
    color: "from-cyan-500 to-teal-600"
  },
  {
    id: 19,
    name: "Rachel Okonkwo",
    location: "Uyo, Nigeria",
    rating: 5,
    service: "MacBook Purchase",
    review: "My MacBook Air is perfect for my writing work. The keyboard is responsive, screen is crisp, and battery life is incredible. Sure Imports made the process seamless!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-indigo-500 to-blue-600"
  },
  {
    id: 20,
    name: "Yakubu Hassan",
    location: "Gombe, Nigeria",
    rating: 5,
    service: "Drone Purchase",
    review: "Ordered a professional drone for my photography business. Sure Imports handled the technical specifications perfectly, and the drone exceeded my expectations!",
    date: "3 days ago",
    avatar: "🇳🇬",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 21,
    name: "Ngozi Okafor",
    location: "Nsukka, Nigeria",
    rating: 5,
    service: "Tablet Purchase",
    review: "The iPad I bought for my design work is amazing. Color accuracy is perfect, and the Apple Pencil works flawlessly. Sure Imports verified everything thoroughly!",
    date: "2 weeks ago",
    avatar: "🇳🇬",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: 22,
    name: "Adamu Garba",
    location: "Kebbi, Nigeria",
    rating: 5,
    service: "Smartphone Bulk",
    review: "Purchased 100 smartphones for distribution. Every device was tested and certified. The profit margin is excellent, and customers love the quality!",
    date: "1 month ago",
    avatar: "🇳🇬",
    color: "from-yellow-500 to-orange-600"
  },
  {
    id: 23,
    name: "Stella Nnamdi",
    location: "Owerri, Nigeria",
    rating: 5,
    service: "Laptop Accessories",
    review: "Got a complete setup - laptop stand, wireless mouse, and keyboard. Everything works perfectly together, and the build quality is exceptional. Great value!",
    date: "4 days ago",
    avatar: "🇳🇬",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: 24,
    name: "Tunde Bakare",
    location: "Ogbomoso, Nigeria",
    rating: 5,
    service: "Gaming Setup",
    review: "Sure Imports helped me build the perfect gaming setup. From the monitor to the mechanical keyboard, everything is top quality. My gaming experience is incredible!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-red-500 to-orange-600"
  },
  {
    id: 25,
    name: "Hauwa Abdullahi",
    location: "Yola, Nigeria",
    rating: 5,
    service: "Medical Equipment",
    review: "Sourced medical diagnostic equipment through Sure Imports. The technical specifications were perfect, and the certification process was handled professionally. Excellent service!",
    date: "3 weeks ago",
    avatar: "🇳🇬",
    color: "from-teal-500 to-cyan-600"
  },
  {
    id: 26,
    name: "Kunle Adeyemi",
    location: "Ilorin, Nigeria",
    rating: 5,
    service: "Audio Equipment",
    review: "The studio monitors I ordered sound incredible! Perfect for my music production work. Sure Imports ensured they were properly calibrated before shipping.",
    date: "2 days ago",
    avatar: "🇳🇬",
    color: "from-violet-500 to-indigo-600"
  },
  {
    id: 27,
    name: "Maryam Aliyu",
    location: "Dutse, Nigeria",
    rating: 5,
    service: "Educational Tech",
    review: "Bought tablets for our school's computer lab. Sure Imports provided educational discounts and ensured all devices met our specifications. Students love them!",
    date: "1 month ago",
    avatar: "🇳🇬",
    color: "from-emerald-500 to-green-600"
  },
  {
    id: 28,
    name: "Emeka Okafor",
    location: "Asaba, Nigeria",
    rating: 5,
    service: "Smart Home",
    review: "Set up my entire smart home system through Sure Imports. From smart bulbs to security cameras, everything integrates perfectly. Amazing technology at great prices!",
    date: "5 days ago",
    avatar: "🇳🇬",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 29,
    name: "Zainab Mohammed",
    location: "Birnin Kebbi, Nigeria",
    rating: 5,
    service: "Photography Gear",
    review: "Professional camera lens I ordered is absolutely perfect. Image quality is sharp, and the autofocus is lightning fast. Sure Imports' quality check was comprehensive!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 30,
    name: "Olumide Fashola",
    location: "Akure, Nigeria",
    rating: 5,
    service: "Fitness Tech",
    review: "The fitness tracker I bought tracks everything perfectly - heart rate, sleep, steps. Battery lasts for days, and the app sync is seamless. Great purchase!",
    date: "3 days ago",
    avatar: "🇳🇬",
    color: "from-lime-500 to-yellow-600"
  },
  {
    id: 31,
    name: "Amara Okonkwo",
    location: "Abakaliki, Nigeria",
    rating: 5,
    service: "MacBook Pro",
    review: "My MacBook Pro for video editing is a beast! Renders 4K videos smoothly, and the display is stunning. Sure Imports' technical verification was thorough.",
    date: "2 weeks ago",
    avatar: "🇳🇬",
    color: "from-fuchsia-500 to-pink-600"
  },
  {
    id: 32,
    name: "Sani Garba",
    location: "Lafia, Nigeria",
    rating: 5,
    service: "Printer Solutions",
    review: "Industrial printer for my printing shop works flawlessly. Print quality is excellent, and it handles high volume perfectly. Sure Imports provided great technical support!",
    date: "1 month ago",
    avatar: "🇳🇬",
    color: "from-sky-500 to-teal-600"
  },
  {
    id: 33,
    name: "Funmi Adeleke",
    location: "Ado-Ekiti, Nigeria",
    rating: 5,
    service: "Kitchen Gadgets",
    review: "Smart kitchen appliances I ordered work amazingly! The air fryer and smart refrigerator have made cooking so much easier. Quality is top-notch!",
    date: "6 days ago",
    avatar: "🇳🇬",
    color: "from-rose-500 to-orange-600"
  },
  {
    id: 34,
    name: "Ahmed Bello",
    location: "Minna, Nigeria",
    rating: 5,
    service: "Solar Equipment",
    review: "Solar power system components were exactly as specified. Installation was smooth, and the system generates more power than expected. Excellent quality control!",
    date: "3 weeks ago",
    avatar: "🇳🇬",
    color: "from-yellow-500 to-green-600"
  },
  {
    id: 35,
    name: "Comfort Bassey",
    location: "Umuahia, Nigeria",
    rating: 5,
    service: "Beauty Tech",
    review: "The facial cleansing device I bought works wonderfully! My skin has improved significantly. Sure Imports ensured it met all safety standards.",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-pink-500 to-purple-600"
  },
  {
    id: 36,
    name: "Idris Yakubu",
    location: "Jalingo, Nigeria",
    rating: 5,
    service: "Security Systems",
    review: "CCTV system for my business is perfect. Night vision is clear, and remote monitoring works flawlessly. Sure Imports handled the technical setup guidance excellently!",
    date: "2 days ago",
    avatar: "🇳🇬",
    color: "from-gray-500 to-slate-600"
  },
  {
    id: 37,
    name: "Blessing Udoh",
    location: "Ikot Ekpene, Nigeria",
    rating: 5,
    service: "Phone Accessories",
    review: "Wireless charging pad and phone case are fantastic! Charging is fast, and the case provides excellent protection. Build quality exceeded expectations!",
    date: "4 days ago",
    avatar: "🇳🇬",
    color: "from-indigo-500 to-purple-600"
  },
  {
    id: 38,
    name: "Kabir Abdullahi",
    location: "Damaturu, Nigeria",
    rating: 5,
    service: "Networking Equipment",
    review: "Wi-Fi 6 router I ordered provides incredible coverage and speed. My entire office now has seamless internet. Sure Imports' technical consultation was valuable!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 39,
    name: "Ifeoma Nwachukwu",
    location: "Orlu, Nigeria",
    rating: 5,
    service: "Fashion Tech",
    review: "Smart jewelry I bought tracks my activity perfectly and looks elegant. The companion app is user-friendly, and battery life is excellent. Love it!",
    date: "5 days ago",
    avatar: "🇳🇬",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 40,
    name: "Bashir Mohammed",
    location: "Gashua, Nigeria",
    rating: 5,
    service: "Agricultural Tech",
    review: "Drone for crop monitoring exceeded expectations. Image quality is professional-grade, and flight time is excellent. Sure Imports provided comprehensive training materials!",
    date: "2 weeks ago",
    avatar: "🇳🇬",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 41,
    name: "Cynthia Onyeka",
    location: "Okigwe, Nigeria",
    rating: 5,
    service: "Home Theater",
    review: "Sound system for my home theater is incredible! Bass is deep, clarity is perfect, and the wireless connectivity is seamless. Movie nights are amazing now!",
    date: "3 days ago",
    avatar: "🇳🇬",
    color: "from-violet-500 to-blue-600"
  },
  {
    id: 42,
    name: "Aliyu Tanko",
    location: "Birnin Gwari, Nigeria",
    rating: 5,
    service: "Power Solutions",
    review: "Inverter and battery system works perfectly during power outages. Installation guidance was clear, and the system efficiency exceeds specifications. Excellent service!",
    date: "1 month ago",
    avatar: "🇳🇬",
    color: "from-orange-500 to-yellow-600"
  },
  {
    id: 43,
    name: "Patience Okoro",
    location: "Sapele, Nigeria",
    rating: 5,
    service: "Educational Tools",
    review: "Interactive whiteboard for our classroom is fantastic! Students are more engaged, and the touch response is accurate. Sure Imports provided excellent educational pricing!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-teal-500 to-emerald-600"
  },
  {
    id: 44,
    name: "Hassan Aliyu",
    location: "Potiskum, Nigeria",
    rating: 5,
    service: "Communication Devices",
    review: "Two-way radios for our security team work perfectly. Range is excellent, battery life is long, and build quality is rugged. Professional grade equipment!",
    date: "2 days ago",
    avatar: "🇳🇬",
    color: "from-slate-500 to-gray-600"
  },
  {
    id: 45,
    name: "Adaeze Okafor",
    location: "Nnewi, Nigeria",
    rating: 5,
    service: "Health Monitoring",
    review: "Blood pressure monitor I bought is incredibly accurate. Readings match my doctor's equipment perfectly. Sure Imports ensured it met medical device standards!",
    date: "6 days ago",
    avatar: "🇳🇬",
    color: "from-red-500 to-pink-600"
  },
  {
    id: 46,
    name: "Ismail Garba",
    location: "Azare, Nigeria",
    rating: 5,
    service: "Automotive Tech",
    review: "Car dashboard camera works excellently! Video quality is HD, night vision is clear, and storage is ample. Installation was straightforward with the provided guide.",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 47,
    name: "Chidinma Eze",
    location: "Agbor, Nigeria",
    rating: 5,
    service: "Art Technology",
    review: "Digital drawing tablet is perfect for my design work! Pressure sensitivity is accurate, and the stylus is responsive. My artwork has improved significantly!",
    date: "4 days ago",
    avatar: "🇳🇬",
    color: "from-fuchsia-500 to-violet-600"
  },
  {
    id: 48,
    name: "Musa Ibrahim",
    location: "Katsina, Nigeria",
    rating: 5,
    service: "Environmental Tech",
    review: "Air quality monitor I purchased provides accurate readings and helpful insights. The mobile app alerts work perfectly. Great for health-conscious families!",
    date: "3 days ago",
    avatar: "🇳🇬",
    color: "from-emerald-500 to-cyan-600"
  },
  {
    id: 49,
    name: "Rejoice Ekpo",
    location: "Eket, Nigeria",
    rating: 5,
    service: "Travel Tech",
    review: "Portable power bank and travel adapter set are perfect for my frequent trips. Power bank charges multiple devices, and the adapter works in all countries I've visited!",
    date: "1 week ago",
    avatar: "🇳🇬",
    color: "from-amber-500 to-red-600"
  },
  {
    id: 50,
    name: "Salisu Mohammed",
    location: "Gusau, Nigeria",
    rating: 5,
    service: "Innovation Hub",
    review: "3D printer for our innovation center works flawlessly! Print quality is professional, and Sure Imports provided comprehensive training. Our prototyping capabilities have expanded tremendously!",
    date: "2 weeks ago",
    avatar: "🇳🇬",
    color: "from-lime-500 to-teal-600"
  }
];

const services = [
  { name: "All Reviews", icon: Quote, count: 50 },
  { name: "MacBook Purchase", icon: Laptop, count: 6 },
  { name: "Product Sourcing", icon: ShoppingBag, count: 8 },
  { name: "Gadget Purchase", icon: Smartphone, count: 12 },
  { name: "FAYA Accessories", icon: Headphones, count: 4 },
  { name: "Custom Orders", icon: Zap, count: 8 },
  { name: "Bulk Orders", icon: Shield, count: 6 },
  { name: "Other Services", icon: Clock, count: 6 }
];

export default function Testimonials() {
  const [activeFilter, setActiveFilter] = useState("All Reviews");
  const [visibleReviews, setVisibleReviews] = useState(12);

  const filteredTestimonials = activeFilter === "All Reviews" 
    ? testimonials 
    : testimonials.filter(testimonial => 
        testimonial.service.includes(activeFilter.replace(" Purchase", "").replace("Product ", "").replace("Gadget ", "").replace("FAYA ", "").replace("Custom ", "").replace("Bulk ", "").replace("Other ", ""))
      );

  const loadMore = () => {
    setVisibleReviews(prev => Math.min(prev + 12, filteredTestimonials.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-blue-500/30 mb-6">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-blue-200">4.8/5 Rating from our customers</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Customer Reviews
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover what our 40,000+ registered customers say about their experience with Sure Imports. 
            Real reviews from real customers across Nigeria.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-full border border-green-500/30">
              <span className="text-green-300">40,000+ Happy Customers</span>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
              <span className="text-yellow-300">Since 2018</span>
            </div>
            <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 px-4 py-2 rounded-full border border-pink-500/30">
              <span className="text-pink-300">Verified Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Filter by Service</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              const isActive = activeFilter === service.name;
              return (
                <button
                  key={service.name}
                  onClick={() => {
                    setActiveFilter(service.name);
                    setVisibleReviews(12);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {service.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.slice(0, visibleReviews).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${testimonial.color} p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-white/80 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Service Badge */}
                <div className="inline-flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white text-xs font-medium">{testimonial.service}</span>
                </div>

                {/* Review */}
                <blockquote className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.review}"
                </blockquote>

                {/* Footer */}
                <div className="flex items-center justify-between text-white/70 text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{testimonial.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleReviews < filteredTestimonials.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Load More Reviews ({filteredTestimonials.length - visibleReviews} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white">50</div>
              <div className="text-gray-300">Featured Reviews</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white">4.8★</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white">40K+</div>
              <div className="text-gray-300">Total Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white">2018</div>
              <div className="text-gray-300">Since</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}