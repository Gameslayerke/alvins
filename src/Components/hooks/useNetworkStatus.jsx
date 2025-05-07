import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return;

    const handleChange = () => {
      // Consider slow if effectiveType is 2g or saveData is enabled
      setIsSlow(connection.effectiveType === 'slow-2g' || connection.saveData);
    };

    // Set initial state
    handleChange();

    // Listen for changes
    connection.addEventListener('change', handleChange);

    return () => {
      connection.removeEventListener('change', handleChange);
    };
  }, []);

  return isSlow;
};

export default useNetworkStatus;