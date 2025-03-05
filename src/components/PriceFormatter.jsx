import React from "react";

const PriceFormatter = ({ price, className = "" }) => {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return className ? (
    <span className={className}>{formattedPrice}</span>
  ) : (
    <span>{formattedPrice}</span>
  );
};

export default PriceFormatter;
