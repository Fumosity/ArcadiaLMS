import React from 'react';

const ViewAbstract = ({ isOpen, onClose, abstractContent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg w-full max-w-2xl p-8 shadow-xl h-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold mb-4">View Abstract</h2>
        </div>
        <div className="mb-4">
          <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
            Abstract Content:
          </label>
          <textarea
            id="abstract"
            value={abstractContent}
            readOnly
            className="w-full h-64 p-2 border border-grey rounded-md bg-gray-100 resize-none custom-scrollbar"
          ></textarea>

        </div>
        <div className="flex justify-center">
          <button
            className="penBtn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAbstract;
