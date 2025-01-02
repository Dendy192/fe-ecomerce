import React from "react";
import Select from "react-select";

const SelectCustom = ({
  value,
  option,
  onChange,
  closeMenuOnSelect = true,
  error,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Select
        closeMenuOnSelect={closeMenuOnSelect}
        value={value}
        onChange={onChange}
        options={option}
        menuPlacement="auto"
        menuPortalTarget={document.body}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
            outline: "none",
          }),
          control: (provided, state) => ({
            ...provided,
            borderColor: error
              ? "red" // Highlight red if there's an error
              : state.isFocused
              ? "#4A5568"
              : "#4A5568", // Tailwind's gray-800
            boxShadow: state.isFocused
              ? error
                ? "0 0 0 1px red"
                : "0 0 0 1px #4A5568"
              : "none",
            "&:hover": {
              borderColor: error ? "red" : "#4A5568",
            },
          }),
          menu: (provided) => ({
            ...provided,
            width: "100%",
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: 200,
            overflowY: "auto",
          }),
        }}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default SelectCustom;
