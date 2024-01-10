// Injecting User API Endpoints
import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

// injectEndpoints used to extend the existing API slice (apiSlice) with additional endpoints(user endpoint).
// Ex. http://localhost:5173/api/users/auth for login
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //   adds endpoint with a mutation query for user auth.
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // Update profile
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

//  auto-generated based on the defined endpoints
// Ex.`use${Login}Mutation`
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
} = userApiSlice;
