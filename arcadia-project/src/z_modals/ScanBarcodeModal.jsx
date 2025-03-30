import React from 'react';

const ScanBardodeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg w-full max-w-2xl p-8 shadow-xl h-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Barcode Scanner</h2>
          
        </div>
        {/* Put content here for barcode scanner yusufman */}
        <div className="flex justify-end">
          <button
            className="cancelModify"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanBardodeModal;
