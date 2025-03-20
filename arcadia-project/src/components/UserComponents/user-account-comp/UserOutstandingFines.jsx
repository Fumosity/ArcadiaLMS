import { useState, useEffect } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Link } from "react-router-dom"
import { UserFinesService } from "../../../backend/UserFinesService"

const UserOutstandingFines = () => {
  // Data states
  const [overdueFines, setOverdueFines] = useState([])
  const [damageFines, setDamageFines] = useState([])
  const [finesSummary, setFinesSummary] = useState({
    totalOverdueFines: 0,
    totalDamageFines: 0,
    totalFines: 0,
    hasFines: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  // Overdue fines controls
  const [overdueSortOrder, setOverdueSortOrder] = useState("Descending")
  const [overdueSortBy, setOverdueSortBy] = useState("fine_amount")
  const [overdueCurrentPage, setOverdueCurrentPage] = useState(1)
  const [overdueEntriesPerPage, setOverdueEntriesPerPage] = useState(10)

  // Damage fines controls
  const [damageSortOrder, setDamageSortOrder] = useState("Descending")
  const [damageSortBy, setDamageSortBy] = useState("fine")
  const [damageCurrentPage, setDamageCurrentPage] = useState(1)
  const [damageEntriesPerPage, setDamageEntriesPerPage] = useState(10)

  // Fetch user and fines data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Get current user
      const user = UserFinesService.getCurrentUser()
      setCurrentUser(user)

      if (!user) {
        console.log("No user logged in")
        setIsLoading(false)
        return
      }

      try {
        // Fetch fines data
        const [overdueData, damageData] = await Promise.all([
          UserFinesService.fetchOverdueFines(),
          UserFinesService.fetchDamageFines(),
        ])

        setOverdueFines(overdueData)
        setDamageFines(damageData)

        // Calculate totals
        const summary = UserFinesService.calculateTotalFines(overdueData, damageData)
        setFinesSummary(summary)
      } catch (error) {
        console.error("Error fetching fines data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const [year, month, day] = dateString.split("-")
    const dateObj = new Date(year, month - 1, day)
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Truncate long text
  const truncateText = (text, maxLength = 25) => {
    if (!text) return "N/A"
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Handle sorting and pagination for overdue fines
  const sortedOverdueFines = [...overdueFines].sort((a, b) => {
    const valueA = a[overdueSortBy]
    const valueB = b[overdueSortBy]

    if (overdueSortOrder === "Ascending") {
      return valueA > valueB ? 1 : -1
    } else {
      return valueB > valueA ? 1 : -1
    }
  })

  const overdueStartIndex = (overdueCurrentPage - 1) * overdueEntriesPerPage
  const displayedOverdueFines = sortedOverdueFines.slice(overdueStartIndex, overdueStartIndex + overdueEntriesPerPage)
  const overdueTotalPages = Math.max(1, Math.ceil(overdueFines.length / overdueEntriesPerPage))

  // Handle sorting and pagination for damage fines
  const sortedDamageFines = [...damageFines].sort((a, b) => {
    const valueA = a[damageSortBy]
    const valueB = b[damageSortBy]

    if (damageSortOrder === "Ascending") {
      return valueA > valueB ? 1 : -1
    } else {
      return valueB > valueA ? 1 : -1
    }
  })

  const damageStartIndex = (damageCurrentPage - 1) * damageEntriesPerPage
  const displayedDamageFines = sortedDamageFines.slice(damageStartIndex, damageStartIndex + damageEntriesPerPage)
  const damageTotalPages = Math.max(1, Math.ceil(damageFines.length / damageEntriesPerPage))

  // Render loading state
  if (isLoading) {
    return (
      <div className="uMain-cont">
        <h3 className="text-2xl font-medium text-arcadia-black mb-2">My Outstanding Fines</h3>
        <div className="p-4">
          <Skeleton height={100} className="mb-4" />
          <Skeleton height={200} />
        </div>
      </div>
    )
  }

  // Render not logged in state
  if (!currentUser) {
    return (
      <div className="uMain-cont">
        <h3 className="text-2xl font-medium text-arcadia-black mb-2">My Outstanding Fines</h3>
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-grey">
          <h4 className="text-lg font-medium mb-2 text-gray-700">Please Log In</h4>
          <p className="text-gray-500">You need to be logged in to view your outstanding fines.</p>
        </div>
      </div>
    )
  }

  // Render no fines state
  if (!finesSummary.hasFines) {
    return (
      <div className="uMain-cont">
        <h3 className="text-2xl font-medium text-arcadia-black mb-2">My Outstanding Fines</h3>
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-grey">
          <h4 className="text-lg font-medium mb-2 text-gray-700">No Outstanding Fines</h4>
          <p className="text-gray-500">You don't have any outstanding fines at this time.</p>
        </div>
      </div>
    )
  }

  // Render fines state
  return (
    <div className="uMain-cont">
      <h3 className="text-2xl font-medium text-arcadia-black mb-2">My Outstanding Fines</h3>
      <p className="text-sm text-gray-600 mb-6">
        Note: Additional fines are added per school day. Fines are not added when the ARC is closed.
      </p>

      {/* Total fines summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-grey">
        <h4 className="text-lg font-medium mb-2">Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-light-gray rounded border border-grey">
            <p className="text-sm text-gray-500">Overdue Fines</p>
            <p className="text-xl font-semibold">₱{finesSummary.totalOverdueFines.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-light-gray rounded border border-grey">
            <p className="text-sm text-gray-500">Damage Fines</p>
            <p className="text-xl font-semibold">₱{finesSummary.totalDamageFines.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-light-gray rounded border border-grey">
            <p className="text-sm text-gray-500">Total Outstanding</p>
            <p className="text-xl font-semibold text-arcadia-red">₱{finesSummary.totalFines.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Overdue Fines Section - Only show if there are overdue fines */}
      {overdueFines.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">Overdue Books</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Sort:</span>
                <button
                  className="px-3 py-1 bg-gray-200 border border-grey rounded-md text-sm w-32"
                  onClick={() => setOverdueSortOrder(overdueSortOrder === "Descending" ? "Ascending" : "Descending")}
                >
                  {overdueSortOrder}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Filter:</span>
                <select
                  className="text-sm px-3 py-1 bg-gray-200 border border-grey rounded-md w-44"
                  value={overdueSortBy}
                  onChange={(e) => setOverdueSortBy(e.target.value)}
                >
                  <option value="fine_amount">Total Fine</option>
                  <option value="overdue_days">Days Overdue</option>
                  <option value="book_title">Book Title</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Entries:</span>
                <select
                  className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
                  value={overdueEntriesPerPage}
                  onChange={(e) => {
                    setOverdueEntriesPerPage(Number(e.target.value))
                    setOverdueCurrentPage(1) // Reset to first page when entries per page changes
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
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
                    Book Barcode
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayedOverdueFines.map((fine) => (
                  <tr key={fine.transaction_id} className="hover:bg-light-gray">
                    <td className="px-4 py-3 text-sm text-gray-900 text-center font-semibold">
                      ₱{fine.fine_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{fine.overdue_days} days</td>
                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                      {fine.book_title_id ? (
                        <Link
                          to={`/user/bookview?titleID=${encodeURIComponent(fine.book_title_id)}`}
                          className="text-blue-600 hover:underline"
                          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                          {truncateText(fine.book_title)}
                        </Link>
                      ) : (
                        truncateText(fine.book_title)
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{fine.book_barcode}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{formatDate(fine.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Overdue Fines */}
          {overdueFines.length > 0 && (
            <div className="flex justify-center items-center mt-2 space-x-4">
              <button
                className={`uPage-btn ${overdueCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
                onClick={() => setOverdueCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={overdueCurrentPage === 1}
              >
                Previous Page
              </button>
              <span className="text-xs text-arcadia-red">
                Page {overdueCurrentPage} of {overdueTotalPages}
              </span>
              <button
                className={`uPage-btn ${
                  overdueCurrentPage === overdueTotalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"
                }`}
                onClick={() => setOverdueCurrentPage((prev) => Math.min(prev + 1, overdueTotalPages))}
                disabled={overdueCurrentPage === overdueTotalPages}
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}

      {/* Damage Fines Section - Only show if there are damage fines */}
      {damageFines.length > 0 && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">Fines Due To Damages</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Sort:</span>
                <button
                  className="px-3 py-1 bg-gray-200 border border-grey rounded-md text-sm w-32"
                  onClick={() => setDamageSortOrder(damageSortOrder === "Descending" ? "Ascending" : "Descending")}
                >
                  {damageSortOrder}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Filter:</span>
                <select
                  className="text-sm px-3 py-1 bg-gray-200 border border-grey rounded-md w-44"
                  value={damageSortBy}
                  onChange={(e) => setDamageSortBy(e.target.value)}
                >
                  <option value="fine">Fine Amount</option>
                  <option value="book_title">Book Title</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Entries:</span>
                <select
                  className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
                  value={damageEntriesPerPage}
                  onChange={(e) => {
                    setDamageEntriesPerPage(Number(e.target.value))
                    setDamageCurrentPage(1) // Reset to first page when entries per page changes
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
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
                    Book Barcode
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayedDamageFines.map((fine) => (
                  <tr key={fine.transaction_id} className="hover:bg-light-gray">
                    <td className="px-4 py-3 text-sm text-gray-900 text-center font-semibold">
                      ₱{fine.fine.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                      {fine.book_title_id ? (
                        <Link
                          to={`/user/bookview?titleID=${encodeURIComponent(fine.book_title_id)}`}
                          className="text-blue-600 hover:underline"
                          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                          {truncateText(fine.book_title)}
                        </Link>
                      ) : (
                        truncateText(fine.book_title)
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{fine.book_barcode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Damage Fines */}
          {damageFines.length > 0 && (
            <div className="flex justify-center items-center mt-2 space-x-4">
              <button
                className={`uPage-btn ${damageCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
                onClick={() => setDamageCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={damageCurrentPage === 1}
              >
                Previous Page
              </button>
              <span className="text-xs text-arcadia-red">
                Page {damageCurrentPage} of {damageTotalPages}
              </span>
              <button
                className={`uPage-btn ${
                  damageCurrentPage === damageTotalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"
                }`}
                onClick={() => setDamageCurrentPage((prev) => Math.min(prev + 1, damageTotalPages))}
                disabled={damageCurrentPage === damageTotalPages}
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserOutstandingFines

