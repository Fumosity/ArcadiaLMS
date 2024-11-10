import React, { useState } from "react";
import { Star } from "lucide-react";

export default function LatestNewsUpd() {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const books = [
        {
            title: "Celebrating World Mental Health Day",
            published: "October 10, 2024",
            more: "Read More",
            synopsis: "Today, we celebrate the power of nurturing our mental well-being. Explore books that offer... Today, we celebrate the power of nurturing our mental well-being. Explore books that offer... Today, we celebrate the power of nurturing our mental well-being. Explore books that offer...",
            img: "/placeholder.svg",
        },
        {
            title: "Santa’s Shelf: 2nd Round",
            published: "October 3, 2024",
            more: "Read More",
            synopsis: `It's the 2nd round of...🎅𝗦𝗮𝗻𝘁𝗮'𝘀 𝗦𝗵𝗲𝗹𝗳: 𝗞𝗿𝗶𝘀 𝗞𝗿𝗶𝗻𝗴𝗹𝗲 𝗮𝘁 𝗔𝗥𝗖!🎅
            This OCTOBER, we're challenging... It's the 2nd round of...🎅𝗦𝗮𝗻𝘁𝗮'𝘀 𝗦𝗵𝗲𝗹𝗳: 𝗞𝗿𝗶𝘀 𝗞𝗿𝗶𝗻𝗴𝗹𝗲 𝗮𝘁 𝗔𝗥𝗖!🎅
            This OCTOBER, we're challenging... It's the 2nd round of...🎅𝗦𝗮𝗻𝘁𝗮'𝘀 𝗦𝗵𝗲𝗹𝗳: 𝗞𝗿𝗶𝘀 𝗞𝗿𝗶𝗻𝗴𝗹𝗲 𝗮𝘁 𝗔𝗥𝗖!🎅
            This OCTOBER, we're challenging...`,
            img: "/placeholder.svg",
        },
        {
            title: "ARC Joins MIBF 2024!",
            published: "September 20, 2024",
            more: "Read More",
            synopsis: "On September 11, the Academic Resource Center librarians, alongside the QC 6 - Library Committee... On September 11, the Academic Resource Center librarians, alongside the QC 6 - Library Committee... On September 11, the Academic Resource Center librarians, alongside the QC 6 - Library Committee...",
            img: "/placeholder.svg",
        },
        {
            title: "Welcome back LYCEANS!",
            published: "August 29, 2024",
            more: "Read More",
            synopsis: "To celebrate the opening of classes, our library has a special treat for the first 15 borrowers from... To celebrate the opening of classes, our library has a special treat for the first 15 borrowers from... To celebrate the opening of classes, our library has a special treat for the first 15 borrowers from...",
            img: "/placeholder.svg",
        },
        {
            title: "Santa’s Shelf: 2nd Round",
            published: "October 3, 2024",
            more: "Read More",
            synopsis: `It's the 2nd round of...🎅𝗦𝗮𝗻𝘁𝗮'𝘀 𝗦𝗵𝗲𝗹𝗳: 𝗞𝗿𝗶𝘀 𝗞𝗿𝗶𝗻𝗴𝗹𝗲 𝗮𝘁 𝗔𝗥𝗖!🎅
            This OCTOBER, we're challenging... It's the 2nd round of...🎅𝗦𝗮𝗻𝘁𝗮'𝘀 𝗦𝗵𝗲𝗹𝗳: 𝗞𝗿𝗶𝘀 𝗞𝗿𝗶𝗻𝗴𝗹𝗲 𝗮𝘁 𝗔𝗥𝗖!🎅
            This OCTOBER, we're challenging... It's the 2nd round of...🎅𝗦𝗮𝗻𝘁𝗮'𝘀 𝗦𝗵𝗲𝗹𝗳: 𝗞𝗿𝗶𝘀 𝗞𝗿𝗶𝗻𝗴𝗹𝗲 𝗮𝘁 𝗔𝗥𝗖!🎅
            This OCTOBER, we're challenging...`,
            img: "/placeholder.svg",
        },
        {
            title: "ARC Joins MIBF 2024!",
            published: "September 20, 2024",
            more: "Read More",
            synopsis: "On September 11, the Academic Resource Center librarians, alongside the QC 6 - Library Committee... On September 11, the Academic Resource Center librarians, alongside the QC 6 - Library Committee... On September 11, the Academic Resource Center librarians, alongside the QC 6 - Library Committee...",
            img: "/placeholder.svg",
        },
        {
            title: "Welcome back LYCEANS!",
            published: "August 29, 2024",
            more: "Read More",
            synopsis: "To celebrate the opening of classes, our library has a special treat for the first 15 borrowers from... To celebrate the opening of classes, our library has a special treat for the first 15 borrowers from... To celebrate the opening of classes, our library has a special treat for the first 15 borrowers from...",
            img: "/placeholder.svg",
        },
        {
            title: "Celebrating World Mental Health Day",
            published: "October 10, 2024",
            more: "Read More",
            synopsis: "Today, we celebrate the power of nurturing our mental well-being. Explore books that offer... Today, we celebrate the power of nurturing our mental well-being. Explore books that offer... Today, we celebrate the power of nurturing our mental well-being. Explore books that offer...",
            img: "/placeholder.svg",
        },
    ];
    const totalPages = Math.ceil(books.length / entriesPerPage);

    const displayedBooks = books.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    return (
        <div className="uMain-cont">
            <h2 className="text-xl font-semibold mb-4">3 Results for "Robinson Crusoe"</h2>

            {/* Book Entry */}
            {displayedBooks.map((book, index) => (
                <div key={index} className="genCard-cont flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg shadow-sm mb-6">
                    <div className="flex-shrink-0 mt-2.5 mb-2.5 w-[200px] h-[150px]">
                        <img
                            src={book.img || "https://via.placeholder.com/200x150"}
                            alt={`${book.title} Book Cover`}
                            className="w-full h-full bg-grey object-cover border border-grey rounded-md"
                        />
                    </div>



                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{book.title}</h3>

                        <p className="text-sm text-gray-600 mt-1.5">
                            {book.published}
                        </p>


                        <p className="text-sm text-gray-600 1.5">
                            {book.synopsis}
                        </p>


                        <div className="text-sm text-gray-700 mt-1.5">
                            <p className="text-sm text-gray-600">
                                {book.more}
                            </p>
                        </div>






                    </div>
                </div>
            ))}

            {/* Pagination */}
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
        </div>
    );
}
