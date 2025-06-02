import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import clientProfileReducer from "../features/clientFeatures/profile/clientProfileSlice"
import freelancerProfileSlice from "../features/freelancerFeatures/profile/freelancerProfileSlice"
import usersProfileDataSlice from "../features/admin/users/usersSlice"
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
  freelancerProfile: freelancerProfileSlice,
  userData: usersProfileDataSlice,
});
// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","clientProfile","freelancerProfile"],
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