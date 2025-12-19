import { createContext, useContext } from 'react';
import { AppConfig } from '@redux/slices/hostedAssets.slice';

export const ConfigurationContext = createContext<AppConfig | undefined>(
  undefined,
);

export const ConfigurationProvider = ConfigurationContext.Provider;

export const useConfiguration = () => {
  return useContext(ConfigurationContext);
};
