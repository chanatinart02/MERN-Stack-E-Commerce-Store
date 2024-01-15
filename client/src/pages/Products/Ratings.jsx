import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  // Calculate the number of full stars by rounding down the value
  const fullStars = Math.floor(value);
  // Calculate if there is a half star by checking if the value has a fraction greater than 0.5
  const haftStars = value - fullStars > 0.5 ? 1 : 0;
  // Calculate the number of empty stars by subtracting the number of full and half stars from 5
  const emptyStar = 5 - fullStars - haftStars;

  return (
    <div className="flex items-center">
      {/* Display the full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`text-${color} ml-1`} />
      ))}
      {/* Display a half star if haftStars is 1 */}
      {haftStars === 1 && <FaStarHalfAlt className={`text-${color} ml-1`} />}
      {/* Display the empty stars */}
      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={index} className={`text-${color} ml-1`} />
      ))}
      {/* Display the rating text next to the stars */}
      <span className={`rating-text ml-2 text-${color}`}>{text && text}</span>
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
