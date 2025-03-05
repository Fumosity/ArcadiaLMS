import React from 'react';

const ViewSynopsis = ({ isOpen, onClose, synopsisContent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg w-full max-w-2xl p-8 shadow-xl h-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">View Synopsis</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 mb-2">
            Synopsis Content:
          </label>
          <textarea
            id="synopsis"
            value={synopsisContent}
            readOnly
            className="w-full h-32 p-2 border border-gray-300 rounded-md bg-gray-100 resize-none"
          ></textarea>

          
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSynopsis;
