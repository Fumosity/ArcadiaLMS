import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Trie from "../../backend/trie";

const UBkResults = ({ query }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [trie, setTrie] = useState(new Trie());
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;

    useEffect(() => {
        const fetchBooks = async () => {
            const { data, error } = await supabase.from("book_titles").select("*");

            if (error) {
                console.error("Error fetching books:", error);
            } else {
                setBooks(data);

                const newTrie = new Trie();
                data.forEach((book) => {
                    // Insert the title into the Trie
                    newTrie.insert(book.title.toLowerCase());

                    // Extract and insert authors if present in jsonb[] format
                    if (book.author && Array.isArray(book.author)) {
                        const authorNames = book.author
                            .map((author) => author.name ? author.name.toLowerCase() : "")
                            .filter((name) => name !== ""); // Filter out empty names
                        const authorString = authorNames.join(", ");
                        // Insert the combined author names into the Trie
                        newTrie.insert(authorString.toLowerCase());
                    }
                });
                setTrie(newTrie);
            }
        };

        fetchBooks();
    }, []);


    useEffect(() => {
        if (query) {
            const searchQuery = query.toLowerCase();

            const results = books.filter((book) => {
                const titleMatch = book.title.toLowerCase().includes(searchQuery);

                // Process the author field (assuming it's an array of strings)
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

            {filteredBooks.map((book, index) => (
                <div key={index} className="genCard-cont flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg mb-6">
                    <div className="flex-shrink-0 w-[200px]">
                        <img
                            src={book.image_url || "https://via.placeholder.com/150x300"}
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
                                <p><span>Published:</span> <b>{book.published}</b></p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-3">
                            {book.description || "No description available"}
                        </p>

                        <div className="flex align-baseline items-center justify-end gap-4 mt-2">
                            <button className="viewRsrch-btn">
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
