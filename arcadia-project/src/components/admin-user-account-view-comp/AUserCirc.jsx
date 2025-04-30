import { Link } from "react-router-dom"
import { useUserCirculation } from "../../backend/AUserCircBackend"
import { useEffect } from "react"

const AUserCirc = ({ user }) => {
  const {
    sortOrder,
    setSortOrder,
    entriesPerPage,
    setEntriesPerPage,
    typeOrder,
    setTypeFilter,
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    loading,
    handleUserClick,
    truncateTitle,
    totalEntries,
  } = useUserCirculation(user)

  // Log when component receives new user data
  useEffect(() => {
    console.log("AUserCirc received user data:", user)
  }, [user])

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border">
        <h3 className="text-2xl font-semibold mb-4">User Book Circulation History</h3>
        <div className="text-center py-4">Loading circulation history...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">User Book Circulation History</h3>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")}
              className="sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* Type */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Type:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
              value={typeOrder}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Date Range:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
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
            value={searchTerm}
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Title, borrower, or barcode"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {typeOrder === "Borrowed" ? "Date Borrowed" : typeOrder === "Returned" ? "Date Returned" : "Date"}
              </th>
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
            {paginatedData.length > 0 ? (
              paginatedData.map((book, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                    <span
                      className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                      ${book.type === "Returned" ? "bg-resolved text-white" : book.type === "Borrowed" ? "bg-ongoing" : "bg-grey"}`}
                    >
                      {book.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    {book.type === "Borrowed" ? book.dateOut : book.dateIn}
                  </td>
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
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{book.deadline || "N/A"}</td>
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

      {/* Pagination */}
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

export default AUserCirc
