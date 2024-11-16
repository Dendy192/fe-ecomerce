import React from "react";

const PriceFormatter = ({ price }) => {
  // Format the price to Indonesian Rupiah (IDR)
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  }).format(price);

  return <span>{formattedPrice}</span>;
};

export default PriceFormatter;
