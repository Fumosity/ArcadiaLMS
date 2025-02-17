import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";

const BookCards = ({ title, fetchBooks }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const entriesPerPage = 5;
    const maxPages = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedBooks = await fetchBooks();
                setBooks(fetchedBooks.books || []);  // Ensure you're setting the 'books' array here
            } catch (error) {
                setError(error.message);
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [fetchBooks]);

    console.log(books)

    const totalEntries = books.length;
    const totalPages = Math.min(Math.ceil(totalEntries / entriesPerPage), maxPages);
    const paginatedBooks = books.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log("book metadata", books)

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <button className="uSee-more">See more</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {paginatedBooks.map((book, index) => (
                    <a key={index} href={`http://localhost:5173/user/bookview?titleID=${book.titleID}`} className="block genCard-cont">
                        <img src={book.cover} alt={book.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                        <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                        <p className="text-sm text-gray-500 mb-2 truncate">★ {book.weightedAvg}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                        {/*
                        <div className="flex items-center space-x-1">
                            {book.genres.length > 0 && (
                                <div className="flex items-center space-x-1">
                                    <span className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-gray p-2">
                                        {book.genres[0]}
                                    </span>
                                    {book.genres.length > 1 && (
                                        <span className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-grey p-2">...</span>
                                    )}
                                </div>
                            )}
                        </div>
                        */}
                    </a>
                ))}
            </div>
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous Page
                </button>
                <span className="text-xs text-arcadia-red">Page {currentPage}</span>
                <button className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default BookCards;
