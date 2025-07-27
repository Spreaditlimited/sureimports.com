'use client';

import { useEffect, useState } from 'react';
import { GrNext } from 'react-icons/gr';
import { GrPrevious } from 'react-icons/gr';

const messages = [
  'spreaditglobal.com by Spreadit Limited is now sureimports.com.',
  'This new name captures more succinctly what we do.',
  'We look forward to serving you.',
];

const NotificationMessage = () => {
  const [currentMessage, setCurrentMessage] = useState<string>(messages[0]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      changeMessage((index + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [index]);

  const changeMessage = (newIndex: number) => {
    setIndex(newIndex);
    setCurrentMessage(messages[newIndex]);
  };

  const handleNext = () => {
    changeMessage((index + 1) % messages.length);
  };

  const handlePrev = () => {
    changeMessage((index - 1 + messages.length) % messages.length);
  };

  return (
    <div className="relative bg-gray-500 p-2 text-center text-white">
      <p>{currentMessage}</p>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded p-2 hover:bg-orange-500"
        onClick={handlePrev}
      >
        <GrPrevious />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded p-2 hover:bg-orange-700"
        onClick={handleNext}
      >
        <GrNext />
      </button>
    </div>
  );
};

export default NotificationMessage;
