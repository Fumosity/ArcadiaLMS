import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HighRates = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHighlyRated()
      .then((data) => {
        setBooks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const fetchHighlyRated = async () => {
    try {
      // Fetch all ratings with titleID
      const { data: ratings, error: ratingError } = await supabase
        .from("ratings")
        .select("ratingValue, titleID");

      if (ratingError) throw ratingError;

      // Compute average ratings per titleID
      const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
        if (!acc[titleID]) {
          acc[titleID] = { total: 0, count: 0 };
        }
        acc[titleID].total += ratingValue;
        acc[titleID].count += 1;
        return acc;
      }, {});

      // Get unique titleIDs that have ratings
      const titleIDs = Object.keys(ratingMap);

      if (titleIDs.length === 0) {
        console.log("No books with ratings found");
        return [];
      }

      // Fetch book details for unique books that have ratings
      const { data: bookTitles, error: bookError } = await supabase
        .from("book_titles")
        .select("titleID, title")
        .in("titleID", titleIDs);

      if (bookError) throw bookError;

      // Combine book data with ratings
      const booksWithDetails = bookTitles.map((book) => {
        const titleID = book.titleID;
        const avgRating = ratingMap[titleID]
          ? (ratingMap[titleID].total / ratingMap[titleID].count).toFixed(2)
          : "0.00";
        const totalRatings = ratingMap[titleID]?.count || 0;

        return {
          title: book.title,
          avgRating,
          totalRatings,
          titleID,
        };
      });

      // Sort by highest rating and limit to top 5
      const books = booksWithDetails
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 5);

      return books;
    } catch (error) {
      console.error("Error fetching top books:", error);
      return [];
    }
  };

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <h3 className="text-2xl font-semibold">Highly Rated Books</h3>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="w-2/3 px-4 py-2 text-center text-sm truncate">
                    <Skeleton />
                  </td>
                  <td className="w-1/3 px-4 py-2 text-center text-sm truncate">
                    <Skeleton />
                  </td>
                </tr>
              ))
            ) : books.length > 0 ? (
              books.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="w-2/3 px-4 py-2 text-left text-sm text-arcadia-red font-semibold">
                    <Link
                      to={`/admin/abviewer?titleID=${encodeURIComponent(
                        book.titleID
                      )}`}
                      className="text-blue-500 hover:underline"
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td className="w-1/3 px-4 py-2 text-center text-sm truncate">
                    {book.avgRating}
                    <span className="text-xs text-gray-500 ml-1">
                      ({book.totalRatings >= 1000 ? "1000+" : book.totalRatings})
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center text-sm text-gray-500">
                  No rated books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighRates;
