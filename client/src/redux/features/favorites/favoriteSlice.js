import { createSlice } from "@reduxjs/toolkit";
const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      // Checking the item is not already in the favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },

    removeFromFavorites: (state, action) => {
      //   Removing the item with the matching id
      return state.filter((product) => product._id !== action.payload._id);
    },

    setFavorites: (state, action) => {
      // Setting the favorites from localStorage
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer; // favoriteReducer
