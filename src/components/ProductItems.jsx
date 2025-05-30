import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import PriceFormatter from "./PriceFormatter";
import Loading from "./Loading";
import StarsRatingDisplay from "./StarsRatingDisplay";

const ProductItems = ({ id, image, name, price, rating }) => {
  const { currency } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleProductClick = () => {
    setLoading(true); // Set loading to true when the link is clicked

    navigate(`/product/${id}`); // Navigate to the product page

    window.scrollTo(0, 0);
    setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 1000);
  };
  if (loading) return <Loading />;
  return (
    <Link
      className="text-grey-700 cursor-pointer"
      to={`/product/${id}`}
      onClick={handleProductClick}
    >
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out max-w-[300px] max-h-[300px] w-full h-auto object-cover"
          src={image[0]}
          alt=""
        />
      </div>
      <div className="pb-1 pt-1">
        <StarsRatingDisplay rating={rating} size="small" />
        <p className=" text-sm">{name}</p>
      </div>

      <p className="text-sm font-medium">
        <PriceFormatter price={price} />
      </p>
    </Link>
  );
};

export default ProductItems;
