import { useState, useEffect } from "react"
import { supabase } from "/src/supabaseClient.js"
import { Link } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const MostPop = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMostPopular = async () => {
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

      // Step 5: Fetch genres and categories
      const titleIDs = Object.keys(titleBorrowMap)
      const { data: genreData, error: genreError } = await supabase
        .from("book_genre_link")
        .select("titleID, genreID, genres(genreID, genreName, category)")
        .in("titleID", titleIDs)

      if (genreError) throw genreError

      // Step 6: Structure genres and categories
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

      // Step 7: Add genres and categories to books
      const booksWithDetails = Object.values(titleBorrowMap)
        .filter((book) => book.borrowCount > 0) // Only include books that have been borrowed at least once
        .map((book) => {
          const titleID = book.titleID
          return {
            ...book,
            genres: genreMap[titleID]?.genres || [],
            category: genreMap[titleID]?.category || "Unknown",
          }
        })

      // Step 8: Sort by borrow count and return the top books
      const sortedBooks = booksWithDetails.sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5)

      console.log("Top 5 most popular books:", sortedBooks)
      return sortedBooks
    } catch (error) {
      console.error("Error fetching most popular books:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      const mostPopularBooks = await fetchMostPopular()
      setBooks(mostPopularBooks)
      setIsLoading(false)
    }
    fetchBooks()
  }, [])

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <h3 className="text-2xl font-semibold">Most Popular Books</h3>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrows
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
                  <td className="w-1/3 px-4 py-2 text-center text-sm truncate">{book.borrowCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center text-sm text-gray-500">
                  No popular books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MostPop
