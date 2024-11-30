import React, { useState } from "react";

const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  onBlur,
  errorMessage = "This field is required",
  isRequired = false,
  customValidation = null,
}) => {
  const [error, setError] = useState(false);

  const handleBlur = () => {
    if (isRequired && !value.trim()) {
      setError(true);
    } else if (customValidation && !customValidation(value)) {
      setError(true);
    } else {
      setError(false);
    }
    if (onBlur) onBlur();
  };
  return (
    <>
      <input
        type={type}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-600" : "border-gray-800"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
      />
      {error && (
        <span className="text-red-600 text-sm mt-1">{errorMessage}</span>
      )}
    </>
  );
};

export default Input;
