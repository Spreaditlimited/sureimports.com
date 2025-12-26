'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import Stores from '@/components/dashboard/procurement/stores';
import { useRouter } from 'next/navigation';
import CreateOrder from '../create-order/components/createOrder';
import type { Metadata } from 'next';
import { VideoIcon } from 'lucide-react';
import { useModal } from '@/app/context/ModalContext';
import Modal from '@/components/uix/ModalLarge';
import { useAuth } from '@/lib/AuthContext';

let titlex = 'Dashboard: General Procurement';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

function Procurement() {
  const { user } = useAuth();
  const router = useRouter();
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className="dark:bg-black">
        {/* MODAL VIEW STARTS */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <hr />
          <h2 className="p-3 text-3xl font-bold text-gray-700 dark:bg-black dark:text-white">
            (1) How to create Orders on SureImports
          </h2>
          <hr />
          <br />

          <div className="relative h-0 w-full pb-[56.25%]">
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${'qpUBdhmVK7c'}`}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* <div className="p-3 text-gray-700">
          <p>
            Scroll down to see <b>how and where to buy your orders</b>
          </p>
          <br />
        </div> */}

          <br />
          <br />
          <hr />

          <h2 className="p-3 text-3xl font-bold text-gray-700">
            (2) Where and How to Buy Authentic Designer Items
          </h2>
          <hr />
          <br />
          <div className="relative h-0 w-full pb-[56.25%]">
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${'zxkPU0ZCTlM'}`}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* <div className="p-3 text-gray-700">
          <p>Watch how you can create Orders on SureImports</p>
          <br />
        </div> */}

          <br />
          <br />
          <hr />

          <h2 className="p-3 text-3xl font-bold text-gray-700 dark:bg-black dark:text-white">
            (3) Import from 1688.com to the UK
          </h2>
          <hr />
          <br />
          <div className="relative h-0 w-full pb-[56.25%] dark:bg-black">
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${'nX5S-SIr_To'}`}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* <div className="p-3 text-gray-700">
          <p>Watch how you can create Orders on SureImports</p>
          <br />
        </div> */}
        </Modal>

        <div className="bg-slate-50 px-4 py-[25px] text-slate-800 dark:bg-black dark:text-white">
          <div className="flex flex-col gap-[25px]">
            <div className="flex flex-col justify-start xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-[8px] xl:w-[704px]">
                <div className="text-[22px] font-bold capitalize text-slate-800 dark:text-white">
                  {user?.userFirstname && 'Hi '} {user?.userFirstname}, Buy From
                  Chinese Websites
                </div>
                <p className="p-5 text-base font-normal text-slate-600 dark:text-gray-300 max-sm:py-4">
                  Visit any of the hundreds of e-commerce websites in China to
                  search for products. When you find what you want, create an
                  order for the products, we buy and ship to you.
                </p>
              </div>

              <Button
                type="button"
                onClick={openModal}
                className="inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl bg-white py-[15px] pr-3 text-base text-slate-600 hover:bg-[#161629]/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:mr-5 md:px-[30px] xl:w-[201px]"
              >
                <VideoIcon className="text-red-600" />
                Watch Video
              </Button>

              <div className="flex items-start gap-3 pt-3 md:flex-row xl:pt-0">
                <Button
                  onClick={() => {
                    router.push('/dashboard/procurement/view-orders/saved');
                  }}
                  className="inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl bg-white py-[15px] text-base text-slate-600 hover:bg-[#161629]/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:px-[30px] xl:w-[201px]"
                >
                  Visit saved orders
                </Button>

                <CreateOrder />
              </div>
            </div>

            <div className="mb-[20px] flex w-full justify-center rounded-[20px] border border-border bg-card shadow-sm">
              <div className="flex h-[60px] w-full items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold uppercase leading-[21px] text-slate-950 shadow dark:bg-black dark:text-white dark:shadow-gray-700">
                These are some of the stores we can buy products from…
              </div>
            </div>
          </div>
          <Stores />
        </div>
      </div>
    </>
  );
}

export default Procurement;
