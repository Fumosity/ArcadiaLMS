import { useState, useEffect } from "react"
import { supabase } from "/src/supabaseClient.js"
import { Link } from "react-router-dom"

const LeastPop = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeastPopular = async () => {
    try {
      // Fetch all borrow transactions
      const { data: transactions, error: transactionError } = await supabase
        .from("book_transactions")
        .select("bookBarcode")

      if (transactionError) throw transactionError

      // Count borrows per bookBarcode
      const borrowCountMap = transactions.reduce((acc, { bookBarcode }) => {
        acc[bookBarcode] = (acc[bookBarcode] || 0) + 1
        return acc
      }, {})

      // Fetch book metadata and join with book_titles
      const { data: bookMetadata, error: bookError } = await supabase
        .from("book_indiv")
        .select("bookBarcode, titleID, book_titles(titleID, title)")

      if (bookError) throw bookError

      // Aggregate borrow counts by titleID
      const titleBorrowMap = {}

      bookMetadata.forEach(({ bookBarcode, titleID, book_titles }) => {
        if (!titleBorrowMap[titleID]) {
          titleBorrowMap[titleID] = {
            title: book_titles.title,
            borrowCount: 0,
            titleID: book_titles.titleID,
          }
        }
        titleBorrowMap[titleID].borrowCount += borrowCountMap[bookBarcode] || 0
      })

      // Convert object to array, sort by least borrowed, and get bottom 5
      const books = Object.values(titleBorrowMap)
        .sort((a, b) => a.borrowCount - b.borrowCount)
        .slice(0, 5) // Changed from 10 to 5

      return books
    } catch (error) {
      console.error("Error fetching least popular books:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      const leastPopularBooks = await fetchLeastPopular()
      setBooks(leastPopularBooks)
      setIsLoading(false)
    }
    fetchBooks()
  }, [])

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <h3 className="text-2xl font-semibold mb-4">Least Popular Books</h3>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrows
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-light-gray">
                  <td className="w-2/3 px-4 py-2 text-left text-sm">
                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="w-1/4 px-4 py-2 text-center text-sm">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-12 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : books.length > 0 ? (
              books.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="w-2/3 px-4 py-2 text-left text-sm text-arcadia-red font-semibold">
                    <Link
                      to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td className="w-1/4 px-4 py-2 text-center text-sm truncate">{book.borrowCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center text-sm text-gray-500">
                  No book data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeastPop
