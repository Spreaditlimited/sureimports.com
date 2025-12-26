import {
  Shield,
  Users,
  Calendar,
  Star,
  CheckCircle,
  Globe,
  Clock,
  Award,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description:
        'Every product is thoroughly inspected and verified before shipping to ensure you receive exactly what you ordered.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Trusted by 40,000+',
      description:
        'Join over 40,000 registered users who trust us for their importing needs from China.',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: Calendar,
      title: '7 Years of Experience',
      description:
        "Since 2018, we've been perfecting our import process and building strong relationships with suppliers.",
      color: 'from-green-500 to-blue-500',
    },
    {
      icon: Star,
      title: '4.7/5 Google Rating',
      description:
        'Our customers consistently rate us highly for our service quality and reliability.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Globe,
      title: 'Global Shipping',
      description:
        'We ship to any country worldwide with full tracking and insurance coverage.',
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description:
        'Quick order processing and efficient handling to get your products shipped faster.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { number: '40,000+', label: 'Registered Users', icon: Users },
    { number: '7', label: 'Years in Business', icon: Calendar },
    { number: '4.7/5', label: 'Google Rating', icon: Star },
    { number: '100+', label: 'Chinese Websites', icon: Globe },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Sure Imports?
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            We've built our reputation on trust, quality, and exceptional
            service. Here's why thousands of businesses choose us for their
            import needs.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="border-slate-700/50 bg-white/5 text-center backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-1 text-2xl font-bold text-white lg:text-3xl">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="group border-slate-700/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`h-12 w-12 bg-gradient-to-br ${feature.color} flex flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="mx-auto flex max-w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-700/50 bg-white/5 px-4 py-4 backdrop-blur-sm sm:inline-flex sm:flex-row sm:space-x-6 sm:space-y-0 sm:px-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300 sm:text-base">
                Verified Business
              </span>
            </div>
            <div className="hidden h-6 w-1 bg-slate-600 sm:block"></div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300 sm:text-base">
                Secure Payments
              </span>
            </div>
            <div className="hidden h-6 w-1 bg-slate-600 sm:block"></div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-300 sm:text-base">
                Industry Leader
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
