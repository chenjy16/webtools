import { useState, useEffect } from 'react';

/**
 * Custom hook for storing and retrieving data from localStorage
 * @param {string} key - localStorage key name
 * @param {any} initialValue - initial value
 * @returns {Array} - [storedValue, setValue] tuple
 */
const useLocalStorage = (key, initialValue) => {
  // Get initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;