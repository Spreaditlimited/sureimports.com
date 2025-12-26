'use client';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
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
} from 'lucide-react';
import macBooksStoreImage from '../../images/laptops.png';
import obidimmaPhoto from '../../../../public/images/reviewprofile5.png';
import innocentPhoto from '../assets/user2.png';

interface MacBookSalesProps {
  onNavigateToSignUp?: () => void;
}

export default function MacBookSales({
  onNavigateToSignUp,
}: MacBookSalesProps) {
  const handleCreateAccount = () => {
    window.location.href = 'https://www.sureimports.com/auth/signup';
  };

  const handleGetQuote = () => {
    window.location.href =
      'mailto:hello@sureimports.com?subject=Business Laptop Quote Request&body=Hello,%0D%0A%0D%0AI would like to request a custom quote for business laptops.%0D%0A%0D%0APlease provide details for:%0D%0A- Company name:%0D%0A- Number of units needed:%0D%0A- Preferred laptop brand/model(s) (MacBook, HP, Dell, Lenovo, etc.):%0D%0A- Condition preference (Brand New/Pre-owned):%0D%0A- Timeline:%0D%0A- Any :%0D%0A%0D%0AThank you!';
  };

  const handleTalkToSpecialist = () => {
    window.open(
      'https://calendly.com/sureimports/product-sourcing-one-one-one-session',
      '_blank',
      'noopener,noreferrer',
    );
  };

  const handleBrowseMacBooks = () => {
    window.location.href = 'https://www.sureimports.com/auth/signup';
  };

  return (
    <div className="min-h-screenx">
      {/* Hero Section - White Background */}
      <section className="bg-white px-4 pb-16 pt-20 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-1">
              <div className="mb-6">
                <Badge className="mb-4 border-blue-200 bg-blue-50 text-blue-600">
                  Laptops for Business
                </Badge>
                <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
                  Sourced in China,
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Delivered with Confidence
                  </span>
                </h1>
                <p className="mb-6 text-lg leading-relaxed text-gray-600 md:mb-8 md:text-xl">
                  Outfit your team with authentic MacBooks and premium Windows
                  laptops sourced directly from verified suppliers in China.
                  Whether you're buying 5 units or 500, we handle everything.
                </p>
              </div>

              <div className="mb-6 space-y-3 md:mb-8 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 md:h-10 md:w-10">
                    <Shield className="h-4 w-4 text-green-600 md:h-5 md:w-5" />
                  </div>
                  <span className="text-base font-medium text-gray-900 md:text-lg">
                    Pre-Owned Laptops → 90-day warranty
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 md:h-10 md:w-10">
                    <Award className="h-4 w-4 text-blue-600 md:h-5 md:w-5" />
                  </div>
                  <span className="text-base font-medium text-gray-900 md:text-lg">
                    Brand-New Laptops → 1-year warranty
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
                <Button
                  onClick={handleCreateAccount}
                  className="h-auto w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto md:px-8 md:py-4 md:text-lg"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  onClick={handleTalkToSpecialist}
                  variant="outline"
                  className="h-auto w-full rounded-lg border-2 border-green-600 px-6 py-3 text-base text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white sm:w-auto md:px-8 md:py-4 md:text-lg"
                >
                  Schedule a Call
                </Button>
              </div>
            </div>

            {/* Hide image on mobile, show on lg and up */}
            <div className="hidden lg:order-2 lg:block">
              <div className="relative">
                <img
                  src={'/images/laptops.png'}
                  alt="Laptops display in our verified supplier store in China"
                  className="h-[500px] w-full rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-lg bg-white/90 p-4 backdrop-blur-sm">
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
      <section className="bg-slate-900 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                40,000+
              </div>
              <div className="text-sm font-medium text-blue-300 md:text-base">
                Registered Users Since 2018
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                4.8★
              </div>
              <div className="text-sm font-medium text-blue-300 md:text-base">
                Google Rating
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                100%
              </div>
              <div className="text-sm font-medium text-blue-300 md:text-base">
                Authentic Products
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - White Background */}
      <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center md:mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Trusted by Teams Like Yours
            </h2>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 md:p-12">
              <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
                <Quote className="mx-auto h-8 w-8 flex-shrink-0 text-blue-600 md:mx-0 md:h-12 md:w-12" />
                <div className="text-center md:text-left">
                  <p className="mb-6 text-lg leading-relaxed text-gray-700 md:mb-8 md:text-xl">
                    "Microware Solutions Limited is highly satisfied with our
                    purchase from Sure Importers Limited. The items arrived
                    exactly as described, securely packaged, and delivered on
                    schedule. The quality not only met but exceeded our
                    expectations, and everything has been performing flawlessly.
                    Communication throughout the process was seamless, and the
                    team demonstrated professionalism at every stage. We
                    confidently recommend Sure Importers Limited to anyone
                    seeking safe, reliable, and timely delivery of laptops and
                    other products from China."
                  </p>
                  <div className="text-center md:text-left">
                    <p className="text-base font-semibold text-gray-900 md:text-lg">
                      Okoli, Augustine J. FCIA
                    </p>
                    <p className="text-sm font-medium text-blue-600 md:text-base">
                      Head of HR & Admin
                    </p>
                    <p className="text-sm font-medium text-blue-600 md:text-base">
                      Microware Solutions Limited (Nigeria)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Your Quote Button - Outside of Card */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleGetQuote}
              className="w-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 sm:w-auto"
            >
              Get Your Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid - Pure Black Background */}
      <section className="bg-slate-900 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Why Businesses Choose Sure Imports
            </h2>
            <p className="mx-auto max-w-3xl px-4 text-lg text-gray-300 md:text-xl">
              We've built our reputation on reliability, quality, and service.
              Here's what sets us apart.
            </p>
          </div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden">
            <div className="relative">
              <div className="scrollbar-hide -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4">
                {[
                  {
                    icon: <Shield className="h-6 w-6" />,
                    title: 'Verified Supply Chain',
                    description:
                      'Vetted, long-term suppliers in China only. No gray channels. No clones. No parts-swapped surprises.',
                    color: 'blue',
                  },
                  {
                    icon: <CheckCircle className="h-6 w-6" />,
                    title: 'Strict Quality Standards',
                    description:
                      'Multi-point checks: battery health, keyboard, display, SSD/SMART, ports, camera, mic, speakers, Wi-Fi, Bluetooth, genuine-parts verification.',
                    color: 'green',
                  },
                  {
                    icon: <Award className="h-6 w-6" />,
                    title: 'Comprehensive Warranties',
                    description:
                      '90-day warranty for pre-owned and 1-year warranty for brand-new laptops—with responsive support.',
                    color: 'purple',
                  },
                  {
                    icon: <Briefcase className="h-6 w-6" />,
                    title: 'Bespoke Bulk Pricing',
                    description:
                      'Share your spec (model, CPU, RAM/SSD, year/condition). We present batches at tiered pricing with consistent grades.',
                    color: 'yellow',
                  },
                  {
                    icon: <Truck className="h-6 w-6" />,
                    title: 'End-to-End Logistics',
                    description:
                      'China-to-destination shipping, insurance options, customs guidance, and clear documentation for your teams.',
                    color: 'red',
                  },
                  {
                    icon: <Users className="h-6 w-6" />,
                    title: 'Proven Track Record',
                    description:
                      'Since 2018, 40,000+ registered users. A platform built for scale, compliance, and reliable after-sales support.',
                    color: 'pink',
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="w-72 flex-shrink-0 border-gray-800 bg-gray-900/70 backdrop-blur-sm transition-all duration-200 hover:bg-gray-900/90"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`h-12 w-12 bg-${feature.color}-500/20 flex items-center justify-center rounded-xl text-${feature.color}-400 mb-4`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Gradient overlay to indicate scrollable content */}
              <div className="pointer-events-none absolute bottom-4 right-0 top-0 w-8 bg-gradient-to-l from-slate-900 to-transparent"></div>
              {/* Scroll indicator text */}
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">
                  ← Swipe to see more features →
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden gap-6 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[
              {
                icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />,
                title: 'Verified Supply Chain',
                description:
                  'Vetted, long-term suppliers in China only. No gray channels. No clones. No parts-swapped surprises.',
                color: 'blue',
              },
              {
                icon: <CheckCircle className="h-6 w-6 md:h-8 md:w-8" />,
                title: 'Strict Quality Standards',
                description:
                  'Multi-point checks: battery health, keyboard, display, SSD/SMART, ports, camera, mic, speakers, Wi-Fi, Bluetooth, genuine-parts verification.',
                color: 'green',
              },
              {
                icon: <Award className="h-6 w-6 md:h-8 md:w-8" />,
                title: 'Comprehensive Warranties',
                description:
                  '90-day warranty for pre-owned and 1-year warranty for brand-new laptops—with responsive support.',
                color: 'purple',
              },
              {
                icon: <Briefcase className="h-6 w-6 md:h-8 md:w-8" />,
                title: 'Bespoke Bulk Pricing',
                description:
                  'Share your spec (model, CPU, RAM/SSD, year/condition). We present batches at tiered pricing with consistent grades.',
                color: 'yellow',
              },
              {
                icon: <Truck className="h-6 w-6 md:h-8 md:w-8" />,
                title: 'End-to-End Logistics',
                description:
                  'China-to-destination shipping, insurance options, customs guidance, and clear documentation for your teams.',
                color: 'red',
              },
              {
                icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
                title: 'Proven Track Record',
                description:
                  'Since 2018, 40,000+ registered users. A platform built for scale, compliance, and reliable after-sales support.',
                color: 'pink',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-gray-800 bg-gray-900/70 backdrop-blur-sm transition-all duration-200 hover:bg-gray-900/90"
              >
                <CardContent className="p-6 md:p-8">
                  <div
                    className={`h-12 w-12 md:h-16 md:w-16 bg-${feature.color}-500/20 flex items-center justify-center rounded-xl text-${feature.color}-400 mb-4 md:mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white md:mb-4 md:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience - White Background */}
      <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Perfect for Procurement & IT Teams
            </h2>
            <p className="mx-auto max-w-3xl px-4 text-lg text-gray-600 md:text-xl">
              From startups to enterprises, we serve teams who need reliable
              laptops at scale.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-2 gap-4 md:mb-16 md:grid-cols-3 md:gap-6 lg:grid-cols-6 lg:gap-8">
            {[
              {
                icon: <Building className="h-6 w-6 md:h-8 md:w-8" />,
                label: 'IT Distributors & Resellers',
                color: 'blue',
              },
              {
                icon: <Lightbulb className="h-6 w-6 md:h-8 md:w-8" />,
                label: 'Fintechs & Tech Startups',
                color: 'green',
              },
              {
                icon: <Palette className="h-6 w-6 md:h-8 md:w-8" />,
                label: 'Agencies & Creative Studios',
                color: 'purple',
              },
              {
                icon: <GraduationCap className="h-6 w-6 md:h-8 md:w-8" />,
                label: 'Training Centres & Schools',
                color: 'orange',
              },
              {
                icon: <Phone className="h-6 w-6 md:h-8 md:w-8" />,
                label: 'Customer Support Centres',
                color: 'cyan',
              },
              {
                icon: <Briefcase className="h-6 w-6 md:h-8 md:w-8" />,
                label: 'SME Fleets',
                color: 'indigo',
              },
            ].map((item, index) => (
              <div key={index} className="group text-center">
                <div
                  className={`h-12 w-12 md:h-16 md:w-16 bg-${item.color}-100 flex items-center justify-center rounded-2xl text-${item.color}-600 mx-auto mb-3 transition-transform duration-200 group-hover:scale-110 md:mb-4`}
                >
                  {item.icon}
                </div>
                <p className="text-xs font-medium leading-tight text-gray-700 md:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Product Specs */}
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
            <Card className="border-2 border-gray-200 transition-colors duration-200 hover:border-blue-300">
              <CardContent className="p-6 md:p-8">
                <h3 className="mb-4 text-xl font-bold text-gray-900 md:mb-6 md:text-2xl">
                  Common Models We Source
                </h3>
                <div className="space-y-3">
                  {[
                    'MacBook Air (M1/M2/M3) & MacBook Pro (13"/14"/16")',
                    'HP EliteBook, ProBook & ZBook Series',
                    'HP Spectre & Pavilion Series',
                    'Dell Latitude & XPS (select models)',
                    'Lenovo ThinkPad & Legion Series',
                    'High-spec configurations for dev/design teams',
                  ].map((model, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-500 md:h-5 md:w-5" />
                      <span className="text-sm text-gray-700 md:text-base">
                        {model}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 transition-colors duration-200 hover:border-green-300">
              <CardContent className="p-6 md:p-8">
                <h3 className="mb-4 text-xl font-bold text-gray-900 md:mb-6 md:text-2xl">
                  Quality Grades
                </h3>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <Badge className="flex-shrink-0 border-green-300 bg-green-100 text-green-700">
                      Pre-owned
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-gray-900 md:text-base">
                        Pre-owned laptops that are as good as new and packed in
                        boxes or laptop bags with all accessories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <Badge className="flex-shrink-0 border-blue-300 bg-blue-100 text-blue-700">
                      Brand New
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-gray-900 md:text-base">
                        Authentic brand new laptops with manufacturer warranty
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs italic text-gray-500 md:mt-4">
                  We always disclose condition clearly before you pay.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center md:mt-12">
            <Button
              onClick={handleBrowseMacBooks}
              className="h-auto w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto md:px-8 md:py-4 md:text-lg"
            >
              See Available Laptops
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Pure Black Background */}
      <section className="bg-slate-900 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-gray-300 md:text-xl">
              Simple, transparent, and reliable
            </p>
          </div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="mb-8 md:hidden">
            <div className="relative">
              <div className="scrollbar-hide -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4">
                {[
                  {
                    step: '01',
                    title: 'Create Account',
                    description: 'Sign up at sureimports.com',
                    icon: <Users className="h-5 w-5" />,
                  },
                  {
                    step: '02',
                    title: 'Choose Laptops',
                    description: 'Browse our verified inventory',
                    icon: <Laptop className="h-5 w-5" />,
                  },
                  {
                    step: '03',
                    title: 'Get Quote',
                    description: 'Bulk orders get bespoke pricing',
                    icon: <Briefcase className="h-5 w-5" />,
                  },
                  {
                    step: '04',
                    title: 'Secure Payment',
                    description: 'Approve quote & pay securely',
                    icon: <Shield className="h-5 w-5" />,
                  },
                  {
                    step: '05',
                    title: 'Quality Check',
                    description: 'We source, test, and prepare',
                    icon: <CheckCircle className="h-5 w-5" />,
                  },
                  {
                    step: '06',
                    title: 'Delivery',
                    description: 'Receive with warranty coverage',
                    icon: <Truck className="h-5 w-5" />,
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="relative w-72 flex-shrink-0 overflow-hidden border-gray-800 bg-gray-900/70 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center space-x-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-sm font-bold text-white">
                          {item.step}
                        </div>
                        <div className="text-blue-300">{item.icon}</div>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Gradient overlay to indicate scrollable content */}
              <div className="pointer-events-none absolute bottom-4 right-0 top-0 w-8 bg-gradient-to-l from-slate-900 to-transparent"></div>
              {/* Scroll indicator text */}
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">
                  ← Swipe to see all steps →
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="mb-8 hidden gap-6 md:mb-12 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up at sureimports.com',
                icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
              },
              {
                step: '02',
                title: 'Choose Laptops',
                description: 'Browse our verified inventory',
                icon: <Laptop className="h-5 w-5 md:h-6 md:w-6" />,
              },
              {
                step: '03',
                title: 'Get Quote',
                description: 'Bulk orders get bespoke pricing',
                icon: <Briefcase className="h-5 w-5 md:h-6 md:w-6" />,
              },
              {
                step: '04',
                title: 'Secure Payment',
                description: 'Approve quote & pay securely',
                icon: <Shield className="h-5 w-5 md:h-6 md:w-6" />,
              },
              {
                step: '05',
                title: 'Quality Check',
                description: 'We source, test, and prepare',
                icon: <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />,
              },
              {
                step: '06',
                title: 'Delivery',
                description: 'Receive with warranty coverage',
                icon: <Truck className="h-5 w-5 md:h-6 md:w-6" />,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-gray-800 bg-gray-900/70 backdrop-blur-sm"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="mb-4 flex items-center space-x-3 md:mb-6 md:space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-sm font-bold text-white md:h-12 md:w-12 md:text-lg">
                      {item.step}
                    </div>
                    <div className="text-blue-300">{item.icon}</div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white md:mb-3 md:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-300 md:text-base">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleCreateAccount}
              className="h-auto w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto md:px-8 md:py-4 md:text-lg"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Individual Testimonials - White Background */}
      <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              What Individual Buyers Say
            </h2>
            <p className="px-4 text-lg text-gray-600 md:text-xl">
              Not buying for a company? Our quality standards remain the same.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-2 md:gap-8">
            <Card className="border-2 border-gray-200 transition-colors duration-200 hover:border-blue-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-x-4 md:space-y-0">
                  <Quote className="mx-auto h-6 w-6 flex-shrink-0 text-blue-600 md:mx-0 md:h-8 md:w-8" />
                  <div className="text-center md:text-left">
                    <p className="mb-4 text-sm leading-relaxed text-gray-700 md:mb-6 md:text-base">
                      "I recently purchased a new MacBook from Sure Importers
                      Limited. Honestly, I was a bit anxious at first, and
                      throughout the delivery period, I wasn't completely at
                      ease. But to my surprise, the package arrived earlier than
                      expected, and the laptop was in perfect condition. I
                      highly recommend Sure Importers Limited to anyone in need
                      of Laptops, Phone, etc."
                    </p>
                    <div className="flex items-center justify-center space-x-3 md:justify-start">
                      <img
                        src={'/images/user1.png'}
                        alt="Obidimma C"
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover md:h-12 md:w-12"
                      />
                      <div className="text-center md:text-left">
                        <p className="text-sm font-semibold text-gray-900 md:text-base">
                          Obidimma C.
                        </p>
                        <p className="text-xs font-medium text-blue-600 md:text-sm">
                          Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 transition-colors duration-200 hover:border-blue-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-x-4 md:space-y-0">
                  <Quote className="mx-auto h-6 w-6 flex-shrink-0 text-blue-600 md:mx-0 md:h-8 md:w-8" />
                  <div className="text-center md:text-left">
                    <p className="mb-4 text-sm leading-relaxed text-gray-700 md:mb-6 md:text-base">
                      "I have used their service twice and I can assure you,
                      they are for real. You get great value for money and
                      expert consultation alongside. Just be rest assured that
                      you will have a great experience shopping and sourcing
                      through sure import"
                    </p>
                    <div className="flex items-center justify-center space-x-3 md:justify-start">
                      <img
                        src={'/images/user2.png'}
                        alt="Innocent Waziri"
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover md:h-12 md:w-12"
                      />
                      <div className="text-center md:text-left">
                        <p className="text-sm font-semibold text-gray-900 md:text-base">
                          Innocent Waziri
                        </p>
                        <p className="text-xs font-medium text-blue-600 md:text-sm">
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
              className="h-auto w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto md:px-8 md:py-4 md:text-lg"
            >
              Shop with Confidence
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section - Pure Black Background */}
      <section className="bg-slate-900 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300 md:text-xl">
              Everything you need to know about sourcing Laptops at scale
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                value: 'bulk-pricing',
                question: 'How does bulk pricing work?',
                answer:
                  "Our bulk pricing starts from 5 units and scales based on quantity and specifications. Share your requirements (model, condition, quantity) and we'll provide a custom quote within 3 business days. Larger orders (50+ units) receive priority pricing and dedicated account management.",
              },
              {
                value: 'warranty-business',
                question: 'What warranty do business orders receive?',
                answer:
                  "Pre-owned laptops come with a 90-day warranty covering hardware defects and major component failures. Brand-new units include the full 1-year manufacturer's warranty. We also offer extended warranty options for businesses requiring longer coverage periods.",
              },
              {
                value: 'delivery-timeline',
                question:
                  "What's the typical delivery timeline for business orders?",
                answer:
                  'Standard delivery is 7-14 business days for orders under 20 units. Larger orders (20+ units) typically take 14-21 business days to source, test, and ship. We provide regular updates and can accommodate urgent delivery requests with express shipping options.',
              },

              {
                value: 'quality-consistency',
                question:
                  'How do you ensure consistent quality across bulk orders?',
                answer:
                  'We batch orders from the same supplier sources and conduct multi-point quality checks on every unit. Each laptop or desktop (for businesses that request that) undergoes battery health testing, hardware diagnostics, cosmetic grading, and functional verification before shipping. We provide detailed condition reports for every unit.',
              },
              {
                value: 'business-support',
                question: 'What support do you provide for business customers?',
                answer:
                  'Business customers receive dedicated account management, priority customer support, and technical consultation. We assist with deployment planning, configuration requirements, and provide ongoing support for warranty claims and technical issues.',
              },
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={faq.value}
                className="rounded-lg border border-gray-800 bg-gray-900/50 px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="py-4 text-left text-white hover:text-blue-300">
                  <span className="text-base font-medium md:text-lg">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-gray-300 md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section - White Background */}
      <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Ready to Outfit Your Team?
            </h2>
            <p className="mb-8 text-lg text-gray-600 md:text-xl">
              Get a custom quote for your Laptop requirements or speak with our
              business specialists.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="border-2 border-gray-200 transition-colors duration-200 hover:border-blue-300">
              <CardContent className="p-6 text-center md:p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Get a Custom Quote
                </h3>
                <p className="mb-6 text-gray-600">
                  Share your requirements and receive a detailed proposal within
                  3 business days.
                </p>
                <Button
                  onClick={handleGetQuote}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Request Quote
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 transition-colors duration-200 hover:border-green-300">
              <CardContent className="p-6 text-center md:p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Talk to a Specialist
                </h3>
                <p className="mb-6 text-gray-600">
                  Speak directly with our business team for personalized
                  guidance and support.
                </p>
                <Button
                  onClick={handleTalkToSpecialist}
                  variant="outline"
                  className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                >
                  Schedule Call
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Or browse our current inventory and start shopping immediately
            </p>
            <Button
              onClick={handleBrowseMacBooks}
              className="h-auto rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              Browse Laptops
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
