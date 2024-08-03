"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import useAppState from '@/app/customHooks/useAppState';
const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const appState = useAppState();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
        
  }, [appState.isLoggedIn, appState.theme]);

  return (
    <AppStateContext.Provider value={appState}>
      <div key={key}>
        {children}
      </div>
    </AppStateContext.Provider>
  );
};

export const useAppStateContext = () => useContext(AppStateContext);
