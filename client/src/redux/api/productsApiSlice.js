import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants";

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetches products based on the search keyword
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: PRODUCT_URL,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    // Fetches a single product by (productId)
    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Fetches a list of all available products
    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/allproducts`,
    }),

    // Fetches detailed information of a single product by id
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: PRODUCT_URL,
        method: "POST",
        body: productData,
      }),
      invalidateTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, productData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: productData,
      }),
      invalidateTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidateTags: ["Product"],
    }),

    // Adds a review for a product
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    // Fetches the top-rated products
    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    // Fetches the newest products added
    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    // Uploads an image for a product and returns the URL of the uploaded image
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
} = productApiSlice;
