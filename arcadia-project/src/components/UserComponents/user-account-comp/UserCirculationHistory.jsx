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
  const [entriesPerPage, setEntriesPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("All Time")

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
                                title,
                                location
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
          const dateIn = item.checkinDate
          const dateOut = item.checkoutDate
          const deadline = item.deadline
          const timeIn = item.checkinTime
          const timeOut = item.checkoutTime

          // Format dateIn to "Month Day, Year" format
          let formattedDateIn = null
          if (dateIn) {
            const [year, month, day] = dateIn.split("-")
            const dateObj = new Date(year, month - 1, day)
            formattedDateIn = dateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }

          // Format dateOut to "Month Day, Year" format
          let formattedDateOut = null
          if (dateOut) {
            const [year, month, day] = dateOut.split("-")
            const dateObj = new Date(year, month - 1, day)
            formattedDateOut = dateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }

          // Format deadline to "Month Day, Year" format
          let formattedDeadline = null
          if (deadline) {
            const [year, month, day] = deadline.split("-")
            const dateObj = new Date(year, month - 1, day)
            formattedDeadline = dateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }

          // Format timeIn
          let formattedTimeIn = null
          if (timeIn) {
            // Ensure time is in the format HH:mm (24-hour format)
            const timeString = timeIn.includes(":") ? timeIn : `${timeIn.slice(0, 2)}:${timeIn.slice(2)}`

            // Convert time into 12-hour format with AM/PM, no 'Z' for local time
            formattedTimeIn = new Date(`1970-01-01T${timeString}`).toLocaleString("en-PH", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          }

          // Format timeOut
          let formattedTimeOut = null
          if (timeOut) {
            // Ensure time is in the format HH:mm (24-hour format)
            const timeString = timeOut.includes(":") ? timeOut : `${timeOut.slice(0, 2)}:${timeOut.slice(2)}`

            // Convert time into 12-hour format with AM/PM, no 'Z' for local time
            formattedTimeOut = new Date(`1970-01-01T${timeString}`).toLocaleString("en-PH", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          }

          const bookIndiv = item.book_indiv || {}
          const bookTitles = bookIndiv.book_titles || {}

          return {
            type: item.transactionType || "Unknown",
            dateIn: formattedDateIn || "Not yet Returned",
            dateOut: formattedDateOut || "N/A",
            timeIn: formattedTimeIn || "N/A",
            timeOut: formattedTimeOut || "N/A",
            rawDateIn: dateIn || "",
            rawDateOut: dateOut || "",
            // Use the most recent date for sorting
            rawDate: dateIn || dateOut || "",
            bookTitle: bookTitles.title || "Unknown Title",
            bookBarcode: bookIndiv.bookBarcode || item.bookBarcode || "N/A",
            titleID: bookTitles.titleID,
            deadline: formattedDeadline || "N/A",
            location: bookTitles.location
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
    // Get the dates for comparison
    const dateA = a.rawDate || ""
    const dateB = b.rawDate || ""

    // Sort based on the current sort order
    if (sortOrder === "Ascending") {
      return dateA.localeCompare(dateB)
    } else {
      return dateB.localeCompare(dateA)
    }
  })

  // Handle filtering by date range
  const filterByDateRange = (data) => {
    if (dateRange === "All Time") return data

    return data.filter((book) => {
      if (!book.rawDate) return false

      const bookDate = new Date(book.rawDate)
      const today = new Date()

      switch (dateRange) {
        case "Last 7 Days":
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(today.getDate() - 7)
          return bookDate >= sevenDaysAgo
        case "Last 30 Days":
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(today.getDate() - 30)
          return bookDate >= thirtyDaysAgo
        case "Last 90 Days":
          const ninetyDaysAgo = new Date()
          ninetyDaysAgo.setDate(today.getDate() - 90)
          return bookDate >= ninetyDaysAgo
        case "This Year":
          const startOfYear = new Date(today.getFullYear(), 0, 1)
          return bookDate >= startOfYear
        default:
          return true
      }
    })
  }

  // Handle filtering and searching
  const filteredData = filterByDateRange(sortedData).filter((book) => {
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
      <h3 className="text-2xl font-medium text-arcadia-black mb-6">My Circulation History</h3>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
              className="border border-grey sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* Filter By Type */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Type:</span>
            <select
              className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Date Range:</span>
            <select
              className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="All Time">All Time</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Entries Per Page */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Entries:</span>
            <select
              className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
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
            className="border border-grey rounded-md py-1 px-2 text-sm w-64"
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
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Borrowed
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Returned
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barcode
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
            </tr>
          </thead>
          <tbody className="divide-y ">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  Loading data...
                </td>
              </tr>
            ) : displayedBooks.length > 0 ? (
              displayedBooks.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray">
                  <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                    <span
                      className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                                            ${book.type === "Returned"
                          ? "bg-resolved text-white"
                          : book.type === "Borrowed"
                            ? "bg-ongoing"
                            : book.type === "Overdue"
                              ? "bg-dark-blue text-white"
                              : "bg-grey"
                        }`}
                    >
                      {book.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.dateOut}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.dateIn}</td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                    {book.titleID ? (
                      <Link
                        to={`/user/bookview?titleID=${encodeURIComponent(book.titleID)}`}
                        className="text-blue-600 hover:underline"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      >
                        {truncateTitle(book.bookTitle)}
                      </Link>
                    ) : (
                      truncateTitle(book.bookTitle)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.bookBarcode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.deadline}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
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
