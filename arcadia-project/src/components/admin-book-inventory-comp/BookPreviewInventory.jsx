import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopularAmong from "../admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../admin-book-viewer-comp/SimilarTo";

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
    return <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">Select a book title to view its details.</div>;
  }

  // Show skeletons while loading
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border mt-12">
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
  };

  // Create a function to handle navigation
  const handleModifyBook = () => {
    console.log("Title ID in BookPreviewInventory:", bookDetails.titleID);
    const queryParams = new URLSearchParams(bookDetails).toString();
    navigate(`/admin/bookmodify?${queryParams}`);
  };

  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey  hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyBook}
        >
          Modify Book Title
        </button>
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey  hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyBook}
        >
          Modify Book Copies
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border-grey border w-full">
        <h3 className="text-2xl font-semibold mb-2">About</h3>
        <div className="relative bg-white p-2 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
          <img src={book.cover || "image/bkfrontpg.png"} alt="Book cover" className="h-[475px] w-full rounded-lg" />
        </div>

        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(bookDetails).map(([key, value], index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}:
                </td>
                <td className="px-1 py-1 text-sm">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PopularAmong />
      <SimilarTo />
    </div>
  );
};

export default BookPreviewInventory;
