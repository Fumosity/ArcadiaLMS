import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faRegularStar } from '@fortawesome/free-solid-svg-icons'; // Import the icons you need
import { faStar as faRegularStarOutline } from '@fortawesome/free-regular-svg-icons'; //Example of importing outline star

const BookCards = ({ title, fetchBooks, onSeeMoreClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const entriesPerPage = 5;
    const maxPages = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedBooks = await fetchBooks();
                console.log(title, fetchedBooks)
                setBooks(fetchedBooks.books || []);  // Ensure you're setting the 'books' array here
            } catch (error) {
                setError(error.message);
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [fetchBooks]);

    const totalEntries = books.length;
    const totalPages = Math.min(Math.ceil(totalEntries / entriesPerPage), maxPages);
    const paginatedBooks = books.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    const generatePlaceholders = () => {
        const numPlaceholders = entriesPerPage - paginatedBooks.length;
        return Array(numPlaceholders).fill(null); // Create an array of nulls for placeholders
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const formatAuthor = (authors) => {
        if (!authors || !Array.isArray(authors) || authors.length === 0) {
            return "Unknown Author";
        }

        return authors.map((authorName) => {
            // Trim whitespace before and after the name
            const trimmedName = authorName.trim();
            const names = trimmedName.split(" ");
            const lastName = names.pop();
            const initials = names.map(name => name[0] + ".").join("");
            return initials ? `${initials} ${lastName}` : lastName;
        }).join(", ");
    };

    const renderStars = (rating) => {
        const roundedRating = Math.round(rating * 10) / 10; // Round to one decimal place
        const fullStars = Math.floor(roundedRating);
        const halfStar = (roundedRating * 2) % 2 !== 0; // Better check for half star

        let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        emptyStars = Math.max(0, emptyStars); // Ensure non-negative

        return (
            <span className="flex gap-1 items-center">
                <span className="flex">
                    {[...Array(fullStars)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="text-arcadia-yellow" />
                    ))}
                    {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-grey" />}
                    {[...Array(emptyStars)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faRegularStar} className="text-grey" /> // Use the outline star
                    ))}
                </span>
                {formatRating(rating)}
            </span>
        );
    };

    const formatRating = (rating) => {
        return rating.toFixed(1);
    }

    //console.log("book metadata", books)

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <button className="uSee-more" onClick={onSeeMoreClick}>
                    See more
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {paginatedBooks.map((book, index) => (
                    <a key={index} href={`http://localhost:5173/user/bookview?titleID=${book.titleID}`} className="block genCard-cont">
                        <img src={book.cover} alt={book.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                        <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{formatAuthor(book.author)}</p>
                        <p className="text-sm text-gray-500 mb-2 truncate">
                            {book.weightedAvg && renderStars(book.weightedAvg)}{!book.weightedAvg && "Rating not available"}
                        </p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>

                    </a>
                ))}
                {generatePlaceholders().map((_, index) => (
                    <div key={index} className="genCard-cont"> {/* Placeholder div */}
                        <div className="w-full h-40 rounded-lg mb-4 bg-light-gray"></div> {/* Placeholder image with slightly darker gray */}
                        <div className="text-lg font-semibold mb-2 truncate bg-light-gray">&nbsp;</div> {/* Placeholder title */}
                        <div className="text-sm text-gray-500 mb-2 truncate bg-light-gray">&nbsp;</div> {/* Placeholder author */}
                        <div className="text-sm text-gray-500 mb-2 truncate bg-light-gray">&nbsp;</div> {/* Placeholder rating */}
                        <div className="text-xs text-gray-400 mb-2 truncate bg-light-gray">&nbsp;</div> {/* Placeholder category */}
                    </div>
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
