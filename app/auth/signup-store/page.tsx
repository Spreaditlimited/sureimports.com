import React from 'react';
import SignUpStoreForm from './components/SignUpStoreForm';
import type { Metadata } from 'next';

let titlex = 'SignUp Page';
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

const SignUpFormx = () => {
  return (
    <div>
      <SignUpStoreForm />
    </div>
  );
};

export default SignUpFormx;
