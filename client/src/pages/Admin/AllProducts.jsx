import { Link } from "react-router-dom";
import moment from "moment";

import { useAllProductsQuery } from "../../redux/api/productsApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import { useEffect } from "react";

const AllProducts = () => {
  // Fetching all products
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();

  useEffect(() => {
    //   after update refetch data
    refetch();
  }, [refetch, products]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading products</div>;
  }
  return (
    <>
      <div className="container mx-[9rem]">
        <div className="flex flex-col md:flex-row">
          {/* Product List */}
          <div className="p-3">
            <div className="ml-[2rem] text-xl font-bold h-12">
              {/* Displaying the total number of products */}
              All Products ({products.length})
            </div>
            <div className="flex flex-wrap justify-around items-center">
              {/* Loop through each product and display relevant information */}
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block mb-4 overflow-hidden"
                >
                  <div className="flex">
                    {/* Product Image */}
                    <img
                      src={
                        product?.image ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"
                      }
                      alt={product.name}
                      className="w-[10rem] object-cover"
                    />
                    {/* Product Details */}
                    <div className="p-4 flex flex-col justify-around">
                      <div className="flex justify-between">
                        {/* Product Name */}
                        <h5 className="text-xl font-semibold mb-2">
                          {product?.name}
                        </h5>
                        {/* Product Creation Date */}
                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>
                      {/* Product Short Description */}
                      <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                        {product?.description?.substring(0, 160)}...
                      </p>
                      <div className="flex justify-between">
                        {/* Link to update the product */}
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                        >
                          Update Product
                          {/* Icon */}
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        {/* Product Price */}
                        <p>$ {product?.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Admin Menu Sidebar */}
          <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
