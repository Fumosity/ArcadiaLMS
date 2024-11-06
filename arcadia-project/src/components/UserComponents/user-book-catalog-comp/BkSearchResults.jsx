import React, { useState } from "react";
import { Star } from "lucide-react";

export default function BkSearchResults() {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const books = [
        {
            title: "Robinson Crusoe",
            author: "Daniel Defoe",
            published: "2016",
            rating: 4.5,
            img: "/placeholder.svg",
            synopsis: "A shipwreck. A sole survivor, stranded on a deserted island. What could be more appealing to children than Robinson Crusoe’s amazing adventure? Set in the 17th century, and unfolding over a 30-year period, it offers plenty of suspense and everyday detail about how Crusoe manages to stay alive. Additionally, it paints a fascinating portrait of the age—including references to slavery and Europe’s view of the 'New World.'",
        },
        {
            title: "Treasure Island",
            author: "Robert Louis Stevenson",
            published: "1883",
            rating: 4.2,
            img: "/placeholder.svg",
            synopsis: "A shipwreck. A sole survivor, stranded on a deserted island. What could be more appealing to children than Robinson Crusoe’s amazing adventure? Set in the 17th century, and unfolding over a 30-year period, it offers plenty of suspense and everyday detail about how Crusoe manages to stay alive. Additionally, it paints a fascinating portrait of the age—including references to slavery and Europe’s view of the 'New World.'",
        },
        {
            title: "Moby Dick",
            author: "Herman Melville",
            published: "1851",
            rating: 4.0,
            img: "/placeholder.svg",
            synopsis: "A shipwreck. A sole survivor, stranded on a deserted island. What could be more appealing to children than Robinson Crusoe’s amazing adventure? Set in the 17th century, and unfolding over a 30-year period, it offers plenty of suspense and everyday detail about how Crusoe manages to stay alive. Additionally, it paints a fascinating portrait of the age—including references to slavery and Europe’s view of the 'New World.'",
        },
    ];
    const totalPages = Math.ceil(books.length / entriesPerPage);

    const displayedBooks = books.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    return (
        <div className="p-6 w-[870px] mx-auto bg-white shadow-md rounded-md border border-grey">
            <h2 className="text-xl font-semibold mb-4">3 Results for "Robinson Crusoe"</h2>

            {/* Book Entry */}
            {displayedBooks.map((book, index) => (
                <div key={index} className="flex w-[800px] gap-4 p-4 border border-grey rounded-lg shadow-sm mb-6">
                    <div className="flex-shrink-0 w-[200px]">
                        <img
                            src={book.img || "https://via.placeholder.com/150x300"}
                            alt={`${book.title} Book Cover`}
                            className="w-full h-[300px] object-cover border border-grey rounded-md"
                        />
                        <p className="text-arcadia-red text-xs mt-2 cursor-pointer text-center">
                            Report a broken link or error
                        </p>
                    </div>


                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <div className="text-sm text-gray-700 mt-1">
                            <p><span className="font-semibold">Author:</span> {book.author}</p>
                            <p><span className="font-semibold">Published:</span> {book.published}</p>
                        </div>

                        <p className="text-sm text-gray-600 mt-2">
                            {book.synopsis}
                        </p>

                        <div className="flex items-center justify-end gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? " fill-bright-yellow" : "fill-grey"}`} />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                            <div className="flex items-center">
                                <span className="text-sm text-green-700 font-semibold ml-2 text-green">✓</span>
                                <span className="text-sm text-green-700 font-semibold ml-2">Is Available</span>
                            </div>
                            
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-4">
                            <button className="bg-arcadia-red text-white py-1 px-3 rounded-md text-sm hover:bg-red">
                                View Book
                            </button>
                            <button className="border border-gray-300 text-gray-700 py-1 px-4 rounded-md text-sm hover:bg-gray-100">
                                Reserve
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    className={`bg-arcadia-red text-white py-2 px-4 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700 hover:font-semibold"}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs">Page {currentPage} of {totalPages}</span>
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
}
