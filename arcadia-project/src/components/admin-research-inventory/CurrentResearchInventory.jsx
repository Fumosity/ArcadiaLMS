"use client"

import { useEffect, useState } from "react"
import { supabase } from "/src/supabaseClient.js"
import { Link } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const CurrentResearchInventory = ({ onResearchSelect }) => {
  const [inventoryData, setInventoryData] = useState([])
  const [sortOrder, setSortOrder] = useState("Descending")
  const [pubDateFilter, setPubDateFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResearch, setSelectedResearch] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)

  useEffect(() => {
    const fetchResearch = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("research") // Fetch from 'research' table
          .select(
            "researchID, title, college, department, abstract, location, researchARCID, pubDate, cover, author, keyword, pages",
          )

        if (error) {
          console.error("Error fetching research:", error)
          return
        }

        console.log("Fetched research data:", data)
        setInventoryData(data)
      } catch (error) {
        console.error("Unexpected error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResearch()
  }, [])

  // Handle sorting
  const sortedData = [...inventoryData].sort((a, b) => {
    if (sortOrder === "Ascending") {
      return a.title.localeCompare(b.title)
    } else {
      return b.title.localeCompare(a.title)
    }
  })

  // Handle filtering and searching
  const filteredData = sortedData.filter((research) => {
    // Filter by publication date if specified
    const matchesPubDate =
      !pubDateFilter || (research.pubDate && research.pubDate.toLowerCase().includes(pubDateFilter.toLowerCase()))

    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      (research.title && research.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (research.college && research.college.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (research.department && research.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (research.author &&
        ((typeof research.author === "string" && research.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (Array.isArray(research.author) &&
            research.author.some((author) => author && author.toLowerCase().includes(searchTerm.toLowerCase())))))

    return matchesPubDate && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedResearch = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const handleRowClick = (research) => {
    setSelectedResearch(research)
    if (onResearchSelect) {
      onResearchSelect(research) // Pass the selected research to parent
    }
  }

  const formatAuthor = (authors) => {
    if (!authors || authors.length === 0) return "N/A"

    if (!Array.isArray(authors)) {
      authors = [authors] // Handle cases where author is not an array
    }

    const formattedAuthors = authors.map((author) => {
      author = author.trim()
      const names = author.split(" ")
      const initials = names.slice(0, -1).map((name) => name[0] + ".")
      const lastName = names.slice(-1)[0]
      return `${initials.join("")} ${lastName}`
    })

    if (formattedAuthors.length <= 2) {
      return formattedAuthors.join(", ")
    } else {
      const etAlCount = authors.length - 2
      return `${formattedAuthors[0]}, ${formattedAuthors[1]}, et al (${etAlCount} more)`
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Current Research Inventory</h3>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap justify-between space-x-4">
        <div className="flex gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
              className="sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* Pub Date Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Pub. Date:</span>
            <input
              type="text"
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
              placeholder="YYYY or YYYY-MM"
              value={pubDateFilter}
              onChange={(e) => setPubDateFilter(e.target.value)}
            />
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
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="font-medium text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-64"
            placeholder="Title, author, college, or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                College
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Authors
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thesis ID
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pub. Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: entriesPerPage }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <Skeleton className="w-24" />
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <Skeleton className="w-24" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                    <Skeleton className="w-40" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                    <Skeleton className="w-32" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <Skeleton className="w-20" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <Skeleton className="w-32" />
                  </td>
                </tr>
              ))
            ) : displayedResearch.length > 0 ? (
              displayedResearch.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-light-gray cursor-pointer ${
                    selectedResearch?.researchID === item.researchID ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleRowClick(item)} // Row click event
                >
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-36">
                    <div className="flex justify-center">
                      <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1">
                        {item.college}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm max-w-36">
                    <div className="flex justify-center">
                      <span className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-gray px-2 py-1">
                        {item.department}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate max-w-64">
                    <Link
                      to={`/admin/arviewer?researchID=${encodeURIComponent(item.researchID)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.title}
                    </Link>
                  </td>

                  <td className="px-4 py-4 text-sm truncate max-w-48 relative group">
                    {" "}
                    {/* Added group class here */}
                    <div className="flex items-center space-x-1">
                      <span className="inline-block truncate break-words">{formatAuthor(item.author)}</span>
                      {Array.isArray(item.author) &&
                        item.author.length > 2 && ( // Check if item.author is an array before checking length
                          <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded p-2 z-10 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                            {item.author.slice(2).map(
                              (
                                author,
                                i, // Use item.author here!
                              ) => (
                                <div key={i} className="mt-1">
                                  {formatAuthor([author])}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-500 w-10">{item.researchARCID}</td>

                  <td className="px-4 py-4 text-center text-sm text-gray-500 min-w-8">{item.pubDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
                  No research found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-2 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="uPage-btn"
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span className="text-xs text-arcadia-red">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="uPage-btn"
          disabled={currentPage === totalPages}
        >
          Next Page
        </button>
      </div>
    </div>
  )
}

export default CurrentResearchInventory

