import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setup, wrapComponent } from './util/log';
import { ENV } from './constants/env';
import Root from './Root';

// Initialize logging and error tracking only if Sentry DSN is provided
if (ENV.SENTRY_DSN) {
  setup();
}

const App = () => {
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

export default wrapComponent(App);
