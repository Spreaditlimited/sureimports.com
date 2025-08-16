'use client';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Globe, Award, TrendingUp, Zap, Code, Heart, Target } from "lucide-react";
import Image from "next/image";
import tochukwuImage from '../images/new/images/sureimports-ceo.jpg';

export default function AboutUs() {
  const achievements = [
    {
      icon: Users,
      number: "40,000+",
      label: "Registered Users",
      description: "Growing community since 2018"
    },
    {
      icon: Globe,
      number: "Millions",
      label: "Dollars Remitted",
      description: "To suppliers worldwide"
    },
    {
      icon: Award,
      number: "4.7/5",
      label: "Google Rating",
      description: "Trusted by customers"
    },
    {
      icon: TrendingUp,
      number: "100,000+",
      label: "Products Delivered",
      description: "Across multiple countries"
    }
  ];

  const founderSkills = [
    "Digital Marketing Strategy",
    "Facebook & TikTok Advertising",
    "Software Development",
    "Product Management",
    "Artificial Intelligence",
    "E-commerce Strategy"
  ];

  const globalPresence = [
    { country: "Nigeria", role: "Headquarters", location: "Lagos" },
    { country: "China", role: "Sourcing Hub", location: "Guangzhou" },
    { country: "United Kingdom", role: "Market Expansion", location: "Manchester" },
    { country: "Africa", role: "Market Expansion", location: "Multiple Countries" }
  ];

  return (
    <div className="bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Sure Imports</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transforming global procurement by connecting businesses with verified Chinese suppliers and manufacturers, ensuring quality, reliability, and seamless international trade.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Company Story */}
        <section>
          <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2 text-2xl">
                <Heart className="w-6 h-6 text-red-400" />
                <span>Our Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              <p className="text-lg leading-relaxed">
                Since 2018, Sure Imports Limited has revolutionized the way businesses source products from China. What started as a vision to bridge the gap between African entrepreneurs and Chinese manufacturers has grown into a thriving global procurement platform.
              </p>
              
              <p className="leading-relaxed">
                Our team has transformed the global procurement landscape by building trust, ensuring quality, and providing seamless service. We've successfully remitted millions of dollars to suppliers and delivered hundreds of thousands of products worldwide, creating lasting partnerships across continents.
              </p>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>Our Mission</span>
                </h3>
                <p className="text-gray-300">
                  To democratize global trade by providing businesses of all sizes with access to high-quality Chinese products, reliable suppliers, and exceptional service that drives their success in the global marketplace.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Achievements */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Achievements</h2>
            <p className="text-gray-300 text-lg">Building trust through consistent delivery and exceptional service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-slate-700/50 hover:bg-white/10 transition-all">
                <CardContent className="p-6 text-center">
                  <achievement.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">{achievement.number}</h3>
                    <p className="font-semibold text-blue-400">{achievement.label}</p>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Founder Section */}
        <section>
          <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2 text-2xl">
                <Users className="w-6 h-6 text-blue-400" />
                <span>Meet Our Founder</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Founder Image */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block">
                    <div className="w-64 h-80 bg-slate-800/50 rounded-2xl shadow-2xl mx-auto lg:mx-0 overflow-hidden">
                      <Image 
                        src="images/new/images/sureimports-ceo.jpg"
                        height={320}
                        width={256}
                        priority
                        draggable={false}
                        alt="Tochukwu Nkwocha - Founder & CEO of Sure Imports"
                        className="w-full h-full object-contain"
                      />

                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Founder & CEO
                    </div>
                  </div>
                </div>

                {/* Founder Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Tochukwu Nkwocha</h3>
                    <p className="text-blue-400 font-semibold mb-4">Founder & Chief Executive Officer</p>
                    
                    <div className="space-y-4 text-gray-300">
                      <p className="leading-relaxed">
                        Leading Sure Imports with visionary expertise, Tochukwu has leveraged his background in digital marketing—particularly Facebook and TikTok advertising—to grow our user base to over 40,000 registered users since 2018.
                      </p>
                      
                      <p className="leading-relaxed">
                        His unique combination of software development and product management experience has been pivotal in directing our development teams to enhance our product sourcing platform, creating a seamless synergy between technology and commerce.
                      </p>
                      
                      <p className="leading-relaxed">
                        With strategic leadership spanning multiple countries including China, the United Kingdom, and various African nations, Tochukwu fosters international collaborations that drive Sure Imports' global success.
                      </p>
                    </div>
                  </div>

                  {/* Social Media Influence */}
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-semibold">Digital Influence</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      With over 80,000 followers across social media platforms, Tochukwu shares valuable insights on e-commerce, digital strategy, and artificial intelligence to help businesses thrive in the digital age.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills & Expertise */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold flex items-center space-x-2">
                  <Code className="w-5 h-5 text-green-400" />
                  <span>Expertise & Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {founderSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Enthusiasm */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold">AI Innovation</span>
                </div>
                <p className="text-gray-300">
                  As an Artificial Intelligence enthusiast, Tochukwu actively shares insights on how businesses and individuals can leverage AI to improve operations and create a more prosperous world, positioning Sure Imports at the forefront of technological innovation.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Global Presence */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Global Presence</h2>
            <p className="text-gray-300 text-lg">Strategically positioned across key markets for optimal service delivery</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalPresence.map((location, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-slate-700/50 hover:bg-white/10 transition-all">
                <CardContent className="p-6 text-center">
                  <Globe className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <h3 className="font-bold text-white">{location.country}</h3>
                    <p className="text-blue-400 text-sm font-semibold">{location.role}</p>
                    <p className="text-gray-400 text-sm">{location.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision Statement */}
        <section>

          <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Our Vision for the Future</h2>
              <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                To become the world's most trusted global procurement platform, where businesses of every size can access quality products, reliable suppliers, and innovative solutions that drive growth and success in an interconnected world.
              </p>
            </CardContent>
          </div>

        </section>
      </div>
    </div>
  );
}