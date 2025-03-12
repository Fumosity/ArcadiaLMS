import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCards from "./BookCards";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed
import { supabase } from "../../../supabaseClient";

const fetchRecommendedBooks = async (userID, titleID) => {
    try {
        const response = await axios.post("http://localhost:8000/book-recommend", {
            userID,
            titleID: titleID || null,
        });

        const recommendations = response.data.recommendations || [];

        if (recommendations.length === 0) return [];

        console.log(recommendations)

        // Fetch genres and categories from book_genre_link and genre tables
        const titleIDs = recommendations.map(book => book.titleID);
        const { data: genreData, error: genreError } = await supabase
            .from("book_genre_link")
            .select("titleID, genreID, genres(genreID, genreName, category)")
            .in("titleID", titleIDs);

        if (genreError) throw genreError;

        // Map genres and categories to book titleIDs
        const genreMap = {};
        genreData.forEach(({ titleID, genres }) => {
            if (!genreMap[titleID]) {
                genreMap[titleID] = { genres: [], category: genres.category };
            }
            genreMap[titleID].genres.push(genres.genreName);
        });

        const { data: ratings, error: ratingError } = await supabase
            .from("ratings")
            .select("ratingValue, titleID")
            .in("titleID", titleIDs);

        if (ratingError) throw ratingError;

        const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
            if (!acc[titleID]) {
                acc[titleID] = { total: 0, count: 0 };
            }
            acc[titleID].total += ratingValue;
            acc[titleID].count += 1;
            return acc;
        }, {});

        // Merge recommendations with genre and category data
        const books = Object.values(recommendations).map(book => {
            const titleID = book.titleID;
            const avgRating =
                ratingMap[titleID]?.count > 0
                    ? ratingMap[titleID].total / ratingMap[titleID].count
                    : 0;

            return {
                ...book,
                weightedAvg: avgRating,
                totalRatings: ratingMap[titleID]?.count || 0,
                category: genreMap[book.titleID]?.category || "Unknown",
            }
        });

        console.log({books})

        return { books }
    } catch (error) {
        console.error("Error fetching recommended books:", error);
        return [];
    }
};

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
        <BookCards
            title="Recommended for You"
            fetchBooks={() => fetchRecommendedBooks(user.userID, titleID)}
            onSeeMoreClick={() => onSeeMoreClick("Recommended for You", () => fetchRecommendedBooks(user.userID, titleID))}
        />
    )
};

export default Recommended;
