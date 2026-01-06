'use client';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  ChevronDown,
  Menu,
  X,
  Smartphone,
  Headphones,
  BookOpen,
  Laptop,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import YouTubeIcon from './icons/YouTubeIcon';
import TikTokIcon from './icons/TikTokIcon';
import { useRouter } from 'next/navigation';
import logo from '../public/images/logo.png';

interface NavigationProps {
  onNavigateHome?: () => void;
  onNavigateSignIn?: () => void;
  onNavigateBlog?: () => void;
}

export default function Navigation({
  onNavigateHome,
  onNavigateSignIn,
  onNavigateBlog,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() =>
                onNavigateHome ? onNavigateHome() : router.push('/')
              }
              className="transition-opacity hover:opacity-80"
              aria-label="Go to home page"
            >
              <Image
                src="/images/new/images/logo.png"
                alt="Sure Imports Logo"
                width={190}
                height={40}
                priority
                draggable={false}
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <button
              onClick={() => router.push('/')}
              className="group relative text-white transition-colors duration-200 hover:text-blue-400"
            >
              Home
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => router.push('/blog')}
              className="group relative flex items-center space-x-1 text-gray-300 transition-colors duration-200 hover:text-blue-400"
            >
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 border-none bg-transparent text-gray-300 outline-none transition-colors duration-200 hover:text-blue-400">
                <span>Videos</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 border-slate-700 bg-slate-800 shadow-xl">
                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://youtube.com/@sureimports?si=sAunkYlz_EUyT5nM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <YouTubeIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">YouTube</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Watch detailed tutorials and sourcing guides
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://www.tiktok.com/@tochukwunkwocha?_t=ZS-8ydbARssS1K&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <TikTokIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">TikTok</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Quick tips and behind-the-scenes content
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* SERVICES */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 border-none bg-transparent text-gray-300 outline-none transition-colors duration-200 hover:text-blue-400">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 border-slate-700 bg-slate-800 shadow-xl">
                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://www.sureimports.com/buy-from-chinese-websites"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xs font-bold text-white">🛒</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        Buy from Chinese Websites
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        Direct purchasing from Chinese platforms with quality
                        assurance
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://www.sureimports.com/source-products-from-china"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-blue-600">
                      <span className="text-xs font-bold text-white">🔍</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        Source Products from China
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        Custom product sourcing and supplier verification
                        services
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://linescout.sureimports.com/"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-blue-600">
                      <span className="text-xs font-bold text-white">✨</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">LineScout</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Clear guidance for machines and equipment sourcing from
                        China to Nigeria
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* TOOLS */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 border-none bg-transparent text-gray-300 outline-none transition-colors duration-200 hover:text-blue-400">
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 border-slate-700 bg-slate-800 shadow-xl">
                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://www.sureimports.com/tools/air-vs-sea-calculator"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xs font-bold text-white">✨</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Air vs Sea calculator</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Compare air and sea shipping costs for your products
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://www.sureimports.com/tools/carton-optimization"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xs font-bold text-white">✨</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Carton Optimization</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Optimize your carton size for shipping
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://sureimports.com/tools/cbm-volumetric-weight-calculator"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xs font-bold text-white">✨</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        CBM volumetric weight calculator
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        Calculate CBM and volumetric weight for your products
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://sureimports.com/tools/generator-sizing"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xs font-bold text-white">✨</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Generator Sizing</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Calculate the right generator size for your factory
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://sureimports.com/tools/landed-cost-estimator"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xs font-bold text-white">✨</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Landed cost estimator</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Estimate total landed cost using all-in rates (shipping,
                        duties, and taxes included)
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://sureimports.com/tools/retail-price-builder"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xs font-bold text-white">✨</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Retail Price Builder</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Turn your landed cost per unit into a confident selling
                        price
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* SHOP */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 border-none bg-transparent text-gray-300 outline-none transition-colors duration-200 hover:text-blue-400">
                <span>Shop</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-80 border-slate-700 bg-slate-800 shadow-xl">
                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <button
                    onClick={() => router.push('/laptops-for-business')}
                    className="flex w-full items-start space-x-3 text-left"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600">
                      <Laptop className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Laptops for Business</span>
                      <span className="mt-1 text-xs text-gray-400">
                        Authentic MacBooks and Windows laptops sourced with
                        warranty
                      </span>
                    </div>
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://www.sureimports.com/buy-phones-from-china"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-red-600">
                      <Smartphone className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        Buy Gadgets from China
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        Phones, electronics, and tech gadgets at wholesale
                        prices
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 text-gray-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white">
                  <a
                    href="https://www.sureimports.com/faya"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start space-x-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-600">
                      <Headphones className="h-3 w-3 text-white" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium">
                        FAYA Phone & Laptop Accessories
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        Premium accessories for phones, laptops, and devices
                      </span>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Sign In Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => router.push('/auth/login')}
              className="rounded-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white transition-colors duration-200 hover:text-blue-400 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="space-y-2 border-t border-slate-800/50 py-4 md:hidden">
            {/* Home Link */}
            <button
              onClick={() => {
                router.push('/');
                setIsMobileMenuOpen(false);
              }}
              className="block min-h-[44px] w-full px-1 py-2 text-left text-white transition-colors duration-200 hover:text-blue-400"
            >
              Home
            </button>

            {/* Blog Link */}
            <button
              onClick={() => {
                router.push('/blog');
                setIsMobileMenuOpen(false);
              }}
              className="flex min-h-[44px] w-full items-center space-x-2 px-1 py-2 text-left text-gray-300 transition-colors duration-200 hover:text-blue-400"
            >
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </button>

            {/* Accordion Menu for Expandable Sections */}
            <Accordion type="single" collapsible className="w-full">
              {/* Videos Section */}
              <AccordionItem
                value="videos"
                className="border-b-0 border-slate-700"
              >
                <AccordionTrigger className="min-h-[44px] px-1 py-3 text-gray-300 hover:text-blue-400 hover:no-underline [&>svg]:text-gray-400 [&[data-state=open]]:text-blue-400">
                  Videos
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-3 pl-4">
                    <a
                      href="https://youtube.com/@sureimports?si=sAunkYlz_EUyT5nM"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <YouTubeIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">YouTube</span>
                        <span className="mt-1 text-xs text-gray-500">
                          Detailed tutorials and sourcing guides
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://www.tiktok.com/@tochukwunkwocha?_t=ZS-8ydbARssS1K&_r=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <TikTokIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">TikTok</span>
                        <span className="mt-1 text-xs text-gray-500">
                          Quick tips and behind-the-scenes content
                        </span>
                      </div>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Services Section */}
              <AccordionItem
                value="services"
                className="border-b-0 border-slate-700"
              >
                <AccordionTrigger className="min-h-[44px] px-1 py-3 text-gray-300 hover:text-blue-400 hover:no-underline [&>svg]:text-gray-400 [&[data-state=open]]:text-blue-400">
                  Services
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-3 pl-4">
                    <a
                      href="https://www.sureimports.com/buy-from-chinese-websites"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs text-white">🛒</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Buy from Chinese Websites
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Direct purchasing with quality assurance
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://www.sureimports.com/source-products-from-china"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-blue-600">
                        <span className="text-xs text-white">🔍</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Source Products from China
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Custom sourcing and supplier verification
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://linescout.sureimports.com/"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-blue-600">
                        <span className="text-xs text-white">✨</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">LineScout</span>
                        <span className="mt-1 text-xs text-gray-500">
                          Machines and equipment sourcing from China
                        </span>
                      </div>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tools Section */}
              <AccordionItem
                value="tools"
                className="border-b-0 border-slate-700"
              >
                <AccordionTrigger className="min-h-[44px] px-1 py-3 text-gray-300 hover:text-blue-400 hover:no-underline [&>svg]:text-gray-400 [&[data-state=open]]:text-blue-400">
                  Tools
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-3 pl-4">
                    <a
                      href="https://www.sureimports.com/air-vs-sea-calculator"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs text-white">✨</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Air vs Sea Calculator
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Compare air and sea shipping costs
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://www.sureimports.com/tools/carton-optimization"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs text-white">✨</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Carton Optimization</span>
                        <span className="mt-1 text-xs text-gray-500">
                          Optimize your carton size for shipping
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://sureimports.com/tools/cbm-volumetric-weight-calculator"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs text-white">✨</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">CBM Calculator</span>
                        <span className="mt-1 text-xs text-gray-500">
                          Calculate CBM and volumetric weight
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://sureimports.com/tools/generator-sizing"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs text-white">✨</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Generator Sizing</span>
                        <span className="mt-1 text-xs text-gray-500">
                          Calculate the right generator size
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://sureimports.com/tools/landed-cost-estimator"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs text-white">✨</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Landed Cost Estimator
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Estimate total landed cost
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://sureimports.com/tools/retail-price-builder"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs text-white">✨</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Retail Price Builder
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Turn landed cost into selling price
                        </span>
                      </div>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Shop Section */}
              <AccordionItem
                value="shop"
                className="border-b-0 border-slate-700"
              >
                <AccordionTrigger className="min-h-[44px] px-1 py-3 text-gray-300 hover:text-blue-400 hover:no-underline [&>svg]:text-gray-400 [&[data-state=open]]:text-blue-400">
                  Shop
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-3 pl-4">
                    <a
                      href="/laptops-for-business"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Laptop className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Laptops for Business
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Authentic MacBooks and Windows laptops
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://www.sureimports.com/buy-phones-from-china"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-red-600">
                        <Smartphone className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Buy Gadgets from China
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Phones, electronics, and tech gadgets
                        </span>
                      </div>
                    </a>
                    <a
                      href="https://www.sureimports.com/faya"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-start space-x-3 py-2 text-gray-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-600">
                        <Headphones className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          FAYA Phone & Laptop Accessories
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          Premium accessories for devices
                        </span>
                      </div>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Mobile Sign In Button */}
            <div className="pt-4">
              <Button
                onClick={() => {
                  router.push('/auth/login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full rounded-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
              >
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
