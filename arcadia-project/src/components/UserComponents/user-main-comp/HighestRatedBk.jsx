import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient";
import { useUser } from "../../../backend/UserContext"; // Adjust path if needed

const HighestRatedBk = ({ onSeeMoreClick }) => {
  const { user } = useUser();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

      let books = booksWithDetails.sort((a, b) => b.weightedAvg - a.weightedAvg)

      // Step 7: Sort by highest weighted average rating
      return books;
    } catch (error) {
      console.error("Error fetching highly rated books:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedBooks = await fetchHighlyRatedBooks(user?.userID);
      setBooks(fetchedBooks);
      setIsLoading(false);
    };

    if (user?.userID) {
      fetchData();
    }
  }, [user?.userID]);

  // Ensure exactly 5 rows (fill with placeholders if needed)
  const filledBooks = books.length < 5 ? [...books, ...Array(5 - books.length).fill(null)] : books;
  return (
    <div className="uSidebar-filter">
      <div className="flex justify-between items-center mb-2.5">
        <h2 className="text-xl font-semibold">Highest Rated Books</h2>
        <button
          className="uSidebar-Seemore"
          onClick={() => onSeeMoreClick("Highly Rated", async () => {
            const books = await fetchHighlyRatedBooks();
            return { books };
          })}
        >
          See more
        </button>
      </div>

      <ul className="text-sm text-gray-600 divide-y divide-grey">
        {filledBooks.map((book, index) => (
          <li key={index} className="flex justify-between py-1 hover:bg-light-gray">
            {book ? (
              <>
                <a
                  href={`/user/bookview?titleID=${book.titleID}`}
                  className="text-arcadia-red font-bold w-60 p-1"
                >
                  {book.title}
                </a>
                <span className="w-12 p-1 flex justify-center">{book.weightedAvg.toFixed(2)}</span>
              </>
            ) : (
              <>
                <span className="w-60 h-6 p-1 bg-light-gray rounded animate-pulse"></span>
                <span className="w-12 h-6 p-1 bg-light-gray rounded animate-pulse"></span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighestRatedBk;
