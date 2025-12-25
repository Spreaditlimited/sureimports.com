'use client';

import { useEffect } from 'react';

export const AffiliateTracker = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const affRef = urlParams.get('affRef');
    
    if (affRef) {
      // Set cookie for 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      document.cookie = `affRef=${affRef}; expires=${expiryDate.toUTCString()}; path=/; domain=.sureimports.com; secure; sameSite=lax`;
      
      // Optional: Store in localStorage as backup
      localStorage.setItem('affRef', affRef);
      localStorage.setItem('affRefTimestamp', Date.now().toString());
      
      console.log('Affiliate reference tracked:', affRef);
    }
  }, []);

  return null;
};
