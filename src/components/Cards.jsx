// src/Card.js
import React from "react";

const Cards = ({ header, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-4 w-full">
      {/* Conditionally render the header only if it is provided */}
      {header && (
        <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">{header}</h2>
        </div>
      )}
      <div className="p-0">
        {children} {/* Render the children passed to the Card */}
      </div>
    </div>
  );
};

export default Cards;
