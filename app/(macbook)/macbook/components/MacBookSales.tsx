import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Shield,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Users,
  Award,
  Truck,
  Clock,
  Play,
  Quote,
  Laptop,
  Building,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Palette,
  HelpCircle,
  ArrowRight,
  Check,
} from "lucide-react";
import macBooksStoreImage from "../assets/776c1453c5ce6f351ee5b84b8c61e975eb00861f.png";
import obidimmaPhoto from "../assets/776c1453c5ce6f351ee5b84b8c61e975eb00861f.png";
import innocentPhoto from "../assets/776c1453c5ce6f351ee5b84b8c61e975eb00861f.png";

interface MacBookSalesProps {
  onNavigateToSignUp?: () => void;
}

export default function MacBookSales({
  onNavigateToSignUp,
}: MacBookSalesProps) {
  const handleCreateAccount = () => {
    window.location.href =
      "https://www.sureimports.com/auth/signup";
  };

  const handleGetQuote = () => {
    window.location.href =
      "mailto:hello@sureimports.com?subject=Business Laptop Quote Request&body=Hello,%0D%0A%0D%0AI would like to request a custom quote for business laptops.%0D%0A%0D%0APlease provide details for:%0D%0A- Company name:%0D%0A- Number of units needed:%0D%0A- Preferred laptop brand/model(s) (MacBook, HP, Dell, Lenovo, etc.):%0D%0A- Condition preference (Brand New/Pre-owned):%0D%0A- Timeline:%0D%0A- Any :%0D%0A%0D%0AThank you!";
  };

  const handleTalkToSpecialist = () => {
    window.open(
      "https://calendly.com/sureimports/product-sourcing-one-one-one-session",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleBrowseMacBooks = () => {
    window.location.href =
      "https://www.sureimports.com/auth/signup";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - White Background */}
      <section className="bg-white pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-1">
              <div className="mb-6">
                <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
                  Laptops for Business
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                  Sourced in China,
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Delivered with Confidence
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8">
                  Outfit your team with authentic MacBooks and
                  premium Windows laptops sourced directly from
                  verified suppliers in China. Whether you're
                  buying 5 units or 500, we handle everything.
                </p>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                  <span className="text-base md:text-lg font-medium text-gray-900">
                    Pre-Owned Laptops → 90-day warranty
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <span className="text-base md:text-lg font-medium text-gray-900">
                    Brand-New Laptops → 1-year warranty
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button
                  onClick={handleCreateAccount}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleTalkToSpecialist}
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg h-auto transition-all duration-200 w-full sm:w-auto"
                >
                  Schedule a Call
                </Button>
              </div>
            </div>

            {/* Hide image on mobile, show on lg and up */}
            <div className="hidden lg:block lg:order-2">
              <div className="relative">
                <img
                  src={macBooksStoreImage as any}
                  alt="Laptops display in our verified supplier store in China"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">
                      Sourced from Verified Suppliers in China
                    </p>
                    <p className="text-xs text-gray-600">
                      Authentic Laptops, Quality Assured
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Pure Black Background */}
      <section className="bg-slate-900 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                40,000+
              </div>
              <div className="text-blue-300 font-medium text-sm md:text-base">
                Registered Users Since 2018
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                4.8★
              </div>
              <div className="text-blue-300 font-medium text-sm md:text-base">
                Google Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                100%
              </div>
              <div className="text-blue-300 font-medium text-sm md:text-base">
                Authentic Products
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - White Background */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Teams Like Yours
            </h2>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Quote className="w-8 h-8 md:w-12 md:h-12 text-blue-600 flex-shrink-0 mx-auto md:mx-0" />
                <div className="text-center md:text-left">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
                    "Microware Solutions Limited is highly
                    satisfied with our purchase from Sure
                    Importers Limited. The items arrived exactly
                    as described, securely packaged, and
                    delivered on schedule. The quality not only
                    met but exceeded our expectations, and
                    everything has been performing flawlessly.
                    Communication throughout the process was
                    seamless, and the team demonstrated
                    professionalism at every stage. We
                    confidently recommend Sure Importers Limited
                    to anyone seeking safe, reliable, and timely
                    delivery of laptops and other products from
                    China."
                  </p>
                  <div className="text-center md:text-left">
                    <p className="font-semibold text-gray-900 text-base md:text-lg">
                      Okoli, Augustine J. FCIA
                    </p>
                    <p className="text-blue-600 font-medium text-sm md:text-base">
                      Head of HR & Admin
                    </p>
                    <p className="text-blue-600 font-medium text-sm md:text-base">
                      Microware Solutions Limited (Nigeria)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Your Quote Button - Outside of Card */}
          <div className="text-center mt-8">
            <Button
              onClick={handleGetQuote}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 w-full sm:w-auto"
            >
              Get Your Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid - Pure Black Background */}
      <section className="bg-slate-900 py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Why Businesses Choose Sure Imports
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              We've built our reputation on reliability,
              quality, and service. Here's what sets us apart.
            </p>
          </div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden">
            <div className="relative">
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide px-4 -mx-4">
                {[
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Verified Supply Chain",
                    description:
                      "Vetted, long-term suppliers in China only. No gray channels. No clones. No parts-swapped surprises.",
                    color: "blue",
                  },
                  {
                    icon: <CheckCircle className="w-6 h-6" />,
                    title: "Strict Quality Standards",
                    description:
                      "Multi-point checks: battery health, keyboard, display, SSD/SMART, ports, camera, mic, speakers, Wi-Fi, Bluetooth, genuine-parts verification.",
                    color: "green",
                  },
                  {
                    icon: <Award className="w-6 h-6" />,
                    title: "Comprehensive Warranties",
                    description:
                      "90-day warranty for pre-owned and 1-year warranty for brand-new laptops—with responsive support.",
                    color: "purple",
                  },
                  {
                    icon: <Briefcase className="w-6 h-6" />,
                    title: "Bespoke Bulk Pricing",
                    description:
                      "Share your spec (model, CPU, RAM/SSD, year/condition). We present batches at tiered pricing with consistent grades.",
                    color: "yellow",
                  },
                  {
                    icon: <Truck className="w-6 h-6" />,
                    title: "End-to-End Logistics",
                    description:
                      "China-to-destination shipping, insurance options, customs guidance, and clear documentation for your teams.",
                    color: "red",
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Proven Track Record",
                    description:
                      "Since 2018, 40,000+ registered users. A platform built for scale, compliance, and reliable after-sales support.",
                    color: "pink",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-gray-900/70 backdrop-blur-sm border-gray-800 hover:bg-gray-900/90 transition-all duration-200 flex-shrink-0 w-72"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center text-${feature.color}-400 mb-4`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Gradient overlay to indicate scrollable content */}
              <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
              {/* Scroll indicator text */}
              <div className="text-center mt-2">
                <p className="text-gray-400 text-xs">
                  ← Swipe to see more features →
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: (
                  <Shield className="w-6 h-6 md:w-8 md:h-8" />
                ),
                title: "Verified Supply Chain",
                description:
                  "Vetted, long-term suppliers in China only. No gray channels. No clones. No parts-swapped surprises.",
                color: "blue",
              },
              {
                icon: (
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                ),
                title: "Strict Quality Standards",
                description:
                  "Multi-point checks: battery health, keyboard, display, SSD/SMART, ports, camera, mic, speakers, Wi-Fi, Bluetooth, genuine-parts verification.",
                color: "green",
              },
              {
                icon: (
                  <Award className="w-6 h-6 md:w-8 md:h-8" />
                ),
                title: "Comprehensive Warranties",
                description:
                  "90-day warranty for pre-owned and 1-year warranty for brand-new laptops—with responsive support.",
                color: "purple",
              },
              {
                icon: (
                  <Briefcase className="w-6 h-6 md:w-8 md:h-8" />
                ),
                title: "Bespoke Bulk Pricing",
                description:
                  "Share your spec (model, CPU, RAM/SSD, year/condition). We present batches at tiered pricing with consistent grades.",
                color: "yellow",
              },
              {
                icon: (
                  <Truck className="w-6 h-6 md:w-8 md:h-8" />
                ),
                title: "End-to-End Logistics",
                description:
                  "China-to-destination shipping, insurance options, customs guidance, and clear documentation for your teams.",
                color: "red",
              },
              {
                icon: (
                  <Users className="w-6 h-6 md:w-8 md:h-8" />
                ),
                title: "Proven Track Record",
                description:
                  "Since 2018, 40,000+ registered users. A platform built for scale, compliance, and reliable after-sales support.",
                color: "pink",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/70 backdrop-blur-sm border-gray-800 hover:bg-gray-900/90 transition-all duration-200"
              >
                <CardContent className="p-6 md:p-8">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center text-${feature.color}-400 mb-4 md:mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience - White Background */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Procurement & IT Teams
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From startups to enterprises, we serve teams who
              need reliable laptops at scale.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
            {[
              {
                icon: (
                  <Building className="w-6 h-6 md:w-8 md:h-8" />
                ),
                label: "IT Distributors & Resellers",
                color: "blue",
              },
              {
                icon: (
                  <Lightbulb className="w-6 h-6 md:w-8 md:h-8" />
                ),
                label: "Fintechs & Tech Startups",
                color: "green",
              },
              {
                icon: (
                  <Palette className="w-6 h-6 md:w-8 md:h-8" />
                ),
                label: "Agencies & Creative Studios",
                color: "purple",
              },
              {
                icon: (
                  <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />
                ),
                label: "Training Centres & Schools",
                color: "orange",
              },
              {
                icon: (
                  <Phone className="w-6 h-6 md:w-8 md:h-8" />
                ),
                label: "Customer Support Centres",
                color: "cyan",
              },
              {
                icon: (
                  <Briefcase className="w-6 h-6 md:w-8 md:h-8" />
                ),
                label: "SME Fleets",
                color: "indigo",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 bg-${item.color}-100 rounded-2xl flex items-center justify-center text-${item.color}-600 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  {item.icon}
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-700 leading-tight">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Product Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  Common Models We Source
                </h3>
                <div className="space-y-3">
                  {[
                    'MacBook Air (M1/M2/M3) & MacBook Pro (13"/14"/16")',
                    "HP EliteBook, ProBook & ZBook Series",
                    "HP Spectre & Pavilion Series",
                    "Dell Latitude & XPS (select models)",
                    "Lenovo ThinkPad & Legion Series",
                    "High-spec configurations for dev/design teams",
                  ].map((model, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3"
                    >
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm md:text-base">
                        {model}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-green-300 transition-colors duration-200">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  Quality Grades
                </h3>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <Badge className="bg-green-100 text-green-700 border-green-300 flex-shrink-0">
                      Pre-owned
                    </Badge>
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">
                        Pre-owned laptops that are as good as
                        new and packed in boxes or laptop bags
                        with all accessories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 flex-shrink-0">
                      Brand New
                    </Badge>
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">
                        Authentic brand new laptops with
                        manufacturer warranty
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 md:mt-4 italic">
                  We always disclose condition clearly before
                  you pay.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Button
              onClick={handleBrowseMacBooks}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              See Available Laptops
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Pure Black Background */}
      <section className="bg-slate-900 py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Simple, transparent, and reliable
            </p>
          </div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden mb-8">
            <div className="relative">
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide px-4 -mx-4">
                {[
                  {
                    step: "01",
                    title: "Create Account",
                    description: "Sign up at sureimports.com",
                    icon: <Users className="w-5 h-5" />,
                  },
                  {
                    step: "02",
                    title: "Choose Laptops",
                    description:
                      "Browse our verified inventory",
                    icon: <Laptop className="w-5 h-5" />,
                  },
                  {
                    step: "03",
                    title: "Get Quote",
                    description:
                      "Bulk orders get bespoke pricing",
                    icon: <Briefcase className="w-5 h-5" />,
                  },
                  {
                    step: "04",
                    title: "Secure Payment",
                    description: "Approve quote & pay securely",
                    icon: <Shield className="w-5 h-5" />,
                  },
                  {
                    step: "05",
                    title: "Quality Check",
                    description: "We source, test, and prepare",
                    icon: <CheckCircle className="w-5 h-5" />,
                  },
                  {
                    step: "06",
                    title: "Delivery",
                    description:
                      "Receive with warranty coverage",
                    icon: <Truck className="w-5 h-5" />,
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-gray-900/70 backdrop-blur-sm border-gray-800 relative overflow-hidden flex-shrink-0 w-72"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="text-blue-300">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Gradient overlay to indicate scrollable content */}
              <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
              {/* Scroll indicator text */}
              <div className="text-center mt-2">
                <p className="text-gray-400 text-xs">
                  ← Swipe to see all steps →
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up at sureimports.com",
                icon: (
                  <Users className="w-5 h-5 md:w-6 md:h-6" />
                ),
              },
              {
                step: "02",
                title: "Choose Laptops",
                description: "Browse our verified inventory",
                icon: (
                  <Laptop className="w-5 h-5 md:w-6 md:h-6" />
                ),
              },
              {
                step: "03",
                title: "Get Quote",
                description: "Bulk orders get bespoke pricing",
                icon: (
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                ),
              },
              {
                step: "04",
                title: "Secure Payment",
                description: "Approve quote & pay securely",
                icon: (
                  <Shield className="w-5 h-5 md:w-6 md:h-6" />
                ),
              },
              {
                step: "05",
                title: "Quality Check",
                description: "We source, test, and prepare",
                icon: (
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                ),
              },
              {
                step: "06",
                title: "Delivery",
                description: "Receive with warranty coverage",
                icon: (
                  <Truck className="w-5 h-5 md:w-6 md:h-6" />
                ),
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-gray-900/70 backdrop-blur-sm border-gray-800 relative overflow-hidden"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-sm md:text-lg flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="text-blue-300">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleCreateAccount}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Individual Testimonials - White Background */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Individual Buyers Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">
              Not buying for a company? Our quality standards
              remain the same.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0 mx-auto md:mx-0" />
                  <div className="text-center md:text-left">
                    <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                      "I recently purchased a new MacBook from
                      Sure Importers Limited. Honestly, I was a
                      bit anxious at first, and throughout the
                      delivery period, I wasn't completely at
                      ease. But to my surprise, the package
                      arrived earlier than expected, and the
                      laptop was in perfect condition. I highly
                      recommend Sure Importers Limited to anyone
                      in need of Laptops, Phone, etc."
                    </p>
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                      <img
                        src={obidimmaPhoto as any}
                        alt="Obidimma C"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="text-center md:text-left">
                        <p className="font-semibold text-gray-900 text-sm md:text-base">
                          Obidimma C.
                        </p>
                        <p className="text-blue-600 font-medium text-xs md:text-sm">
                          Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0 mx-auto md:mx-0" />
                  <div className="text-center md:text-left">
                    <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                      "I have used their service twice and I can
                      assure you, they are for real. You get
                      great value for money and expert
                      consultation alongside. Just be rest
                      assured that you will have a great
                      experience shopping and sourcing through
                      sure import"
                    </p>
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                      <img
                        src={innocentPhoto as any}
                        alt="Innocent Waziri"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="text-center md:text-left">
                        <p className="font-semibold text-gray-900 text-sm md:text-base">
                          Innocent Waziri
                        </p>
                        <p className="text-blue-600 font-medium text-xs md:text-sm">
                          Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleCreateAccount}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              Shop with Confidence
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section - Pure Black Background */}
      <section className="bg-slate-900 py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Everything you need to know about sourcing
              MacBooks at scale
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="space-y-4"
          >
            {[
              {
                value: "bulk-pricing",
                question: "How does bulk pricing work?",
                answer:
                  "Our bulk pricing starts from 5 units and scales based on quantity and specifications. Share your requirements (model, condition, quantity) and we'll provide a custom quote within 3 business days. Larger orders (50+ units) receive priority pricing and dedicated account management.",
              },
              {
                value: "warranty-business",
                question:
                  "What warranty do business orders receive?",
                answer:
                  "Pre-owned laptops come with a 90-day warranty covering hardware defects and major component failures. Brand-new units include the full 1-year manufacturer's warranty. We also offer extended warranty options for businesses requiring longer coverage periods.",
              },
              {
                value: "delivery-timeline",
                question:
                  "What's the typical delivery timeline for business orders?",
                answer:
                  "Standard delivery is 7-14 business days for orders under 20 units. Larger orders (20+ units) typically take 14-21 business days to source, test, and ship. We provide regular updates and can accommodate urgent delivery requests with express shipping options.",
              },

              {
                value: "quality-consistency",
                question:
                  "How do you ensure consistent quality across bulk orders?",
                answer:
                  "We batch orders from the same supplier sources and conduct multi-point quality checks on every unit. Each laptop or desktop (for businesses that request that) undergoes battery health testing, hardware diagnostics, cosmetic grading, and functional verification before shipping. We provide detailed condition reports for every unit.",
              },
              {
                value: "business-support",
                question:
                  "What support do you provide for business customers?",
                answer:
                  "Business customers receive dedicated account management, priority customer support, and technical consultation. We assist with deployment planning, configuration requirements, and provide ongoing support for warranty claims and technical issues.",
              },
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={faq.value}
                className="border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur-sm px-6"
              >
                <AccordionTrigger className="text-white hover:text-blue-300 py-4 text-left">
                  <span className="text-base md:text-lg font-medium">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section - White Background */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Outfit Your Team?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Get a custom quote for your Laptop requirements or
              speak with our business specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Get a Custom Quote
                </h3>
                <p className="text-gray-600 mb-6">
                  Share your requirements and receive a detailed
                  proposal within 3 business days.
                </p>
                <Button
                  onClick={handleGetQuote}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Request Quote
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-green-300 transition-colors duration-200">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Talk to a Specialist
                </h3>
                <p className="text-gray-600 mb-6">
                  Speak directly with our business team for
                  personalized guidance and support.
                </p>
                <Button
                  onClick={handleTalkToSpecialist}
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-full"
                >
                  Schedule Call
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Or browse our current inventory and start shopping
              immediately
            </p>
            <Button
              onClick={handleBrowseMacBooks}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Browse Laptops
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}