import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const HighRates = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHighlyRated()
      .then((data) => {
        setBooks(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      })
  }, [])

  const fetchHighlyRated = async () => {
    try {
      // Step 1: Fetch all ratings with titleID
      const { data: ratings, error: ratingError } = await supabase.from("ratings").select("ratingValue, titleID")

      if (ratingError) throw ratingError

      // Step 2: Group ratings by titleID and calculate average rating
      const ratingMap = {}
      ratings.forEach(({ titleID, ratingValue }) => {
        // Ensure ratingValue is a number
        const numericRating = Number.parseFloat(ratingValue)

        // Skip invalid ratings
        if (isNaN(numericRating)) return

        if (!ratingMap[titleID]) {
          ratingMap[titleID] = { total: 0, count: 0 }
        }
        ratingMap[titleID].total += numericRating
        ratingMap[titleID].count += 1
      })

      // Get unique titleIDs that have ratings
      const bookIDs = Object.keys(ratingMap)

      if (bookIDs.length === 0) {
        console.log("No books with ratings found")
        return []
      }

      // Step 3: Fetch book details for unique books that have ratings
      const { data: books, error: bookError } = await supabase
        .from("book_titles")
        .select("titleID, title")
        .in("titleID", bookIDs)

      if (bookError) {
        console.error("Error fetching book details:", bookError)
        throw bookError
      }

      if (!books || books.length === 0) {
        console.log("No book details found for the rated books")
        return []
      }

      // Step 4: Fetch genres and categories (optional, for future use)
      const { data: genreData, error: genreError } = await supabase
        .from("book_genre_link")
        .select("titleID, genreID, genres(genreID, genreName, category)")
        .in("titleID", bookIDs)

      if (genreError) throw genreError

      // Create a map of genres and categories
      const genreMap = {}
      if (genreData) {
        genreData.forEach(({ titleID, genres }) => {
          if (genres && titleID) {
            if (!genreMap[titleID]) {
              genreMap[titleID] = { genres: [], category: genres.category }
            }
            genreMap[titleID].genres.push(genres.genreName)
          }
        })
      }

      // Calculate weighted ranking score for each book
      // This formula balances average rating with number of ratings
      const calculateWeightedRankingScore = (avgRating, totalRatings) => {
        // Constants for the ranking algorithm
        const MIN_RATINGS_THRESHOLD = 5 // Minimum number of ratings to get full weight
        const RATING_WEIGHT = 0.7 // Weight given to the average rating (0-1)
        const COUNT_WEIGHT = 0.3 // Weight given to the number of ratings (0-1)

        // Normalize the rating count (0-1 scale)
        const normalizedCount = Math.min(totalRatings / MIN_RATINGS_THRESHOLD, 1)

        // Calculate weighted score
        return avgRating * RATING_WEIGHT + avgRating * normalizedCount * COUNT_WEIGHT
      }

      // Combine all data into final book objects
      const booksWithDetails = books.map((book) => {
        const titleID = book.titleID
        const avgRating = ratingMap[titleID].total / ratingMap[titleID].count
        const totalRatings = ratingMap[titleID].count

        // Calculate ranking score
        const rankingScore = calculateWeightedRankingScore(avgRating, totalRatings)

        return {
          ...book,
          avgRating: avgRating,
          avgRatingDisplay: avgRating.toFixed(2),
          totalRatings: totalRatings,
          rankingScore: rankingScore,
          genres: genreMap[titleID]?.genres || [],
          category: genreMap[titleID]?.category || "Unknown",
        }
      })

      // Sort by the weighted ranking score instead of just the average rating
      const sortedBooks = booksWithDetails.sort((a, b) => b.rankingScore - a.rankingScore).slice(0, 5) // Get top 5

      console.log("Top 5 books with weighted ranking:", sortedBooks)
      return sortedBooks
    } catch (error) {
      console.error("Error fetching highly rated books:", error)
      return []
    }
  }

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
                      to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                      className="text-blue-500 hover:underline"
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td className="w-1/3 px-4 py-2 text-center text-sm truncate">
                    {book.avgRatingDisplay}
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
  )
}

export default HighRates
