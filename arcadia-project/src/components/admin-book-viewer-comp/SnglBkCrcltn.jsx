import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"

const SnglBkCrcltn = ({ titleID }) => {
  console.log("SnglBkCrcltn received titleID:", titleID)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("Descending")
  const [typeFilter, setTypeFilter] = useState("All")
  const [bkhistoryData, setBkhistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (titleID == null || isNaN(titleID)) {
      console.error("titleID is not a valid number or is null")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      console.log("current titleID:", titleID)
      setLoading(true)

      try {
        // Step 1: Fetch books associated with the current titleID from book_indiv
        const { data: bookIndiv, error: bookIndivError } = await supabase
          .from("book_indiv")
          .select("*")
          .eq("titleID", titleID)

        if (bookIndivError) {
          console.error("Error fetching book_indiv: ", bookIndivError.message)
          setLoading(false)
          return
        }

        // Get a list of bookBarcodes for the current titleID
        const bookBarcodes = bookIndiv.map((book) => book.bookBarcode)

        if (bookBarcodes.length === 0) {
          console.log("No book copies found for this title")
          setLoading(false)
          return
        }

        const { data: transactions, error: transactionError } = await supabase
          .from("book_transactions")
          .select(`
            transactionType, 
            checkinDate, 
            checkinTime, 
            checkoutDate, 
            checkoutTime, 
            userID,
            bookBarcode, 
            book_indiv(
                bookBarcode,
                bookStatus,
                book_titles (
                    titleID,
                    title,
                    price
                )
            ),
            user_accounts (
                userFName,
                userLName,
                userLPUID
            )`)
          .in("bookBarcode", bookBarcodes)

        if (transactionError) {
          console.error("Error fetching transactions: ", transactionError.message)
          setLoading(false)
          return
        }

        // Step 3: Fetch book_titles to get the details of the title
        const { data: bookTitles, error: bookTitlesError } = await supabase
          .from("book_titles")
          .select("titleID, title, price")
          .eq("titleID", titleID)

        if (bookTitlesError) {
          console.error("Error fetching book_titles: ", bookTitlesError.message)
          setLoading(false)
          return
        }

        // Step 4: Now join the data manually in JavaScript
        const formattedData = transactions.map((transaction) => {
          const titleDetails = bookTitles[0] // Since we know it's only one title for the current titleID

          const date = transaction.checkinDate || transaction.checkoutDate
          const time = transaction.checkinTime || transaction.checkoutTime

          let formattedTime = null
          if (time) {
            const timeString = time.includes(":") ? time : `${time.slice(0, 2)}:${time.slice(2)}`
            formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString("en-PH", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          }

          return {
            type: transaction.transactionType,
            date,
            time: formattedTime,
            borrower: `${transaction.user_accounts.userFName} ${transaction.user_accounts.userLName}`,
            bookTitle: titleDetails?.title || "N/A",
            bookBarcode: transaction.bookBarcode,
            userId: transaction.userID,
            titleID: titleDetails?.titleID,
          }
        })

        setBkhistoryData(formattedData)
        setLoading(false)
      } catch (error) {
        console.error("Error: ", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [titleID])

  // Handle filtering and searching
  const filteredData = bkhistoryData.filter((book) => {
    const matchesType = typeFilter === "All" || book.type === typeFilter

    const matchesSearch =
      book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookBarcode.includes(searchTerm)

    return matchesType && matchesSearch
  })

  // Handle sorting by borrower name
  const sortedData = [...filteredData].sort((a, b) => {
    const nameA = a.borrower.toLowerCase()
    const nameB = b.borrower.toLowerCase()

    return sortOrder === "Ascending" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
  })

  // Pagination logic
  const totalEntries = sortedData.length
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + entriesPerPage)

  const handleUserClick = (book) => {
    console.log("userid", book.userId, "user", book.borrower, book)
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: book.userId, user: book },
    })
  }

  const truncateTitle = (title, maxLength = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Book Circulation History</h3>

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
        <div className="flex items-center space-x-2 min-w-[0]">
          <label htmlFor="search" className="font-medium text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
            placeholder="Title, borrower, or barcode"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  Loading data...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                    <span
                      className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                      ${book.type === "Returned" ? "bg-[#118B50]" : book.type === "Borrowed" ? "bg-[#FFB200]" : "bg-grey"}`}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
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
    </div>
  )
}

export default SnglBkCrcltn

