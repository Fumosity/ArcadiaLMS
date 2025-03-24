import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useUser } from "../../../backend/UserContext" // Adjust this path as needed

const ReportStatus = ({ onReportSelect }) => {
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser() // Get logged-in user info
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("Descending")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchReports = useCallback(async () => {
    if (!user?.userID) {
      alert("Please log in to view your reports.")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("report_ticket")
        .select("reportID, type, status, subject, date, time")
        .eq("userID", user.userID) // Filter by user ID

      if (error) throw error

      setReportData(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error.message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.userID])

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleReportClick = (reportID) => {
    onReportSelect(reportID)
  }

  function checkStatusColor(status) {
    switch (status) {
      case "Resolved":
        return "bg-resolved text-white font-semibold"
      case "Ongoing":
        return "bg-ongoing font-semibold"
      case "Intended":
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
  const sortedData = [...reportData].sort((a, b) => {
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
  const filteredData = sortedData.filter((report) => {
    const matchesType = typeFilter === "All" || report.type === typeFilter
    const matchesStatus = statusFilter === "All" || report.status === statusFilter
    const matchesSearch =
      report.subject.toLowerCase().includes(searchTerm.toLowerCase()) || report.reportID.toString().includes(searchTerm)

    return matchesType && matchesStatus && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedReports = filteredData.slice(startIndex, startIndex + entriesPerPage)

  return (
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Report Status</h2>
      </div>
      <p className="text-md mb-4">
        These are all the user reports that you have made. Click on the report ID to view the contents of the report and
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
              <option value="System">System</option>
              <option value="Feedback">Feedback</option>
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
              <option value="Ongoing">Ongoing</option>
              <option value="Resolved">Resolved</option>
              <option value="Intended">Intended</option>
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
            placeholder="Subject or report ID"
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
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-1/12">Report ID</th>
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
            ) : displayedReports.length > 0 ? (
              displayedReports.map((report) => (
                <tr key={report.reportID} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                    <div className="py-1 px-3 rounded-full bg-grey font-semibold">{report.type || "N/A"}</div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                    <div className={`py-1 px-3 rounded-full ${checkStatusColor(report.status)}`}>
                      {report.status || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-left w-3/12">
                    <button
                      onClick={() => handleReportClick(report.reportID)}
                      className="text-blue-500 hover:underline"
                    >
                      {report.subject || "N/A"}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-2/12">{formatDate(report.date)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">{formatTime(report.time)}</td>
                  <td className="px-4 py-2 text-sm text-arcadia-red font-semibold text-center w-1/12">
                    <button
                      onClick={() => handleReportClick(report.reportID)}
                      className="text-blue-500 hover:underline"
                    >
                      {report.reportID || "N/A"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center text-zinc-600 py-4" colSpan="6">
                  No reports found
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

export default ReportStatus

