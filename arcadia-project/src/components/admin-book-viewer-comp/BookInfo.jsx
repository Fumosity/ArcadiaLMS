import React from "react";

const BookInfo = ({ book }) => {
  if (!book) return null; // Return null if no book is selected

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-2">{book.title}</h3>
      <p className="text-gray-600 mb-4">{book.author}</p>
      <h4 className="font-semibold mb-2">Synopsis:</h4>
      <p className="text-sm text-gray-700">
        {book.synopsis} {/* Assuming 'synopsis' is a field in your book data */}
      </p>
    </div>
  );
}

export default BookInfo;
