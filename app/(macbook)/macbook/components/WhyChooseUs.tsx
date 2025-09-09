import { Shield, Users, Calendar, Star, CheckCircle, Globe, Clock, Award } from "lucide-react";
import { Card, CardContent } from "./ui/card";


export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Every product is thoroughly inspected and verified before shipping to ensure you receive exactly what you ordered.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Trusted by 40,000+",
      description: "Join over 40,000 registered users who trust us for their importing needs from China.",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Calendar,
      title: "7 Years of Experience",
      description: "Since 2018, we've been perfecting our import process and building strong relationships with suppliers.",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: Star,
      title: "4.7/5 Google Rating",
      description: "Our customers consistently rate us highly for our service quality and reliability.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Global Shipping",
      description: "We ship to any country worldwide with full tracking and insurance coverage.",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick order processing and efficient handling to get your products shipped faster.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "40,000+", label: "Registered Users", icon: Users },
    { number: "7", label: "Years in Business", icon: Calendar },
    { number: "4.7/5", label: "Google Rating", icon: Star },
    { number: "100+", label: "Chinese Websites", icon: Globe }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Sure Imports?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We've built our reputation on trust, quality, and exceptional service. Here's why thousands of businesses choose us for their import needs.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-slate-700/50 text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row sm:inline-flex items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 bg-white/5 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-4 sm:px-8 py-4 max-w-full mx-auto">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm sm:text-base">Verified Business</span>
            </div>
            <div className="hidden sm:block w-1 h-6 bg-slate-600"></div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm sm:text-base">Secure Payments</span>
            </div>
            <div className="hidden sm:block w-1 h-6 bg-slate-600"></div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm sm:text-base">Industry Leader</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}