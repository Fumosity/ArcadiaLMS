import React from "react";
import BookCards from "./BookCards";
import { supabase } from "/src/supabaseClient.js";

const fetchMostPopularBooks = async () => {
    try {
        // Step 1: Get all "Borrowed" transactions with the bookID
        const { data: transactions, error: transactionError } = await supabase
            .from("book_transactions")
            .select("bookID");

        if (transactionError) throw transactionError;

        const { data: ratings, error: ratingError } = await supabase
            .from("ratings")
            .select("ratingValue, titleID");

        if (ratingError) throw ratingError;

        // Step 2: Count the number of borrows for each bookID
        const borrowCountMap = transactions.reduce((acc, transaction) => {
            acc[transaction.bookID] = (acc[transaction.bookID] || 0) + 1;
            return acc;
        }, {});

        const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
            if (!acc[titleID]) {
                acc[titleID] = { total: 0, count: 0 };
            }
            acc[titleID].total += ratingValue;
            acc[titleID].count += 1;
            return acc;
        }, {});

        // Step 3: Get book details for each bookID, joining with book_titles
        const bookIDs = Object.keys(borrowCountMap);
        const { data: bookMetadata, error: bookError } = await supabase
            .from("book_indiv")
            .select("bookID, book_titles(titleID, title, author, cover)")
            .in("bookID", bookIDs);

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

        let books = booksWithDetails.sort((a, b) => b.borrowCount - a.borrowCount)
        return { books };
    } catch (error) {
        console.error("Error fetching most popular books:", error);
        return [];
    }
};

const MostPopular = ({ onSeeMoreClick }) => {
    return(
    <BookCards 
            title="Most Popular" 
            fetchBooks={fetchMostPopularBooks} 
            onSeeMoreClick={() => onSeeMoreClick("Most Popular", fetchMostPopularBooks)} 
        />)
};

export default MostPopular;
