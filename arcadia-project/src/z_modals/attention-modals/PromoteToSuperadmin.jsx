// WarningModal.js
import React from 'react';

const PromoteToSuperadmin = ({ isOpen, onClose, onPromote }) => {
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
        You are about to make an admin account into a Superadmin which gives them ALL ADMIN PRIVILEGES and turns it into an Superadmin account. 
        <br />
        <br />
        <b>DO NOT GRANT THIS TO ANYONE YOU DON’T TRUST.</b> 
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
            onClick={onPromote}
            className="cancelModify"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteToSuperadmin;
