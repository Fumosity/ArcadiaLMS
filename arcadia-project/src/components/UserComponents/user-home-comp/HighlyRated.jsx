import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import { useUser } from "../../../backend/UserContext";

const HighlyRated = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const { user, updateUser } = useUser();

    const entriesPerPage = 5; // Books per page
    const maxPages = 5; // Limit pagination to 5 pages

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ratings along with book information
                const { data, error } = await supabase
                    .from("ratings")
                    .select(`
                        ratingValue,
                        book_titles (titleID, title, author, category, cover)
                    `)
                    .order("ratingValue", { ascending: false }); // Order by ratingValue

                if (error) throw error;

                // Group ratings by book titleID
                const groupedBooks = data.reduce((acc, { ratingValue, book_titles }) => {
                    const { titleID, title, author, category, cover } = book_titles;
                    if (!acc[titleID]) {
                        acc[titleID] = {
                            titleID,
                            title,
                            author,
                            category,
                            cover,
                            ratings: [],
                        };
                    }
                    acc[titleID].ratings.push(ratingValue);
                    return acc;
                }, {});

                // Calculate weighted average for each book
                const booksArray = Object.values(groupedBooks).map((book) => {
                    const totalRatings = book.ratings.length;
                    const sumRatings = book.ratings.reduce((sum, rating) => sum + rating, 0);
                    const weightedAvg = sumRatings / totalRatings;
                    return {
                        ...book,
                        weightedAvg,
                        totalRatings, // Store total ratings to help with sorting
                    };
                });

                // Sort books by weighted average (highest to lowest)
                booksArray.sort((a, b) => b.weightedAvg - a.weightedAvg);

                setBooks(booksArray); // Set the books data
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
                <h2 className="text-2xl font-semibold">Highly Rated</h2>
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
                            src={book.cover || "https://via.placeholder.com/150x200"}
                            alt={book.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                        <div className="flex items-center space-x-1">
                            <span className="text-bright-yellow text-sm">★</span>
                            <p className="text-sm">{book.weightedAvg.toFixed(2)}</p>
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

export default HighlyRated;
