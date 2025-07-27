'use client';

import React, { useState, useEffect } from 'react';

const TopNotificationStrip: React.FC = () => {
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has seen the notification before
    const hasSeenNotification = localStorage.getItem('hasSeenNotification6');
    if (!hasSeenNotification) {
      setShowNotification(true);
    }
  }, []);

  const handleCloseNotification = () => {
    setShowNotification(false);
    // Store the fact that the user has seen the notification
    localStorage.setItem('hasSeenNotification6', 'true');
  };

  return (
    <>
      {showNotification && (
        <div className="flex items-center justify-between bg-slate-700 px-7 py-7 text-xs text-white lg:text-base">
          <div>
            <strong>NOTICE: </strong>
            <b>spreaditglobal.com</b> by <b>Spreadit Limited</b> is now{' '}
            <b>sureimports.com.</b>
            This new name captures more succinctly what we do. We look forward
            to serving you.
          </div>

          <button
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            onClick={handleCloseNotification}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default TopNotificationStrip;
