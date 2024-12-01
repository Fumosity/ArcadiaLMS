// UBkResults.js
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // Import Supabase client
import Trie from "../../backend/trie"; // Import the Trie class

const UBkResults = ({ query }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [trie, setTrie] = useState(new Trie());

    // Fetch the book data from Supabase and populate the Trie
    useEffect(() => {
        const fetchBooks = async () => {
            const { data, error } = await supabase.from("book_titles").select("*");

            if (error) {
                console.error("Error fetching books:", error);
            } else {
                setBooks(data);

                // Insert all titles into the Trie
                const newTrie = new Trie();
                data.forEach((book) => newTrie.insert(book.title.toLowerCase()));
                setTrie(newTrie);
            }
        };

        fetchBooks();
    }, []);

    // Use the Trie to filter the books based on the query
    useEffect(() => {
        if (query) {
            const searchResults = trie.search(query.toLowerCase());
            const results = books.filter((book) =>
                searchResults.includes(book.title.toLowerCase())
            );
            setFilteredBooks(results);
        } else {
            setFilteredBooks(books);
        }
    }, [query, books, trie]);

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Similar Results for "{query}"</h2>
            </div>

            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book, index) => (
                        <a key={index} className="genCard-cont">
                            <img
                                src={book.image_url} // Assuming you have a column for book images
                                alt={book.title}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                            <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                            <div className="flex items-center space-x-1">
                                <span className="text-bright-yellow text-sm">★</span>
                                <p className="text-sm">{book.rating?.toFixed(2)}</p>
                            </div>
                        </a>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>

            {/* Pagination can be added here if needed */}
        </div>
    );
};

export default UBkResults;
