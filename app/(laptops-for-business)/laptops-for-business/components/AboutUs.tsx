import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Users,
  Globe,
  Award,
  TrendingUp,
  Zap,
  Code,
  Heart,
  Target,
} from 'lucide-react';
import tochukwuImage from '../../../public/images/new/images/logo.png';

export default function AboutUs() {
  const achievements = [
    {
      icon: Users,
      number: '40,000+',
      label: 'Registered Users',
      description: 'Growing community since 2018',
    },
    {
      icon: Globe,
      number: 'Millions',
      label: 'Dollars Remitted',
      description: 'To suppliers worldwide',
    },
    {
      icon: Award,
      number: '4.7/5',
      label: 'Google Rating',
      description: 'Trusted by customers',
    },
    {
      icon: TrendingUp,
      number: '100,000+',
      label: 'Products Delivered',
      description: 'Across multiple countries',
    },
  ];

  const founderSkills = [
    'Digital Marketing Strategy',
    'Facebook & TikTok Advertising',
    'Software Development',
    'Product Management',
    'Artificial Intelligence',
    'E-commerce Strategy',
  ];

  const globalPresence = [
    { country: 'Nigeria', role: 'Headquarters', location: 'Lagos' },
    { country: 'China', role: 'Sourcing Hub', location: 'Guangzhou' },
    {
      country: 'United Kingdom',
      role: 'Market Expansion',
      location: 'Manchester',
    },
    {
      country: 'Africa',
      role: 'Market Expansion',
      location: 'Multiple Countries',
    },
  ];

  return (
    <div className="bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
              About{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Sure Imports
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
              Transforming global procurement by connecting businesses with
              verified Chinese suppliers and manufacturers, ensuring quality,
              reliability, and seamless international trade.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {/* Company Story */}
        <section>
          <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl text-white">
                <Heart className="h-6 w-6 text-red-400" />
                <span>Our Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              <p className="text-lg leading-relaxed">
                Since 2018, Sure Imports Limited has revolutionized the way
                businesses source products from China. What started as a vision
                to bridge the gap between African entrepreneurs and Chinese
                manufacturers has grown into a thriving global procurement
                platform.
              </p>

              <p className="leading-relaxed">
                Our team has transformed the global procurement landscape by
                building trust, ensuring quality, and providing seamless
                service. We've successfully remitted millions of dollars to
                suppliers and delivered hundreds of thousands of products
                worldwide, creating lasting partnerships across continents.
              </p>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-6">
                <h3 className="mb-3 flex items-center space-x-2 font-semibold text-white">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>Our Mission</span>
                </h3>
                <p className="text-gray-300">
                  To democratize global trade by providing businesses of all
                  sizes with access to high-quality Chinese products, reliable
                  suppliers, and exceptional service that drives their success
                  in the global marketplace.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Achievements */}
        <section>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Our Achievements
            </h2>
            <p className="text-lg text-gray-300">
              Building trust through consistent delivery and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <CardContent className="p-6 text-center">
                  <achievement.icon className="mx-auto mb-4 h-8 w-8 text-blue-400" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      {achievement.number}
                    </h3>
                    <p className="font-semibold text-blue-400">
                      {achievement.label}
                    </p>
                    <p className="text-sm text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Founder Section */}
        <section>
          <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl text-white">
                <Users className="h-6 w-6 text-blue-400" />
                <span>Meet Our Founder</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                {/* Founder Image */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block">
                    <div className="mx-auto h-80 w-64 overflow-hidden rounded-2xl bg-slate-800/50 shadow-2xl lg:mx-0">
                      <img
                        src={tochukwuImage as any}
                        alt="Tochukwu Nkwocha - Founder & CEO of Sure Imports"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                      Founder & CEO
                    </div>
                  </div>
                </div>

                {/* Founder Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      Tochukwu Nkwocha
                    </h3>
                    <p className="mb-4 font-semibold text-blue-400">
                      Founder & Chief Executive Officer
                    </p>

                    <div className="space-y-4 text-gray-300">
                      <p className="leading-relaxed">
                        Leading Sure Imports with visionary expertise, Tochukwu
                        has leveraged his background in digital
                        marketing—particularly Facebook and TikTok
                        advertising—to grow our user base to over 40,000
                        registered users since 2018.
                      </p>

                      <p className="leading-relaxed">
                        His unique combination of software development and
                        product management experience has been pivotal in
                        directing our development teams to enhance our product
                        sourcing platform, creating a seamless synergy between
                        technology and commerce.
                      </p>

                      <p className="leading-relaxed">
                        With strategic leadership spanning multiple countries
                        including China, the United Kingdom, and various African
                        nations, Tochukwu fosters international collaborations
                        that drive Sure Imports' global success.
                      </p>
                    </div>
                  </div>

                  {/* Social Media Influence */}
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                    <div className="mb-2 flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-purple-400" />
                      <span className="font-semibold text-white">
                        Digital Influence
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      With over 80,000 followers across social media platforms,
                      Tochukwu shares valuable insights on e-commerce, digital
                      strategy, and artificial intelligence to help businesses
                      thrive in the digital age.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills & Expertise */}
              <div className="space-y-4">
                <h4 className="flex items-center space-x-2 font-semibold text-white">
                  <Code className="h-5 w-5 text-green-400" />
                  <span>Expertise & Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {founderSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="border-green-500/20 bg-green-500/10 text-green-400"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Enthusiasm */}
              <div className="rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
                <div className="mb-3 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="font-semibold text-white">
                    AI Innovation
                  </span>
                </div>
                <p className="text-gray-300">
                  As an Artificial Intelligence enthusiast, Tochukwu actively
                  shares insights on how businesses and individuals can leverage
                  AI to improve operations and create a more prosperous world,
                  positioning Sure Imports at the forefront of technological
                  innovation.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Global Presence */}
        <section>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Global Presence
            </h2>
            <p className="text-lg text-gray-300">
              Strategically positioned across key markets for optimal service
              delivery
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {globalPresence.map((location, index) => (
              <Card
                key={index}
                className="border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <CardContent className="p-6 text-center">
                  <Globe className="mx-auto mb-4 h-8 w-8 text-blue-400" />
                  <div className="space-y-2">
                    <h3 className="font-bold text-white">{location.country}</h3>
                    <p className="text-sm font-semibold text-blue-400">
                      {location.role}
                    </p>
                    <p className="text-sm text-gray-400">{location.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision Statement */}
        <section>
          <Card className="border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardContent className="p-8 text-center">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Our Vision for the Future
              </h2>
              <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-300">
                To become the world's most trusted global procurement platform,
                where businesses of every size can access quality products,
                reliable suppliers, and innovative solutions that drive growth
                and success in an interconnected world.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
