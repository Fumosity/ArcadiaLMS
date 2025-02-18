import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js";
import { Link } from "react-router-dom";
import BookCopies from "../../z_modals/BookCopies";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CurrentBookInventory = ({ onBookSelect }) => {
    const [inventoryData, setInventoryData] = useState([]);
    const [sortOrder, setSortOrder] = useState("Descending");
    const [pubDateFilter, setPubDateFilter] = useState("After 2020");
    const [hoveredGenreIndex, setHoveredGenreIndex] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                const { data: bookTitles, error: titleError } = await supabase
                    .from("book_titles")
                    .select("titleID, title, author, synopsis, keywords, publisher, currentPubDate, originalPubDate, procurementDate, cover, arcID");

                if (titleError) {
                    console.error("Error fetching book titles:", titleError.message);
                    return;
                }

                if (!bookTitles || bookTitles.length === 0) {
                    console.log("No book titles found.");
                    setInventoryData([]);
                    return;
                }

                const bookIDs = bookTitles.map((book) => book.titleID);

                // Fetch book-genre relationships and join with genres table
                const { data: bookGenres, error: genreError } = await supabase
                    .from("book_genre_link")
                    .select("titleID, genres(genreID, genreName, category)") // Join with genres table
                    .in("titleID", bookIDs);

                if (genreError) {
                    console.error("Error fetching book genres:", genreError.message);
                    return;
                }

                const { data: bookIndiv, error: bookError } = await supabase
                    .from("book_indiv")
                    .select("bookID, titleID")
                    .in("titleID", bookIDs);

                if (bookError) {
                    console.error("Error fetching book_indiv:", bookError.message);
                    return;
                }

                // Process genre data
                const bookGenreMap = bookGenres.reduce((acc, item) => {
                    if (!acc[item.titleID]) {
                        acc[item.titleID] = { category: item.genres.category, genres: [] };
                    }
                    acc[item.titleID].genres.push(item.genres.genreName);
                    return acc;
                }, {});

                // Combine all data
                const combinedData = bookTitles.map((title) => {
                    const books = bookIndiv.filter((b) => b.titleID === title.titleID);
                    const { category, genres } = bookGenreMap[title.titleID] || { category: "Uncategorized", genres: [] };

                    return {
                        ...title,
                        copies: books,
                        category,
                        genres, // Array of genre names
                    };
                });

                console.log("Combined data:", combinedData);
                setInventoryData(combinedData);
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleRowClick = (book) => {
        setSelectedBook(book);
        onBookSelect(book);
    };

    const handleViewClick = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    const uniqueBooks = Array.from(new Set(inventoryData.map(item => item.title)))
        .map(title => inventoryData.find(item => item.title === title));

    const formatAuthor = (authors) => {
        if (!authors || authors.length === 0) return "N/A";

        if (!Array.isArray(authors)) {
            authors = [authors]; // Handle cases where author is not an array
        }

        const formattedAuthors = authors.map(author => {
            author = author.trim();
            const names = author.split(" ");
            const initials = names.slice(0, -1).map(name => name[0] + ".");
            const lastName = names.slice(-1)[0];
            return `${initials.join("")} ${lastName}`;
        });

        if (formattedAuthors.length <= 2) {
            return formattedAuthors.join(", ");
        } else {
            const etAlCount = authors.length - 2;
            return `${formattedAuthors[0]}, ${formattedAuthors[1]}, et al (${etAlCount} more)`;
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl border-grey border mr-5">
            <h3 className="text-xl font-semibold mb-4">Current Inventory</h3>
            <div className="flex flex-wrap items-center mb-6 space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Sort By:</span>
                    <button
                        onClick={() =>
                            setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")
                        }
                        className="sort-by bg-gray-200 py-1 px-3 rounded-full text-sm"
                    >
                        {sortOrder}
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Pub. Date:</span>
                    <button
                        onClick={() =>
                            setPubDateFilter(
                                pubDateFilter === "After 2020"
                                    ? "After 2021"
                                    : pubDateFilter === "After 2021"
                                        ? "After 2022"
                                        : "After 2020"
                            )
                        }
                        className="bg-gray-200 py-1 px-3 rounded-full text-sm"
                    >
                        {pubDateFilter}
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Filter By:</span>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Category</button>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Genre</button>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Copies</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {["Category", "Genres", "Book Title", "Author", "Title ARC ID", "Original Pub. Date", "Copies"].map(
                                (header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        <Skeleton className="w-24" />
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <Skeleton className="w-24" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                                        <Skeleton className="w-40" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                                        <Skeleton className="w-32" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        <Skeleton className="w-20" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        <Skeleton className="w-32" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        <Skeleton className="w-20" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            uniqueBooks.map((item, index) => {
                                const genres = Array.isArray(item.genre) ? item.genre : (typeof item.genre === "string" ? item.genre.split(";") : []);

                                return (
                                    <tr
                                        key={index}
                                        className="hover:bg-light-gray cursor-pointer"
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full p-2">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <span
                                                    className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-gray p-2"
                                                    onMouseEnter={() => setHoveredGenreIndex(index)}
                                                    onMouseLeave={() => setHoveredGenreIndex(null)}
                                                >
                                                    {item.genres.length > 0 ? item.genres[0] : "No Genre"}
                                                </span>
                                                {item.genres.length > 1 && (
                                                    <span
                                                        className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-grey p-2"
                                                        onMouseEnter={() => setHoveredGenreIndex(index)}
                                                        onMouseLeave={() => setHoveredGenreIndex(null)}
                                                    >
                                                        ...
                                                    </span>
                                                )}
                                            </div>
                                            {hoveredGenreIndex === index && item.genres.length > 1 && (
                                                <div className="mt-1 transition-opacity duration-300 ease-in-out opacity-100">
                                                    {item.genres.slice(1).map((genre, i) => (
                                                        <div key={i} className="bg-grey rounded-full p-2 mt-1 text-sm">
                                                            {genre}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate max-w-xs">
                                            <Link
                                                to={`/admin/abviewer?titleID=${encodeURIComponent(item.titleID)}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4 text-sm truncate max-w-xs relative group"> {/* Added group class here */}
                                            <div className="flex items-center space-x-1">
                                                <span className="inline-block">{formatAuthor(item.author)}</span>
                                                {Array.isArray(item.author) && item.author.length > 2 && ( // Check if item.author is an array before checking length
                                                    <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded p-2 z-10 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                                        {item.author.slice(2).map((author, i) => ( // Use item.author here!
                                                            <div key={i} className="mt-1">
                                                                {formatAuthor([author])}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm text-gray-500 truncate max-w-xs">
                                            {item.arcID || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm text-gray-500 truncate max-w-xs">
                                            {item.originalPubDate}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-3 rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewClick(item);
                                                }}
                                            >
                                                View Copies
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && selectedBook && (
                <BookCopies
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titleID={selectedBook.titleID}
                />
            )}
        </div>
    );
};

export default CurrentBookInventory;

