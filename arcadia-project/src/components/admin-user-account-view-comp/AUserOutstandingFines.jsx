import { Link } from "react-router-dom"
import { useOutstandingFines } from "../../backend/AUOFBackend"
import { useEffect } from "react"

const AUserOutstandingFines = ({ user, source }) => {
  const {
    loading,
    overdueSortOrder,
    setOverdueSortOrder,
    overdueSortBy,
    setOverdueSortBy,
    overduePage,
    setOverduePage,
    overdueEntriesPerPage,
    setOverdueEntriesPerPage,
    displayedOverdueBooks,
    damagedSortOrder,
    setDamagedSortOrder,
    damagedSortBy,
    setDamagedSortBy,
    damagedPage,
    setDamagedPage,
    damagedEntriesPerPage,
    setDamagedEntriesPerPage,
    displayedDamagedBooks,
    truncateTitle,
    totalOverdueFines,
    totalDamageFines,
    totalFines,
    overdueBooks,
    damagedBooks,
  } = useOutstandingFines(user)

  // Log when component receives new user data
  useEffect(() => {
    console.log("AUserOutstandingFines received user data:", user)
  }, [user])

  return (
    <div className="uMain-cont">
      <h3 className="text-2xl font-medium text-arcadia-black mb-6">Outstanding Fines</h3>

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
                          to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
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
                    No overdue books found.
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
                          to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
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
                    No damaged books found.
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
      </div>
    </div>
  )
}

export default AUserOutstandingFines
