import BookCards from "./BookCards"
import { supabase } from "/src/supabaseClient.js"

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
      return { books: [] }
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
      return { books: [] }
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
      // This combines both the average rating and how many people rated it
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

    console.log("Highly rated books:", sortedBooks)
    return { books: sortedBooks }
  } catch (error) {
    console.error("Error fetching highly rated books:", error)
    return { books: [] }
  }
}

const HighlyRated = ({ onSeeMoreClick }) => {
  // ... rest of the component code remains the same ...

  return (
    <BookCards
      title="Highly Rated"
      fetchBooks={fetchHighlyRatedBooks}
      onSeeMoreClick={() => onSeeMoreClick("Highly Rated", fetchHighlyRatedBooks)}
    />
  )
}

export default HighlyRated

