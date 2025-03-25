import { useEffect, useState } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const BookCopiesSection = ({ titleID }) => {
  const [bookCopies, setBookCopies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookTitle, setBookTitle] = useState("")

  useEffect(() => {
    const fetchBookCopies = async () => {
      setIsLoading(true)
      try {
        if (!titleID) {
          setIsLoading(false)
          return
        }

        const { data: titleData, error: titleError } = await supabase
          .from("book_titles")
          .select("titleID, procurementDate, title")
          .eq("titleID", titleID)
          .single()

        if (titleError) throw titleError

        // Set the title to display
        setBookTitle(titleData.title)

        const { data: copies, error: copiesError } = await supabase
          .from("book_indiv")
          .select("bookBarcode, bookStatus")
          .eq("titleID", titleID)

        if (copiesError) throw copiesError

        const combinedData = copies.map((copy) => ({
          ...copy,
          procurementDate: titleData.procurementDate,
        }))

        setBookCopies(combinedData)
      } catch (error) {
        console.error("Error fetching book copies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookCopies()
  }, [titleID])

  const getStatusStyle = (bookStatus) => {
    switch (bookStatus) {
      case "Available":
        return "bg-resolved text-white"
      case "Reserved":
        return "bg-grey text-black"
      case "Unavailable":
        return "bg-ongoing text-black"
      case "Damaged":
        return "bg-intended text-white"
      default:
        return "bg-grey text-black"
    }
  }

  const handleRowClick = (book) => {
    // Implement any row click functionality here if needed
    console.log("Book copy clicked:", book)
  }

  return (
    <div className="bg-white p-4 rounded-xl w-full shadow-md">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium text-zinc-900">Book Copies</h2>
      </header>

      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Barcode", "Status"].map((header) => (
                <th
                  key={header}
                  className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <Skeleton className="w-1/4" />
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <Skeleton className="w-1/4" />
                  </td>
                </tr>
              ))
            ) : bookCopies.length === 0 ? (
              <tr>
                <td className="text-center text-zinc-600 m-2 py-4" colSpan="2">
                  Title does not have any copies.
                </td>
              </tr>
            ) : (
              bookCopies.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer" onClick={() => handleRowClick(book)}>
                  <td className="text-center py-2">{book.bookBarcode}</td>
                  <td className="text-center py-2">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(
                        book.bookStatus,
                      )}`}
                    >
                      {book.bookStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookCopiesSection