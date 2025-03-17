import React, { useState, useEffect } from "react"
import { supabase } from "/src/supabaseClient.js"
import { Link, useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const ReservSupport = () => {
  const [supports, setSupports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("Ascending")
  const [userTypeFilter, setUserTypeFilter] = useState("All") // renamed to be clearer
  const [statusFilter, setStatusFilter] = useState("All")
  const navigate = useNavigate()

  function checkStatusColor(status) {
    switch (status) {
      case 'Resolved':
        return "bg-resolved"
      case 'Ongoing':
        return "bg-ongoing"
      case 'Intended':
        return "bg-intended"
      default:
        return "bg-grey"
    }
  }

  useEffect(() => {
    const fetchSupports = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("support_ticket")
          .select(`
            supportID, type, status, subject, date, time, content,
            user_accounts:userID (userFName, userLName, userAccountType)
          `)
          .eq("type", "Room Reservation")

        if (error) throw error

        setSupports(data || [])
      } catch (error) {
        console.error("Error fetching supports:", error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupports()
  }, [])

  const totalPages = Math.ceil(supports.length / entriesPerPage)

  const sortedData = [...supports].sort((a, b) => {
    if (sortOrder === "Ascending") {
      return String(a.supportID).localeCompare(String(b.supportID))
    } else {
      return String(b.supportID).localeCompare(String(a.supportID))
    }
  })

  const filteredData = sortedData.filter((support) => {
    const matchesUserType =
      userTypeFilter === "All" || support.user_accounts?.userAccountType === userTypeFilter

    const matchesStatus =
      statusFilter === "All" || support.status === statusFilter

    const matchesSearch =
      support.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.supportID.toString().includes(searchTerm)

    return matchesUserType && matchesStatus && matchesSearch
  })

  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedSupports = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const handleSupportClick = (support) => {
    navigate("/admin/supportticket", {
      state: { support: support },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">Room Reservation Tickets</h3>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() =>
                setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")
              }
              className="sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* User Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">User Type:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
              <option value="Intern">Intern</option>
              <option value="Superadmin">Superadmin</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Status:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Intended">Intended</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 min-w-[0]">
          <label htmlFor="search" className="font-medium text-sm">Search:</label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
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
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Subject</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">User</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">User Type</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Date</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Time</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Ticket ID</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              {[...Array(8)].map((_, idx) => (
                <td key={idx} className="text-center py-4">
                  <Skeleton />
                </td>
              ))}
            </tr>
          ) : displayedSupports.length > 0 ? (
            displayedSupports.map((support, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                {/* <td className="px-4 py-2 text-sm text-gray-900 text-center">
                  <div className="py-1 px-3 rounded-full bg-grey font-semibold">
                    {support.type || "N/A"}
                  </div>
                </td> */}
                <td className="px-4 py-2 text-sm text-gray-900 text-center">
                  <div className={`py-1 px-3 rounded-full font-semibold ${checkStatusColor(support.status)}`}>
                    {support.status || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-left">
                  <button
                    onClick={() => handleSupportClick(support)}
                    className="text-blue-500 hover:underline"
                  >
                    {support.subject}
                  </button>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center">
                  {support.user_accounts?.userFName} {support.user_accounts?.userLName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center">
                  {support.user_accounts?.userAccountType || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center">
                  {support.date}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center">
                  {support.time}
                </td>
                <td className="px-4 py-2 text-sm text-arcadia-red font-semibold text-center">
                  <button
                    onClick={() => handleSupportClick(support)}
                    className="text-blue-500 hover:underline"
                  >
                    {support.supportID}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center text-zinc-600 py-4" colSpan="8">
                No supports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

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

export default ReservSupport
