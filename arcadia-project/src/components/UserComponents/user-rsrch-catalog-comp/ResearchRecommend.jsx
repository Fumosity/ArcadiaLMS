import React, { useEffect, useState } from "react";
import axios from "axios";
import RsrchCards from "../user-home-comp/RsrchCards";
import { useUser } from "../../../backend/UserContext";
import { supabase } from "../../../supabaseClient";

const fetchRecommendedBooks = async (userID, titleID) => {
    // Placeholder book data
    const books = [
        { pdf: "dadad", researchID: 12, title: "Designing Data-Intensive Applications", author: ["Marcus Oliveira", "Israel Quinto", "Takumi Sato", "Gwenne Masila"], college: "COECSA", department: "DCS", pubDate: 2023, abstract: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham." },
        { researchID: 34, title: "Departing Tourism in War-torn Areas of Mindanao", author: ["Karen Rubio", "Rafael Villafuerte", "Lucia Ferrer"], college: "CITHM", department: "", pubDate: 2020, abstract: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham." },
        { pdf: "dadad",researchID: 21, title: "Feasibility Study of Crypto-based Public Transport", author: ["Ellaine Mambato", "Michael Arroyo"], college: "CBA", department: "", pubDate: 2019, abstract: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham." },
        { researchID: 25, title: "Aftereffects of Steroidal Solutions for Victims of Blunt-force Trauma", author: ["John Carlo Flores", "Christian Mercado", "Andrea Mendoza"],  college: "CAMS", department: "", pubDate: 2014, abstract: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham." },
        { researchID: 52, title: "Anime and its Consequences", author: ["Han Jae-in", "Julian Torres"],  college: "CLAE", department: "", pubDate: 2018, abstract: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham." },
    ];
    return { books }
}

const Recommended = ({ titleID, onSeeMoreClick }) => {
    const { user } = useUser(); // Global user state from context

    useEffect(() => {
        if (!user || !user.userID) return; // Ensure user is loaded before fetching
    }, [user, titleID]);

    if (!user || !user.userID) {
        console.log("Recommended: Guest Mode");
        return;
    }

    return (
        <RsrchCards
            title="Recommended for You"
            fetchResearch={() => fetchRecommendedBooks(user.userID, titleID)}
            onSeeMoreClick={() => onSeeMoreClick("Recommended for You", () => fetchRecommendedBooks(user.userID, titleID))}
        />
    )
};

export default Recommended;
