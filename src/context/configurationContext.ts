import { createContext, useContext } from 'react';
import { AppConfig } from '../types/interface/config';

export const ConfigurationContext = createContext<AppConfig | null>(null);
export const ConfigurationProvider = ConfigurationContext.Provider;

export const useConfiguration = () => {
  return useContext(ConfigurationContext);
};
