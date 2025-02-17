import React from "react";
import BookCards from "./BookCards";
import { supabase } from "/src/supabaseClient.js";

const fetchHighlyRatedBooks = async () => {
    try {
        // Step 1: Fetch all ratings with titleID
        const { data: ratings, error: ratingError } = await supabase
            .from("ratings")
            .select("ratingValue, titleID");

        if (ratingError) throw ratingError;

        // Step 2: Group ratings by titleID and calculate weighted average
        const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
            if (!acc[titleID]) {
                acc[titleID] = { total: 0, count: 0 };
            }
            acc[titleID].total += ratingValue;
            acc[titleID].count += 1;
            return acc;
        }, {});

        const bookIDs = Object.keys(ratingMap);

        // Step 3: Fetch book metadata from book_indiv and book_titles
        const { data: bookMetadata, error: bookError } = await supabase
            .from("book_indiv")
            .select("titleID, book_titles(titleID, title, author, cover)")
            .in("titleID", bookIDs);

        if (bookError) throw bookError;

        // Step 4: Fetch genres and categories using book_genre_link and genre tables
        const titleIDs = bookMetadata.map(book => book.book_titles.titleID);
        const { data: genreData, error: genreError } = await supabase
            .from("book_genre_link")
            .select("titleID, genreID, genres(genreID, genreName, category)")
            .in("titleID", titleIDs);

        if (genreError) throw genreError;

        // Step 5: Structure genres and categories
        const genreMap = {};
        genreData.forEach(({ titleID, genres }) => {
            if (!genreMap[titleID]) {
                genreMap[titleID] = { genres: [], category: genres.category };
            }
            genreMap[titleID].genres.push(genres.genreName);
        });

        // Step 6: Combine book data with genres, category, and rating
        const booksWithDetails = bookMetadata.map(book => {
            const titleID = book.book_titles.titleID;
            const avgRating = ratingMap[titleID].total / ratingMap[titleID].count;
            return {
                ...book.book_titles,
                weightedAvg: avgRating,
                totalRatings: ratingMap[titleID].count,
                genres: genreMap[titleID]?.genres || [],
                category: genreMap[titleID]?.category || "Unknown",
            };
        });

        // Step 7: Sort by highest weighted average rating
        return booksWithDetails.sort((a, b) => b.weightedAvg - a.weightedAvg);
    } catch (error) {
        console.error("Error fetching highly rated books:", error);
        return [];
    }
};

const HighlyRated = () => {
    return <BookCards title="Highly Rated" fetchBooks={fetchHighlyRatedBooks} />;
};

export default HighlyRated;
