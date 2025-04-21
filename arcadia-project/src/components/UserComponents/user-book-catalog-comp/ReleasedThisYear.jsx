import React from "react";
import BookCards from "../user-home-comp/BookCards";
import { supabase } from "/src/supabaseClient.js";

const fetchReleasedThisYearBooks = async () => {
    try {
        const currentYear = new Date().getFullYear();

        // Step 1: Fetch books released this year
        const { data: bookMetadata, error: bookError } = await supabase
            .from("book_titles")
            .select("titleID, title, author, cover, pubDate")
            .eq("pubDate", `${currentYear}`) // Fetch books from Jan 1 of the current year

        if (bookError) throw bookError;

        const titleIDs = bookMetadata.map(book => book.titleID);

        // Step 2: Fetch ratings
        const { data: ratings, error: ratingError } = await supabase
            .from("ratings")
            .select("ratingValue, titleID")
            .in("titleID", titleIDs);

        if (ratingError) throw ratingError;

        // Step 3: Fetch genres and categories
        const { data: genreData, error: genreError } = await supabase
            .from("book_genre_link")
            .select("titleID, genres(genreID, genreName, category)")
            .in("titleID", titleIDs);

        if (genreError) throw genreError;

        // Step 4: Structure genres and categories
        const genreMap = {};
        genreData.forEach(({ titleID, genres }) => {
            if (!genreMap[titleID]) {
                genreMap[titleID] = { genres: [], category: genres.category };
            }
            genreMap[titleID].genres.push(genres.genreName);
        });

        // Step 5: Calculate average ratings
        const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
            if (!acc[titleID]) {
                acc[titleID] = { total: 0, count: 0 };
            }
            acc[titleID].total += ratingValue;
            acc[titleID].count += 1;
            return acc;
        }, {});

        // Step 6: Combine book data with genres, category, and rating
        const booksWithDetails = bookMetadata.map(book => {
            const titleID = book.titleID;
            const avgRating = ratingMap[titleID] ? ratingMap[titleID].total / ratingMap[titleID].count : null;
            return {
                ...book,
                weightedAvg: avgRating,
                totalRatings: ratingMap[titleID]?.count || 0,
                genres: genreMap[titleID]?.genres || [],
                category: genreMap[titleID]?.category || "Unknown",
            };
        });

        return { books: booksWithDetails };
    } catch (error) {
        console.error("Error fetching books released this year:", error);
        return { books: [] };
    }
};

const ReleasedThisYear = ({ onSeeMoreClick }) => {
    return (
        <BookCards 
            title="Released This Year" 
            fetchBooks={fetchReleasedThisYearBooks} 
            onSeeMoreClick={() => onSeeMoreClick("Released This Year", fetchReleasedThisYearBooks)} 
        />
    );
};

export default ReleasedThisYear;
