import React, { useState, useEffect } from "react";
import axios from "axios";
import RsrchCards from "../user-home-comp/RsrchCards";
import api from "../../../api";

const fetchSimilarResearch = async (researchID) => {
    try {
        const response = await api.post("/research-recommend", { researchID });
        return { research: response.data.recommendations || [] };
    } catch (error) {
        console.error("Error fetching similar research:", error);
        return { research: [] };
    }
};

const SimRsrch = ({ research }) => {
    useEffect(() => {
        if (!research || !research.researchID) {
            console.warn("SimRsrch: Missing researchID prop");
        }
    }, [research]);

    if (!research) {
        return <p>Loading...</p>;
    }

    return (
        <RsrchCards
            title="Similar Research"
            fetchResearch={() => fetchSimilarResearch(research.researchID)}
        />
    );
};

export default SimRsrch;
