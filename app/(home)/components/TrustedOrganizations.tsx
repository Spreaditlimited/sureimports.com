import Image from 'next/image';

const clients = [
  {
    name: 'Moppet',
    src: '/Moppet.PNG',
    logoClass: 'max-h-24 max-w-[240px] md:max-h-28 md:max-w-[300px]',
  },
  {
    name: 'Microware',
    src: '/Microware.PNG',
    logoClass: 'max-h-24 max-w-[240px] md:max-h-28 md:max-w-[300px]',
  },
  {
    name: 'Sterling',
    src: '/Sterling.PNG',
    logoClass: 'max-h-24 max-w-[240px] md:max-h-28 md:max-w-[300px]',
  },
  {
    name: 'CafeOne',
    src: '/cafeOne.PNG',
    logoClass: 'max-h-24 max-w-[220px] md:max-h-28 md:max-w-[270px]',
  },
  {
    name: 'Dr. Muibat Adeniran',
    src: '/Dr-Muibat-Adeniran-OBGYN-p.png',
    logoClass: 'max-h-24 max-w-[340px] md:max-h-28 md:max-w-[440px]',
  },
];

const marqueeClients = [...clients, ...clients];
const mobileLogoSlotClass =
  'flex h-36 w-[300px] shrink-0 items-center justify-center px-3 md:h-40 md:w-[390px]';
const desktopLogoSlotClass =
  'flex h-40 min-w-0 flex-1 items-center justify-center px-2';

export default function TrustedOrganizations() {
  return (
    <section
      aria-labelledby="trusted-organizations-title"
      className="bg-[#fcfcfd] pb-16 pt-4 dark:bg-slate-950 sm:pt-6"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="pt-10">
          <p
            id="trusted-organizations-title"
            className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
          >
            TRUSTED BY ORGANIZATIONS ACROSS NIGERIA
          </p>

          <div className="-mx-4 overflow-hidden sm:-mx-6 lg:hidden">
            <div className="mobile-logo-marquee flex w-max items-center px-4 sm:px-6">
              {marqueeClients.map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className={mobileLogoSlotClass}
                  aria-hidden={index >= clients.length}
                >
                  <Image
                    src={client.src}
                    alt={client.name}
                    width={360}
                    height={120}
                    sizes="(min-width: 768px) 330px, 260px"
                    className={`h-auto w-auto object-contain ${client.logoClass}`}
                    quality={100}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden items-center justify-center gap-3 lg:flex xl:gap-5">
            {clients.map((client) => (
              <div key={client.name} className={desktopLogoSlotClass}>
                <Image
                  src={client.src}
                  alt={client.name}
                  width={360}
                  height={120}
                  sizes="260px"
                  className={`h-auto w-auto object-contain ${client.logoClass}`}
                  quality={100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
