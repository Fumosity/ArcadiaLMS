import React, { useState } from "react";
import { Star } from "lucide-react";

export default function RsrchSearchResults() {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const rsrchs = [
        {
            title: "Arcadia: Enhancing the Library Management System of the LPU-C Academic Resource Center",
            authors: "Y. Mirasol, K. Marpuri, V. Fadri, L. Sambile",
            published: "2016",
            college: "COECSA",
            dept: "DCS",
            img: "/placeholder.svg",
            abstract: "Abstract: In today’s digital age, libraries’ roles as knowledge repositories and information gateways have expanded significantly (A. Meena, 2024). With the exponential increase of academic literature and the growing demand for access to different resources, efficient and accessible library systems have become essential (Ashmore, et al., 2020).",
            keywords: "Keywords: artificial intelligence; library management system; algorithms; computer science; knn",
        },
        {
            title: "Arcadia: Enhancing the Library Management System of the LPU-C Academic Resource Center",
            authors: "Y. Mirasol, K. Marpuri, V. Fadri, L. Sambile",
            published: "2016",
            college: "COECSA",
            dept: "DCS",
            img: "/placeholder.svg",
            abstract: "Abstract: In today’s digital age, libraries’ roles as knowledge repositories and information gateways have expanded significantly (A. Meena, 2024). With the exponential increase of academic literature and the growing demand for access to different resources, efficient and accessible library systems have become essential (Ashmore, et al., 2020).",
            keywords: "Keywords: artificial intelligence; library management system; algorithms; computer science; knn",

        },
        {
            title: "Arcadia: Enhancing the Library Management System of the LPU-C Academic Resource Center",
            authors: "Y. Mirasol, K. Marpuri, V. Fadri, L. Sambile",
            published: "2016",
            college: "COECSA",
            dept: "DCS",
            img: "/placeholder.svg",
            abstract: "Abstract: In today’s digital age, libraries’ roles as knowledge repositories and information gateways have expanded significantly (A. Meena, 2024). With the exponential increase of academic literature and the growing demand for access to different resources, efficient and accessible library systems have become essential (Ashmore, et al., 2020).",
            keywords: "Keywords: artificial intelligence; library management system; algorithms; computer science; knn",

        }
    ];
    const totalPages = Math.ceil(rsrchs.length / entriesPerPage);

    const displayedRsrchs = rsrchs.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    return (
        <div className="uMain-cont">
            <h2 className="text-xl font-semibold mb-4">3 Results for "algorithms"</h2>

            {/* Book Entry */}
            {displayedRsrchs.map((rsrch, index) => (
                <div key={index} className="genCard-cont flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg mb-6">
                    <div className="flex-shrink-0 w-[200px]">
                        <img
                            src={rsrch.img || "https://via.placeholder.com/150x300"}
                            alt={`${rsrch.title} Book Cover`}
                            className="w-full h-[300px] bg-grey object-cover border border-grey rounded-md"
                        />
                        <p className="text-arcadia-red text-xs mt-2 cursor-pointer text-center underline">
                            Report a broken link or error
                        </p>
                    </div>


                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{rsrch.title}</h3>
                        <div className="text-sm text-gray-700 mt-3">
                            <p><span>Authors:</span> <b>{rsrch.authors}</b></p>
                            <div className="flex space-x-6 mt-3">
                                <p><span>Published:</span> <b>{rsrch.published}</b></p>
                                <p><span>College:</span> <b>{rsrch.college}</b></p>
                                <p><span>Department:</span> <b>{rsrch.dept}</b></p>
                            </div>

                        </div>

                        <p className="text-sm text-gray-600 mt-3">
                            {rsrch.abstract}
                        </p>

                        <p className="text-sm mt-3">{rsrch.keywords}</p>

                        <div className="flex align-baseline items-center justify-end gap-4 mt-2">

                            <div className="flex items-center">
                                <span className="text-sm text-green-700 font-semibold ml-2 text-green">✓</span>
                                <span className="text-sm text-green-700 font-semibold ml-2">Is Available</span>
                            </div>



                            
                                <button className="viewRsrch-btn">
                                    View Research
                                </button>

                            
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
