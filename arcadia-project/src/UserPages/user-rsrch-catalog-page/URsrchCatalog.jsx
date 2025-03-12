import React, { useState, useEffect } from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../components/main-comp/Title";
import URFilterSidebar from "../../components/UserComponents/user-rsrch-catalog-comp/URFilterSidebar";
import UResResults from "../../UserPages/user-rsrch-catalog-page/UResResults";
import USearchBarR from "../../components/UserComponents/user-main-comp/USearchBarR";
import SimRsrch from "../../components/UserComponents/user-rsrch-catalog-comp/SimRsrch";
import ResearchRecommend from "../../components/UserComponents/user-rsrch-catalog-comp/ResearchRecommend";
import NewAddResearch from "../../components/UserComponents/user-rsrch-catalog-comp/NewAddResearch";
import { useUser } from "../../backend/UserContext";
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";

const URsrchCatalog = () => {
    const [query, setSearchQuery] = useState("");
    const { user, updateUser } = useUser();
    const queryParams = new URLSearchParams(location.search);
    const researchID = queryParams.get("researchID");
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    console.log(user)

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!researchID) {
                setError("Title ID not provided");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("research")
                .select("*")
                .eq("researchID", researchID)
                .single();

            if (error || !data) {
                console.error("Error fetching or no data:", error);
                setError("Failed to fetch research details or book not found");
                setLoading(false);
                return;
            }

            setLoading(false);
        };

        fetchBookDetails();
    }, [researchID]);

    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <USearchBarR placeholder="Search for research..." onSearch={setSearchQuery} />
            <Title>Research Catalog</Title>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    {query.trim() && <div className="lg:w-1/4 md:w-1/3 w-full space-y-4 sticky top-5">
                        <URFilterSidebar />
                    </div>}
                    {!query.trim() && <div className="lg:w-1/4 md:w-1/3 w-full space-y-4">
                        <ArcOpHr />
                        <UpEvents />
                        <Services />
                    </div>}
                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        {query && <UResResults query={query} />}
                        <ResearchRecommend />
                        <NewAddResearch />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default URsrchCatalog;
