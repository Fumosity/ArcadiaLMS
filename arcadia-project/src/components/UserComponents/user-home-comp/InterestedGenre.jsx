import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js";
import BookCards from "./BookCards";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed

const fetchBooksByUserInterest = async (userID) => {
    try {
        console.log("Fetching books for userID:", userID); // Debugging

        // Step 1: Get all genres the user is interested in
        const { data: userGenres, error: userGenresError } = await supabase
            .from("user_genre_link")
            .select("genreID, genres(genreID, genreName)")
            .eq("userID", userID);

        if (userGenresError) throw userGenresError;
        if (!userGenres || userGenres.length === 0) return { genreName: "Unknown", books: [] };

        // Step 2: Pick a random genre from the user's interests
        const randomGenre = userGenres[Math.floor(Math.random() * userGenres.length)];

        // Step 3: Fetch books associated with the chosen genre
        const { data: bookGenreLinks, error: bookError } = await supabase
            .from("book_genre_link")
            .select("titleID, book_titles(titleID, title, author, cover)")
            .eq("genreID", randomGenre.genreID);

        if (bookError) throw bookError;

        // Step 4: Extract and return books
        const books = bookGenreLinks.map(link => link.book_titles);

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
