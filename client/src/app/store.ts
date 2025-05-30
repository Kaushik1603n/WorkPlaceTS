import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import clientProfileReducer from "../features/clientFeatures/profile/clientProfileSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage  from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  clientProfile: clientProfileReducer,
});
// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Export types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;