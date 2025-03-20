import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useUser } from "../../../backend/UserContext"

const SupportTixStatus = ({ onSupportSelect }) => {
  const [supportData, setSupportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("Ascending")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchSupports = useCallback(async () => {
    if (!user?.userID) {
      alert("Please log in to view your supports.")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("support_ticket")
        .select("supportID, type, status, subject, date, time")
        .eq("userID", user.userID)

      if (error) throw error

      setSupportData(data || [])
    } catch (error) {
      console.error("Error fetching supports:", error.message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.userID])

  useEffect(() => {
    fetchSupports()
  }, [fetchSupports])

  const handleSupportClick = (supportID) => {
    onSupportSelect(supportID)
  }

  function checkStatusColor(status) {
    switch (status) {
      case "Approved":
        return "bg-resolved text-white font-semibold"
      case "Pending":
        return "bg-ongoing font-semibold"
      case "Rejected":
        return "bg-intended text-white font-semibold"
      default:
        return "bg-grey"
    }
  }

  // Format date to "Month Day, Year"
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // Format time to "H:MM AM/PM"
  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      console.error("Error formatting time:", error)
      return timeString
    }
  }

  // Handle sorting
  const sortedData = [...supportData].sort((a, b) => {
    // Create date objects for comparison
    const dateA = new Date(`${a.date} ${a.time}`)
    const dateB = new Date(`${b.date} ${b.time}`)

    if (sortOrder === "Ascending") {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })

  // Handle filtering and searching
  const filteredData = sortedData.filter((support) => {
    const matchesType = typeFilter === "All" || support.type === typeFilter
    const matchesStatus = statusFilter === "All" || support.status === statusFilter
    const matchesSearch =
      support.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.supportID.toString().includes(searchTerm)

    return matchesType && matchesStatus && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedSupports = filteredData.slice(startIndex, startIndex + entriesPerPage)

  return (
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Support Status</h2>
      </div>
      <p className="text-md mb-4">
        These are all the user supports that you have made. Click on the subject to view the contents of the support and
        the ARC's reply.
      </p>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
              className="sort-by bg-gray-200 py-1 px-3 border-grey rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* Filter By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Type:</span>
            <select
              className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Account">Account</option>
              <option value="Book">Book</option>
              <option value="Research">Research</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Status:</span>
            <select
              className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
        <div className="flex items-center space-x-2 min-w-[0]">
          <label htmlFor="search" className="font-medium text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="border border-grey rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
            placeholder="Subject or support ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-1/12">Type</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-1/12">Status</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-3/12">Subject</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-2/12">Date</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-1/12">Time</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-1/12">Support ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="text-center py-4 w-1/12">
                    <Skeleton height={20} />
                  </td>
                  <td className="text-center py-4 w-1/12">
                    <Skeleton height={20} />
                  </td>
                  <td className="text-center py-4 w-3/12">
                    <Skeleton height={20} />
                  </td>
                  <td className="text-center py-4 w-2/12">
                    <Skeleton height={20} />
                  </td>
                  <td className="text-center py-4 w-1/12">
                    <Skeleton height={20} />
                  </td>
                  <td className="text-center py-4 w-1/12">
                    <Skeleton height={20} />
                  </td>
                </tr>
              ))
            ) : displayedSupports.length > 0 ? (
              displayedSupports.map((support) => (
                <tr key={support.supportID} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                    <div className="py-1 px-3 rounded-full bg-grey font-semibold">{support.type || "N/A"}</div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                    <div className={`py-1 px-3 rounded-full ${checkStatusColor(support.status)}`}>
                      {support.status || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-left w-3/12">
                    <button
                      onClick={() => handleSupportClick(support.supportID)}
                      className="text-blue-500 hover:underline"
                    >
                      {support.subject || "N/A"}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-2/12">{formatDate(support.date)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">{formatTime(support.time)}</td>
                  <td className="px-4 py-2 text-sm text-arcadia-red font-semibold text-center w-1/12">
                    <button
                      onClick={() => handleSupportClick(support.supportID)}
                      className="text-blue-500 hover:underline"
                    >
                      {support.supportID || "N/A"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center text-zinc-600 py-4" colSpan="6">
                  No supports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && filteredData.length > 0 && (
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
      )}
    </div>
  )
}

export default SupportTixStatus

