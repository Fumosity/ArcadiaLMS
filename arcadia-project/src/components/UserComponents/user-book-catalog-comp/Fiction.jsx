import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import BookCards from "../user-home-comp/BookCards";

export const fetchFictionBooks = async () => {
    try {
        // Fetch user preferred genres
        const { data: userGenresData, error: userGenresError } = await supabase
            .from("user_genre_link")
            .select("genreID");

        if (userGenresError) throw userGenresError;

        const userGenres = userGenresData.map(g => g.genreID);

        // Fetch books metadata
        const { data: bookMetadata, error: bookError } = await supabase
            .from("book_titles")
            .select("titleID, title, author, cover")
            .order("titleID", { ascending: false });

        if (bookError) throw bookError;

        const titleIDs = bookMetadata.map(book => book.titleID);

        // Fetch genres and categories
        const { data: genreData, error: genreError } = await supabase
            .from("book_genre_link")
            .select("titleID, genres(genreID, genreName, category)")
            .in("titleID", titleIDs);

        if (genreError) throw genreError;

        // Fetch ratings
        const { data: ratings, error: ratingError } = await supabase
            .from("ratings")
            .select("ratingValue, titleID")
            .in("titleID", titleIDs);

        if (ratingError) throw ratingError;

        // Structure genres and filter Fiction books
        const genreMap = {};
        genreData.forEach(({ titleID, genres }) => {
            if (!genreMap[titleID]) {
                genreMap[titleID] = { genres: [], category: genres.category };
            }
            genreMap[titleID].genres.push(genres.genreName);
        });

        const fictionBooks = bookMetadata.filter(book => genreMap[book.titleID]?.category === "Fiction");

        // Calculate average ratings
        const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
            if (!acc[titleID]) {
                acc[titleID] = { total: 0, count: 0 };
            }
            acc[titleID].total += ratingValue;
            acc[titleID].count += 1;
            return acc;
        }, {});

        // Combine book data with genres, category, and rating
        const booksWithDetails = fictionBooks.map(book => {
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

        // Prioritize books that match user genres
        const prioritizedBooks = booksWithDetails.sort((a, b) => {
            const aPriority = a.genres.some(g => userGenres.includes(g)) ? 1 : 0;
            const bPriority = b.genres.some(g => userGenres.includes(g)) ? 1 : 0;
            return bPriority - aPriority || Math.random() - 0.5;
        });

        return { books: prioritizedBooks };
    } catch (error) {
        console.error("Error fetching Fiction books:", error);
        return { books: [] };
    }
};

const Fiction = ({ onSeeMoreClick }) => {
    return (
        <BookCards 
            title="Fiction" 
            fetchBooks={fetchFictionBooks} 
            onSeeMoreClick={() => onSeeMoreClick("Fiction", fetchFictionBooks)} 
        />
    );
};

export default Fiction;
