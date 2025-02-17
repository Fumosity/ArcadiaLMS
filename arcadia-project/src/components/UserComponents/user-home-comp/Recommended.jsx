import React from "react";
import axios from "axios";
import BookCards from "./BookCards";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed
import { supabase } from "/src/supabaseClient.js";

const fetchRecommendedBooks = async (userID, titleID) => {
    try {
        const response = await axios.post("http://localhost:8000/book-recommend", {
            userID,
            titleID: titleID || null,
        });

        const recommendations = response.data.recommendations || [];

        // Fetch genres and categories from book_genre_link and genre tables
        const titleIDs = recommendations.map(book => book.titleID);
        const { data: genreData, error: genreError } = await supabase
            .from("book_genre_link")
            .select("titleID, genreID, genres(genreID, genreName, category)")
            .in("titleID", titleIDs);

        if (genreError) throw genreError;

        // Map genres and categories to book titleIDs
        const genreMap = {};
        genreData.forEach(({ titleID, genre }) => {
            if (!genreMap[titleID]) {
                genreMap[titleID] = { genres: [], category: genre.category };
            }
            genreMap[titleID].genres.push(genre.genreName);
        });

        // Merge recommendations with genre and category data
        return recommendations.map(book => ({
            ...book,
            genres: genreMap[book.titleID]?.genres || [],
            category: genreMap[book.titleID]?.category || "Unknown",
        }));
    } catch (error) {
        console.error("Error fetching recommended books:", error);
        return [];
    }
};

const Recommended = ({ userID, titleID }) => {
    const { user, updateUser } = useUser(); // Global user state from context

    console.log(user)
    console.log(user.userID)
    
    userID = user.userID

    if (!userID) {
        console.error("Recommended: userID is undefined!");
        return <p>Error: User not found.</p>;
    }

    return <BookCards title="Recommended for You" fetchBooks={() => fetchRecommendedBooks(userID, titleID)} />;
};

export default Recommended;
