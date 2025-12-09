import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createInstance } from 'sharetribe-flex-sdk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ENV } from '../constants';
import rootReducer from './rootReducer';
import sharetribeTokenStore from './sharetribeTokenStore';

export const sdk = createInstance({
  clientId: ENV.SHARETRIBE_SDK_CLIENT_ID,
  tokenStore: sharetribeTokenStore({
    clientId: ENV.SHARETRIBE_SDK_CLIENT_ID,
  }),
  clientSecret: ENV.SHARETRIBE_SDK_CLIENT_SECRET,
});

// Root persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 0,
  whitelist: [], // Add slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: { extraArgument: sdk },
      immutableCheck: true,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const getState = store.getState;
export const persistor = persistStore(store);
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
