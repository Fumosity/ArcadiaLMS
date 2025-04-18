import React, { useState } from "react";

const LatestNews = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = 5; // Total number of news items
    const entriesPerPage = 4; // News items per page
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Latest News and Updates</h2>
                <button className="uSee-more hover:bg-red hover:text-white">
                    See more
                </button>
            </div>

            {/* News Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {[...Array(4)].map((_, index) => (
                    <a key={index} className="genCard-cont">
                        <img
                            src="https://via.placeholder.com/300x200"
                            alt="News Thumbnail"
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2">News Title {index + 1}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Brief description of the news article goes here. Make it concise and
                            informative.
                        </p>
                        <a href="#" className="text-arcadia-red text-sm font-medium hover:underline">
                            Read More
                        </a>
                    </a>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red  hover:text-white"}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs text-arcadia-red">Page {currentPage}</span>
                <button
                    className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-red  hover:text-white"}`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default LatestNews;
