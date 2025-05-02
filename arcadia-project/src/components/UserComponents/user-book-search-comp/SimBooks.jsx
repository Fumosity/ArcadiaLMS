import React from "react";
import axios from "axios";
import { supabase } from "../../../supabaseClient";
import BookCards from "../user-home-comp/BookCards";
import api from "../../../api";

export const fetchSimilarBooks = async (titleID, userID) => {
    try {
        // Step 1: Fetch recommended books
        const response = await api.post(`/book-recommend`, {
            userID: null,
            titleID
        });
        const recommendedBooks = response.data.recommendations || [];

        if (recommendedBooks.length === 0) {
            return { books: [] };
        }

        // Extract titleIDs from recommended books
        const titleIDs = recommendedBooks.map(book => book.titleID);

        // Step 2: Fetch ratings for these books
        const { data: ratings, error: ratingError } = await supabase
            .from("ratings")
            .select("titleID, ratingValue")
            .in("titleID", titleIDs);

        if (ratingError) throw ratingError;

        // Step 3: Compute average rating per titleID
        const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
            if (!acc[titleID]) {
                acc[titleID] = { total: 0, count: 0 };
            }
            acc[titleID].total += ratingValue;
            acc[titleID].count += 1;
            return acc;
        }, {});

        // Step 4: Fetch genres and categories
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

        // Step 6: Attach ratings, genres, and category to books
        const books = recommendedBooks.map(book => {
            const avgRating =
                ratingMap[book.titleID]?.count > 0
                    ? ratingMap[book.titleID].total / ratingMap[book.titleID].count
                    : 0;

            return {
                ...book,
                weightedAvg: avgRating,
                totalRatings: ratingMap[book.titleID]?.count || 0,
                genres: genreMap[book.titleID]?.genres || [],
                category: genreMap[book.titleID]?.category || "Unknown",
            };
        });

        return { books };
    } catch (error) {
        console.error("Error fetching similar books:", error);
        return { books: [] };
    }
};

const SimBooks = ({ titleID, userID, onSeeMoreClick }) => {
    return (
        <BookCards 
            title="Similar Books"
            fetchBooks={() => fetchSimilarBooks(titleID, userID)}
            onSeeMoreClick={null}
        />
    );
};

export default SimBooks;
