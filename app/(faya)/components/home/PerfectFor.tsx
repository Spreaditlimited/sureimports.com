'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import gadgetSeller from '@/public/assets/img/perfect/gadget-sellers.png';
import retail from '@/public/assets/img/perfect/retail-outlets.png';
import mobile from '@/public/assets/img/perfect/mobile.png';
import mobileTechmicians from '@/public/assets/img/perfect/mobile-technicians.png';
import Image from 'next/image';
import Button from '../global/Button';
import { motion } from 'framer-motion';

export default function PerfectFor() {
  const slides = [
    {
      img: gadgetSeller,
      title: 'Gadget sellers',
    },
    {
      img: retail,
      title: 'Retail outlets',
    },
    {
      img: mobile,
      title: 'Online stores',
    },

    {
      img: mobileTechmicians,
      title: 'Mobile technicians',
    },
  ];

  return (
    <section className="sm:py-15 xl:py-30 bg-white py-[50px]">
      <div className="container">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gradient-dark mx-auto w-fit text-center text-[32px] font-semibold leading-[131%] md:text-[42px] md:leading-[152%]"
        >
          Perfect for:
        </motion.h3>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mb-[30px] mt-6 w-fit max-w-full"
        >
          <Swiper
            modules={[Pagination]}
            spaceBetween={0}
            slidesPerView="auto"
            pagination={{ el: '.custom-pagination', clickable: true }}
            className="custom-swiper"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide
                key={idx}
                className="mx-2.5 my-5 !w-auto rounded-[15px] border border-[#F4F4F4] bg-white sm:mx-5"
                style={{
                  boxShadow: '10px 10px 10px 0px rgba(0, 0, 0, 0.08)',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="w-[170px] md:w-[294px]"
                >
                  <Image
                    src={slide.img}
                    alt=""
                    className="max-w-full rounded-[15px]"
                  />
                  <h4 className="mb-6 mt-5 text-center text-[16px] font-semibold text-[var(--dark-color)] sm:text-[20px]">
                    {slide.title}
                  </h4>
                </motion.div>
              </SwiperSlide>
            ))}
            <div className="custom-pagination mt-4 flex justify-center gap-2"></div>
          </Swiper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button href="/faya#buy-now">Buy Now</Button>
        </motion.div>
      </div>
    </section>
  );
}
