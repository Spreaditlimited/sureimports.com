import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, Users, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface HeroSectionProps {
  onNavigateToSignUp?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
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

export default function HeroSection({ 
  onNavigateToSignUp, 
  onNavigateToTerms, 
  onNavigateToPrivacy 
}: HeroSectionProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

    const { user, logout } = useAuth();
    const router = useRouter();
    const [isLoadingx, setIsLoadingx] = React.useState(true);
  
    const searchParams = useSearchParams();
  
    const userAffiliateRefx =
      (new URLSearchParams(searchParams).get('affRef') as any) || 'NO_REF';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Handle email validation
    if (field === "email") {
      handleEmailValidation(value);
    }
    
    // Handle password validation
    if (field === "password" || field === "confirmPassword") {
      handlePasswordValidation(field, value);
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Standard email validation requiring dot in domain
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleEmailValidation = (email: string) => {
    if (email.trim() === "") {
      setEmailError("");
    } else if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordValidation = (field: string, value: string) => {
    const currentPassword = field === "password" ? value : formData.password;
    const currentConfirmPassword = field === "confirmPassword" ? value : formData.confirmPassword;
    
    // Only validate if both fields have values
    if (currentPassword && currentConfirmPassword) {
      if (currentPassword !== currentConfirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    // Validate email before submission
    if (!isValidEmail(formData.email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Validate password match before submission
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);



    const userFirstname = formData.firstName;
    const userLastname = formData.lastName;
    const email = formData.email;
    const phone = formData.phone;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const userAffiliateRef = userAffiliateRefx;

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userFirstname,
          userLastname,
          email,
          phone,
          password,
          confirmPassword,
          userAffiliateRef,
        }),
      });
      const data: ApiResponse = await res.json();
      if (data.successx) {
        router.push('/auth/account-creation-success');
        setIsSubmitting(false);
      } else {
        setEmailError(data.messagex.message1);
        setIsSubmitting(false);
      }
      setEmailError(data.messagex.message1);
      //setPasswordError(data.messagex.message1);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
    
    // try {
    //   // Simulate form submission
    //   console.log("Form submitted:", formData);
      
    //   // Here you would typically send the data to your backend
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      
    //   alert("Thank you for signing up! We'll be in touch soon.");
      
    //   // Reset form
    //   setFormData({
    //     firstName: "",
    //     lastName: "",
    //     email: "",
    //     phone: "",
    //     password: "",
    //     confirmPassword: ""
    //   });
    //   setEmailError("");
    //   setPasswordError("");
    // } catch (error) {
    //   console.error("Form submission error:", error);
    //   alert("There was an error submitting your information. Please try again.");
    // } finally {
    //   setIsSubmitting(false);
    // }



  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-blue-600/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-160px)]">
          {/* Left Column - Content */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Trusted by 40,000+ merchants</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Buy from China with{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Say goodbye to the fear of receiving poor quality or incorrect products from China. 
                We guarantee the quality and accuracy of every item we source, ensuring you get exactly what 
                you ordered, every time.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Quality Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Fast Shipping</span>
              </div>
            </div>

            {/* Call to Action - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={onNavigateToSignUp}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Start Importing Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const servicesSection = document.getElementById('services-section');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-slate-400 bg-transparent text-white hover:bg-white/10 hover:border-slate-300 hover:text-white px-8 py-3 transition-all duration-200 font-medium"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="lg:pl-8">
            <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50 shadow-2xl">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl text-white">Join Our Network</CardTitle>
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Join over 40,000 merchants today</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname" className="text-gray-300">First Name</Label>
                      <Input
                        id="firstname"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your firstname"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname" className="text-gray-300">Last Name</Label>
                      <Input
                        id="lastname"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your lastname"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className={`bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                      required
                    />
                    {emailError && (
                      <p className="text-red-400 text-xs mt-1 break-words">
                        {emailError}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+234 801 234 5678"
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Create a password"
                          className={`bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${passwordError ? "border-red-500 focus:border-red-500" : ""}`}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-300">Repeat Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          placeholder="Repeat your password"
                          className={`bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${passwordError ? "border-red-500 focus:border-red-500" : ""}`}
                          required
                        />
                      </div>
                    </div>
                    {passwordError && (
                      <div className="w-full max-w-full min-w-0 overflow-hidden">
                        <p className="text-red-400 text-xs mt-1 break-all overflow-wrap-anywhere hyphens-auto leading-tight px-1">
                          {passwordError}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Get Started Today"}
                  </Button>
                  
                  <p className="text-xs text-gray-400 text-center">
                    By signing up, you agree to our{" "}
                    <button 
                      type="button"
                      onClick={() => router.push("/terms-and-conditions")}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button 
                      type="button"
                      onClick={() => router.push("/privacy-policy")}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}