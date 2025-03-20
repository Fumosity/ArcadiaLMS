"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useUser } from "../../../backend/UserContext"
import { Link } from "react-router-dom"

const AccountRequests = () => {
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const [sortOrder, setSortOrder] = useState("Descending")
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(5)

  const fetchReservations = useCallback(async () => {
    if (!user?.userID) {
      alert("Please log in to view your reservations.")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      console.log("Fetching reservations for userID:", user.userID)

      // Updated query to also fetch titleID for linking to book details
      const { data, error } = await supabase
        .from("book_reservation")
        .select("bookResID, status, date, details, book_titles(titleID, title)")
        .eq("userID", user.userID)
        .order("date", { ascending: false })

      if (error) throw error

      console.log("Fetched reservations:", data)
      setReservations(data || [])
    } catch (error) {
      console.error("Error fetching reservations:", error.message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.userID])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

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

  // Handle sorting
  const sortedData = [...reservations].sort((a, b) => {
    // Get the book titles, defaulting to empty strings if undefined
    const titleA = (a.book_titles?.title || "").toLowerCase()
    const titleB = (b.book_titles?.title || "").toLowerCase()

    // Sort based on the current sort order
    if (sortOrder === "Ascending") {
      return titleA.localeCompare(titleB)
    } else {
      return titleB.localeCompare(titleA)
    }
  })

  // Handle filtering and searching
  const filteredData = sortedData.filter((reservation) => {
    const matchesStatus = statusFilter === "All" || reservation.status === statusFilter

    const matchesSearch =
      !searchTerm ||
      (reservation.book_titles?.title &&
        reservation.book_titles.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reservation.details && reservation.details.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesStatus && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedReservations = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const truncateText = (text, maxLength = 25) => {
    if (!text) return "N/A"
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div className="uMain-cont">
      <h3 className="text-2xl font-medium text-arcadia-black mb-6">My Book Reservations</h3>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
              className="border border-grey sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* Filter By Status */}
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
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="font-medium text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="border border-grey rounded-md py-1 px-2 text-sm w-64"
            placeholder="Title or details"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead>
            <tr>
              {/* Switched the order of Status and Book Title columns */}
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-center">
                    <Skeleton height={20} />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Skeleton height={20} />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Skeleton height={20} />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Skeleton height={20} />
                  </td>
                </tr>
              ))
            ) : displayedReservations.length > 0 ? (
              displayedReservations.map((reservation) => (
                <tr key={reservation.bookResID} className="hover:bg-light-gray">
                  {/* Status column now first */}
                  <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                    <span
                      className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                        ${
                          reservation.status === "Pending"
                            ? "bg-ongoing"
                            : reservation.status === "Approved"
                              ? "bg-resolved text-white"
                              : reservation.status === "Rejected"
                                ? "bg-dark-blue text-white"
                                : "bg-grey"
                        }`}
                    >
                      {reservation.status || "N/A"}
                    </span>
                  </td>
                  {/* Book Title column with clickable link */}
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-center">
                    {reservation.book_titles?.titleID ? (
                      <Link
                        to={`/user/bookview?titleID=${encodeURIComponent(reservation.book_titles.titleID)}`}
                        className="text-blue-600 hover:underline"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      >
                        {truncateText(reservation.book_titles?.title)}
                      </Link>
                    ) : (
                      truncateText(reservation.book_titles?.title)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{formatDate(reservation.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    {truncateText(reservation.details, 40)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-zinc-600">
                  {user ? "No book reservations found." : "Please log in to view your reservations."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && displayedReservations.length > 0 && (
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

export default AccountRequests

