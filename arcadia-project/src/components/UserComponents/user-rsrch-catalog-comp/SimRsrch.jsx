import React, { useState } from "react";

const SimRsrch = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = 5; // Total number of recommended books
    const entriesPerPage = 4; // Books per page
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Placeholder book data
    const rsrches = [
        { title: "Recommender System for...", college: "COECSA", dept: "DCS", img: "https://via.placeholder.com/150x200" },
        { title: "Large Language Models in...", college: "COECSA", dept: "DCS", img: "https://via.placeholder.com/150x200" },
        { title: "MyLPUSentiment: A Sentiment...", college: "COECSA", dept: "DCS", img: "https://via.placeholder.com/150x200" },
        { title: "RockSort: A Sorting Algorithm using...", college: "COECSA", dept: "DCS", img: "https://via.placeholder.com/150x200" },
        { title: "Libertad: A Historical RPG...", college: "COECSA", dept: "DCS", img: "https://via.placeholder.com/150x200" },
    ];

    return (
        <div className="bg-white p-6 border border-grey rounded-xl mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Similar Research</h2>
            </div>

            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {rsrches.map((rsrch, index) => (
                    <div key={index} className="bg-white border border-grey rounded-lg p-4">
                        <img
                            src={rsrch.img}
                            alt={rsrch.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2 truncate">{rsrch.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{rsrch.college}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{rsrch.dept}</p>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimRsrch;
