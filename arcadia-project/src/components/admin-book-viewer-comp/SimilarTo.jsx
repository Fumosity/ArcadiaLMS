import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
const fetchSimilarBooks = async (titleID) => {
  try {
    console.log("Similar to: title, ", titleID)
    // Step 1: Fetch recommended books
    const response = await axios.post(`http://18.143.186.140:8000/book-recommend`, {
      titleID,
    });
    const recommendedBooks = response.data.recommendations || [];

    if (recommendedBooks.length === 0) {
      return [];
    }

    // Extract titleIDs from recommended books
    const titleIDs = recommendedBooks.map((book) => book.titleID);

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

    // Step 4: Attach ratings to books
    return recommendedBooks.map((book) => {
      const avgRating =
        ratingMap[book.titleID]?.count > 0
          ? (ratingMap[book.titleID].total / ratingMap[book.titleID].count).toFixed(2)
          : "N/A";

      return {
        book: book.title,
        rating: avgRating,
        titleID: book.titleID
      };
    });
  } catch (error) {
    console.error("Error fetching similar books:", error);
    return [];
  }
};

const SimilarTo = ({ titleID }) => {
  const [similarBooks, setSimilarBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await fetchSimilarBooks(titleID);
      console.log(similarBooks)
      setSimilarBooks(books);
    };
    fetchBooks();
  }, [titleID]);

  return (
    <div className="bg-white p-4 rounded-lg border-grey border w-full">
      <h3 className="text-2xl font-semibold mb-2">Similar To</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg. Rating
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {similarBooks.length > 0 ? (
            similarBooks.map((book, index) => (
              
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-4 py-3 text-sm text-center text-arcadia-red font-semibold truncate max-w-64">
                  <Link
                    to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {book.book}
                  </Link>
                </td>
                <td className="py-2 text-center">{book.rating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-2 text-center text-gray-500">
                No similar books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimilarTo;
