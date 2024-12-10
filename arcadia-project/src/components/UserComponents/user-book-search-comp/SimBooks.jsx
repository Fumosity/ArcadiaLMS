import React, { useEffect, useState } from "react";
import axios from "axios";

const SimBooks = ({ titleID, userID }) => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    console.log("Current User", userID, "Current Title", titleID)

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.post("http://localhost:8000/book-recommend", {
                    userID,
                    titleID
                });
                setBooks(response.data.recommendations || []); // Assuming the response is an array of books
                console.log("SimBooks Response\n", response.data)
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Failed to fetch similar books.");
            }
        };

        if (userID && titleID) {
            fetchRecommendations();
        }
    }, [titleID, userID]);

    return (
        <div className="uHero-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Similar Books</h2>
            </div>
            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {books.length > 0 ? (
                    books.map((book) => (
                        <a
                            key={book.titleID}
                            href={`http://localhost:5173/user/bookview?titleID=${book.titleID}`}
                            className="block"  // Use block to make the entire div clickable
                        >
                            <div key={book.titleID} className="genCard-cont">
                                <img
                                    src={book.cover || "https://via.placeholder.com/150x200"}
                                    alt={book.title}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">{book.genre}</p>
                                <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                                <div className="flex items-center space-x-1">
                                    <span className="text-bright-yellow text-sm">★</span>
                                    <p className="text-sm">{book.average_rating?.toFixed(2)}</p>
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <p>No recommendations available</p>
                )}
            </div>
        </div>
    );
};

export default SimBooks;
