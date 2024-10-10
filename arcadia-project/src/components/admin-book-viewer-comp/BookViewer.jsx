import React from "react";

const BookViewer = () => (
  <div className="bg-light-gray py-2 px-4">
    <div className="max-w-7xl mx-auto flex items-center space-x-2">
      {/* Updated logo with appropriate size */}
      <img src="/image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
      
      {/* Updated title */}
      <h2 className="text-3xl font-semibold text-gray-700">Book Viewer</h2>
    </div>
  </div>
);

export default BookViewer;
