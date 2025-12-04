/**
 * useDebounce Hook
 * Custom hook for debouncing values
 */

import { useState, useEffect } from 'react';
import { UI } from '../config/constants';

export const useDebounce = (value, delay = UI.DEBOUNCE_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
