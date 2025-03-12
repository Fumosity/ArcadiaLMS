import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Trie from "../../backend/trie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faRegularStar } from "@fortawesome/free-solid-svg-icons";

const UBkResults = ({ query }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [trie, setTrie] = useState(new Trie());
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const navigate = useNavigate();


    const renderStars = (rating) => {
        const roundedRating = Math.round(rating * 10) / 10;
        const fullStars = Math.floor(roundedRating);
        const halfStar = (roundedRating * 2) % 2 !== 0;

        let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        emptyStars = Math.max(0, emptyStars);

        return (
            <span className="flex gap-1 items-center space-x-2">
                <span className="flex">
                    {[...Array(fullStars)].map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className="text-arcadia-yellow cursor-pointer"
                            onClick={() => handleStarClick(i + 1)}
                        />
                    ))}
                    {halfStar && (
                        <FontAwesomeIcon
                            icon={faStarHalfAlt}
                            className="text-arcadia-yellow cursor-pointer"
                            onClick={() => handleStarClick(fullStars + 1)}
                        />
                    )}
                    {[...Array(emptyStars)].map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faRegularStar}
                            className="text-grey cursor-pointer"
                            onClick={() => handleStarClick(fullStars + 1 + (halfStar ? 1 : i))}
                        />
                    ))}
                </span>
                <span className="text-md">{rating ? rating.toFixed(1) : "No rating"}</span>
            </span>
        );
    };


    useEffect(() => {
        const fetchBooksAndRatings = async () => {
            try {
                const { data: booksData, error: booksError } = await supabase
                    .from("book_titles")
                    .select("*, book_indiv(bookStatus)");
                if (booksError) throw booksError;

                const { data: ratingsData, error: ratingsError } = await supabase
                    .from("ratings")
                    .select("titleID, ratingValue");
                if (ratingsError) throw ratingsError;

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

                // Fetch book genres
                const { data: bookGenres, error: genreError } = await supabase
                    .from("book_genre_link")
                    .select("titleID, genres(genreID, genreName, category)");
                if (genreError) throw genreError;

                // Group genres by titleID
                const bookGenresMap = bookGenres.reduce((acc, curr) => {
                    if (!acc[curr.titleID]) {
                        acc[curr.titleID] = {
                            category: curr.genres?.category || "Uncategorized",
                            genres: []
                        };
                    }
                    acc[curr.titleID].genres.push(curr.genres?.genreName);
                    return acc;
                }, {});

                const booksWithDetails = booksData.map((book) => {
                    const avgRating =
                        averageRatings[book.titleID]?.count > 0
                            ? averageRatings[book.titleID].sum /
                            averageRatings[book.titleID].count
                            : 0;

                    return {
                        ...book,
                        image_url: book.cover || "https://via.placeholder.com/150x300", // Default placeholder
                        averageRating: avgRating,
                        totalRatings: averageRatings[book.titleID]?.count || 0,
                        category: bookGenresMap[book.titleID]?.category || "Uncategorized",
                        genres: bookGenresMap[book.titleID]?.genres || [],
                        book_indiv: book.book_indiv || [],
                        publishedYear: book.originalPubDate ? new Date(book.originalPubDate).getFullYear() : "Unknown Year"
                    };
                });

                setBooks(booksWithDetails);

                console.log(booksWithDetails)

                const newTrie = new Trie();
                booksWithDetails.forEach((book) => {
                    newTrie.insert(book.title.toLowerCase());

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
                <h2 className="text-xl font-semibold mb-4">
                    No results for "{query}"
                </h2>
            )}

            {displayedBooks.map((book, index) => (
                <div key={index} className="genCard-cont flex w-full gap-4 p-4 border border-grey bg-silver rounded-lg mb-4">
                    <div className="flex-shrink-0 w-[200px]">
                        <img
                            src={book.image_url}
                            alt={book.title}
                            className="w-full h-[300px] bg-grey object-cover border border-grey rounded-md"
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-2xl font-ZenSerif">{book.title}</h3>
                        <div className="text-md text-gray-700 mt-1 space-y-1">
                            <p><span className="font-semibold">Author:</span> {book.author.join(", ")}</p>
                            <p><span className="font-semibold">Published:</span> {book.publishedYear}</p>
                            <p><span className="font-semibold">Category:</span> {book.category} <span className="font-semibold">Genres:</span> {book.genres.join(", ")}</p>
                            <p className="min-h-[6rem] leading-relaxed">
                                <span className="font-semibold"></span> {book.synopsis || "No synopsis available."}
                            </p>

                            <div className="flex space-x-1 items-center text-yellow-600 w-1/2">
                                {renderStars(book.averageRating)}
                                <span className="text-md text-gray-500">
                                    ({book.totalRatings >= 1000 ? "1000+" : book.totalRatings} Ratings)
                                </span>
                            </div>
                            <div className="justify-start space-x-2 w-1/2">

                                <button
                                    className="w-1/3 bg-arcadia-red hover:bg-red hover:text-white text-white py-1 px-2 mt-4 rounded-xl text-md"
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: "smooth" })
                                        navigate(`/user/bookview?titleID=${book.titleID}`)
                                    }} // Navigate with title_id
                                >
                                    View Book
                                </button>
                                {book.book_indiv.length > 0 &&
                                    book.book_indiv.some((indivBook) => indivBook.bookStatus === "Available") ? (
                                    <>
                                        <span className="text-green font-semibold">✓</span>
                                        <span className="ml-2">Book is Available</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-red font-semibold">✗</span>
                                        <span className="ml-2">Book is Unavailable</span>
                                    </>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            ))}

            {filteredBooks.length > 0 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red hover:font-semibold"}`}
                        onClick={() => {
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }}
                        disabled={currentPage === 1}
                    >
                        Previous Page
                    </button>
                    <span className="text-xs">Page {currentPage} of {totalPages}</span>
                    <button
                        className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-red"}`}
                        onClick={() => {
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }}
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