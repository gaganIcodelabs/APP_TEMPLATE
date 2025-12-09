import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { store } from './redux/store';
import { fetchAppAssets } from './redux/slices/hostedAssets.slice';
import { colors, mergeColors } from './constants';
import { ConfigurationProvider } from './context/configurationContext';
import { AppConfig, FetchAppAssetsResponse } from './types/interface/config';

// interface AppConfig {
//   appConfig: any;
// }

const Root = () => {
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState<AppConfig | null>(null);

  const initializeApp = useCallback(async () => {
    try {
      // Wait for i18n to initialize if needed
      // if (!i18n.isInitialized) {
      //   await i18n.init();
      // }

      const res: FetchAppAssetsResponse = await store
        .dispatch(fetchAppAssets())
        .unwrap();
      // console.log('res', JSON.stringify(res));
      if (res.appConfig) {
        // i18n.addResourceBundle(
        //   'en',
        //   'translation',
        //   mergeTranslations(res.translations),
        // );
        setConfig(res.appConfig);
      }

      setIsReady(true);
    } catch (error) {
      console.error('App initialization failed:', error);
      // Fallback to default config if fetch fails
      setConfig(null);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <ConfigurationProvider value={config}>
      <Text style={{ marginTop: 100 }}>Root</Text>
    </ConfigurationProvider>
  );
};

export default Root;
