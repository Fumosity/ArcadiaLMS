// WarningModal.js
import React from 'react';

const DemoteToAdmin = ({ isOpen, onClose, onDemote }) => {
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
          <h2 className="text-2xl font-semibold">Attention!</h2>
        </div>
        <p className="text-gray-700 mb-6">
        You are about to make a Superadmin account into an Admin which removes some admin privileges and turns it into an admin account. 
        <br />
        <br />
        Are you sure about this?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="penBtn"
          >
            Nevermind
          </button>
          <button
            onClick={onDemote}
            className="cancelModify"
          >
            Demote
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoteToAdmin;
