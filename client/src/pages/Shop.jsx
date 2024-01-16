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

const Shop = () => {
  const [priceFilter, setPriceFilter] = useState("");

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
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Categories
            </h2>
            {/* Categories Filter Checkbox Options */}
            <div className="p-5 w-[15rem]">
              {categories?.map((category) => (
                <div key={category._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) =>
                        handleCheck(e.target.checked, category._id)
                      }
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
