import { SafeAreaProvider } from 'react-native-safe-area-context';
import Root from './Root';

const App = () => {
  return (
    <SafeAreaProvider>
      {/* <Provider store={store}> */}
      <Root />
      {/* </Provider> */}
    </SafeAreaProvider>
  );
};

export default App;
