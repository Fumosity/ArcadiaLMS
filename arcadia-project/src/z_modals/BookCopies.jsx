import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "/src/supabaseClient.js";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BookCopies = ({ isOpen, onClose, titleID }) => {
  const [bookCopies, setBookCopies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookCopies = async () => {
      setIsLoading(true);
      try {
        const { data: bookTitle, error: titleError } = await supabase
          .from("book_titles")
          .select("titleID, procurementDate")
          .eq("titleID", titleID)
          .single();

        if (titleError) throw titleError;

        const { data: copies, error: copiesError } = await supabase
          .from("book_indiv")
          .select("bookBarcode, bookARCID, bookStatus")
          .eq("titleID", titleID);

        if (copiesError) throw copiesError;

        const combinedData = copies.map((copy) => ({
          ...copy,
          procurementDate: bookTitle.procurementDate,
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
        return "bg-green text-white";
      case "Reserved":
        return "bg-yellow text-white";
      case "Unavailable":
        return "bg-orange text-white";
      case "Damaged":
        return "bg-red text-white";
      default:
        return "bg-grey text-black";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-xl max-w-2xl w-full shadow-lg relative">

        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-zinc-900">Book Copies</h2>
        </header>

        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Barcode", "Call No.", "Status", "Date Acq."].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
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
                    <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-xs">
                      <Skeleton className="w-1/4" />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-xs">
                      <Skeleton className="w-1/4" />
                    </td>
                  </tr>
                ))
              ) : bookCopies.length === 0 ? (
                <tr>
                  <td className="text-center text-zinc-600 m-2" colSpan="4">
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
                    <td className="flex-1 text-center">{book.bookBarcode}</td>
                    <td className="flex-1 text-center">{book.bookARCID}</td>
                    <td
                      className={`px-2 py-0.5 rounded-full text-center ${getStatusStyle(
                        book.bookStatus
                      )}`}
                    >
                      {book.bookStatus}
                    </td>
                    <td className="flex-1 text-center">
                      {new Date(book.procurementDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-6 mt-2.5 min-h-[50px]">
            <button
              onClick={onClose}
              className="px-2 py-1 border border-grey rounded-xl w-32 hover:bg-light-gray"
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
