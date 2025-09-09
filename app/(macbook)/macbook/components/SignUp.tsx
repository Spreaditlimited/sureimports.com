import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Mail, Lock, User, Eye, EyeOff, Phone, Shield } from "lucide-react";
import sureImportsLogo from "figma:asset/84c7e5da1d268b600da8ab16cf73ccc4cef6b5ac.png";

interface SignUpProps {
  onNavigateToSignIn?: () => void;
  onNavigateToSignUpSuccess?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateHome?: () => void;
}

export default function SignUp({ 
  onNavigateToSignIn, 
  onNavigateToSignUpSuccess,
  onNavigateToTerms,
  onNavigateToPrivacy,
  onNavigateHome 
}: SignUpProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate email on change
    if (field === "email") {
      if (value.trim() === "") {
        setEmailError("");
      } else if (!isValidEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!isValidEmail(formData.email)) {
      setEmailError("Invalid email format");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onNavigateToSignUpSuccess?.();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <button
              onClick={onNavigateHome}
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src={sureImportsLogo} 
                alt="Sure Imports" 
                className="h-8 opacity-90"
              />
            </button>
          </div>
          <h1 className="text-white text-2xl">Create your account</h1>
          <p className="text-gray-400">Join thousands of businesses sourcing from China</p>
        </div>

        {/* Sign Up Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white">Sign Up</CardTitle>
            <CardDescription className="text-gray-400">
              Create your Sure Imports account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                </div>
                {emailError && (
                  <div className="text-red-400 text-xs mt-1 w-full max-w-full break-all overflow-wrap-anywhere hyphens-auto">
                    {emailError}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Enhanced Terms and Privacy Section */}
              <div className="space-y-4">
                <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-0.5"
                    />
                    <div className="flex-1 space-y-2">
                      <Label 
                        htmlFor="terms" 
                        className="text-gray-300 leading-relaxed cursor-pointer block"
                      >
                        I agree to Sure Imports' legal agreements
                      </Label>
                      <div className="flex flex-wrap items-center gap-1 text-sm">
                        <span className="text-gray-500">Read our</span>
                        <button
                          type="button"
                          onClick={onNavigateToTerms}
                          className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2 hover:underline-offset-4"
                        >
                          Terms & Conditions
                        </button>
                        <span className="text-gray-500">and</span>
                        <button
                          type="button"
                          onClick={onNavigateToPrivacy}
                          className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2 hover:underline-offset-4"
                        >
                          Privacy Policy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start space-x-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">
                    Your data is protected with industry-standard encryption and we never share your information with third parties.
                  </span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 mt-6"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <button
                    onClick={onNavigateToSignIn}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}