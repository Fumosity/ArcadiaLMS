import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BookPreviewInventory = ({ book }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading effect when a book is selected
  useEffect(() => {
    if (book) {
      // Simulate a delay to show the skeleton effect
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [book]);

  // Show a message if no book is selected
  if (!book) {
    return <div className="bg-white p-4 rounded-lg border-grey border">Select a book to see details.</div>;
  }

  // Show skeletons while loading
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border">
        <h3 className="text-xl font-semibold mb-3">
          <Skeleton width={150} />
        </h3>
        <div className="relative bg-white p-2 mb-4 rounded-lg">
          <Skeleton height={200} width={150} className="mx-auto mb-2 rounded" />
          <p className="text-xs text-gray-500 mb-2 text-center">
            <Skeleton width={120} />
          </p>
        </div>
        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                  <Skeleton width={80} />
                </td>
                <td className="px-1 py-1 text-sm">
                  <Skeleton width={150} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-center">
          <Skeleton width={100} height={35} borderRadius={20} />
        </div>
      </div>
    );
  }

  const bookDetails = {
    title: book.title,
    author: book.author,
    genre: book.genre,
    category: book.category,
    publisher: book.publisher,
    synopsis: book.synopsis,
    keywords: book.keyword,
    datePublished: book.originalPubDate,
    republished: book.currentPubDate,
    quantity: book.quantity,
    procurementDate: book.procDate,  
    cover: book.cover,
    titleID: book.titleID,  
  };

  // Create a function to handle navigation
  const handleModifyBook = () => {
    console.log("Title ID in BookPreviewInventory:", bookDetails.titleID);
    const queryParams = new URLSearchParams(bookDetails).toString();
    navigate(`/admin/bookmodify?${queryParams}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border-grey border" style={{ maxWidth: "350px", margin: "0 auto" }}>
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
