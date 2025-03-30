import React from 'react';

const DeleteUserAcc = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
        <div className="flex items-center mb-4">
          <div className="text-red-500 text-2xl mr-2">⚠️</div>
          <h2 className="text-2xl font-semibold">Attention!</h2>
        </div>
        <p className="text-gray-700 mb-6">
        You are about to delete a user account. This will erase them from the database, and all other information associated with it.
        <br />
        <br />
        <b>THIS ACTION IS IRREVERSIBLE.</b> 
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
            onClick={onDelete}
            className="cancelModify"
          >
            I am Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserAcc;
