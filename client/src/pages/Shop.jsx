import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useGetFilteredProductsQuery } from "../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/catApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const [priceFilter, setPriceFilter] = useState(""); // price input

  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    // Check if there are no selected categories (checked) or no selected price range (radio)
    if (!checked.length || !radio.length) {
      // If filteredProductsQuery is not in a loading state, proceed to filter the products
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both, checked categories and radio (price filter)
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              // if the product's price as a string contains the priceFilter value
              product.price.toString().includes(priceFilter) ||
              // if the product's price as a number is equal to the parsed integer of priceFilter
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        // Dispatch action to update the products state with the filtered products
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [filteredProductsQuery.data, checked, radio, priceFilter, dispatch]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updateChecked = value
      ? [...checked, id]
      : checked.filter((item) => item !== id);
    dispatch(setChecked(updateChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row ml-[50px]">
          {/* Left side Filters container */}
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Categories
            </h2>
            {/* Categories Filter Checkbox Options */}
            <div className="p-5 w-[15rem]">
              {categories?.map((category) => (
                <div key={category._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) =>
                        handleCheck(e.target.checked, category._id)
                      }
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded accent-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {/* Category name of Checkbox */}
                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {category.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter by brands */}
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <>
                  <div className="flex items-enter mr-4 mb-5">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 accent-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:outline-none"
                    />

                    <label
                      htmlFor="pink-radio"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {brand}
                    </label>
                  </div>
                </>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filer by Price
            </h2>
            {/* Filter by price */}
            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:border-pink-600 focus:ring-pink-500 focus:ring-opacity-50"
              />
            </div>
            {/* Reset all filters options */}
            <div className="p-5 pt-0">
              <button
                className="w-full border my-4"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right side Show all products & Filter products */}
          <div className="p-3">
            {/* Number of products */}
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            {/* Show all products cards or filtered products */}
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
