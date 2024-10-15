import React, { useState } from 'react';

const CheckingContainer = () => {
  const [checkMode, setCheckMode] = useState('Check Out');

  const handleCheckChange = (e) => {
    setCheckMode(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-3">Checking</h2>

      {/* Check In / Check Out Options */}
      <div className="flex items-center mb-3">
        <label className="mr-2">
          <input
            type="radio"
            name="check"
            value="Check In"
            className="mr-1"
            checked={checkMode === 'Check In'}
            onChange={handleCheckChange}
          /> Check In
        </label>
        <label className="mr-2">
          <input
            type="radio"
            name="check"
            value="Check Out"
            className="mr-1"
            checked={checkMode === 'Check Out'}
            onChange={handleCheckChange}
          /> Check Out
        </label>
      </div>

      {/* Form Section - Horizontal alignment of inputs */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">User ID:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="1-00923"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">Book ID:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="B-1742"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">School No.:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="2021-02909"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">Book Title:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="National Geographic World Atlas"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">Name:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="Alexander B. Corrine"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">Check Out Date:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="September 11 2024"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">College:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="COEDCSA"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">Check Out Time:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="12:04PM"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">Department:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="DCS"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-medium">Deadline:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full w-full p-1.5 text-right"
            readOnly
            value="September 18 2024"
          />
        </div>
        {/* Autofill Data Text */}
        <div className="mb-3">
          <p className="text-gray-500 italic">Autofill data</p>
        </div>
        {/* Autofill Data Text */}
        <div className="mb-3">
          <p className="text-gray-500 italic">Autofill data</p>
        </div>
      </div>

      {/* "Library Card" and "Book Cover" Text */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-semibold">Library Card</p>
        </div>
        <div>
          <p className="font-semibold">Book Cover</p>
        </div>
      </div>

      {/* QR Code and Book Cover - Aligned Horizontally */}
      <div className="grid grid-cols-2 gap-4">
        {/* Library Card QR Code */}
        <div className="border border-gray-300 rounded p-3 text-center">
          <p>Click to Scan Library Card QR Code</p>
          <div className="mt-2 w-20 h-20 mx-auto bg-gray-200">
            {/* Placeholder for QR Code */}
          </div>
        </div>

        {/* Book Cover Image */}
        <div className="border border-gray-300 rounded p-3 text-center">
          <img src="/path-to-book-cover.jpg" alt="Book Cover" className="mx-auto max-h-56" />
        </div>
      </div>

      {/* Dynamic Button - Centered */}
      <div className="mt-5 flex justify-center">
        <button className="border border-black text-black font-bold py-1.5 px-4 rounded-full hover:bg-gray-100">
          {checkMode}
        </button>
      </div>
    </div>
  );
};

export default CheckingContainer;
