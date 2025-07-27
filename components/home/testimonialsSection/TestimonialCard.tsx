'use client';

import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  role,
  image,
  content,
  rating,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedContent =
    content.length > 150 ? content.substring(0, 150) + '...' : content;

  return (
    <div className="justify-top flex w-full grow flex-col rounded-xl bg-white p-9 max-md:mt-6 max-md:min-w-[300px] max-md:p-5 md:min-w-[600px]">
      <div className="flex flex-col max-md:max-w-full">
        <div className="flex w-full justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="flex gap-3">
            <div className="aspect-square h-12 w-12 shrink-0 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-[590] leading-6 text-neutral-950">
                {name}
              </div>
              <div className="text-sm leading-6 text-slate-400">{role}</div>
            </div>
          </div>
          <div className="my-auto flex gap-1 px-0.5">
            <RatingStars rating={rating} />
          </div>
        </div>
        <div className="mt-6 text-base leading-6 tracking-normal text-slate-600 max-md:max-w-full">
          {isExpanded ? content : truncatedContent}
          {content.length > 150 && (
            <button
              onClick={toggleReadMore}
              className="ml-2 text-blue-600 hover:underline max-md:ml-0"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
