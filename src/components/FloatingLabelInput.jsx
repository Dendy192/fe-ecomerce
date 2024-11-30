import React, { useState } from "react";

const FloatingLabelInput = ({
  type = "text",
  id,
  label,
  error,
  props,
  onChange,
}) => {
  return (
    <>
      <div className="relative ">
        <input
          type={type}
          id={id}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
            error
              ? "border-red-500 focus:border-red-500 dark:border-red-500"
              : "border-gray-300 focus:border-black dark:border-gray-600"
          } appearance-none  dark:focus:border-black focus:outline-none focus:ring-0 peer`}
          placeholder=" "
          onChange={onChange} // Handling the onChange event
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute left-3  ${
            error ? "text-red-500" : "text-gray-600 dark:text-gray-600"
          } duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 ${
            error
              ? "peer-focus:text-red-500"
              : "peer-focus:text-black peer-focus:dark:text-black"
          } peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4`}
        >
          {label}
        </label>
      </div>
      {error && <p className="text-red-500 text-xs ">{error}</p>}
    </>
  );
};

export default FloatingLabelInput;
