import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faRegularStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStarOutline } from '@fortawesome/free-regular-svg-icons';

const BookGrid = ({ title, fetchBooks }) => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const entriesPerRow = 5;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const fetchedBooks = await fetchBooks();
                console.log("Fetched books in BookGrid:", fetchedBooks);

                setBooks(fetchedBooks.books || []);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fetchBooks]);

    const generatePlaceholders = () => {
        const remainder = books.length % entriesPerRow;
        return remainder === 0 ? [] : Array(entriesPerRow - remainder).fill(null);
    };

    const formatAuthor = (authors) => {
        if (!authors || !Array.isArray(authors) || authors.length === 0) {
            return "Unknown Author";
        }
        return authors.map((authorName) => {
            const trimmedName = authorName.trim();
            const names = trimmedName.split(" ");
            const lastName = names.pop();
            const initials = names.map(name => name[0] + ".").join("");
            return initials ? `${initials} ${lastName}` : lastName;
        }).join(", ");
    };

    const renderStars = (rating) => {
        const roundedRating = Math.round(rating * 10) / 10;
        const fullStars = Math.floor(roundedRating);
        const halfStar = (roundedRating * 2) % 2 !== 0;
        let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        emptyStars = Math.max(0, emptyStars);

        return (
            <span className="flex gap-1 items-center">
                <span className="flex">
                    {[...Array(fullStars)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="text-arcadia-yellow" />
                    ))}
                    {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-grey" />}
                    {[...Array(emptyStars)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faRegularStar} className="text-grey" />
                    ))}
                </span>
                {rating.toFixed(1)}
            </span>
        );
    };

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {isLoading ? ( // Conditionally render placeholders
                    Array(entriesPerRow).fill(null).map((_, index) => (
                        <div key={index} className="genCard-cont animate-pulse"> {/* Added animate-pulse */}
                            <div className="w-full h-40 rounded-lg mb-4 bg-light-gray"></div>
                            <div className="text-lg font-semibold mb-2 truncate bg-light-gray">&nbsp;</div>
                            <div className="text-sm text-gray-500 mb-2 truncate bg-light-gray">&nbsp;</div>
                            <div className="text-sm text-gray-500 mb-2 truncate bg-light-gray">&nbsp;</div>
                            <div className="text-xs text-gray-400 mb-2 truncate bg-light-gray">&nbsp;</div>
                        </div>
                    ))
                ) : (
                    <>
                        {books.map((book, index) => (
                            <a key={index} href={`http://localhost:5173/user/bookview?titleID=${book.titleID}`} className="block genCard-cont">
                                <img src={book.cover} alt={book.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                                <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">{formatAuthor(book.author)}</p>
                                <p className="text-sm text-gray-500 mb-2 truncate">
                                    {book.weightedAvg ? renderStars(book.weightedAvg) : "Rating not available"}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default BookGrid;
