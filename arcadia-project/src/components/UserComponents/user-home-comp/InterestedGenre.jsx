import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js";
import BookCards from "./BookCards";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed

const fetchBooksByUserInterest = async (userID) => {
    try {
        const { data: userGenres, error: userGenresError } = await supabase
            .from("user_genre_link")
            .select("genreID, genres(genreID, genreName, category)") // Include category
            .eq("userID", userID);

        if (userGenresError) throw userGenresError;
        if (!userGenres || userGenres.length === 0) return { genreName: "Unknown", books: [] };

        const randomGenre = userGenres[Math.floor(Math.random() * userGenres.length)];

        const { data: bookGenreLinks, error: bookError } = await supabase
            .from("book_genre_link")
            .select("titleID, book_titles(titleID, title, author, cover), genres(genreID, genreName, category)") // Include category and genre
            .eq("genreID", randomGenre.genreID);

        if (bookError) throw bookError;

        const titleIDs = bookGenreLinks.map(link => link.titleID);

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

        const books = bookGenreLinks.map(link => {
            const titleID = link.titleID;
            const avgRating = ratingMap[titleID] ? ratingMap[titleID].total / ratingMap[titleID].count : null;
            const totalRatings = ratingMap[titleID] ? ratingMap[titleID].count : 0;
            return {
                ...link.book_titles,
                weightedAvg: avgRating,
                totalRatings: totalRatings,
                genres: link.genres.genreName, // Add genre information
                category: link.genres.category, // Add category information
            };
        });

        return { genreName: randomGenre.genres.genreName, books };
    } catch (error) {
        console.error("Error fetching books by user interest:", error);
        return { genreName: "Unknown", books: [] };
    }
};

const InterestedGenre = ({ userID }) => {
    const { user } = useUser(); // Global user state from context
    const [genreName, setGenreName] = useState("");

    userID = user?.userID || userID;

    useEffect(() => {
        if (!userID) {
            console.error("InterestedGenre: userID is undefined!");
            return;
        }

        const fetchData = async () => {
            try {
                const { genreName } = await fetchBooksByUserInterest(userID);
                setGenreName(genreName);
            } catch (err) {
                console.error("Error fetching genre:", err);
            }
        };

        fetchData();
    }, [userID]);

    return <BookCards title={`Because You Like ${genreName}`} fetchBooks={() => fetchBooksByUserInterest(userID)} />;
};

export default InterestedGenre;
