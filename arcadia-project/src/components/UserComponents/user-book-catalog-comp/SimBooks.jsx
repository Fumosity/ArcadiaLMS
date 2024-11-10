import React, { useState } from "react";

const SimBooks = () => {
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
        <div className="uHero-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Similar Books</h2>
            </div>

            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {books.map((book, index) => (
                    <a key={index} className="genCard-cont">
                        <img
                            src={book.img}
                            alt={book.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{book.category}</p>
                        <div className="flex items-center space-x-1">
                            <span className="text-bright-yellow text-sm">★</span>
                            <p className=" text-sm">{book.rating.toFixed(2)}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SimBooks;
