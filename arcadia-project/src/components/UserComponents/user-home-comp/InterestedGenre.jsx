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

        // Fetch all book genre links for the user's interested genres
        const interestedGenreIDs = userGenres.map(ug => ug.genreID);
        const { data: bookGenreLinksAll, error: bookGenreLinksError } = await supabase
            .from("book_genre_link")
            .select("genreID")
            .in("genreID", interestedGenreIDs);

        if (bookGenreLinksError) throw bookGenreLinksError;

        // Filter user's interested genres to only those that have associated books
        const genresWithBooks = userGenres.filter(ug =>
            bookGenreLinksAll.some(bgl => bgl.genreID === ug.genreID)
        );

        if (genresWithBooks.length === 0) {
            return { genreName: "No books found for your interests", books: [] };
        }

        const randomGenre = genresWithBooks[Math.floor(Math.random() * genresWithBooks.length)];

        const { data: bookGenreLinks, error: bookError } = await supabase
            .from("book_genre_link")
            .select("titleID, book_titles(titleID, title, author, cover), genres(genreID, genreName, category)")
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

        const allBooks = bookGenreLinks
            .filter(link => link.book_titles) // Ensure book_titles is not null
            .map(link => {
                const titleID = link.titleID;
                const avgRating = ratingMap[titleID] ? ratingMap[titleID].total / ratingMap[titleID].count : null;
                const totalRatings = ratingMap[titleID] ? ratingMap[titleID].count : 0;
                return {
                    ...link.book_titles,
                    weightedAvg: avgRating,
                    totalRatings: totalRatings,
                    genres: link.genres?.genreName || "Unknown",
                    category: link.genres?.category || "Unknown",
                };
            });

        // Limit the books to a maximum of 15
        const limitedBooks = allBooks.slice(0, 15);

        return { genreName: randomGenre.genres.genreName, books: { books: limitedBooks } };
    } catch (error) {
        console.error("Error fetching books by user interest:", error);
        return { genreName: "Unknown", books: [] };
    }
};

const InterestedGenre = ({ userID, onSeeMoreClick, booksPerPage = 10 }) => {
    const { user } = useUser();
    const [genreData, setGenreData] = useState({ genreName: "", books: [] });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // Initialize page state

    userID = user?.userID || userID;

    useEffect(() => {
        // Reset page to 1 whenever the userID changes (data refresh)
        setPage(1);

        if (!userID) {
            console.log("InterestedGenre: Guest Mode");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchBooksByUserInterest(userID);
                if (!data.books || data.books.length === 0) {
                    setGenreData({ genreName: "", books: [] });
                    return;
                }
                setGenreData(data);
            } catch (err) {
                console.error("Error fetching genre:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userID]); // Re-run effect when userID changes

    // If there are no genres or books, don't render the component
    if (!genreData.books || genreData.books.length === 0) {
        return null;
    }

    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const displayedBooks = genreData.books.books.slice(startIndex, endIndex);

    return (
        <BookCards
            title={`Because you like ${genreData.genreName}`}
            fetchBooks={() => Promise.resolve({ books: displayedBooks })} // Pass only the current page's books
            onSeeMoreClick={() =>
                onSeeMoreClick(`Because you like ${genreData.genreName}`, () => Promise.resolve(genreData.books))
            }
        />
    );
};

export default InterestedGenre;