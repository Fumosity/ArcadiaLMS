import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const UResResults = ({ query }) => {
    const [researchList, setResearchList] = useState([]);
    const [filteredResearch, setFilteredResearch] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResearch = async () => {
            const { data, error } = await supabase.from("research").select("*");
            if (error) {
                console.error("Error fetching research data:", error);
            } else {
                setResearchList(data);
            }
        };

        fetchResearch();
    }, []);

    useEffect(() => {
        if (query) {
            const searchQuery = query.toLowerCase();
            const results = researchList.filter((research) => {
                const titleMatch = research.title.toLowerCase().includes(searchQuery);
                const authorString = research.author && Array.isArray(research.author)
                    ? research.author.join(", ").toLowerCase()
                    : "";
                const authorMatch = authorString.includes(searchQuery);
                return titleMatch || authorMatch;
            });
            setFilteredResearch(results);
        } else {
            setFilteredResearch(researchList);
        }
    }, [query, researchList]);

    const totalPages = Math.ceil(filteredResearch.length / entriesPerPage);
    const displayedResearch = filteredResearch.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    return (
        <div className="uMain-cont">
            {query && filteredResearch.length > 0 && (
                <h2 className="text-xl font-semibold mb-4">
                    {filteredResearch.length} results for "{query}"
                </h2>
            )}

            {query && filteredResearch.length === 0 && (
                <p className="text-lg text-gray-500 mb-4">No results for "{query}"</p>
            )}

            {displayedResearch.map((research, index) => (
                <div
                    key={index}
                    className="genCard-cont flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg mb-6"
                >
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{research.title}</h3>
                        <div className="text-sm text-gray-700 mt-3">
                            <p>
                                <span>Author(s):</span> <b>{research.author}</b>
                            </p>
                            <p className="mt-3">
                                <span>Published:</span> <b>{research.pubDate}</b>
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 mt-3">
                            {research.abstract || "No abstract available"}
                        </p>
                        <div className="flex align-baseline items-center justify-end gap-2 mt-2">
                            <button
                                className="viewRsrch-btn"
                                onClick={() => navigate(`/user/researchview?researchID=${research.researchID}`)}
                            >
                                View Research
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {filteredResearch.length > 0 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red"
                            }`}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous Page
                    </button>
                    <span className="text-xs">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-red"
                            }`}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next Page
                    </button>
                </div>
            )}
        </div>
    );
};

export default UResResults;
