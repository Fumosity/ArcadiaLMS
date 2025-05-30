import { useState, useEffect } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useNavigate } from "react-router-dom"

const SupportTicket = () => {
  const [supports, setSupports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("Ascending")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const navigate = useNavigate()

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

  useEffect(() => {
    const fetchSupports = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from("support_ticket").select(`
            supportID, type, status, subject, date, time, content, 
            user_accounts:userID (userFName, userLName, userID)
          `)

        if (error) throw error

        setSupports(data || [])
      } catch (error) {
        console.error("Error fetching supports:", error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupports()
  }, [supabase]) // Add `supabase` if needed, otherwise leave as `[]`

  const totalPages = Math.ceil(supports.length / entriesPerPage)

  // Handle sorting
  const sortedData = [...supports].sort((a, b) => {
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
    // Always exclude "Room Reservation" type when "All" is selected
    if (typeFilter === "All" && support.type === "Room Reservation") {
      return false
    }

    const matchesType = typeFilter === "All" || support.type === typeFilter

    const matchesStatus = statusFilter === "All" || support.status === statusFilter

    const matchesSearch =
      support.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.supportID.toString().includes(searchTerm)

    return matchesType && matchesStatus && matchesSearch
  })

  // Pagination logic
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedSupports = filteredData.slice(startIndex, startIndex + entriesPerPage)

  // Log `supports` when it updates
  useEffect(() => {
    console.log("Updated supports:", supports)
  }, [supports])

  const handleSupportClick = (support) => {
    console.log("support", support)
    navigate("/admin/supportticket", {
      state: { support: support },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleUserClick = (support) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: support.user_accounts.userID },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">User Support Tickets</h3>

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
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-3/12">User</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-2/12">Date</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-1/12">Time</th>
              <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider w-1/12">Ticket ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td className="text-center py-4 w-1/12">
                  <Skeleton />
                </td>
                <td className="text-center py-4 w-1/12">
                  <Skeleton />
                </td>
                <td className="text-center py-4 w-3/12">
                  <Skeleton />
                </td>
                <td className="text-center py-4 w-3/12">
                  <Skeleton />
                </td>
                <td className="text-center py-4 w-2/12">
                  <Skeleton />
                </td>
                <td className="text-center py-4 w-1/12">
                  <Skeleton />
                </td>
                <td className="text-center py-4 w-1/12">
                  <Skeleton />
                </td>
              </tr>
            ) : displayedSupports.length > 0 ? (
              displayedSupports.map((support, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                    <div className={`py-1 px-3 rounded-full bg-grey font-semibold`}>{support.type || "N/A"}</div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                    <div className={`py-1 px-3 rounded-full font-semibold ${checkStatusColor(support.status)}`}>
                      {support.status || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-left w-3/12">
                    <button onClick={() => handleSupportClick(support)} className="text-blue-500 hover:underline">
                      {support.subject}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-3/12">
                    <button onClick={() => handleUserClick(support)} className="text-sm text-arcadia-red font-semibold hover:underline">
                      {support.user_accounts.userFName} {support.user_accounts.userLName}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-2/12">
                    {new Date(support.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                    {new Date(`2000-01-01T${support.time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 py-2 text-sm  text-arcadia-red font-semibold text-center w-1/12">
                    <button onClick={() => handleSupportClick(support)} className="text-blue-500 hover:underline">
                      {support.supportID}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center text-zinc-600 py-4" colSpan="7">
                  No supports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
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

export default SupportTicket

