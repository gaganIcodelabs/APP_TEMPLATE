import { createContext, useContext } from 'react';

export const ConfigurationContext = createContext<any>(null);

export const ConfigurationProvider = ConfigurationContext.Provider;

export const useConfiguration = () => {
  return useContext(ConfigurationContext);
};
