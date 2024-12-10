import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import { useUser } from "../../../backend/UserContext";

const MostPopular = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const { user, updateUser } = useUser();

    const entriesPerPage = 5; // Books per page
    const maxPages = 5; // Limit pagination to 5 pages

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Step 1: Get all "Borrowed" transactions with the bookID
                const { data: transactions, error: transactionError } = await supabase
                    .from("book_transactions")
                    .select("bookID")

                if (transactionError) throw transactionError;

                // Step 2: Count the number of borrows for each bookID
                const borrowCountMap = transactions.reduce((acc, transaction) => {
                    acc[transaction.bookID] = (acc[transaction.bookID] || 0) + 1;
                    return acc;
                }, {});

                // Step 3: Get book details for each bookID, using book_indiv to join with book_titles
                const bookIDs = Object.keys(borrowCountMap); // Get unique bookIDs
                const { data: bookMetadata, error: bookError } = await supabase
                    .from("book_indiv")
                    .select("bookID, book_titles(titleID, title, author, category, cover)")
                    .in("bookID", bookIDs); // Get books only where bookID is in the list of borrowed books

                if (bookError) throw bookError;

                // Step 4: Combine the borrow count with book metadata
                const booksWithBorrowCount = bookMetadata.map((book) => {
                    return {
                        ...book.book_titles,
                        borrowCount: borrowCountMap[book.bookID] || 0, // Add the borrow count
                    };
                });

                // Step 5: Sort the books by borrow count (descending)
                const sortedBooks = booksWithBorrowCount.sort((a, b) => b.borrowCount - a.borrowCount);

                // Step 6: Update the state
                setBooks(sortedBooks);
            } catch (error) {
                setError(error.message); // Set error message in state
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Pagination logic
    const totalEntries = books.length;
    const totalPages = Math.min(Math.ceil(totalEntries / entriesPerPage), maxPages); // Limit total pages to 5
    const paginatedBooks = books.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Most Popular</h2>
                <button className="uSee-more">See more</button>
            </div>

            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {paginatedBooks.map((book, index) => (
                    <a key={index}
                        href={`http://localhost:5173/user/bookview?titleID=${book.titleID}`}
                        className="block genCard-cont"
                    >
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                        <div className="flex items-center space-x-1">
                            <span className="text-bright-yellow text-sm">★</span>
                            <p className="text-sm">{book.average_rating}</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs text-arcadia-red">Page {currentPage}</span>
                <button
                    className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default MostPopular;
