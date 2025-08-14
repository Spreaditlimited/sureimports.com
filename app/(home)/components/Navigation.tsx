"use client";

import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, Menu, X, Smartphone, Headphones, BookOpen } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import YouTubeIcon from "./icons/YouTubeIcon";
import TikTokIcon from "./icons/TikTokIcon";
import { useRouter } from 'next/navigation';
import logo from '../public/images/logo.png';

interface NavigationProps {
  onNavigateHome?: () => void;
  onNavigateSignIn?: () => void;
  onNavigateBlog?: () => void;
}

export default function Navigation({ onNavigateHome, onNavigateSignIn, onNavigateBlog }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <nav className="w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={onNavigateHome}
              className="hover:opacity-80 transition-opacity"
            >
                <Image 
                  src={logo} 
                  alt="Sure Imports Logo"
                  width={140}
                  height={24}
                  priority
                  // loading="eager"
                  draggable={false}
                  // className="w-full h-full object-contain"
                />
              {/* <Image
                src="../public/images/logo.png"
                alt="SURE IMPORTS"
                width={120}
                height={24}
                className="h-6 w-auto opacity-90"
                priority
              /> */}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => router.push("/")}
              className="text-white hover:text-blue-400 transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => router.push("/blog")}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 relative group flex items-center space-x-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1 bg-transparent border-none outline-none">
                <span>Videos</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700 shadow-xl w-80">
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 p-4">
                  <a 
                    href="https://youtube.com/@sureimports?si=sAunkYlz_EUyT5nM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 w-full"
                  >
                    <YouTubeIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">YouTube</span>
                      <span className="text-xs text-gray-400 mt-1">Watch detailed tutorials and sourcing guides</span>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 p-4">
                  <a 
                    href="https://www.tiktok.com/@tochukwunkwocha?_t=ZS-8ydbARssS1K&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 w-full"
                  >
                    <TikTokIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">TikTok</span>
                      <span className="text-xs text-gray-400 mt-1">Quick tips and behind-the-scenes content</span>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1 bg-transparent border-none outline-none">
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700 shadow-xl w-80">
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 p-4">
                  <a 
                    href="https://www.sureimports.com/buy-from-chinese-websites"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 w-full"
                  >
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🛒</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Buy from Chinese Websites</span>
                      <span className="text-xs text-gray-400 mt-1">Direct purchasing from Chinese platforms with quality assurance</span>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 p-4">
                  <a 
                    href="https://www.sureimports.com/source-products-from-china"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 w-full"
                  >
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-green-500 to-blue-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🔍</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Source Products from China</span>
                      <span className="text-xs text-gray-400 mt-1">Custom product sourcing and supplier verification services</span>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1 bg-transparent border-none outline-none">
                <span>Shop</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700 shadow-xl w-80">
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 p-4">
                  <a 
                    href="https://www.sureimports.com/buy-phones-from-china"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 w-full"
                  >
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                      <Smartphone className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Buy Gadgets from China</span>
                      <span className="text-xs text-gray-400 mt-1">Phones, electronics, and tech gadgets at wholesale prices</span>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 p-4">
                  <a 
                    href="https://www.sureimports.com/faya"
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 w-full"
                  >
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                      <Headphones className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">FAYA Phone & Laptop Accessories</span>
                      <span className="text-xs text-gray-400 mt-1">Premium accessories for phones, laptops, and devices</span>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Sign In Button */}
          <div className="hidden md:block">
            <Button 
              onClick={onNavigateSignIn}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-blue-400 transition-colors duration-200"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/50 py-4 space-y-4">
            <button 
              onClick={onNavigateHome}
              className="block text-white hover:text-blue-400 transition-colors duration-200 text-left w-full"
            >
              Home
            </button>
            <button 
              onClick={onNavigateBlog}
              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 text-left w-full"
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
            </button>
            <div className="space-y-2">
              <span className="block text-gray-300 font-medium">Videos</span>
              <div className="pl-4 space-y-3">
                <a 
                  href="https://youtube.com/@sureimports?si=sAunkYlz_EUyT5nM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <YouTubeIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">YouTube</span>
                    <span className="text-xs text-gray-500 mt-1">Detailed tutorials and sourcing guides</span>
                  </div>
                </a>
                <a 
                  href="https://www.tiktok.com/@tochukwunkwocha?_t=ZS-8ydbARssS1K&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <TikTokIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">TikTok</span>
                    <span className="text-xs text-gray-500 mt-1">Quick tips and behind-the-scenes content</span>
                  </div>
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <span className="block text-gray-300 font-medium">Services</span>
              <div className="pl-4 space-y-3">
                <a 
                  href="https://www.sureimports.com/buy-from-chinese-websites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">🛒</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Buy from Chinese Websites</span>
                    <span className="text-xs text-gray-500 mt-1">Direct purchasing with quality assurance</span>
                  </div>
                </a>
                <a 
                  href="https://www.sureimports.com/source-products-from-china"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-green-500 to-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">🔍</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Source Products from China</span>
                    <span className="text-xs text-gray-500 mt-1">Custom sourcing and supplier verification</span>
                  </div>
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <span className="block text-gray-300 font-medium">Shop</span>
              <div className="pl-4 space-y-3">
                <a 
                  href="https://www.sureimports.com/buy-phones-from-china"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                    <Smartphone className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Buy Gadgets from China</span>
                    <span className="text-xs text-gray-500 mt-1">Phones, electronics, and tech gadgets</span>
                  </div>
                </a>
                <a 
                  href="https://www.sureimports.com/faya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                    <Headphones className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">FAYA Phone & Laptop Accessories</span>
                    <span className="text-xs text-gray-500 mt-1">Premium accessories for devices</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Mobile Sign In Button */}
            <Button 
              onClick={onNavigateSignIn}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg transition-all duration-200"
            >
              Sign In
            </Button>

          </div>
        )}
      </div>
    </nav>
  );
}