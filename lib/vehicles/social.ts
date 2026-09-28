const LANDING_IMAGE =
  'https://res.cloudinary.com/djprcwnsz/image/upload/v1790613676/sureimports/vehicles/social/cars-social-v1.png';

export function vehicleSocialImage(image = LANDING_IMAGE) {
  // Keep the whole vehicle visible and serve a predictable JPEG to share crawlers.
  return image.replace(
    '/image/upload/',
    '/image/upload/c_pad,w_1200,h_630,b_rgb:f6f7fc/f_jpg,q_85/',
  );
}

export const carsSocialImage = {
  url: vehicleSocialImage(),
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'Sure Imports — electric vehicles from China to Nigeria, featuring a Ruichi passenger van and cargo truck',
};
