import React from "react";

const ARAdd = () => (
  <div className="min-h-screen bg-gray-100">
    <div className="flex justify-center items-start p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-4">Research Adding</h2>
        <p className="text-gray-600 mb-8">
          Data points marked with an asterisk (*) are autofilled. Use a semicolon to add multiple authors.
        </p>

        {/* Upload Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p>Upload research pages to autofill.</p>
            <p className="text-gray-500">Accepted formats: (*.pdf, *.png, *.jpeg)</p>
          </div>
          <button className="upload-page-btn py-2 px-4 border-gray-400 rounded-2xl">
            Upload Pages
          </button>
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
            <label className="w-1/4">College:</label>
            <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
          </div>
          <div className="flex justify-between items-center">
            <label className="w-1/4">Department:</label>
            <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
          </div>
          <div className="flex justify-between items-center">
            <label className="w-1/4">Abstract:</label>
            <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
          </div>
          <div className="flex justify-between items-center">
            <label className="w-1/4">Pages:</label>
            <input type="number" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
          </div>
          <div className="flex justify-between items-center">
            <label className="w-1/4">Keywords:</label>
            <input type="text" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
          </div>
          <div className="flex justify-between items-center">
            <label className="w-1/4">Date Published:</label>
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
        </form>

        {/* Add Research Button */}
        <div className="flex justify-center mt-8">
          <button className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
            Add Research
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ARAdd;
