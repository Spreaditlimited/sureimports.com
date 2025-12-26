import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Search,
  Shield,
  MessageCircle,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';

interface ServicesSectionProps {
  onNavigateToSignUp?: () => void;
}

export default function ServicesSection({
  onNavigateToSignUp,
}: ServicesSectionProps) {
  return (
    <section
      id="services-section"
      className="bg-gradient-to-b from-slate-900 to-slate-800 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Choose from our comprehensive range of import services designed to
            meet your specific needs
          </p>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4 md:grid md:flex-none md:grid-cols-2 md:gap-8 md:overflow-x-visible md:pb-0">
          {/* Buy From Chinese Websites */}
          <Card className="group flex min-w-[320px] flex-col border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 md:min-w-0">
            <CardHeader className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Buy From Chinese Websites
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="flex-1 space-y-3">
                <p className="leading-relaxed text-gray-300">
                  You can search for products on Chinese websites and place an
                  order right here. We can buy products from over 100 websites
                  in China.
                </p>
                <p className="leading-relaxed text-gray-300">
                  Simply provide us with the product link, specify your
                  requirements, and we'll handle the entire purchasing process
                  including quality verification, secure payment, and
                  consolidation at our China warehouse.
                </p>
                <p className="leading-relaxed text-gray-300">
                  Our team communicates directly with suppliers to ensure you
                  get the best prices and authentic products every time.
                </p>

                {/* Platform Logos */}
                <div className="flex flex-wrap items-center gap-4 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-500">1688</span>
                    <span className="text-sm text-gray-400">网上</span>
                  </div>
                  <div className="text-lg font-bold text-orange-500">
                    Alibaba.com
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500">
                      <span className="text-xs font-bold text-white">❤</span>
                    </div>
                    <span className="font-medium text-gray-300">Pinduoduo</span>
                  </div>
                  <div className="font-medium text-blue-400">koala</div>
                  <div className="rounded bg-red-600 px-2 py-1 text-sm font-bold text-white">
                    天猫
                  </div>
                </div>
              </div>

              <Button
                onClick={onNavigateToSignUp}
                className="mt-auto w-full border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 group-hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Special Product Sourcing */}
          <Card className="group flex min-w-[320px] flex-col border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 md:min-w-0">
            <CardHeader className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Special Product Sourcing
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="flex-1 space-y-3 text-gray-300">
                <p>
                  We can source any product from China for you whilst
                  guaranteeing the quality you will receive. To do this, we will
                  create a WhatsApp group with our China team who will handle
                  the sourcing for you.
                </p>
                <p>
                  We charge a sourcing commitment fee to begin. This money is
                  refunded when you go ahead to place an order.
                </p>
                <p>
                  We will provide a consolidated quote to you which will include
                  shipping and clearing.
                </p>
              </div>

              <Button
                onClick={onNavigateToSignUp}
                className="mt-auto w-full border-0 bg-gradient-to-r from-green-600 to-blue-600 text-white transition-all duration-200 hover:from-green-700 hover:to-blue-700 group-hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Verify Suppliers in China */}
          <Card className="group flex min-w-[320px] flex-col border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 md:min-w-0">
            <CardHeader className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Verify Suppliers in China
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="flex-1 space-y-3 text-gray-300">
                <p>
                  Our onsite verification service provides comprehensive
                  supplier investigation in China. We physically visit
                  facilities, verify business licenses, and assess production
                  capabilities.
                </p>
                <p>
                  Get detailed investigation results within 3 business days,
                  including photos, documentation, and our professional
                  assessment to help you import directly from suppliers with
                  complete confidence.
                </p>
                <p>
                  Protect your investment and avoid fraudulent suppliers with
                  our thorough verification process.
                </p>
              </div>

              <Button
                onClick={onNavigateToSignUp}
                className="mt-auto w-full border-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-200 hover:from-purple-700 hover:to-pink-700 group-hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Buy Gadgets from China */}
          <Card className="group flex min-w-[320px] flex-col border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/50 md:min-w-0">
            <CardHeader className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Buy Gadgets from China
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="flex-1 space-y-3 text-gray-300">
                <p>
                  Browse our curated selection of phones, electronics, and tech
                  gadgets sourced directly from trusted Chinese manufacturers at
                  wholesale prices.
                </p>
                <p>
                  Every phone purchase includes complimentary phone casings and
                  screen protectors to keep your device protected from day one.
                  We believe in providing complete value with every order.
                </p>
                <p>
                  All gadgets come with comprehensive warranty coverage and
                  quality assurance. Each product is thoroughly tested before
                  shipping to ensure you receive authentic, working products
                  with peace of mind.
                </p>
                <p>
                  Our warranty policy covers manufacturing defects and ensures
                  you get reliable support for your tech investments.
                </p>
              </div>

              <Button
                onClick={onNavigateToSignUp}
                className="mt-auto w-full border-0 bg-gradient-to-r from-orange-600 to-red-600 text-white transition-all duration-200 hover:from-orange-700 hover:to-red-700 group-hover:scale-105"
              >
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
