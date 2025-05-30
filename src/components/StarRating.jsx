import { useState } from "react";
import { IoMdStar } from "react-icons/io";
const StarRating = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          <label>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
            <IoMdStar
              key={i}
              className="star"
              size={100}
              color={ratingValue <= (hover || rating) ? "#2B2073" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
      <p>Rating is: {rating}</p>
    </div>
  );
};

export default StarRating;
