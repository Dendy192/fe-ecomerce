import React, { useState } from "react";

const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  error,
  props,
  onChange,
  width = "w-full",
  className = "",
}) => {
  return (
    <>
      <input
        type={type}
        className={`${width} px-3 py-2 border ${
          error ? "border-red-600" : "border-gray-800"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </>
  );
};

export default Input;
