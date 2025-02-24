import React from "react";
import BookCards from "../user-home-comp/BookCards";
import { supabase } from "/src/supabaseClient.js";

const fetchNewlyAddedBooks = async () => {
    try {
        // Step 1: Fetch the most recently procured books from book_titles
        const { data: bookMetadata, error: bookError } = await supabase
            .from("book_titles")
            .select("titleID, title, author, cover, procurementDate")
            .order("procurementDate", { ascending: false }) // Newest books first
            .limit(20);

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
                totalRatings: ratingMap[titleID]?.count,
                genres: genreMap[titleID]?.genres || [],
                category: genreMap[titleID]?.category || "Unknown",
            };
        });

        return { books: booksWithDetails };
    } catch (error) {
        console.error("Error fetching newly added books:", error);
        return { books: [] };
    }
};

const NewlyAdded = ({ onSeeMoreClick }) => {
    return (
        <BookCards 
            title="Newly Added" 
            fetchBooks={fetchNewlyAddedBooks} 
            onSeeMoreClick={() => onSeeMoreClick("Newly Added", fetchNewlyAddedBooks)} 
        />
    );
};

export default NewlyAdded;
