{
  /*IMPORT PRODUCTS IMAGES*/
}
import greeting_cards from '@/public/assets/images/png/product_images/GREETING-CARDS.png';
import branded_mugs from '@/public/assets/images/png/product_images/BRANDED-MUGS.png';
import business_cards from '@/public/assets/images/png/product_images/BUSINESS-CARDS.png';
import calendar from '@/public/assets/images/png/product_images/CALENDAR.png';
import feather_banner from '@/public/assets/images/png/product_images/FEATHER-BANNER.png';
import gift_bags from '@/public/assets/images/png/product_images/GIFT-BAGS.png';
import letterhead from '@/public/assets/images/png/product_images/LETTER-HEAD.png';
import magazine from '@/public/assets/images/png/product_images/MAGAZINE.png';
import product_packaging from '@/public/assets/images/png/product_images/PRODUCT-PACKAGING.png';
import roullup_banner from '@/public/assets/images/png/product_images/ROLLUP-BANNER.png';

const popularCategories = [
  {
    id: 1,
    category: 'BUSINESS_CARDS',
    title: 'Business Cards (Two Sided)',
    slug: 'business-cards',
    price: 20000,
    moq: 100,
    priceInfo: '₦20,000 per 100',
    generalInfo: 'Takes 3-5 Business days',
    description:
      'Create beautiful Business Cards for your brand at affordable cost.',
    image: business_cards,
  },
  {
    id: 2,
    category: 'BANNERS',
    title: 'Rollup Banner (Large Size)',
    slug: 'rollup-banner',
    price: 65000,
    moq: 1,
    priceInfo: '₦65,000 per 1',
    generalInfo: 'Takes 3-5 Business days',
    description:
      'Create Professional and beautiful Rollup Banners for your events at affordable cost.',
    image: roullup_banner,
  },
  {
    id: 3,
    category: 'DOCUMENTS',
    title: 'Letter Head (Coloured)',
    slug: 'letter-head',
    price: 80000,
    moq: 100,
    priceInfo: '₦80,000 per 100',
    generalInfo: 'Takes 3-5 Business days',
    description:
      'Up your professional game with our exotic branded envelopes. Send those letters with style',
    image: letterhead,
  },
  {
    id: 4,
    category: 'CALENDERS',
    title: 'Calenders (Large)',
    slug: 'calenders',
    price: 150000,
    moq: 100,
    priceInfo: '₦150,000 per 100',
    generalInfo: 'Takes 3-5 Business days',
    description:
      'Gift your clients, family and friends calenders and stay on their miind all year round.',
    image: calendar,
  },
  {
    id: 5,
    category: 'MUG_BRANDING',
    title: 'Branded Mugs',
    slug: 'branded-mugs',
    price: 3500,
    moq: 1,
    priceInfo: '₦3,500 per 1',
    generalInfo: 'Takes 3-5 Business days',
    description:
      'Brand your custom designed Mugs with unique designs for special occasions, fully custom deisgn.',
    image: branded_mugs,
  },
  {
    id: 6,
    category: 'GIFT_BAGS_PAPER',
    title: 'Gift Bags',
    slug: 'gift-bags',
    price: 100000,
    moq: 100,
    priceInfo: '₦100,000 per 100',
    generalInfo: 'Takes 3-5 Business days',
    description:
      'Get your professionally produced Gift Bags for your product packaging with our exotic design.',
    image: gift_bags,
  },
  {
    id: 7,
    category: 'GREETING_CARDS',
    title: 'Greeting Cards',
    slug: 'greetings-cards',
    price: 7000,
    moq: 1,
    priceInfo: '₦7,000 per 1',
    generalInfo: 'Takes 3-5 Business days',
    description:
      "Greeting Cards are unique for special seasons, let's create one that is captivating for your clients.",
    image: greeting_cards,
  },
  {
    id: 8,
    category: 'BANNERS',
    title: 'Feather Banner (Large)',
    slug: 'feather-banner',
    price: 60000,
    moq: 1,
    priceInfo: '₦60,000 per 1',
    generalInfo: 'Takes 3-5 Business days',
    description:
      'Create special flying banners for your special occassions at a very affordable cost, with high quality stands.',
    image: feather_banner,
  },
];

export default popularCategories;
