import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { store } from './redux/store';
import { fetchAppAssets } from './redux/slices/hostedAssets.slice';
import { colors, mergeColors } from './constants';
import { ConfigurationProvider } from './context/configurationContext';

interface AppConfig {
  appConfig: any;
  colors: any;
}

const Root = () => {
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState<AppConfig | null>(null);

  const initializeApp = useCallback(async () => {
    try {
      // Wait for i18n to initialize if needed
      // if (!i18n.isInitialized) {
      //   await i18n.init();
      // }

      const res: any = await store.dispatch(fetchAppAssets()).unwrap();
      if (res.appConfig) {
        // i18n.addResourceBundle(
        //   'en',
        //   'translation',
        //   mergeTranslations(res.translations),
        // );
        setConfig({
          appConfig: res.appConfig,
          colors: mergeColors(res.appConfig.branding || {}),
        });
      }

      setIsReady(true);
    } catch (error) {
      console.error('App initialization failed:', error);
      // Fallback to default config if fetch fails
      setConfig({
        appConfig: {},
        colors: colors,
      });
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <ConfigurationProvider value={config?.appConfig}>
      <Text>Root</Text>
    </ConfigurationProvider>
  );
};

export default Root;
