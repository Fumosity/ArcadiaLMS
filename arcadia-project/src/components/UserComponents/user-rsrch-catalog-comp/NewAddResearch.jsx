import React, { useEffect, useState } from "react";
import RsrchCards from "../user-home-comp/RsrchCards";
import { supabase } from "../../../supabaseClient";

const fetchNewlyAddedResearch = async () => {
    try {
        const { data: research, error } = await supabase
            .from("research")
            .select("*")
            .order("pubDate", { ascending: false })
            .limit(15);

        if (error) throw error;

        console.log({ research });
        return { research };
    } catch (error) {
        console.error("Error fetching newly added research:", error);
        return { research: [] };
    }
};

const NewAddResearch = ({ researchID, onSeeMoreClick }) => {
    useEffect(() => {
        fetchNewlyAddedResearch();
    }, [researchID]);

    return (
        <RsrchCards
            title="Recently Published"
            fetchResearch={fetchNewlyAddedResearch}
            onSeeMoreClick={() =>
                onSeeMoreClick("Recently Published", fetchNewlyAddedResearch)
            }
        />
    );
};

export default NewAddResearch;
