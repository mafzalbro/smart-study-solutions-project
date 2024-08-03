import { useState, useEffect } from 'react';
// import { useAuth } from '@/app/customHooks/AuthContext'; // Adjust the import path accordingly

const useAppState = () => {
  // const { isLoggedIn } = useAuth();
  // const loginStatus = localStorage.getItem('isLoggedIn')
  // const themeStatus = localStorage.getItem('themeStatus')
  // console.log({loginStatus, themeStatus})

  const [isLoggedIn, setIsLoggedIn] = useState('false');
  const [theme, setTheme] = useState('light');
  const [appState, setAppState] = useState({ theme, isLoggedIn });

// console.log({isLoggedIn, theme})

  useEffect(() => {
      const checkAppState = () => {
      const storedTheme = localStorage.getItem('theme') || 'light';
      const storedAuth = localStorage.getItem('isLoggedIn') || 'false';
      if (storedTheme !== appState.theme || storedAuth !== appState.isLoggedIn) {
        setAppState({ theme: storedTheme, isLoggedIn: storedAuth });
      }
    };

    // const handleStorageChange = () => {
    //   checkAppState();
    // };

    // Check initial state
    checkAppState();

    // window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(checkAppState, 5000);

    return () => {
      clearInterval(interval); // Cleanup on component unmount
      // window.removeEventListener('storage', handleStorageChange);
    };
  }, [appState, isLoggedIn]);

  return appState;
};

export default useAppState;