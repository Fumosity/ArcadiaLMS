import React from "react";

const ABAdding = () => (
  <div className="min-h-screen bg-gray-100">
    <div className="flex justify-center items-start p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-8xl flex"> {/* Changed max-w-7xl to max-w-8xl */}
        {/* Left Side: Form Section */}
        <div className="w-full"> {/* Changed w-3/4 to w-full */}
          {/* Title */}
          <h2 className="text-3xl font-bold mb-4">Book Adding</h2>
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
            {[
              { label: "Title:", type: "text" },
              { label: "Genre:", type: "text" },
              { label: "Category:", type: "text" },
              { label: "Publisher:", type: "text" },
              { label: "Synopsis:", type: "text" },
              { label: "Keywords:", type: "number" },
              { label: "Date Published (Current):", type: "text" },
              { label: "Date Published (Original):", type: "text" },
              { label: "Date Procured:", type: "date" },
              { label: "Location:", type: "text" },
              { label: "Database ID*:", type: "text" },
              { label: "ARC ID:", type: "text" },
              { label: "ISBN:", type: "text" },
            ].map(({ label, type }) => (
              <div className="flex justify-between items-center" key={label}>
                <label className="w-1/4 mb-2">{label}</label> {/* Added mb-2 for gap */}
                <input type={type} className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
              </div>
            ))}
          </form>

          {/* Add Book Button */}
          <div className="flex justify-center mt-8">
            <button className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
              Add Book
            </button>
          </div>
        </div>

        {/* Right Side: Book Cover Placeholder */}
        <div className="w-60 ml-8 mt-32">
          <p className="font-bold text-lg mb-2">Book Cover*</p>
          <div className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg"> 
            <img
              src="image/bkfrontpg.png" // Replace with dynamic path or placeholder image
              alt="Book cover placeholder"
              className="h-auto w-full object-contain mb-2"
            />
          </div>
          <p className="text-xs text-gray-500 text-center">Click to update book cover</p>
        </div>
      </div>
    </div>
  </div>
);

export default ABAdding;
