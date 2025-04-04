import { useEffect, useState } from "react"
import { supabase } from "/src/supabaseClient"
import { useUser } from "../../../backend/UserContext"
import { Link } from "react-router-dom"

const MostPopBk = ({ onSeeMoreClick }) => {
  const { user } = useUser()
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [noBooks, setNoBooks] = useState(false)

  const fetchMostPopularBooks = async () => {
    try {
      // Step 1: Fetch all borrow transactions
      const { data: transactions, error: transactionError } = await supabase
        .from("book_transactions")
        .select("bookBarcode")

      if (transactionError) throw transactionError

      // Step 2: Count borrows per bookBarcode
      const borrowCountMap = transactions.reduce((acc, { bookBarcode }) => {
        acc[bookBarcode] = (acc[bookBarcode] || 0) + 1
        return acc
      }, {})

      // Step 3: Fetch book metadata (bookBarcode, titleID, and book_titles details)
      const { data: bookMetadata, error: bookError } = await supabase
        .from("book_indiv")
        .select("bookBarcode, titleID, book_titles(titleID, title, author, cover)")

      if (bookError) throw bookError

      // Step 4: Aggregate borrow counts by titleID
      const titleBorrowMap = {}

      bookMetadata.forEach(({ bookBarcode, titleID, book_titles }) => {
        if (!titleBorrowMap[titleID]) {
          titleBorrowMap[titleID] = {
            ...book_titles,
            borrowCount: 0, // Initialize borrow count
          }
        }
        titleBorrowMap[titleID].borrowCount += borrowCountMap[bookBarcode] || 0
      })

      // Step 5: Fetch ratings
      const { data: ratings, error: ratingError } = await supabase.from("ratings").select("ratingValue, titleID")

      if (ratingError) throw ratingError

      // Step 6: Compute average rating per titleID
      const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
        if (!acc[titleID]) {
          acc[titleID] = { total: 0, count: 0 }
        }
        acc[titleID].total += ratingValue
        acc[titleID].count += 1
        return acc
      }, {})

      // Step 7: Fetch genres and categories
      const titleIDs = Object.keys(titleBorrowMap)
      const { data: genreData, error: genreError } = await supabase
        .from("book_genre_link")
        .select("titleID, genreID, genres(genreID, genreName, category)")
        .in("titleID", titleIDs)

      if (genreError) throw genreError

      // Step 8: Structure genres and categories
      const genreMap = {}
      genreData.forEach(({ titleID, genres }) => {
        if (!genreMap[titleID]) {
          genreMap[titleID] = { genres: [], category: genres.category }
        }
        genreMap[titleID].genres.push(genres.genreName)
      })

      // Step 9: Add genres, categories, and ratings to books
      const booksWithDetails = Object.values(titleBorrowMap)
        .filter((book) => book.borrowCount > 0) // Only include books that have been borrowed at least once
        .map((book) => {
          const titleID = book.titleID
          const avgRating = ratingMap[titleID]?.count > 0 ? ratingMap[titleID].total / ratingMap[titleID].count : 0

          return {
            ...book,
            weightedAvg: avgRating,
            totalRatings: ratingMap[titleID]?.count || 0,
            genres: genreMap[titleID]?.genres || [],
            category: genreMap[titleID]?.category || "Unknown",
          }
        })

      // Step 10: Sort by borrow count and return the top 5 books
      return booksWithDetails.sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5) // Limit to top 5 most borrowed books
    } catch (error) {
      console.error("Error fetching most popular books:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setNoBooks(false)
      const fetchedBooks = await fetchMostPopularBooks(user?.userID)
      setBooks(fetchedBooks)
      setNoBooks(fetchedBooks.length === 0)
      setIsLoading(false)
    }

    if (user?.userID) {
      fetchData()
    }
  }, [user?.userID])

  // Only fill with placeholders if we're still loading
  const filledBooks = isLoading && books.length < 5 ? [...books, ...Array(5 - books.length).fill(null)] : books

  return (
    <div className="uSidebar-filter">
      <div className="flex justify-between items-center mb-2.5">
        <h2 className="text-xl font-semibold">Most Borrowed</h2>
        <button
          className="rounded-full py-0.5 px-3 text-sm border border-grey hover:bg-light-gray"
          onClick={() =>
            onSeeMoreClick("Most Popular", async () => {
              const books = await fetchMostPopularBooks()
              return { books }
            })
          }
        >
          See more
        </button>
      </div>
      <ul className="text-sm text-gray-600 divide-y divide-grey">
        {isLoading ? (
          // Show loading placeholders
          Array(5)
            .fill(null)
            .map((_, index) => (
              <li key={index} className="flex justify-between py-1">
                <span className="w-60 h-6 p-1 bg-light-gray rounded animate-pulse"></span>
                <span className="w-12 h-6 p-1 bg-light-gray rounded animate-pulse"></span>
              </li>
            ))
        ) : noBooks ? (
          // Show message when no books are found
          <li className="py-4 text-center text-gray-500">No popular books found yet</li>
        ) : (
          // Show actual books
          filledBooks.map((book, index) => (
            <li key={index} className="flex justify-between py-1 hover:bg-light-gray">
              <Link
                to={`/user/bookview?titleID=${book.titleID}`}
                className="text-arcadia-red font-bold w-60 p-1 truncate"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {book.title}
              </Link>
              <span className="w-12 p-1 flex justify-center">{book.weightedAvg.toFixed(1)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
export default MostPopBk

