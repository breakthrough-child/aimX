// CustomModal.tsx
import React from 'react';
import './CustomModal.css'; // You can create and style the modal using CSS

interface CustomModalProps {
  message: string;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CustomModal;
