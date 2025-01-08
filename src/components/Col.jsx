// Col.js
import React from "react";
// xs={12} sm={6} md={4} lg={3}
const Col = ({
  xs = 12,
  sm = 6,
  md = 4,
  lg = 3,
  xl,
  children,
  className = "",
  ...props
}) => {
  // Helper function to get Tailwind width classes based on the column size
  const getColWidth = (size) => (size ? `w-${size}/12` : "w-full");

  return (
    <div
      className={`${getColWidth(xs)} ${sm ? `sm:${getColWidth(sm)}` : ""} ${
        md ? `md:${getColWidth(md)}` : ""
      } ${lg ? `lg:${getColWidth(lg)}` : ""} ${
        xl ? `xl:${getColWidth(xl)}` : ""
      } px-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Col;
