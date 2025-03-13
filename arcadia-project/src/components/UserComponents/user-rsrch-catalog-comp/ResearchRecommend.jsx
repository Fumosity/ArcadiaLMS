import React, { useEffect, useState } from "react";
import RsrchCards from "../user-home-comp/RsrchCards";
import { useUser } from "../../../backend/UserContext";
import { supabase } from "../../../supabaseClient";

const fetchRecommendedResearch = async (userCollege, userDepartment) => {
    try {
        console.log(userCollege, userDepartment);
        
        let query = supabase.from("research").select("*");

        if (userCollege === "COECSA") {
            // Fetch COECSA research (prioritizing same department)
            const { data: research, error: researchError } = await query.eq("college", "COECSA");

            if (researchError) throw researchError;

            const currentYear = new Date().getFullYear();
            const fiveYearsAgo = currentYear - 5;

            // Sort by department first, then prioritize within COECSA
            const sortedResearch = research
                .map((paper) => ({
                    ...paper,
                    isSameDepartment: paper.department === userDepartment ? 1 : 0, // Highest priority
                    priority: (paper.pdf ? 2 : 0) + (paper.pubdate >= fiveYearsAgo ? 1 : 0), 
                    random: Math.random(),
                }))
                .sort((a, b) => 
                    b.isSameDepartment - a.isSameDepartment || // Same department first
                    b.priority - a.priority || 
                    b.random - a.random
                )
                .slice(0, 15); // Limit to 15 results

            console.log({ sortedResearch });
            return { research: sortedResearch };

        } else {
            // Default behavior for other colleges
            const { data: research, error: researchError } = await query.eq("college", userCollege);

            if (researchError) throw researchError;

            const currentYear = new Date().getFullYear();
            const fiveYearsAgo = currentYear - 5;

            const sortedResearch = research
                .map((paper) => ({
                    ...paper,
                    priority: (paper.pdf ? 2 : 0) + (paper.pubdate >= fiveYearsAgo ? 1 : 0), 
                    random: Math.random(),
                }))
                .sort((a, b) => 
                    b.priority - a.priority || b.random - a.random
                )
                .slice(0, 15);

            console.log({ sortedResearch });
            return { research: sortedResearch };
        }
    } catch (error) {
        console.error("Error fetching recommended research:", error);
        return { research: [] };
    }
};

const Recommended = ({ researchID, onSeeMoreClick }) => {
    const { user } = useUser();

    useEffect(() => {
        if (!user || !user.userID) return;
    }, [user, researchID]);

    if (!user || !user.userID) {
        console.log("Recommended: Guest Mode");
        return;
    }

    return (
        <RsrchCards
            title="Recommended for You"
            fetchResearch={() => fetchRecommendedResearch(user.userCollege, user.userDepartment)}
            onSeeMoreClick={() =>
                onSeeMoreClick("Recommended for You", () => fetchRecommendedResearch(user.userCollege, user.userDepartment))
            }
        />
    );
};


export default Recommended;
