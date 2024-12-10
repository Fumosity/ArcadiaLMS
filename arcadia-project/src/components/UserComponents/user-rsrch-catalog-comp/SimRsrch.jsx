import React, { useState, useEffect } from "react";
import axios from "axios";

const SimRsrch = ({ research }) => {
    const [researches, setResearch] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    console.log("Current Title", research)

    useEffect(() => {
        const fetchRecommendations = async () => {
            setIsLoading(true);  // Set loading at start
            try {
                const response = await axios.post("http://localhost:8000/research-recommend", {
                    researchID: research.researchID,
                });
                setResearch(response.data.recommendations || []);
                setIsLoading(false);  // End loading after success
                console.log('WHAT IS THIS?', response.data)

                console.log("SimResearch Response\n", response.data);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Failed to fetch similar research.");
                setIsLoading(false);  // End loading on error

            }
        };

        if (research) {
            fetchRecommendations();
        }
    }, [research]);

    if (!research) {
        console.warn("Missing researchID prop");
    }

    if (!research) {
        return <p>Loading...</p>;
    }

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Similar Research</h2>
            </div>

            {/* Research Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {researches.length > 0 ? (
                    researches.map((item) => (
                        <a
                            key={item.researchID}  // Correct unique key here
                            href={`http://localhost:5173/user/researchview?researchID=${item.researchID}`}
                            className="block"
                        >
                            <div className="genCard-cont">
                                <img
                                    src={item.cover || "https://via.placeholder.com/150x200"}
                                    alt={item.title}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2 truncate">{item.title}</h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">{item.college}</p>
                                {item.department && item.department !== "N/A" && (
                                    <p className="text-xs text-gray-400 mb-2 truncate">{item.department}</p>
                                )}
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

export default SimRsrch;
