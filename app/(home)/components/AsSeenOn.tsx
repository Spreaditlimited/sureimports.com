import Image from "next/image";


export default function AsSeenOn() {
  const mediaLogos = [
    {
      name: "TechPoint",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80",
      alt: "TechPoint Logo"
    },
    {
      name: "The Guardian",
      logo: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80",
      alt: "The Guardian Nigeria Logo"
    },
    {
      name: "Punch",
      logo: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Punch Newspapers Logo"
    },
    {
      name: "TechCabal",
      logo: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80",
      alt: "TechCabal Logo"
    },
    {
      name: "This Day",
      logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80",
      alt: "This Day Newspaper Logo"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm font-medium tracking-wide uppercase mb-4">
            As Featured In
          </p>
          <h2 className="text-xl text-gray-300">
            Trusted by Media and Recognized by Industry Leaders
          </h2>
        </div>

        {/* Media Logos Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
          {mediaLogos.map((media, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group"
            >
              <Image
                src={media.logo}
                alt={media.alt}
                width={120}
                height={32}
                unoptimized
                className="h-8 w-auto max-w-[120px] object-contain opacity-70 group-hover:opacity-90 transition-opacity duration-300 filter grayscale hover:grayscale-0"
              />
            </div>))};
        </div>

        {/* Additional Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-800/50">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Featured in 10+ Publications</span>
          </div>
          <div className="hidden sm:block w-1 h-4 bg-slate-700"></div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm">Industry Recognition Since 2018</span>
          </div>
          <div className="hidden sm:block w-1 h-4 bg-slate-700"></div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-sm">Leading Import Service Provider</span>
          </div>
        </div>
      </div>
    </section>
  );
}