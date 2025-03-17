import { useEffect, useState } from "react"
import { supabase } from "../../../supabaseClient.js"
import { Link } from "react-router-dom"

const UserCirculationHistory = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [circulationHistory, setCirculationHistory] = useState([])
  const [sortOrder, setSortOrder] = useState("Descending")
  const [typeFilter, setTypeFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [loading, setLoading] = useState(true)

  // Fetch current user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser) {
      console.log("Current user from localStorage:", storedUser)
      setCurrentUser(storedUser)
    }
  }, [])

  // Fetch user's circulation history from Supabase
  useEffect(() => {
    const fetchUserCirculationHistory = async () => {
      if (!currentUser || !currentUser.userID) {
        console.log("No user ID available")
        setLoading(false)
        return
      }

      console.log("Fetching circulation history for user ID:", currentUser.userID)
      setLoading(true)
      try {
        // First check if the table exists and what columns it has
        const { data: tableInfo, error: tableError } = await supabase.from("book_transactions").select("*").limit(1)

        if (tableError) {
          console.error("Error checking book_transactions table:", tableError)
          setLoading(false)
          return
        }

        console.log("Table info sample:", tableInfo)

        // Now fetch the actual user data
        const { data, error } = await supabase
          .from("book_transactions")
          .select(`
                        *,
                        book_indiv:bookBarcode (
                            bookBarcode,
                        
                            bookStatus,
                            book_titles:titleID (
                                titleID,
                                title
                            )
                        )
                    `)
          .eq("userID", currentUser.userID)

        if (error) {
          console.error("Error fetching circulation history:", error)
          setLoading(false)
          return
        }

        console.log("Raw circulation data:", data)

        if (!data || data.length === 0) {
          console.log("No circulation history found for this user")
          setCirculationHistory([])
          setLoading(false)
          return
        }

        const formattedData = data.map((item) => {
          const date = item.checkinDate || item.checkoutDate
          const time = item.checkinTime || item.checkoutTime

          let formattedTime = null
          if (time) {
            const timeString = time.includes(":") ? time : `${time.slice(0, 2)}:${time.slice(2)}`

            try {
              formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString("en-PH", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            } catch (e) {
              console.error("Error formatting time:", e)
              formattedTime = time
            }
          }

          const bookIndiv = item.book_indiv || {}
          const bookTitles = bookIndiv.book_titles || {}

          return {
            type: item.transactionType || "Unknown",
            date: date || "N/A",
            time: formattedTime || "N/A",
            bookTitle: bookTitles.title || "Unknown Title",
            bookBarcode: bookIndiv.bookBarcode || item.bookBarcode || "N/A",
            titleID: bookTitles.titleID,
          }
        })

        console.log("Formatted circulation data:", formattedData)
        setCirculationHistory(formattedData)
      } catch (error) {
        console.error("Unexpected error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserCirculationHistory()
  }, [currentUser])

  // Handle sorting
  const sortedData = [...circulationHistory].sort((a, b) => {
    // Get the book titles, defaulting to empty strings if undefined
    const titleA = (a.bookTitle || "").toLowerCase()
    const titleB = (b.bookTitle || "").toLowerCase()

    // Sort based on the current sort order
    if (sortOrder === "Ascending") {
      return titleA.localeCompare(titleB)
    } else {
      return titleB.localeCompare(titleA)
    }
  })

  // Handle filtering and searching
  const filteredData = sortedData.filter((book) => {
    const matchesType = typeFilter === "All" || book.type === typeFilter

    const matchesSearch =
      !searchTerm ||
      (book.bookTitle && book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.bookBarcode && book.bookBarcode.toString().toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesType && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedBooks = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const truncateTitle = (title, maxLength = 25) => {
    if (!title) return "Unknown Title"
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  return (
    <div className="uMain-cont">
      <h3 className="text-xl font-medium text-arcadia-black mb-6">My Circulation History</h3>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
              className="sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* Filter By Type */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Type:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Entries Per Page */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Entries:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-20"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        {/* Search */}
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="font-medium text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-64"
            placeholder="Title or barcode"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y ">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barcode
              </th>
            </tr>
          </thead>
          <tbody className="divide-y ">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">
                  Loading data...
                </td>
              </tr>
            ) : displayedBooks.length > 0 ? (
              displayedBooks.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray">
                  <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                    <span
                      className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                                            ${
                                              book.type === "Returned"
                                                ? "bg-[#8fd28f]"
                                                : book.type === "Borrowed"
                                                  ? "bg-[#e8d08d]"
                                                  : book.type === "Overdue"
                                                    ? "bg-[#f8a5a5]"
                                                    : "bg-grey"
                                            }`}
                    >
                      {book.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.time}</td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                    {book.titleID ? (
                      <Link
                        to={`/user/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                        className="text-blue-600 hover:underline"
                      >
                        {truncateTitle(book.bookTitle)}
                      </Link>
                    ) : (
                      truncateTitle(book.bookTitle)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.bookBarcode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-zinc-600">
                  {currentUser ? "No circulation history found." : "Please log in to view your circulation history."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-2 space-x-4">
        <button
          className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || displayedBooks.length === 0}
        >
          Previous Page
        </button>
        <span className="text-xs text-arcadia-red">Page {currentPage}</span>
        <button
          className={`uPage-btn ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || displayedBooks.length === 0}
        >
          Next Page
        </button>
      </div>
    </div>
  )
}

export default UserCirculationHistory

