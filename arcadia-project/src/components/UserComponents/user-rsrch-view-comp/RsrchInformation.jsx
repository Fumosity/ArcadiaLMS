import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient"; // Adjust path if necessary
import { useLocation } from "react-router-dom";  // To read URL params
import { Star } from "lucide-react";

export default function RsrchInformation() {
    const [research, setResearch] = useState(null);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const researchId = queryParams.get("researchID");

    useEffect(() => {
        const fetchResearchDetails = async () => {
            if (researchId && !isNaN(researchId)) { 
                const { data, error } = await supabase
                    .from("research")
                    .select("*")
                    .eq("researchID", researchId)
                    .single();
    
                if (error) {
                    console.error("Error fetching research:", error);
                } else {
                    setResearch(data);
                }
            } else {
                console.error("Invalid or missing researchId");
            }
        };
    
        fetchResearchDetails();
    }, [researchId]);
    

    if (!research) {
        return <p>Loading...</p>; // Show loading state until research data is fetched
    }

    return (
        <div className="uMain-cont">
            {/* Main Research Info */}
            <div className="flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg shadow-sm mb-8">

                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{research.title}</h3>
                    <div className="text-sm text-gray-700 mt-3">
                        <p><span className="font-semibold">Authors:</span> <b>{research.author}</b></p>
                        <div className="flex space-x-6 mt-3">
                            <p><span className="font-semibold">Published:</span> <b>{research.pubDate}</b></p>
                            <p><span className="font-semibold">College:</span> <b>{research.college}</b></p>
                            <p><span className="font-semibold">Department:</span> <b>{research.department}</b></p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3">
                        {research.abstract || "No abstract available"}
                    </p>

                    <p className="text-sm mt-3">{research.keywords}</p>
                </div>
            </div>

            {/* Additional Information Section */}
            <div className="mt-4 border-t border-grey">
                <h4 className="text-lg font-semibold mt-4 mb-2">Research Preview</h4>
                <div className="flex items-center justify-center">
                    <img
                        src={research.img}
                        alt={`${research.title} Cover`}
                        className="w-[520px] h-[836px] border-2 bg-grey object-cover border-black"
                    />
                </div>
            </div>

            {/* Additional Information Section for Research */}
            <div className="mt-4 border-t border-grey">
                <h4 className="text-lg font-semibold mt-4 mb-2">Additional Information</h4>
                <div>
                    <p><span className="font-semibold">Keywords:</span> {research.keyword || "No keywords available"}</p>
                    <br />
                    <p><span className="font-semibold">Location:</span> {research.location || "No location available"}</p>
                    <br />
                    <p><span className="font-semibold">Abstract:</span> {research.abstract || "No abstract available"}</p>
                    <br />
                </div>
            </div>
        </div>
    );
}
