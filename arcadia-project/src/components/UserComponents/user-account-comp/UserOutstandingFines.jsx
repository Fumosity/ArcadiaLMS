import { useEffect, useState } from "react"
import { supabase } from "../../../supabaseClient.js"
import { Link } from "react-router-dom"

const UserOutstandingFines = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [overdueBooks, setOverdueBooks] = useState([])
  const [damagedBooks, setDamagedBooks] = useState([])
  const [loading, setLoading] = useState(true)

  // Sorting and pagination states for overdue books
  const [overdueSortOrder, setOverdueSortOrder] = useState("Descending")
  const [overdueSortBy, setOverdueSortBy] = useState("fine_amount")
  const [overduePage, setOverduePage] = useState(1)
  const [overdueEntriesPerPage, setOverdueEntriesPerPage] = useState(5)

  // Sorting and pagination states for damaged books
  const [damagedSortOrder, setDamagedSortOrder] = useState("Descending")
  const [damagedSortBy, setDamagedSortBy] = useState("fine")
  const [damagedPage, setDamagedPage] = useState(1)
  const [damagedEntriesPerPage, setDamagedEntriesPerPage] = useState(5)

  // Fetch current user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser) {
      console.log("Current user from localStorage:", storedUser)
      setCurrentUser(storedUser)
    }
  }, [])

  // Fetch user's outstanding fines from Supabase
  useEffect(() => {
    const fetchUserFines = async () => {
      if (!currentUser || !currentUser.userID) {
        console.log("No user ID available")
        setLoading(false)
        return
      }

      console.log("Fetching outstanding fines for user ID:", currentUser.userID)
      setLoading(true)

      try {
        // Fetch overdue books
        const today = new Date()
        const { data: overdueData, error: overdueError } = await supabase
          .from("book_transactions")
          .select(`
            transactionID, 
            transactionType,
            userID, 
            bookBarcode, 
            book_indiv (
              bookBarcode,
              bookStatus,
              book_titles (
                titleID,
                title,
                price
              )
            ),
            checkoutDate, 
            checkoutTime, 
            deadline
          `)
          .eq("userID", currentUser.userID)
          .not("deadline", "is.null")
          .lt("deadline", today.toISOString().split("T")[0])
          .neq("transactionType", "Returned")

        if (overdueError) {
          console.error("Error fetching overdue books:", overdueError)
        } else {
          const formattedOverdueData = overdueData.map((item) => {
            const deadline = item.deadline
            let overdue_days = 0

            // Calculate overdue days excluding Sundays
            for (let d = new Date(deadline); d < today; d.setDate(d.getDate() + 1)) {
              if (d.getDay() !== 0) {
                overdue_days++
              }
            }

            const fine_amount = overdue_days * 10
            const bookDetails = item.book_indiv || {}
            const bookTitles = bookDetails.book_titles || {}

            // Format date to "Month Day, Year" format
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

            // Format checkout date
            let formattedCheckoutDate = null
            if (item.checkoutDate) {
              const [year, month, day] = item.checkoutDate.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedCheckoutDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            return {
              transactionID: item.transactionID,
              bookTitle: bookTitles.title || "Unknown Title",
              bookBarcode: bookDetails.bookBarcode || item.bookBarcode || "N/A",
              titleID: bookTitles.titleID,
              checkoutDate: formattedCheckoutDate || "N/A",
              deadline: formattedDeadline || "N/A",
              overdue_days,
              fine_amount,
            }
          })

          console.log("Formatted overdue data:", formattedOverdueData)
          setOverdueBooks(formattedOverdueData)
        }

        // Fetch damaged books
        const { data: damageData, error: damageError } = await supabase
          .from("book_transactions")
          .select(`
    transactionID,
    userID,
    bookBarcode,
    book_indiv!inner (
      bookBarcode,
      bookStatus,
      book_titles (
        titleID,
        title,
        price
      )
    )
  `)
          .eq("userID", currentUser.userID)
          .order("transactionID", { ascending: false })

        if (damageError) {
          console.error("Error fetching damaged books:", damageError)
        } else {
          // We'll store verified damaged books here
          const verifiedDamageData = []

          // Get all unique book barcodes from the user's transactions
          const uniqueBookBarcodes = [...new Set(damageData.map((item) => item.bookBarcode))]

          // For each unique book
          for (const barcode of uniqueBookBarcodes) {
            // 1. Check if the book is currently damaged
            const { data: bookStatus, error: bookStatusError } = await supabase
              .from("book_indiv")
              .select("bookStatus")
              .eq("bookBarcode", barcode)
              .single()

            if (bookStatusError) {
              console.error(`Error checking status for book ${barcode}:`, bookStatusError)
              continue
            }

            // Only proceed if the book is currently damaged
            if (bookStatus.bookStatus === "Damaged") {
              // 2. Check if this user was the last one to have the book
              const { data: latestTransaction, error: latestError } = await supabase
                .from("book_transactions")
                .select("userID, transactionID, book_indiv!inner(bookBarcode, book_titles(titleID, title, price))")
                .eq("bookBarcode", barcode)
                .order("transactionID", { ascending: false })
                .limit(1)

              if (!latestError && latestTransaction.length > 0) {
                // Only add to the user's fines if they were the last one to have the book
                if (latestTransaction[0].userID === currentUser.userID) {
                  verifiedDamageData.push(latestTransaction[0])
                }
              }
            }
          }

          const formattedDamageData = verifiedDamageData.map((item) => {
            const bookDetails = item.book_indiv?.book_titles || {}
            return {
              transactionID: item.transactionID,
              bookBarcode: item.book_indiv.bookBarcode,
              bookTitle: bookDetails.title || "Unknown Title",
              titleID: bookDetails.titleID,
              fine: bookDetails.price || 0,
            }
          })

          console.log("Formatted damage data (verified current damages only):", formattedDamageData)
          setDamagedBooks(formattedDamageData)
        }
      } catch (error) {
        console.error("Unexpected error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserFines()
  }, [currentUser])

  // Sort and paginate overdue books
  const sortedOverdueBooks = [...overdueBooks].sort((a, b) => {
    if (overdueSortOrder === "Descending") {
      return b[overdueSortBy] > a[overdueSortBy] ? 1 : -1
    } else {
      return a[overdueSortBy] > b[overdueSortBy] ? 1 : -1
    }
  })

  const overdueStartIndex = (overduePage - 1) * overdueEntriesPerPage
  const displayedOverdueBooks = sortedOverdueBooks.slice(overdueStartIndex, overdueStartIndex + overdueEntriesPerPage)

  // Sort and paginate damaged books
  const sortedDamagedBooks = [...damagedBooks].sort((a, b) => {
    if (damagedSortOrder === "Descending") {
      return b[damagedSortBy] > a[damagedSortBy] ? 1 : -1
    } else {
      return a[damagedSortBy] > b[damagedSortBy] ? 1 : -1
    }
  })

  const damagedStartIndex = (damagedPage - 1) * damagedEntriesPerPage
  const displayedDamagedBooks = sortedDamagedBooks.slice(damagedStartIndex, damagedStartIndex + damagedEntriesPerPage)

  const truncateTitle = (title, maxLength = 25) => {
    if (!title) return "Unknown Title"
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  // Calculate total fines
  const totalOverdueFines = overdueBooks.reduce((total, book) => total + book.fine_amount, 0)
  const totalDamageFines = damagedBooks.reduce((total, book) => total + book.fine, 0)
  const totalFines = totalOverdueFines + totalDamageFines

  return (
    <div className="uMain-cont">
      <h3 className="text-2xl font-medium text-arcadia-black mb-6">My Outstanding Fines</h3>

      {/* Total fines summary */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-grey">
        <h4 className="text-lg font-medium mb-2">Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Overdue Fines:</p>
            <p className="text-lg font-semibold">₱{totalOverdueFines}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Damage Fines:</p>
            <p className="text-lg font-semibold">₱{totalDamageFines.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Due:</p>
            <p className="text-xl font-bold text-arcadia-red">₱{totalFines.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Overdue Books Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-medium">Overdue Books</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Sort:</span>
              <button
                onClick={() => setOverdueSortOrder(overdueSortOrder === "Ascending" ? "Descending" : "Ascending")}
                className="border border-grey sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
              >
                {overdueSortOrder}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Sort By:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
                value={overdueSortBy}
                onChange={(e) => setOverdueSortBy(e.target.value)}
              >
                <option value="fine_amount">Fine Amount</option>
                <option value="overdue_days">Days Overdue</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Entries:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
                value={overdueEntriesPerPage}
                onChange={(e) => setOverdueEntriesPerPage(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Overdue
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Title
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checkout Date
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center">
                    Loading data...
                  </td>
                </tr>
              ) : displayedOverdueBooks.length > 0 ? (
                displayedOverdueBooks.map((book, index) => (
                  <tr key={index} className="hover:bg-light-gray">
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">₱{book.fine_amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.overdue_days} days</td>
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
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.checkoutDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.deadline}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
                    {currentUser ? "No overdue books found." : "Please log in to view your overdue books."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-2 space-x-4">
          <button
            className={`uPage-btn ${overduePage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setOverduePage((prev) => Math.max(prev - 1, 1))}
            disabled={overduePage === 1 || displayedOverdueBooks.length === 0}
          >
            Previous Page
          </button>
          <span className="text-xs text-arcadia-red">
            Page {overduePage} of {Math.max(1, Math.ceil(overdueBooks.length / overdueEntriesPerPage))}
          </span>
          <button
            className={`uPage-btn ${
              overduePage === Math.ceil(overdueBooks.length / overdueEntriesPerPage) || overdueBooks.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-grey"
            }`}
            onClick={() =>
              setOverduePage((prev) => Math.min(prev + 1, Math.ceil(overdueBooks.length / overdueEntriesPerPage)))
            }
            disabled={
              overduePage === Math.ceil(overdueBooks.length / overdueEntriesPerPage) ||
              displayedOverdueBooks.length === 0
            }
          >
            Next Page
          </button>
        </div>
      </div>

      {/* Damaged Books Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-medium">Damaged Books</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Sort:</span>
              <button
                onClick={() => setDamagedSortOrder(damagedSortOrder === "Ascending" ? "Descending" : "Ascending")}
                className="border border-grey sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
              >
                {damagedSortOrder}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Sort By:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
                value={damagedSortBy}
                onChange={(e) => setDamagedSortBy(e.target.value)}
              >
                <option value="fine">Fine Amount</option>
                <option value="bookTitle">Book Title</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Entries:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
                value={damagedEntriesPerPage}
                onChange={(e) => setDamagedEntriesPerPage(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Title
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center">
                    Loading data...
                  </td>
                </tr>
              ) : displayedDamagedBooks.length > 0 ? (
                displayedDamagedBooks.map((book, index) => (
                  <tr key={index} className="hover:bg-light-gray">
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">₱{book.fine.toFixed(2)}</td>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center text-zinc-600">
                    {currentUser ? "No damaged books found." : "Please log in to view your damaged books."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-2 space-x-4">
          <button
            className={`uPage-btn ${damagedPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setDamagedPage((prev) => Math.max(prev - 1, 1))}
            disabled={damagedPage === 1 || displayedDamagedBooks.length === 0}
          >
            Previous Page
          </button>
          <span className="text-xs text-arcadia-red">
            Page {damagedPage} of {Math.max(1, Math.ceil(damagedBooks.length / damagedEntriesPerPage))}
          </span>
          <button
            className={`uPage-btn ${
              damagedPage === Math.ceil(damagedBooks.length / damagedEntriesPerPage) || damagedBooks.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-grey"
            }`}
            onClick={() =>
              setDamagedPage((prev) => Math.min(prev + 1, Math.ceil(damagedBooks.length / damagedEntriesPerPage)))
            }
            disabled={
              damagedPage === Math.ceil(damagedBooks.length / damagedEntriesPerPage) ||
              displayedDamagedBooks.length === 0
            }
          >
            Next Page
          </button>
        </div>
      </div>

      {/* Note about fines */}
      <div className="mt-6 text-sm text-gray-600">
        <p>Note: Additional fines are added per school day. Fines are not added when the ARC is closed.</p>
        <p>Please visit the library to settle your outstanding fines.</p>
      </div>
    </div>
  )
}

export default UserOutstandingFines

