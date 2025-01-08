import React from "react";

const Row = ({ children, className = "", ...props }) => {
  return (
    <div className={`flex flex-wrap  w-full  ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Row;
