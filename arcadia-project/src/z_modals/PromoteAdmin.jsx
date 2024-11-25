import React from 'react';

const PromoteAdminModal = ({ isOpen, onClose, onPromote, userFName, userLName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ×
        </button>

        {/* Modal Header */}
        <div className="flex items-center mb-4">
          <div className="text-red-500 text-2xl mr-2">⚠️</div>
          <h2 className="text-xl font-semibold">Attention!</h2>
        </div>

        {/* Modal Content */}
        <p className="text-gray-700 mb-6">
          You are about to promote <span className="font-bold">{userFName} {userLName}</span> to a system admin account. 
          This will grant them full access to the system. 
          <br />
          <br />
          Are you sure about this?
        </p>

        {/* Modal Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="cancelButton"
          >
            Nevermind
          </button>
          <button
            onClick={onPromote}
            className="cancelButton"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteAdminModal;
