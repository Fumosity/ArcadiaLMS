import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Trie from "../../backend/trie";
import { useNavigate } from "react-router-dom";

const UBkResults = ({ query }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [trie, setTrie] = useState(new Trie());
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const navigate = useNavigate();

    // Helper function to render star ratings with average rating number
    const renderStars = (averageRating) => {
        const fullStars = Math.floor(averageRating); // Number of full stars
        const halfStar = averageRating % 1 >= 0.5 ? 1 : 0; // One half-star if needed
        const emptyStars = 5 - fullStars - halfStar; // Remaining empty stars
    
        return (
            <span className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="text-yellow-500 text-lg">★</span>
                ))}
                {halfStar === 1 && <span className="text-yellow-500 text-lg">☆</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="text-gray-300 text-lg">☆</span>
                ))}
                <span className="ml-2 text-gray-700 text-sm">
                    {averageRating ? averageRating.toFixed(1) : "0.0"} / 5
                </span>
            </span>
        );
    };
    

    useEffect(() => {
        const fetchBooksAndRatings = async () => {
            try {
                // Fetch books from the book_titles table
                const { data: booksData, error: booksError } = await supabase
                    .from("book_titles")
                    .select("*");
                if (booksError) throw booksError;

                // Fetch ratings from the ratings table
                const { data: ratingsData, error: ratingsError } = await supabase
                    .from("ratings")
                    .select("titleID, ratingValue");
                if (ratingsError) throw ratingsError;

                // Calculate the average rating for each book using titleID
                const averageRatings = ratingsData.reduce((acc, curr) => {
                    if (!acc[curr.titleID]) {
                        acc[curr.titleID] = { sum: 0, count: 0 };
                    }
                    if (curr.ratingValue !== null && !isNaN(curr.ratingValue)) {
                        acc[curr.titleID].sum += curr.ratingValue;
                        acc[curr.titleID].count += 1;
                    }
                    return acc;
                }, {});

                const booksWithDetails = booksData.map((book) => {
                    const avgRating =
                        averageRatings[book.titleID]?.count > 0
                            ? averageRatings[book.titleID].sum /
                              averageRatings[book.titleID].count
                            : 0; // Default to 0 if no ratings available

                    return {
                        ...book,
                        image_url: book.cover || "https://via.placeholder.com/150x300", // Default placeholder
                        averageRating: avgRating,
                    };
                });

                setBooks(booksWithDetails);

                // Insert books and authors into the Trie
                const newTrie = new Trie();
                booksWithDetails.forEach((book) => {
                    newTrie.insert(book.title.toLowerCase());

                    // Insert authors into the Trie
                    if (book.author && Array.isArray(book.author)) {
                        const authorNames = book.author
                            .map((author) => (author.name ? author.name.toLowerCase() : ""))
                            .filter((name) => name !== "");
                        const authorString = authorNames.join(", ");
                        newTrie.insert(authorString.toLowerCase());
                    }
                });
                setTrie(newTrie);
            } catch (error) {
                console.error("Error fetching books or ratings:", error);
            }
        };

        fetchBooksAndRatings();
    }, []);

    useEffect(() => {
        if (query) {
            const searchQuery = query.toLowerCase();

            const results = books.filter((book) => {
                const titleMatch = book.title.toLowerCase().includes(searchQuery);

                const authorString = book.author && Array.isArray(book.author)
                    ? book.author.join(", ").toLowerCase()
                    : "";
                const authorMatch = authorString.includes(searchQuery);

                return titleMatch || authorMatch;
            });

            setFilteredBooks(results);
        } else {
            setFilteredBooks([]);
        }
    }, [query, books]);

    const totalPages = Math.ceil(filteredBooks.length / entriesPerPage);
    const displayedBooks = filteredBooks.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    return (
        <div className="uMain-cont">
            {query && filteredBooks.length > 0 && (
                <h2 className="text-xl font-semibold mb-4">
                    {filteredBooks.length} results for "{query}"
                </h2>
            )}

            {query && filteredBooks.length === 0 && (
                <p className="text-lg text-gray-500 mb-4">No results for "{query}"</p>
            )}

            {displayedBooks.map((book, index) => (
                <div key={index} className="genCard-cont flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg mb-6">
                    <div className="flex-shrink-0 w-[200px]">
                        <img
                            src={book.image_url}
                            alt={book.title}
                            className="w-full h-[300px] bg-grey object-cover border border-grey rounded-md"
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <div className="text-sm text-gray-700 mt-3">
                            <p><span>Author(s):</span> <b>{book.author && book.author.join(", ")}</b></p>
                            <div className="flex space-x-6 mt-3">
                                <p><span>Category:</span> <b>{book.category}</b></p>
                                <p><span>Published:</span> <b>{new Date(book.originalPubDate).getFullYear()}</b></p>
                            </div>
                            <p className="mt-3 text-yellow-600 font-semibold flex items-center">
                                <span>Average Rating:</span> {renderStars(book.averageRating)}
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 mt-3">
                            {book.synopsis || "No synopsis available"}
                        </p>
                        <div className="flex align-baseline items-center justify-end gap-2 mt-2">
                            <span className="text-sm text-green-700 font-semibold ml-2 text-green">✓</span>
                            <span className="text-sm text-green-700 font-semibold">Is Available</span>
                            <button
                                className="viewRsrch-btn"
                                onClick={() => navigate(`/user/bookview?titleID=${book.titleID}`)} // Navigate with title_id
                            >
                                View Book
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {filteredBooks.length > 0 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red hover:font-semibold"}`}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous Page
                    </button>
                    <span className="text-xs">Page {currentPage} of {totalPages}</span>
                    <button
                        className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-red"}`}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next Page
                    </button>
                </div>
            )}
        </div>
    );
};

export default UBkResults;