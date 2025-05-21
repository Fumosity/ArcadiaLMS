import { supabase } from "../../supabaseClient"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useUser } from "../../backend/UserContext"
import PrintReportModal from "../../z_modals/PrintTableReport"

const DamagedBks = () => {
  const [sortOrder, setSortOrder] = useState("Descending")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [damagedData, setDamagedData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState("All Time")
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { user } = useUser()
  console.log(user)
  const username = user.userFName + " " + user.userLName
  console.log(username)

  useEffect(() => {
    // Fetch damaged book data from Supabase
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("book_indiv")
          .select(`
                        bookBarcode,
                        bookStatus,
                        bookAcqDate,
                        notes,
                        book_titles (
                            titleID,
                            title,
                            publisher,
                            price
                        ),
                        book_transactions (
                            checkinDate,
                            userID,
                            user_accounts (
                                userFName,
                                userLName,
                                userLPUID,
                                userCollege,
                                userDepartment
                            )
                        )
                    `)
          .eq("bookStatus", "Damaged")

        if (error) {
          console.error("Error fetching data: ", error.message)
        } else {
          console.log("Damaged books data from Supabase:", data) // Debugging: raw data from Supabase

          const formattedData = data.map((item) => {
            // Get the most recent transaction with a checkinDate
            let checkinDate = null
            let borrower = "N/A"
            let userId = null
            let school_id = null
            let user_college = null
            let user_department = null

            if (item.book_transactions && item.book_transactions.length > 0) {
              // Sort transactions by checkinDate (most recent first)
              const sortedTransactions = [...item.book_transactions]
                .filter((t) => t.checkinDate) // Only include transactions with a checkinDate
                .sort((a, b) => {
                  // Sort in descending order (most recent first)
                  return new Date(b.checkinDate) - new Date(a.checkinDate)
                })

              if (sortedTransactions.length > 0) {
                // Get the most recent transaction with a checkinDate
                const lastTransaction = sortedTransactions[0]
                checkinDate = lastTransaction.checkinDate

                if (lastTransaction.user_accounts) {
                  borrower = `${lastTransaction.user_accounts.userFName} ${lastTransaction.user_accounts.userLName}`
                  user_college = lastTransaction.user_accounts.userCollege
                  user_department = lastTransaction.user_accounts.userDepartment
                  school_id = lastTransaction.user_accounts.userLPUID
                  userId = lastTransaction.userID
                }
              }
            }

            // Format date to "Month Day, Year" format
            let formattedDate = null
            if (checkinDate) {
              const [year, month, day] = checkinDate.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            const bookDetails = item.book_titles || {}

            return {
              type: "Damaged",
              status: item.bookStatus,
              rawDate: checkinDate, // Keep original for sorting
              dateAcquired: formattedDate,
              borrower: borrower,
              user_college: user_college,
              user_department: user_department,
              school_id: school_id,
              bookTitle: bookDetails.title || "Unknown Title",
              publisher: bookDetails.publisher || "Unknown Publisher",
              bookBarcode: item.bookBarcode,
              userId: userId,
              titleID: bookDetails.titleID,
              price: bookDetails.price || "N/A",
              notes: item.notes
            }
          })

          setDamagedData(formattedData)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error: ", error)
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array means this will run once when the component mounts

  const totalPages = Math.ceil(damagedData.length / entriesPerPage)

  // Handle sorting by book title
  const sortedData = [...damagedData].sort((a, b) => {
    const titleA = a.bookTitle.toLowerCase()
    const titleB = b.bookTitle.toLowerCase()

    return sortOrder === "Ascending" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA)
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
      (book.bookTitle && book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.publisher && book.publisher.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.borrower && book.borrower.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.bookBarcode && book.bookBarcode.includes(searchTerm))

    return matchesDateRange && matchesSearch
  })

  // Pagination logic
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedBooks = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const handleUserClick = (book) => {
    if (book.userId) {
      console.log("userid", book.userId, "user", book.borrower, book)
      navigate("/admin/useraccounts/viewusers", {
        state: { userId: book.userId, user: book },
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const truncateTitle = (title, maxLength = 25) => {
    if (!title) return "Unknown"
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Damaged Books</h3>

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
          placeholder="Title, publisher, borrower, or barcode"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Returned
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publisher
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barcode
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Borrower
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  Loading data...
                </td>
              </tr>
            ) : displayedBooks.length > 0 ? (
              displayedBooks.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                    <span
                      className="inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                        bg-intended text-white"
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.dateAcquired || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                    <Link
                      to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {truncateTitle(book.bookTitle)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{truncateTitle(book.publisher)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.bookBarcode}</td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                    {book.userId ? (
                      <button onClick={() => handleUserClick(book)} className="text-blue-500 hover:underline">
                        {book.borrower}
                      </button>
                    ) : (
                      <span>{book.borrower}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
                  No damaged books found.
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
        reportType={"DamagedBooks"}
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

export default DamagedBks
