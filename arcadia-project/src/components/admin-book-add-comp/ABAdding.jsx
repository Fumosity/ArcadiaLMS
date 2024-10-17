import React from "react";

const ABAdding = () => (
  <div className="min-h-screen bg-gray-100">
    <div className="flex justify-center items-start p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl flex">
        {/* Left Side: Form Section */}
        <div className="w-3/4">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-4">Book Adding</h2>
          <p className="text-gray-600 mb-8">
            Data points marked with an asterisk (*) are autofilled. Use a semicolon to add multiple authors.
          </p>

          {/* Upload Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p>Upload book pages to autofill.</p>
              <p className="text-gray-500">Accepted formats: (*.pdf, *.png, *.jpeg)</p>
            </div>
          </div>

          {/* Form Section */}
          <form className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="w-1/4">Title:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Authors:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Genre:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Category:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Publisher:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Synopsis:</label>
              <textarea className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" rows="3"></textarea>
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Keywords:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Date Published (Current):</label>
              <input type="date" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Date Published (Original):</label>
              <input type="date" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Date Procured:</label>
              <input type="date" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Location:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Database ID*:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">ARC ID:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">ISBN:</label>
              <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Quantity:</label>
              <input type="number" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
          </form>

          {/* Add Book Button */}
          <div className="flex justify-center mt-8">
            <button className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
              Add Book
            </button>
          </div>
        </div>

        {/* Right Side: Book Cover Placeholder */}
        <div className="w-60 ml-8 mt-72">
          <p className="font-bold text-lg mb-2">Book Cover*</p>
          <div className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg"> 
            <img
              src="image/bkfrontpg.png" // Replace with dynamic path or placeholder image
              alt="Book cover placeholder"
              className="h-full w-full object-contain mb-2"
            />
            <p className="text-xs text-gray-500 text-center">Click to update book cover</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ABAdding;
