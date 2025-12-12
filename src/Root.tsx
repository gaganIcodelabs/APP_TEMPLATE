import { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { colors, mergeColors } from './constants';
import { ConfigurationProvider } from './context/configurationContext';
import { fetchAppAssets } from './redux/slices/hostedAssets.slice';
import { store } from './redux/store';
import { hideSplash } from 'react-native-splash-view';
import { authInfo } from './redux/slices/auth.slice';
interface AppConfig {
  appConfig: any;
  colors: any;
}

const Root = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  const initializeApp = useCallback(async () => {
    try {
      // Wait for i18n to initialize if needed
      // if (!i18n.isInitialized) {
      //   await i18n.init();
      // }

      const res = await store.dispatch(fetchAppAssets()).unwrap();
      // console.log('res', JSON.stringify(res, null, 2))
      // if (res.appConfig) {
      //   // i18n.addResourceBundle(
      //   //   'en',
      //   //   'translation',
      //   //   mergeTranslations(res.translations),
      //   // );
      //   setConfig({
      //     appConfig: res.appConfig,
      //     colors: mergeColors(res.appConfig.branding || {}),
      //   });
      // }
    } catch (error) {
      console.error('App initialization failed:', error);
      // Fallback to default config if fetch fails
      setConfig({
        appConfig: {},
        colors: colors,
      });
    }
  }, []);

  useEffect(() => {
    initializeApp();
    setTimeout(() => {
      hideSplash();
    }, 5000);
  }, [initializeApp]);

  return (
    <ConfigurationProvider value={config?.appConfig}>
      <Text>Root</Text>
    </ConfigurationProvider>
  );
};

export default Root;
