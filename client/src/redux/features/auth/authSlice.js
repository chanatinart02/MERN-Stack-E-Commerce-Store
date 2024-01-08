// Create auth action
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  // Checking and retrieving user info from localStorage, defaulting to null if not set
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  // Name of the slice, used as a prefix for generated action types
  name: "auth",
  initialState,
  //  define actions and their corresponding state mutations
  reducers: {
    // Action to set user credentials in state and localStorage
    setCredentials: (state, action) => {
      // Updating userInfo in state with payload from the action
      state.userInfo = action.payload;
      // Storing user info in localStorage as a JSON string
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },

    // Action to log out and clear user info from state and localStorage
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

// action creators
export const { setCredentials, logout } = authSlice.actions;

// The reducer function generated by createSlice
export default authSlice.reducer; // authReducer