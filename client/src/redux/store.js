import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    // Using the reducerPath provided by apiSlice as the key
    [apiSlice.reducerPath]: apiSlice.reducer,
    //   sliceName : reducer func
    auth: authReducer, // authSlice
  },

  // Configuring middleware for the store
  middleware: (getDefaultMiddleware) =>
    // Concatenating additional middleware provided by apiSlice
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: true, // Enabling Redux DevTools for easier debugging
});

// Setting up listeners for the store to handle API query lifecycle events
setupListeners(store.dispatch);
