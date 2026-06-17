import Image from 'next/image';

const clients = [
  {
    name: 'Moppet',
    src: '/Moppet.PNG',
    frameClass: 'h-24 w-[220px] md:h-28 md:w-[280px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'Microware',
    src: '/Microware.PNG',
    frameClass: 'h-24 w-[240px] md:h-28 md:w-[310px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'Sterling',
    src: '/Sterling.PNG',
    frameClass: 'h-24 w-[220px] md:h-28 md:w-[280px]',
    imageClass: 'object-cover object-center',
  },
  {
    name: 'CafeOne',
    src: '/cafeOne.PNG',
    frameClass: 'h-24 w-[190px] md:h-28 md:w-[240px]',
    imageClass: 'object-cover object-center',
  },
];

const marqueeClients = [...clients, ...clients];
const logoSlotClass = 'flex w-[280px] shrink-0 items-center justify-center';

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

          <div className="-mx-4 overflow-hidden sm:-mx-6 md:hidden">
            <div className="mobile-logo-marquee flex w-max items-center gap-0 px-4 sm:px-6">
              {marqueeClients.map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className={logoSlotClass}
                >
                  <div className={`relative overflow-hidden ${client.frameClass}`}>
                    <Image
                      src={client.src}
                      alt={client.name}
                      fill
                      sizes="280px"
                      className={client.imageClass}
                      quality={100}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden items-center justify-items-center md:grid md:grid-cols-4 md:gap-x-6">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex w-full items-center justify-center"
              >
                <div
                  className={`relative max-w-full overflow-hidden ${client.frameClass}`}
                >
                  <Image
                    src={client.src}
                    alt={client.name}
                    fill
                    sizes="25vw"
                    className={client.imageClass}
                    quality={100}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
