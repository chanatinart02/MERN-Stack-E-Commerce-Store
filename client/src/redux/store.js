import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import favoriteReducer from "./features/favorites/favoriteSlice";
import cartReducer from "./features/cart/cartSlice";
import shopReducer from "./features/shop/shopSlice";
import { getFavoritesFromLocalStorage } from "../Utils/localStorage";

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    // Using the reducerPath provided by apiSlice as the key
    [apiSlice.reducerPath]: apiSlice.reducer,
    //   sliceName : reducer func
    auth: authReducer, // authSlice
    favorites: favoriteReducer,
    cart: cartReducer,
    shop: shopReducer,
  },
  // initial state for all slices (option)
  preloadedState: {
    favorites: initialFavorites,
  },

  // Configuring middleware for the store
  middleware: (getDefaultMiddleware) =>
    // Concatenating additional middleware provided by apiSlice
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
