import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

const teamMembers = [
  { name: 'Tochukwu', position: 'CEO', image: '/home/team/tm-tochukwu.jpeg' },
  {
    name: 'Favour',
    position: 'Head of Operations, Nigeria',
    image: '/home/team/tm-favour.jpeg',
  },
  {
    name: 'Alex',
    position: 'Head of China Operations',
    image: '/home/team/tm-alex.jpg',
  },
  {
    name: 'Joy',
    position: 'Product Sourcing, China',
    image: '/home/team/tm-joy.jpeg',
  },
  {
    name: 'Eric',
    position: 'Product Sourcing, China',
    image: '/home/team/tm-eric.jpeg',
  },
  {
    name: 'Kalhara',
    position: 'Head of Design, Sri Lanka',
    image: '/home/team/tm-kalhara.png',
  },
  {
    name: 'Ijeoma',
    position: 'Content Lead, Nigeria',
    image: '/home/team/tm-ijeoma.png',
  },
];

const TeamSection: React.FC = () => {
  return (
    <div className="mb-10 flex max-w-[951px] flex-col px-20 text-center max-md:px-10">
      <header className="flex w-full flex-col px-5 max-md:max-w-full">
        <h1 className="self-center text-4xl font-[860] capitalize text-slate-800">
          Our People Make Us Great
        </h1>
        <p className="mt-2 w-full text-base leading-6 tracking-normal text-slate-600">
          Meet the team behind Sure Importers Limited. Our dedicated
          professionals are committed to providing the best service and
          experience for our customers.
        </p>
      </header>
      <main className="mt-10 flex w-full flex-col gap-4 self-center max-md:max-w-full">
        {/* First Row */}
        <div className="flex justify-center">
          <Card className="my-5 rounded-3xl border-none shadow-xl transition-transform hover:scale-110">
            <div className="h-full">
              <div className="relative h-[375px] w-[300px]">
                <Image
                  loading="lazy"
                  src={teamMembers[0].image}
                  alt={teamMembers[0].name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl object-contain"
                  quality={100}
                />
              </div>
              <div className="bottom-0 w-full bg-opacity-50 py-2 text-center text-slate-800">
                <h2 className="text-lg font-bold">{teamMembers[0].name}</h2>
                <p className="text-base font-medium">
                  {teamMembers[0].position}
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* Second Row */}
        <div className="flex items-center justify-center gap-20 max-md:mt-10 max-md:flex-col">
          <Card className="flex w-[300px] justify-center rounded-3xl border-none shadow-xl transition-transform hover:scale-110 md:my-5">
            <div className="h-full self-center">
              <div className="relative h-[375px] w-[300px]">
                <Image
                  loading="lazy"
                  src={teamMembers[1].image}
                  alt={teamMembers[1].name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl object-contain"
                  quality={100}
                />
              </div>
              <div className="bottom-0 w-full bg-opacity-50 py-2 text-center text-slate-800">
                <h2 className="text-lg font-bold">{teamMembers[1].name}</h2>
                <p className="text-base font-medium">
                  {teamMembers[1].position}
                </p>
              </div>
            </div>
          </Card>
          {/* <Card className="flex w-[300px] justify-center rounded-3xl border-none shadow-xl transition-transform hover:scale-110 md:my-5">
            <div className="h-full self-center">
              <div className="relative h-[375px] w-[300px]">
                <Image
                  loading="lazy"
                  src={teamMembers[2].image}
                  alt={teamMembers[2].name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl object-contain"
                  quality={100}
                />
              </div>
              <div className="bottom-0 w-full bg-opacity-50 py-2 text-center text-slate-800">
                <h2 className="text-lg font-bold">{teamMembers[2].name}</h2>
                <p className="text-base font-medium">
                  {teamMembers[2].position}
                </p>
              </div>
            </div>
          </Card> */}
        </div>
        {/* Third Row */}
        <div className="flex items-center justify-center gap-20 max-md:mt-16 max-md:flex-col">
          <Card className="flex w-[300px] justify-center rounded-3xl border-none shadow-xl transition-transform hover:scale-110 md:my-5">
            <div className="h-full self-center">
              <div className="relative h-[375px] w-[300px]">
                <Image
                  loading="lazy"
                  src={teamMembers[3].image}
                  alt={teamMembers[3].name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl object-contain"
                  quality={100}
                />
              </div>
              <div className="bottom-0 w-full bg-opacity-50 py-2 text-center text-slate-800">
                <h2 className="text-lg font-bold">{teamMembers[3].name}</h2>
                <p className="text-base font-medium">
                  {teamMembers[3].position}
                </p>
              </div>
            </div>
          </Card>
          <Card className="flex w-[300px] justify-center rounded-3xl border-none shadow-xl transition-transform hover:scale-110 md:my-5">
            <div className="h-full self-center">
              <div className="relative h-[375px] w-[300px]">
                <Image
                  loading="lazy"
                  src={teamMembers[4].image}
                  alt={teamMembers[4].name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl object-contain"
                  quality={100}
                />
              </div>
              <div className="bottom-0 w-full bg-opacity-50 py-2 text-center text-slate-800">
                <h2 className="text-lg font-bold">{teamMembers[4].name}</h2>
                <p className="text-base font-medium">
                  {teamMembers[4].position}
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* Fourth Row */}
        <div className="flex items-center justify-center gap-20 max-md:mt-16 max-md:flex-col">
          <Card className="flex w-[300px] justify-center rounded-3xl border-none shadow-xl transition-transform hover:scale-110 md:my-5">
            <div className="h-full self-center">
              <div className="relative h-[375px] w-[300px]">
                <Image
                  loading="lazy"
                  src={teamMembers[5].image}
                  alt={teamMembers[5].name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl object-contain"
                  quality={100}
                />
              </div>
              <div className="bottom-0 w-full bg-opacity-50 py-2 text-center text-slate-800">
                <h2 className="text-lg font-bold">{teamMembers[5].name}</h2>
                <p className="text-base font-medium">
                  {teamMembers[5].position}
                </p>
              </div>
            </div>
          </Card>
          <Card className="flex w-[300px] justify-center rounded-3xl border-none shadow-xl transition-transform hover:scale-110 md:my-5">
            <div className="h-full self-center">
              <div className="relative h-[375px] w-[300px]">
                <Image
                  loading="lazy"
                  src={teamMembers[6].image}
                  alt={teamMembers[6].name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl object-contain"
                  quality={100}
                />
              </div>
              <div className="bottom-0 w-full bg-opacity-50 py-2 text-center text-slate-800">
                <h2 className="text-lg font-bold">{teamMembers[6].name}</h2>
                <p className="text-base font-medium">
                  {teamMembers[6].position}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeamSection;
