import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faRegularStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStarOutline } from '@fortawesome/free-regular-svg-icons';
import { Link } from "react-router-dom";

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                {isLoading ? ( // Conditionally render placeholders
                    Array(entriesPerRow).fill(null).map((_, index) => (
                        <div key={index} className="genCard-cont animate-pulse"> {/* Added animate-pulse */}
                            <div className="w-full h-60 rounded-lg mb-2 bg-light-gray"></div>
                            <div className="text-lg font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                            <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                            <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
                            <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                        </div>
                    ))
                ) : (
                    <>
                        {books.map((book, index) => (
                            <Link
                                key={index}
                                to={`/user/bookview?titleID=${book.titleID}`}
                                className="block genCard-cont"
                                title={book.title}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <img src={book.cover} alt={book.title} className="w-full h-4/6 object-cover rounded-lg mb-2" />
                                <h3 className="text-lg h-[3rem] leading-tight font-semibold whitespace-pre-wrap line-clamp-2 mb-1 truncate break-words">{book.title}</h3>
                                <p className="text-sm text-gray-500 mb-1 truncate">{formatAuthor(book.author)}</p>
                                <p className="text-sm text-gray-400 mb-1 truncate">{book.category}</p>
                                <p className="text-sm text-gray-500 mb-1 truncate">
                                    {book.weightedAvg && (
                                        <span className="flex items-center justify-start gap-1">
                                            {renderStars(book.weightedAvg)}
                                            <span className="text-xs text-gray-500">
                                                ({book.totalRatings >= 1000 ? "1000+" : book.totalRatings})
                                            </span>
                                        </span>
                                    )}
                                    {!book.weightedAvg && "Rating not available"}
                                </p>
                            </Link>
                        ))}
                        {generatePlaceholders().map((_, index) => (
                            <div key={index} className="bg-white border border-grey rounded-xl p-2 "> {/* Placeholder div */}
                                <div
                                    className="w-full h-60 rounded-lg mb-2 bg-light-gray"
                                    style={{
                                        boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.05)", // Creates the vignette effect
                                    }}
                                ></div>                            <div className="text-lg font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                                <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
                                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default BookGrid;
