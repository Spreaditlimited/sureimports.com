export const getAffiliateReference = (): string | null => {
  // Try to get from cookie first
  if (typeof document !== 'undefined') {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('affRef='))
      ?.split('=')[1];
    
    if (cookieValue) {
      return cookieValue;
    }
    
    // Fallback to localStorage
    const localStorageValue = localStorage.getItem('affRef');
    const timestamp = localStorage.getItem('affRefTimestamp');
    
    // Check if localStorage value is not older than 30 days
    if (localStorageValue && timestamp) {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      if (parseInt(timestamp) > thirtyDaysAgo) {
        return localStorageValue;
      }
    }
  }
  
  return null;
};

export const clearAffiliateReference = (): void => {
  if (typeof document !== 'undefined') {
    // Clear cookie
    document.cookie = 'affRef=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.sureimports.com;';
    
    // Clear localStorage
    localStorage.removeItem('affRef');
    localStorage.removeItem('affRefTimestamp');
  }
};