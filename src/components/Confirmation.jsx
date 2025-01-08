import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal"; // Ensure this points to your Modal component
import Button from "./Button"; // Ensure this points to your Button component
import Row from "./Row";
import Col from "./Col";
// max-w-xs: Maximum width of 20rem (320px)
// max-w-sm: Maximum width of 24rem (384px)
// max-w-md: Maximum width of 28rem (448px)
// max-w-lg: Maximum width of 32rem (512px)
// max-w-2xl: Maximum width of 42rem (672px)
// max-w-3xl: Maximum width of 48rem (768px)
// max-w-4xl: Maximum width of 56rem (896px)
// max-w-5xl: Maximum width of 64rem (1024px)
// max-w-6xl: Maximum width of 72rem (1152px)
// max-w-full: Full width of the container or screen
const ConfirmationModal = ({
  isOpen,
  onClose,
  onSubmit,
  message = " delete",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      closeButton={false}
      closeOnOutsideClick={false}
    >
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-full items-center gap-4 p-4"
      >
        <div className="w-full text-center">
          <p className="text-lg font-medium text-gray-700 mb-4">
            Are you sure you want to {message}?
          </p>
        </div>

        <Row className="justify-center w-full">
          <Col xs={12} sm={6} md={4} lg={3}>
            <Button size="lg" variant="danger" onClick={onClose}>
              Cancel
            </Button>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Button type="submit" size="lg">
              Submit
            </Button>
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
  cancelText: PropTypes.string,
  submitText: PropTypes.string,
};

export default ConfirmationModal;
