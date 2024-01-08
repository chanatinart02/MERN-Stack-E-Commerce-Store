import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../constants";

// configured with the base URL
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// Define a service using a base URL
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"], //  defined to categorize different types of entities.
  endpoints: () => ({}), //  an empty placeholder for specific API endpoints.
});
