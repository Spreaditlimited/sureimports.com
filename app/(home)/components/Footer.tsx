"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import TikTokIcon from "./icons/TikTokIcon";
import { useState } from "react";
import logo from '../public/images/logo.png';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

interface FooterProps {
  onNavigateToShippingPolicy?: () => void;
  onNavigateToWarrantyPolicy?: () => void;
  onNavigateToTermsConditions?: () => void;
  onNavigateToPrivacyPolicy?: () => void;
  onNavigateToAbout?: () => void;
}

//USER DATA
interface User {
  userFirstname: string;
  userLastname: string;
  email: string;
  phone: string;
  password: string;
  userAffiliateRef: string;
}

//API RESPONSE
interface ApiResponse {
  messagex: any;
  statusx: string;
  successx: boolean;
  userx: User;
  // Add other properties as needed
}

export default function Footer({ onNavigateToShippingPolicy, onNavigateToWarrantyPolicy, onNavigateToTermsConditions, onNavigateToPrivacyPolicy, onNavigateToAbout }: FooterProps) {
  const [email, setEmail] = useState("");
  const [service, setService] = useState("SUREIMPORTS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  

  const router = useRouter();

  // Email validation function
  const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    
          e.preventDefault();
          toast.info("Subscribing to email list...");
          // Only proceed if email is valid (button should be disabled if not)
          if (!email.trim() || !isValidEmail(email)) {
            return;
          }



              //MAKE REQUEST ATTEMPT
    try {
      setIsSubmitting(true);
      //MAKE REQUEST
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          service,
        }),
      });


      const data: ApiResponse = await res.json();
      if (data.statusx === 'SUCCESS') {
        //router.push('/auth/account-creation-success');
        setMessageStatus('SUCCESS');
        setIsSubscribed(true);
        setIsSubmitting(false);

        //toast.success(data.messagex);
        
      } else {
        setIsSubscribed(true);
        //toast.error(data.messagex);
        setMessageStatus('FAILED');
        setMessage(data.messagex);
        setIsSubscribed(false);
        
      }
    } catch (error: any) {
      //setError(error.message);
      setMessage(error);
      setIsSubscribed(false);
      setIsSubmitting(false);
    } finally {
      //setIsLoading(false);
      //alert('Taking Final Action');
      setIsSubscribed(false);
      setIsSubmitting(false);
    }
          
          // Simulate API call to email list service
          // try {
          //   //await new Promise(resolve => setTimeout(resolve, 1000));
            
          //   setIsSubmitting(true);
          //   // Simulate successful subscription
          //   setIsSubscribed(true);
          //   setEmail("");
            
          //   // Reset success message after 3 seconds
          //   setTimeout(() => {
          //     setIsSubscribed(false);
          //   }, 3000);
            
          // } catch (error) {
          //     console.error("Subscription error:", error);
          // } finally {
          //     setIsSubmitting(false);
          // }
  };



  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
                              <Image 
                                src="/images/new/images/logo.png"
                                alt="Sure Imports Logo"
                                width={170}
                                height={24}
                                // priority
                                // loading="eager"
                                draggable={false}
                                // className="w-full h-full object-contain"
                              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for China product sourcing. We connect businesses with verified Chinese suppliers and manufacturers, ensuring quality and reliability.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@sureimports.com" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  hello@sureimports.com
                </a>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-white font-medium">Nigeria Office:</p>
                    <p className="text-gray-400">5 Olutosin Ajay Street, Ajao Estate, Lagos, Nigeria</p>
                  </div>
                </div>
                
                <div className="space-y-1 ml-6">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">08037649956</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">08064583664</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">08068397263</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium">China Office:</p>
                  <p className="text-gray-400">广州市白云区机场路111号建发广场5FB3-1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Legal & Support</h3>
            <div className="space-y-2">
              <button 
                onClick={() => router.push("/about")}
                className="block text-gray-400 hover:text-blue-400 text-sm transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => router.push("/terms-and-conditions")}
                className="block text-gray-400 hover:text-blue-400 text-sm transition-colors text-left"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => router.push("/privacy-policy")}
                className="block text-gray-400 hover:text-blue-400 text-sm transition-colors text-left"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => router.push("/warranty-policy")}
                className="block text-gray-400 hover:text-blue-400 text-sm transition-colors text-left"
              >
                Warranty Policy
              </button>
              <button 
                onClick={() => router.push("/shipping-policy")}
                className="block text-gray-400 hover:text-blue-400 text-sm transition-colors text-left"
              >
                Shipping Policy
              </button>
              <a 
                href="https://affiliate.sureimports.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                Affiliates
              </a>
            </div>
          </div>

          {/* Stay Connected */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Stay Connected</h3>
            <p className="text-gray-400 text-sm">
              Get the latest updates on China sourcing opportunities and industry insights.
            </p>
            
            {/* Email Subscription */}
            <div className="space-y-2">
              {
                messageStatus === 'SUCCESS' && (
                  <p className="text-green-500 text-sm text-center">
                    {message}
                  </p>
                )
              }

              {
                messageStatus === 'FAILED' && (
                  <p className="text-red-500 text-sm text-center">
                    {message}
                  </p>
                )
              }


              {isSubscribed ? (
                <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                  <p className="text-green-400 text-sm text-center">
                    Thank you for subscribing! 🎉
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <form onSubmit={handleSubscribe} className="flex space-x-2">
                    <div className="flex-1 min-w-0">
                      <Input 
                        type="email" 
                        placeholder="Your email" 
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 text-sm disabled:opacity-50 w-full"
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isSubmitting || !email.trim() || !isValidEmail(email)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {isSubmitting ? "Submitting..." : "Subscribe"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
            
            {/* Social Links */}
            <div className="space-y-2">
              <p className="text-white font-medium text-sm">Follow Us</p>
              <div className="flex space-x-3">
                <a 
                  href="https://www.facebook.com/share/1BEjP95X7E/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
                <a 
                  href="https://www.instagram.com/sureimport?igsh=NjRtaHJpbXlnMGxo&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 hover:bg-pink-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
                <a 
                  href="https://www.tiktok.com/@tochukwunkwocha?_t=ZS-8yeC5xnNBmH&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 hover:bg-black rounded-md flex items-center justify-center transition-colors"
                >
                  <TikTokIcon className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
                <a 
                  href="https://youtube.com/@sureimports?si=gP4cw3zUC1iQN3Rd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 hover:bg-red-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025 Sure Imports Limited. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
                <button
                onClick={() => router.push("/terms-and-conditions")}
                className="text-gray-500 hover:text-blue-400 text-sm transition-colors"
                >
                Terms & Conditions
                </button>
              <button 
                onClick={() => router.push("/privacy-policy")}
                className="text-gray-500 hover:text-blue-400 text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => router.push("/shipping-policy")}
                className="text-gray-500 hover:text-blue-400 text-sm transition-colors"
              >
                Shipping Policy
              </button>
              <button 
                //onClick={onNavigateToWarrantyPolicy}
                onClick={() => router.push("/warranty-policy")}
                className="text-gray-500 hover:text-blue-400 text-sm transition-colors"
              >
                Warranty Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}