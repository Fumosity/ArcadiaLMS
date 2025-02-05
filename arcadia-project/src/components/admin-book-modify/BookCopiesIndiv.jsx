import React, { useEffect, useState } from 'react';
import { supabase } from "/src/supabaseClient.js";

const BookCopiesIndiv = ({ titleID }) => {
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
          .select("titleID, bookARCID, bookStatus") //no bookARCID in the column names. status should now be bookStatus
          .eq("titleID", titleID);

        if (copiesError) throw copiesError;

        const combinedData = copies.map(copy => ({
          ...copy,
          procurementDate: bookTitle.procurementDate
        }));

        setBookCopies(combinedData);
      } catch (error) {
        console.error("Error fetching book copies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (titleID) {
      fetchBookCopies();
    }
  }, [titleID]);

  const getStatusStyle = (bookStatus) => {
    switch (bookStatus) {
      case 'Available':
        return 'bg-green text-white';
      case 'Reserved':
        return 'bg-yellow text-white';
      case 'Damaged':
        return 'bg-red text-white';
      default:
        return 'bg-grey text-white';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-lg">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium text-zinc-900">Book Copies</h2>
      </header>

      <div className="flex flex-col">
        <div className="flex justify-between items-center text-base font-bold text-zinc-900">
          <span className="flex-1 text-center">Title ID</span>
          <span className="flex-1 text-center">Call No.</span>
          <span className="flex-1 text-center">Status</span>
          <span className="flex-1 text-center">Date Acq.</span>
        </div>

        <div className="mt-2.5 border-t border-zinc-300" />

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : bookCopies.length === 0 ? (
            <p className="text-center text-zinc-600 mt-2 mxb-2">There are no other copies available</p>
        ) : (
          bookCopies.map((book, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between items-center text-base text-zinc-900 mt-3">
                <span className="flex-1 text-center">{book.titleID}</span>
                <span className="flex-1 text-center">{book.bookARCID}</span>
                <span
                  className={`px-5 py-1 rounded-3xl text-sm font-semibold capitalize text-center ${getStatusStyle(
                    book.bookStatus
                  )}`}
                >
                  {book.bookStatus}
                </span>
                <span className="flex-1 text-center">{book.procurementDate}</span>
              </div>
              <div className="mt-2.5 border-t border-zinc-300" />
            </React.Fragment>
          ))
        )}
      </div>
      <div className="flex justify-center items-center gap-6 mt-2.5 min-h-[50px]">
          <button className="px-2.5 py-1.5 border border-zinc-900 rounded-[40px] w-[135px]">
            Add a Book
          </button>
          <button className="px-2.5 py-1.5 border border-zinc-900 rounded-[40px] w-[135px]">
            Remove a Book
          </button>
          <button className="px-2.5 py-1.5 border border-zinc-900 rounded-[40px] w-[135px]">
            Confirm
          </button>
        </div>
    </div>
  );
};

export default BookCopiesIndiv;
