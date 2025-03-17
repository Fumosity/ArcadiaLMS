import { Link } from "react-router-dom"
import { useUserCirculation } from "../../backend/AUserCircBackend"

const AUserCirc = ({ user }) => {
  const {
    sortOrder,
    setSortOrder,
    entries,
    setEntries,
    typeOrder,
    setTypeFilter,
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

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border">
        <h3 className="text-2xl font-semibold mb-2">User Book Circulation History</h3>
        <div className="text-center py-4">Loading circulation history...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-2">User Book Circulation History</h3>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort By:</span>
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

          {/* No. of Entries */}
          <div className="flex items-center space-x-2">
            <label htmlFor="entries" className="text-sm">
              No. of Entries:
            </label>
            <input
              type="number"
              id="entries"
              min="1"
              value={entries}
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-20"
              onChange={(e) => setEntries(Number.parseInt(e.target.value))}
            />
          </div>
        </div>
        {/* Search */}
        <div className="flex items-center space-x-2 min-w-[0]">
          <label htmlFor="search" className="text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Title or hello"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Borrower</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book Title</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Barcode</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {paginatedData.length > 0 ? (
              paginatedData.map((book, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td
                    className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                ${book.type === "Returned" ? "bg-[#118B50]" : book.type === "Borrowed" ? "bg-[#FFB200]" : ""}`}
                  >
                    {book.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.time}</td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold">
                    <button onClick={() => handleUserClick(book)} className="text-blue-500 hover:underline">
                      {book.borrower}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold">
                    <Link
                      to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {truncateTitle(book.bookTitle)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.bookBarcode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="px-4 py-2 text-center">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-2 space-x-4">
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

