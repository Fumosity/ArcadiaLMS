import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import BookCards from "../user-home-comp/BookCards";

const fetchNonfictionBooks = async () => {
    try {
        // Fetch books metadata
        const { data: bookMetadata, error: bookError } = await supabase
            .from("book_titles")
            .select("titleID, title, author, cover")
            .order("procurementDate", { ascending: false });

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

        // Structure genres and filter Non-fiction books
        const genreMap = {};
        genreData.forEach(({ titleID, genres }) => {
            if (!genreMap[titleID]) {
                genreMap[titleID] = { genres: [], category: genres.category };
            }
            genreMap[titleID].genres.push(genres.genreName);
        });

        const nonfictionBooks = bookMetadata.filter(book => genreMap[book.titleID]?.category === "Non-fiction");

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
        const booksWithDetails = nonfictionBooks.map(book => {
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
        console.error("Error fetching Non-fiction books:", error);
        return { books: [] };
    }
};

const Nonfiction = ({ onSeeMoreClick }) => {
    return (
        <BookCards 
            title="Non-fiction" 
            fetchBooks={fetchNonfictionBooks} 
            onSeeMoreClick={() => onSeeMoreClick("Non-fiction", fetchNonfictionBooks)} 
        />
    );
};

export default Nonfiction;
