import Image from 'next/image';

export default function AsSeenOn() {
  const mediaLogos = [
    {
      name: 'TechPoint',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'TechPoint Logo',
    },
    {
      name: 'The Guardian',
      logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'The Guardian Nigeria Logo',
    },
    {
      name: 'Punch',
      logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Punch Newspapers Logo',
    },
    {
      name: 'TechCabal',
      logo: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'TechCabal Logo',
    },
    {
      name: 'This Day',
      logo: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=60&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'This Day Newspaper Logo',
    },
  ];

  return (
    <section className="border-b border-slate-800/50 bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-400">
            As Featured In
          </p>
          <h2 className="text-xl text-gray-300">
            Trusted by Media and Recognized by Industry Leaders
          </h2>
        </div>

        {/* Media Logos Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {mediaLogos.map((media, index) => (
            <div
              key={index}
              className="group flex items-center justify-center rounded-lg border border-slate-700/30 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50"
            >
              <Image
                src={media.logo}
                alt={media.alt}
                width={120}
                height={32}
                className="h-8 w-auto max-w-[120px] object-contain opacity-70 grayscale filter transition-opacity duration-300 hover:grayscale-0 group-hover:opacity-90"
              />
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-8 flex flex-col items-center justify-center gap-6 border-t border-slate-800/50 pt-6 sm:flex-row">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
            <span className="text-sm">Featured in 10+ Publications</span>
          </div>
          <div className="hidden h-4 w-1 bg-slate-700 sm:block"></div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            <span className="text-sm">Industry Recognition Since 2018</span>
          </div>
          <div className="hidden h-4 w-1 bg-slate-700 sm:block"></div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
            <span className="text-sm">Leading Import Service Provider</span>
          </div>
        </div>
      </div>
    </section>
  );
}
