import React from "react";
import { useNavigate } from "react-router-dom";

const BookPreviewInventory = ({ book }) => {
  const navigate = useNavigate();

  if (!book) return <div className="bg-white p-4 rounded-lg shadow-md">Select a book to see details.</div>;

  const bookDetails = {
    title: book.title,
    author: book.author,
    genre: book.genre,
    category: book.category,
    publisher: book.publisher,
    synopsis: book.synopsis,
    keywords: book.keyword,
    datePublished: book.currentPubDate,
    republished: book.originalPubDate,
    location: book.location,
    databaseID: book.bookID,
    arcID: book.arcID,
    isbn: book.isbn,
    quantity: book.quantity,
  };

  // Create a function to handle navigation
  const handleModifyBook = () => {
    const queryParams = new URLSearchParams(bookDetails).toString();
    navigate(`/bookmodify?${queryParams}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ maxWidth: "350px", margin: "0 auto" }}>
      <h3 className="text-xl font-semibold mb-3">About</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
        <img src={book.cover || "image/bkfrontpg.png"} alt="Book cover" className="h-200 w-150 mx-auto mb-2 rounded" />
        <p className="text-xs text-gray-500 mb-2 text-center">Click to update book cover</p>
      </div>

      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(bookDetails).map(([key, value], index) => (
            <tr key={index} className="border-b border-grey">
              <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                {key.replace(/([A-Z])/g, ' $1')}:
              </td>
              <td className="px-1 py-1 text-sm">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex justify-center">
        <button
          className="px-4 py-2 bg-grey rounded-full border-grey text-sm hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyBook}
        >
          Modify Book
        </button>
      </div>
    </div>
  );
};

export default BookPreviewInventory;
