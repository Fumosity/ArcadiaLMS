import React, { useState } from 'react';

const ModifySynopsis = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // State to manage the synopsis content
  const [synopsisContent, setSynopsisContent] = useState("Lorem ipsum dolor sit amet.");

  const handleChange = (e) => {
    setSynopsisContent(e.target.value); // Update state on change
  };

  const handleModify = () => {
    // Call onModify with the updated synopsis content
    onModify(synopsisContent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modify Synopsis</h2>
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
            value={synopsisContent} // Controlled input
            onChange={handleChange} // Handle changes
            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="penBtn"
            onClick={handleModify} // Modify function
          >
            Modify
          </button>
          <button
            className="cancelModify"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    

  );
};

export default ModifySynopsis;
