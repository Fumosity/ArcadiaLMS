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

const ARViewer = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const thesisID = queryParams.get('thesisID'); // Get thesisID from query params

    const [researchData, setResearchData] = useState(null);

    useEffect(() => {
        const fetchResearchDetails = async () => {
            const { data, error } = await supabase
                .from('research')
                .select('*')
                .eq('thesisID', thesisID)
                .single(); // Fetch the single research record

            if (error) {
                console.error("Error fetching research details:", error);
            } else {
                setResearchData(data);
            }
        };

        if (thesisID) {
            fetchResearchDetails();
        }
    }, [thesisID]);

    if (!researchData) {
        return <div>Loading...</div>; // Show loading while fetching data
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Title>User Account Viewer</Title>

            {/* Main content section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Left side content */}
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <ARTitle researchData={researchData} /> {/* Pass research data to ARTitle */}
                        </div>
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <ARFullText />
                        </div>
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <ARPastReview />
                        </div>
                    </div>

                    {/* Right side content */}
                    <div className="lg:col-span-1 space-y-8">
                        <ARAbout researchData={researchData} /> {/* Pass research data to ARAbout */}
                        <PopularAmong />
                        <SimilarTo />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ARViewer;
