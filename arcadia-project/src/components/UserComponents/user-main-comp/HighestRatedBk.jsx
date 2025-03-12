"use client"

import { useEffect, useState } from "react"
import { supabase } from "/src/supabaseClient"
import { useUser } from "../../../backend/UserContext" // Adjust path if needed
import { Link } from "react-router-dom" // Make sure this is imported

const HighestRatedBk = ({ onSeeMoreClick }) => {
  const { user } = useUser()
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchHighlyRatedBooks = async () => {
    try {
      // Step 1: Fetch all ratings with titleID
      const { data: ratings, error: ratingError } = await supabase.from("ratings").select("ratingValue, titleID")

      if (ratingError) throw ratingError

      // Step 2: Group ratings by titleID and calculate average rating
      const ratingMap = {}
      ratings.forEach(({ titleID, ratingValue }) => {
        if (!ratingMap[titleID]) {
          ratingMap[titleID] = { total: 0, count: 0 }
        }
        ratingMap[titleID].total += ratingValue
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
        .select("titleID, title, author, cover")
        .in("titleID", bookIDs)

      if (bookError) {
        console.error("Error fetching book details:", bookError)
        throw bookError
      }

      if (!books || books.length === 0) {
        console.log("No book details found for the rated books")
        return []
      }

      // Step 4: Fetch genres and categories
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
          weightedAvg: avgRating,
          totalRatings: totalRatings,
          rankingScore: rankingScore,
          genres: genreMap[titleID]?.genres || [],
          category: genreMap[titleID]?.category || "Unknown",
        }
      })

      // Sort by the weighted ranking score instead of just the average rating
      const sortedBooks = booksWithDetails.sort((a, b) => b.rankingScore - a.rankingScore)

      return sortedBooks
    } catch (error) {
      console.error("Error fetching highly rated books:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const fetchedBooks = await fetchHighlyRatedBooks()
      setBooks(fetchedBooks)
      setIsLoading(false)
    }

    if (user?.userID) {
      fetchData()
    }
  }, [user?.userID])

  // Ensure exactly 5 rows (fill with placeholders if needed)
  const filledBooks = books.length < 5 ? [...books, ...Array(5 - books.length).fill(null)] : books.slice(0, 5)

  return (
    <div className="uSidebar-filter">
      <div className="flex justify-between items-center mb-2.5">
        <h2 className="text-xl font-semibold">Highest Rated Books</h2>
        <button
          className="uSidebar-Seemore"
          onClick={() =>
            onSeeMoreClick("Highly Rated", async () => {
              const books = await fetchHighlyRatedBooks()
              return { books }
            })
          }
        >
          See more
        </button>
      </div>

      <ul className="text-sm text-gray-600 divide-y divide-grey">
        {filledBooks.map((book, index) => (
          <li key={index} className="flex justify-between py-1 hover:bg-light-gray">
            {book ? (
              <>
                <Link to={`/user/bookview?titleID=${book.titleID}`} className="text-arcadia-red font-bold w-60 p-1">
                  {book.title}
                </Link>
                <span className="w-12 p-1 flex justify-center">
                  {book.weightedAvg.toFixed(1)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({book.totalRatings >= 1000 ? "1000+" : book.totalRatings})
                  </span>
                </span>
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
  )
}

export default HighestRatedBk

