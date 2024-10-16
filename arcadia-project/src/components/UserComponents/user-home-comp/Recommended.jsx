import React, { useState } from "react";

const Recommended = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = 5; // Total number of recommended books
    const entriesPerPage = 4; // Books per page
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Placeholder book data
    const books = [
        { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", rating: 4.35, img: "https://via.placeholder.com/150x200", category: "Nonfiction; Guide, Educational" },
        { title: "System Design Interview", author: "Alex Xu", rating: 3.21, img: "https://via.placeholder.com/150x200", category: "Nonfiction; Guide, Educational" },
        { title: "Agile Practice Guide", author: "Project Management Institute", rating: 3.69, img: "https://via.placeholder.com/150x200", category: "Nonfiction; Guide, Educational" },
        { title: "Why Machines Learn", author: "Anil Ananthaswamy", rating: 4.65, img: "https://via.placeholder.com/150x200", category: "Nonfiction; Guide, Educational" },
        { title: "CCNA 200-301", author: "Wendell Odom", rating: 4.93, img: "https://via.placeholder.com/150x200", category: "Nonfiction; Guide, Educational" },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Recommended for You</h2>
                <button className="border border-arcadia-red bg-arcadia-red text-white rounded-full font-medium text-sm px-6 py-2 transition-colors hover:bg-red-600">
                    See more
                </button>
            </div>

            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {books.map((book, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <img
                            src={book.img}
                            alt={book.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                        <div className="flex items-center">
                            <span className="text-yellow-500 text-sm">★ {book.rating.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    className={`bg-arcadia-red text-white py-2 px-4 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs">Page {currentPage}</span>
                <button
                    className={`bg-arcadia-red text-white py-2 px-4 rounded-full text-xs ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default Recommended;
