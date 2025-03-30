// WarningModal.js
import React from 'react';

const WrngRmvBkInv = ({ isOpen, onClose, onRemove }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">

        <div className="flex items-center mb-4">
          <div className="text-red-500 text-2xl mr-2">⚠️</div>
          <h2 className="text-2xl font-semibold">Attention!</h2>
        </div>
        <p className="text-gray-700 mb-6">
          You are about to remove a book from the Book Inventory. This action is irreversible once done. Are you sure you want to perform this action?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="penBtn"
          >
            Go back
          </button>
          <button
            onClick={onRemove}
            className="cancelModify"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WrngRmvBkInv;
