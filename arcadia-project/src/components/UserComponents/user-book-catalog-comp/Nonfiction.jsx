import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";

const Nonfiction = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const entriesPerPage = 5; // Books per page
    const maxPages = 5; // Limit pagination to 5 pages

    // Fetch books from Supabase
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data, error } = await supabase
                    .from("book_titles")
                    .select("*")
                    .order("procurementDate", { ascending: false }); // Sort by procurementDate

                if (error) {
                    console.error("Error fetching books:", error);
                    setError(error);
                    setLoading(false);
                } else {
                    // Filter books by category "Nonfiction"
                    const filteredBooks = data.filter(book => book.category.includes("Non-Fiction"));

                    // Shuffle the filtered books
                    const shuffledBooks = filteredBooks.sort(() => Math.random() - 0.5);

                    setBooks(shuffledBooks);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Pagination logic
    const totalEntries = books.length;
    const totalPages = Math.min(Math.ceil(totalEntries / entriesPerPage), maxPages); // Limit total pages to 5
    const paginatedBooks = books.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Nonfiction</h2>
                <button className="uSee-more">
                    See more
                </button>
            </div>

            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {paginatedBooks.map((book, index) => (
                    <a key={index}
                        href={`http://localhost:5173/user/bookview?titleID=${book.titleID}`}
                        className="block genCard-cont"
                    >
                        <img
                            src={book.cover || "https://via.placeholder.com/150x200"} // Adjust for cover field
                            alt={book.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                        <div className="flex items-center space-x-1">
                            <span className="text-bright-yellow text-sm">★</span>
                            <p className=" text-sm">{book.average_rating?.toFixed(2)}</p>
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

export default Nonfiction;
