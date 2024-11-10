import React, { useState } from "react";
import { Star } from "lucide-react";

export default function RsrchInformation() {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const books = [
        {
            title: "Arcadia: Enhancing the Library Management System of the LPU-C Academic Resource Center",
            authors: "Y. Mirasol, K. Marpuri, V. Fadri, L. Sambile",
            published: "2016",
            college: "COECSA",
            dept: "DCS",
            rating: 4.5,
            img: "/placeholder.svg",
            abstract: "Abstract: In today’s digital age, libraries’ roles as knowledge repositories and information gateways have expanded significantly (A. Meena, 2024). With the exponential increase of academic literature and the growing demand for access to different resources, efficient and accessible library systems have become essential (Ashmore, et al., 2020).",
            keywords: "Keywords: artificial intelligence; library management system; algorithms; computer science; knn",
        },
    ];
    const totalPages = Math.ceil(books.length / entriesPerPage);

    const displayedBooks = books.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    return (
        <div className="uMain-cont">
            {/* Book Entry */}
            {displayedBooks.map((book, index) => (
                <div key={index}>
                    {/* Main Book Info */}
                    <div className="flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg shadow-sm mb-8">
                        <div className="flex-shrink-0 w-[200px]">
                            <img
                                src={book.img || "https://via.placeholder.com/150x300"}
                                alt={`${book.title} Book Cover`}
                                className="w-full h-[300px] bg-grey object-cover border border-grey rounded-md"
                            />
                            <p className="text-arcadia-red text-xs mt-2 cursor-pointer text-center underline">
                                Report a broken link or error
                            </p>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            <div className="text-sm text-gray-700 mt-3">
                                <p><span>Authors:</span> <b>{book.authors}</b></p>
                                <div className="flex space-x-6 mt-3">
                                    <p><span>Published:</span> <b>{book.published}</b></p>
                                    <p><span>College:</span> <b>{book.college}</b></p>
                                    <p><span>Department:</span> <b>{book.dept}</b></p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-3">
                                {book.abstract}
                            </p>

                            <p className="text-sm mt-3">{book.keywords}</p>
                            <div className="flex items-center justify-start gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? " fill-bright-yellow" : "fill-grey"}`} />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">{book.rating}</span>

                                <button className="viewBk-btn ml-3">
                                    Rate
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="mt-4 border-t border-grey">
                        <h4 className="text-lg font-semibold mt-4 mb-2">Research Preview</h4>
                        <div className="flex items-center justify-center">
                            <img
                                src={book.img}
                                alt={`${book.title} Book Cover`}
                                className="w-[520px] h-[836px] border-2 bg-grey object-cover border-black"
                            />
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
}
