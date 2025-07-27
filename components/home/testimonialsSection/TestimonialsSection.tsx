import * as React from 'react';
import TestimonialCard from './TestimonialCard';
import { TESTIMONIALS1, TESTIMONIALS2 } from './testimonials';

const TestimonialsSection: React.FC = () => (
  <section className="flex w-full flex-col overflow-x-hidden bg-slate-100 py-20 max-md:max-w-full">
    <div className="flex w-[626px] max-w-full flex-col self-center px-5 text-center">
      <h3 className="text-4xl font-[860] capitalize text-slate-800 max-md:max-w-full">
        What our customers are saying
      </h3>
      <p className="mt-2 text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
        We serve customers all over the world and they have only good things to
        say about us.
      </p>
    </div>
    <div className="group mt-14 px-5 max-md:mt-10 max-md:max-w-full">
      <div className="group-hover:pause-animation flex animate-marquee-left gap-5 max-xl:animate-marquee-left-lg max-md:animate-marquee-left-sm max-md:gap-3">
        {TESTIMONIALS1.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </div>
    <div className="group mt-6 px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex animate-marquee-right gap-5 max-xl:animate-marquee-right-lg max-md:animate-marquee-right-sm max-md:gap-3">
        {TESTIMONIALS2.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
