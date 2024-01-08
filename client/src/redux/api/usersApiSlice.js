// Injecting User API Endpoints
import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

// injectEndpoints used to extend the existing API slice (apiSlice) with additional endpoints(user endpoint).
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
  }),
});

//  auto-generated based on the defined endpoints
// Ex.`use${Login}Mutation`
export const { useLoginMutation, useLogoutMutation } = userApiSlice;
