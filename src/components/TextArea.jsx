import React from "react";

const TextArea = ({ placeholder = "", value = "", error, props, onChange }) => {
  return (
    <>
      <textarea
        className={`w-full px-3 py-2 border ${
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

export default TextArea;
