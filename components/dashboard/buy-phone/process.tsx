'use client';
import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { VerifyIcon } from './Icons';
import './process.css';

function Process() {
  const settings = {
    dots: false,
    infinite: false,
    autoplay: true,
    fade: true, // Enable fade animation
    speed: 1000, // Speed of the fade effect
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          dots: true,
          arrows: false,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          arrows: false,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="process-slider mt-[20px] rounded-[16px] bg-gradient-to-r p-[25px]">
      <Slider {...settings}>
        {processData.map((process, index) => (
          <div key={index}>
            <div className="gap-3 md:flex">
              <VerifyIcon />
              <div className="grid">
                <h3 className="text-[20px] font-bold text-white">
                  {process.title}
                </h3>
                <p className="text-[15px] text-[#E2E8F0]">{process.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

const processData = [
  {
    title: '01: Rigorous Verification Process',
    desc: 'Each device undergoes comprehensive testing to ensure authenticity, functionality, and quality. ',
  },
  {
    title: '02: Network Compatibility Assurance',
    desc: "We guarantee that all phones are compatible with networks in the buyer's region, eliminating concerns about unsupported bands or carrier locks. ",
  },
  {
    title: '03: IMEI Verification',
    desc: "Thorough checks are conducted on each device's IMEI to confirm it is not blacklisted, stolen, or associated with outstanding financial obligations.",
  },
  {
    title: '04: Authentic Software',
    desc: 'All devices feature genuine, unmodified operating systems. Android phones come with proper Google services pre-installed. ',
  },
  {
    title: '05: Transparent Condition Grading',
    desc: 'We employ a clear, objective grading system for all devices, providing accurate descriptions of their condition. ',
  },
  {
    title: '06: Warranty and Customer Support',
    desc: 'Unlike direct purchases from overseas sellers, we offer warranty coverage and responsive after-sales support.',
  },
  {
    title: '07: Streamlined Communication',
    desc: 'Our team of experts provides clear, professional communication throughout the purchasing process. ',
  },
  {
    title: '08: Secure Payment Options',
    desc: 'We offer protected payment methods to ensure financial security for all transactions. ',
  },
  {
    title: '09: Efficient International Shipping',
    desc: 'Our service handles all aspects of international shipping, including potential customs issues.',
  },
  {
    title: '10: Bulk Solutions',
    desc: 'We provide specialized options for businesses requiring multiple devices, including volume pricing and enhanced support. ',
  },
];

export default Process;
