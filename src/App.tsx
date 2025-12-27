/* eslint-disable react-native/no-inline-styles */
import { store } from '@redux/store';
import { configureGoogleSignIn } from 'features/auth/google/google.helper';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Root from './Root';

const App = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <Root />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
