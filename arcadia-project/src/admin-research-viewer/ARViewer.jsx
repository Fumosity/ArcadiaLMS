import React, { useEffect, useState } from "react";
import Title from "../components/main-comp/Title";
import ARTitle from "../components/admin-research-viewer/ARTitle";
import ARFullText from "../components/admin-research-viewer/ARFullText";
import ARAbout from "../components/admin-research-viewer/ARAbout";
import PopularAmong from "../components/admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../components/admin-book-viewer-comp/SimilarTo";
import ARPastReview from "../components/admin-research-viewer/ARPastReview";
import { supabase } from "/src/supabaseClient.js";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Pathfinder from "../components/UserComponents/pathfinder-comp/Pathfinder";

const ARViewer = () => {
    useEffect(() => {
        document.title = "Arcadia | Research View";
    }, []);
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const researchID = queryParams.get('researchID'); // Get researchID from query params

    const [researchData, setResearchData] = useState(null);

    useEffect(() => {
        const fetchResearchDetails = async () => {
            const { data, error } = await supabase
                .from('research')
                .select('*')
                .eq('researchID', researchID)
                .single(); // Fetch the single research record

            if (error) {
                console.error("Error fetching research details:", error);
            } else {
                setResearchData(data);
                console.log("research data", data)
            }
        };

        if (researchID) {
            fetchResearchDetails();
        }
    }, [researchID]);

    if (!researchData) {
        return <div>Loading...</div>; // Show loading while fetching data
    }

    return (
        <div className="min-h-screen bg-white">
            <Title>Research Viewer</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4 space-y-2">
                    <div className="flex justify-between w-full gap-2">
                        <button
                            className="add-book mb-0 w-1/2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => navigate('/admin/researchmanagement')}
                        >
                            Return to Research Inventory
                        </button>
                    </div>
                    <ARTitle researchData={researchData} /> {/* Pass research data to ARTitle */}
                    <Pathfinder book={researchData}/>
            
                    <ARFullText researchData={researchData} />
                </div>

                <div className="flex flex-col items-start flex-shrink-0 w-1/4">
                    <ARAbout researchData={researchData} /> {/* Pass research data to ARAbout */}            
                </div>
            </div>
        </div >
    );
};

export default ARViewer;
