import { Rating } from "@mui/material";
import React from "react";
import { FaStar } from "react-icons/fa";

const StarsRatingDisplay = ({ rating, size = "large" }) => {
  return (
    // <div className="flex gap-1">
    //   {[...Array(maxStars)].map((_, index) => {
    //     const fill = Math.min(Math.max(rating - index, 0), 1); // Clamp between 0 and 1

    //     return (
    //       <div key={index} className="relative w-6 h-6">
    //         {/* Gray base star */}
    //         <FaStar className="absolute text-gray-500 w-full h-full" />

    //         {/* Gold clipped overlay */}
    //         <div
    //           className="absolute top-0 left-0 h-full overflow-hidden"
    //           style={{ width: `${fill * 100}%` }}
    //         >
    //           <FaStar className="text-yellow-400 w-full h-full" />
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
    <Rating
      name="half-rating-read"
      defaultValue={rating}
      precision={0.1}
      readOnly
      size={size}
    />
  );
};

export default StarsRatingDisplay;
