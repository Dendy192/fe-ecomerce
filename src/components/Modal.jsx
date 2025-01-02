import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const Modal = ({
  isOpen,
  onClose,
  onOpen, // Callback for open
  header,
  children,
  closeOnOutsideClick = true,
  maxWidth = "max-w-5xl",
  closeButton = true,
  autoScroll = false, // New prop to toggle auto-scroll
}) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Handle animation on open/close and call onOpen if provided
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      if (onOpen) onOpen();

      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Scroll to bottom on open if autoScroll is enabled
      if (contentRef.current && autoScroll) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    } else {
      setTimeout(() => {
        setVisible(false);

        // Restore body scroll when modal is closed
        document.body.style.overflow = "auto";
      }, 300); // Match animation duration
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onOpen, autoScroll]);

  // Auto-scroll to bottom when children change if autoScroll is enabled
  useEffect(() => {
    if (contentRef.current && autoScroll) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [children, autoScroll]);

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
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button */}
        {closeButton && (
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faX} size="lg" />
          </button>
        )}
        {/* Modal header */}
        {header && <h2 className="text-xl mb-4">{header}</h2>}

        {/* Scrollable content */}
        <div
          className="overflow-y-auto"
          style={{
            flex: 1,
            maxHeight: "calc(80vh - 64px)", // Adjust for header and padding
          }}
          ref={contentRef}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
