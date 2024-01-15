import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";
import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();

  //  access the favorites state from the redux store
  const favorites = useSelector((state) => state.favorites || []);

  // Check current product is already in the favorites
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    // Retrieve the favorites from the local storage
    const favorites = getFavoritesFromLocalStorage();

    // Dispatch action to update the redux store
    dispatch(setFavorites(favorites));
  }, [dispatch]);

  const toggleFavorite = () => {
    if (isFavorite) {
      // Remove the product from favorites
      dispatch(removeFromFavorites(product));
      // remove the product from the local storage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };
  return (
    <div
      onClick={toggleFavorite}
      className="absolute top-2 right-5 cursor-pointer"
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-white" />
      )}
    </div>
  );
};

export default HeartIcon;
