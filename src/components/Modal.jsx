import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const Modal = ({
  isOpen,
  onClose,
  onOpen, // New prop for open callback
  header,
  children,
  closeOnOutsideClick = true,
  maxWidth = "max-w-5xl",
  closeButton = true,
}) => {
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Handle animation on open/close and call onOpen if provided
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      if (onOpen) onOpen(); // Call onOpen callback if provided
    } else {
      setTimeout(() => setVisible(false), 300); // Match animation duration
    }
  }, [isOpen, onOpen]);

  // Close modal on outside click
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (closeOnOutsideClick) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      if (closeOnOutsideClick) {
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };
  }, [closeOnOutsideClick]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-white rounded-lg p-5 w-full relative ${maxWidth} transform transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          ref={modalRef}
          style={{
            transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
          }} // Bounce effect
        >
          {/* Close button in the top right corner */}
          {closeButton && (
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faX} size="lg" /> {/* Close icon */}
            </button>
          )}
          {/* Header of the modal */}
          {header && <h2 className="text-xl mb-4">{header}</h2>}
          {children} {/* Dynamic content goes here */}
        </div>
      </div>
    </>
  );
};

export default Modal;
