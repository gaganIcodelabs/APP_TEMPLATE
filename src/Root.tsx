import { ConfigurationProvider } from '@context/configurationContext';
import AppNavigator from '@navigators/AppNavigator';
import AuthNavigator from '@navigators/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import {
  fetchAuthenticationState,
  isAuthenticatedSelector,
  logout,
  selectIsAuthenticated,
} from '@redux/slices/auth.slice';
import {
  appConfigSelector,
  fetchAppAssets,
} from '@redux/slices/hostedAssets.slice';
import { store, useAppDispatch, useTypedSelector } from '@redux/store';
import { useEffect } from 'react';
import { hideSplash } from 'react-native-splash-view';

const Root = () => {
  const dispatch = useAppDispatch();
  const config = useTypedSelector(appConfigSelector);
  const isAuthenticated = useTypedSelector(selectIsAuthenticated);

  // if (!i18n.isInitialized) {  // add this in useEffect
  //   await i18n.init();
  // }

  useEffect(() => {
    // dispatch(logout());
    dispatch(fetchAppAssets());
    // Start the authentication flow
    dispatch(fetchAuthenticationState());
    setTimeout(() => {
      const isAuthenticatedLocal = isAuthenticatedSelector(store.getState());
      if (isAuthenticatedLocal === null) {
        // if isAuthenticated is null, means authentication state is not fetched yet
        hideSplash();
      }
    }, 10000);
  }, [dispatch]);

  // Show loading while auth info or config is being processed
  if (isAuthenticated === null || !config) {
    return null; // or a loading component
  }

  return (
    <ConfigurationProvider value={config}>
      <NavigationContainer>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </ConfigurationProvider>
  );
};

export default Root;
