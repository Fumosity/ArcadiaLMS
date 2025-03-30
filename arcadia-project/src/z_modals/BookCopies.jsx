import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BookCopies = ({ isOpen, onClose, titleID }) => {
  const [bookCopies, setBookCopies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookTitle, setBookTitle] = useState(""); // Add this state for the title

  useEffect(() => {
    const fetchBookCopies = async () => {
      setIsLoading(true);
      try {
        const { data: titleData, error: titleError } = await supabase
          .from("book_titles")
          .select("titleID, procurementDate, title")
          .eq("titleID", titleID)
          .single();

        if (titleError) throw titleError;

        // Set the title to display
        setBookTitle(titleData.title);

        const { data: copies, error: copiesError } = await supabase
          .from("book_indiv")
          .select("bookBarcode, bookStatus")
          .eq("titleID", titleID);

        if (copiesError) throw copiesError;

        const combinedData = copies.map((copy) => ({
          ...copy,
          procurementDate: titleData.procurementDate,
        }));

        setBookCopies(combinedData);
      } catch (error) {
        console.error("Error fetching book copies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && titleID) {
      fetchBookCopies();
    }
  }, [isOpen, titleID]);

  const getStatusStyle = (bookStatus) => {
    switch (bookStatus) {
      case "Available":
        return "bg-resolved text-white";
      case "Reserved":
        return "bg-grey text-black";
      case "Unavailable":
        return "bg-ongoing text-black";
      case "Damaged":
        return "bg-intended text-white";
      default:
        return "bg-grey text-black";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-xl max-w-2xl w-full shadow-lg relative">


          <h2 className="text-2xl font-semibold mb-4">
            Book Copies of {bookTitle || "Loading..."}
          </h2>

        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Barcode", "Status"].map((header) => (
                  <th
                    key={header}
                    className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <Skeleton className="w-1/4" />
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Skeleton className="w-1/4" />
                    </td>
                  </tr>
                ))
              ) : bookCopies.length === 0 ? (
                <tr>
                  <td className="text-center text-zinc-600 m-2" colSpan="2">
                    Title does not have any copies.
                  </td>
                </tr>
              ) : (
                bookCopies.map((book, index) => (
                  <tr
                    key={index}
                    className="hover:bg-light-gray cursor-pointer"
                    onClick={() => handleRowClick(book)}
                  >
                    <td className="text-center">{book.bookBarcode}</td>
                    <td className="text-center py-2">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(
                          book.bookStatus
                        )}`}
                      >
                        {book.bookStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-6 mt-2.5 min-h-[50px]">
            <button
              onClick={onClose}
              className="penBtn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCopies;
