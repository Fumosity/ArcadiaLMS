import { supabase } from "../../supabaseClient"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import PrintReportModal from "../../z_modals/PrintTableReport"
import { useUser } from "../../backend/UserContext"

const OverdueBks = () => {
  const [sortOrder, setSortOrder] = useState("Descending")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [typeOrder, setTypeOrder] = useState("Overdue")
  const [dateRange, setDateRange] = useState("All Time")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [overdueData, setOverdueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { user } = useUser()
  console.log(user)
  const username = user.userFName + " " + user.userLName
  console.log(username)

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch overdue book data from Supabase
    const fetchData = async () => {
      try {
        setLoading(true)
        const today = new Date()
        const { data, error } = await supabase
          .from("book_transactions")
          .select(`
                        transactionType, 
                        checkinDate, 
                        checkinTime, 
                        checkoutDate, 
                        checkoutTime,
                        deadline, 
                        userID, 
                        bookBarcode, 
                        book_indiv(
                            bookBarcode,
                            bookBarcode,
                            bookStatus,
                            book_titles (
                                titleID,
                                title,
                                price
                            ),
                            notes
                        ),
                        user_accounts (
                            userFName,
                            userLName,
                            userLPUID,
                            userCollege,
                            userDepartment
                        )`)
          .not("deadline", "is.null")
          .lt("deadline", today.toISOString().split("T")[0])

        if (error) {
          console.error("Error fetching data: ", error.message)
        } else {
          console.log("Overdue data from Supabase:", data) // Debugging: raw data from Supabase

          const formattedData = data.map((item) => {
            const date = item.checkoutDate
            const time = item.checkoutTime

            // Format date to "Month Day, Year" format
            let formattedDate = null
            if (date) {
              const [year, month, day] = date.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            // Format deadline to "Month Day, Year" format
            let formattedDeadline = null
            if (item.deadline) {
              const [year, month, day] = item.deadline.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedDeadline = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            let formattedTime = null
            if (time) {
              // Ensure time is in the format HH:mm (24-hour format)
              const timeString = time.includes(":") ? time : `${time.slice(0, 2)}:${time.slice(2)}`

              // Convert time into 12-hour format with AM/PM, no 'Z' for local time
              formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString("en-PH", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            }

            const bookDetails = item.book_indiv?.book_titles || {}

            return {
              type: "Overdue",
              rawDate: date, // Keep original for sorting
              date: formattedDate,
              time: formattedTime,
              borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
              user_college: item.user_accounts.userCollege,
              user_department: item.user_accounts.userDepartment,
              school_id: item.user_accounts.userLPUID,
              bookTitle: bookDetails.title,
              bookBarcode: item.book_indiv.bookBarcode,
              notes: item.book_indiv.notes,
              userId: item.userID,
              titleID: bookDetails.titleID,
              rawDeadline: item.deadline, // Keep original for sorting
              deadline: formattedDeadline,
            }
          })

          setOverdueData(formattedData)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error: ", error)
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array means this will run once when the component mounts

  const totalPages = Math.ceil(overdueData.length / entriesPerPage)

  // Handle sorting by borrower name
  const sortedData = [...overdueData].sort((a, b) => {
    const nameA = a.borrower.toLowerCase()
    const nameB = b.borrower.toLowerCase()

    return sortOrder === "Ascending" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
  })

  // Handle filtering and searching
  const filteredData = sortedData.filter((book) => {
    // Date range filtering
    let matchesDateRange = true
    if (dateRange !== "All Time" && book.rawDate) {
      const bookDate = new Date(book.rawDate)
      const today = new Date()

      switch (dateRange) {
        case "Last 7 Days":
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(today.getDate() - 7)
          matchesDateRange = bookDate >= sevenDaysAgo
          break
        case "Last 30 Days":
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(today.getDate() - 30)
          matchesDateRange = bookDate >= thirtyDaysAgo
          break
        case "Last 90 Days":
          const ninetyDaysAgo = new Date()
          ninetyDaysAgo.setDate(today.getDate() - 90)
          matchesDateRange = bookDate >= ninetyDaysAgo
          break
        case "This Year":
          const startOfYear = new Date(today.getFullYear(), 0, 1)
          matchesDateRange = bookDate >= startOfYear
          break
        default:
          matchesDateRange = true
      }
    }

    const matchesSearch =
      book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookBarcode.includes(searchTerm)

    return matchesDateRange && matchesSearch
  })

  // Pagination logic
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedBooks = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const handleUserClick = (book) => {
    console.log("userid", book.userId, "user", book.borrower, book)
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: book.userId, user: book },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const truncateTitle = (title, maxLength = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Overdue Books</h3>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
              className="sort-by bg-gray-200 border-grey py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
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
        </div>
        <div>
          <button
            className="sort-by bg-arcadia-red hover:bg-white text-white hover:text-arcadia-red font-semibold py-1 px-3 rounded-lg text-sm w-28"
            onClick={() => setIsPrintModalOpen(true)}
          >
            Print Report
          </button>
        </div>

      </div>
      {/* Search */}
      <div className="flex items-center space-x-2 min-w-[0]">
        <label htmlFor="search" className="font-medium text-sm">
          Search:
        </label>
        <input
          type="text"
          id="search"
          className="border border-grey rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
          placeholder="Title, borrower, or barcode"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barcode
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center">
                  Loading data...
                </td>
              </tr>
            ) : displayedBooks.length > 0 ? (
              displayedBooks.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                    <span
                      className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                                        ${book.type === "Overdue" ? "bg-dark-blue text-white" : "bg-grey"}`}
                    >
                      {book.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.time}</td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                    <button onClick={() => handleUserClick(book)} className="text-blue-500 hover:underline">
                      {book.borrower}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                    <Link
                      to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {truncateTitle(book.bookTitle)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.bookBarcode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.deadline}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-zinc-600">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-2 mb-4 space-x-4">
        <button
          className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span className="text-xs text-arcadia-red">Page {currentPage}</span>
        <button
          className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next Page
        </button>
      </div>
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        filteredData={filteredData} // Pass the filtered data
        reportType={"OverdueBooks"}
        filters={{
          dateRange,
          sortOrder,
          searchTerm,
        }}
        username={username}
      />
    </div>
  )
}

export default OverdueBks

