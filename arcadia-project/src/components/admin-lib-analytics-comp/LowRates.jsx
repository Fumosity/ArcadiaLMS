import { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import { Link } from "react-router-dom";

const LowRates = () => {
    const [books, setBooks] = useState([]);

    const fetchLowestRated = async () => {
        try {
            // Fetch all ratings with titleID
            const { data: ratings, error: ratingError } = await supabase
                .from("ratings")
                .select("ratingValue, titleID");

            if (ratingError) throw ratingError;

            // Compute average ratings per titleID
            const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
                if (!acc[titleID]) {
                    acc[titleID] = { total: 0, count: 0 };
                }
                acc[titleID].total += ratingValue;
                acc[titleID].count += 1;
                return acc;
            }, {});

            // Fetch all borrow transactions
            const { data: transactions, error: transactionError } = await supabase
                .from("book_transactions")
                .select("bookBarcode");

            if (transactionError) throw transactionError;

            // Count borrows per bookBarcode
            const borrowCountMap = transactions.reduce((acc, { bookBarcode }) => {
                acc[bookBarcode] = (acc[bookBarcode] || 0) + 1;
                return acc;
            }, {});

            // Fetch book metadata from book_indiv and book_titles
            const bookBarcodes = Object.keys(borrowCountMap);
            const { data: bookMetadata, error: bookError } = await supabase
                .from("book_indiv")
                .select("bookBarcode, titleID, book_titles(titleID, title)")
                .in("bookBarcode", bookBarcodes);

            if (bookError) throw bookError;

            // Combine book data with ratings and borrow counts
            const booksWithDetails = bookMetadata.map(book => {
                const titleID = book.book_titles.titleID;
                const avgRating = ratingMap[titleID]
                ? (ratingMap[titleID].total / ratingMap[titleID].count).toFixed(2) // Format to X.XX
                : "0.00";
                const borrowCount = borrowCountMap[book.bookBarcode] || 0;

                return {
                    title: book.book_titles.title,
                    avgRating,
                    borrowCount,
                    titleID
                };
            });

            // Sort by lowest rating
            let books = booksWithDetails.sort((a, b) => a.avgRating - b.avgRating).slice(0, 10);

            return books;
        } catch (error) {
            console.error("Error fetching lowest-rated books:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            const lowRatedBooks = await fetchLowestRated();
            setBooks(lowRatedBooks);
        };

        fetchBooks();
    }, []);

    return (
        <div className="bg-white border border-grey p-4 rounded-lg w-full">
            <h3 className="text-2xl font-semibold mb-4">Lowest Rated Books</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book, index) => (
                        <tr key={index} className="hover:bg-light-gray cursor-pointer">
                            <td className="w-3/4 px-4 py-2 text-arcadia-red font-semibold text-left text-sm truncate">
                                <Link
                                    to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {book.title}
                                </Link>
                            </td>
                            <td className="w-1/4 px-4 py-2 text-center text-sm truncate">{book.avgRating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LowRates;
