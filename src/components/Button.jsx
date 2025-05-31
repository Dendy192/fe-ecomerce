import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  outline = false,
  type = "button",
  onClick,
  disabled = false,
  className,

  props,
}) => {
  // Define base styles
  const baseStyles = `inline-block font-medium rounded focus:outline-none transition ease-in-out duration-200`;

  // Define variant styles
  const variantStyles = {
    primary: `text-white ${
      outline
        ? "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        : "bg-blue-500 hover:bg-blue-600"
    }`,
    secondary: `text-white ${
      outline
        ? "border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
        : "bg-gray-500 hover:bg-gray-600"
    }`,
    success: `text-white ${
      outline
        ? "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        : "bg-green-500 hover:bg-green-600"
    }`,
    danger: `text-white ${
      outline
        ? "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        : "bg-red-500 hover:bg-red-600"
    }`,
    warning: `text-white ${
      outline
        ? "border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
        : "bg-yellow-500 hover:bg-yellow-600"
    }`,
    dark: `${
      outline
        ? "border border-black text-black hover:bg-black hover:text-white"
        : "bg-gray-800 text-white hover:bg-gray-900"
    }`, // Tailwind styles for dark variant with outline option
  };

  // Define size styles
  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} `}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Set prop types
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "dark",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  outline: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
