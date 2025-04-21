// store.ts or redux/store.ts
import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from '../slices'; // Make sure this combines your slices

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // ✅ use AsyncStorage for React Native
  whitelist: ['modal', 'theme'], // ✅ list of slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

const persistor = persistStore(store);

export {store, persistor};
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
