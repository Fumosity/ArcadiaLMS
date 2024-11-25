// WarningModal.js
import React from 'react';

const ChangesSave = ({ isOpen, onClose}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex items-center mb-4">
          <div className="text-red-500 text-2xl mr-2">⚠️</div>
          <h2 className="text-xl font-semibold">Attention!</h2>
        </div>
        <p className="text-gray-700 mb-6">
        Changes has been saved
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-1 border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangesSave;
