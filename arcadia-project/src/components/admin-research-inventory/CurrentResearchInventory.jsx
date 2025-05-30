import { useEffect, useState } from "react"
import { supabase } from "/src/supabaseClient.js"
import { Link } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useUser } from "../../backend/UserContext"
import PrintReportModal from "../../z_modals/PrintTableReport"

const CurrentResearchInventory = ({ onResearchSelect, showArchived = false }) => {
  const [inventoryData, setInventoryData] = useState([])
  const [sortOrder, setSortOrder] = useState("Ascending")
  const [pubDateFilter, setPubDateFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResearch, setSelectedResearch] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [collegeType, setCollegeType] = useState("All")
  const [departmentType, setDepartmentType] = useState("All")
  const [availableDepartments, setAvailableDepartments] = useState([])
  const [collegeArchiveStatus, setCollegeArchiveStatus] = useState({})
  const [showArchivedColleges, setShowArchivedColleges] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { user } = useUser()
  console.log(user)
  const username = user.userFName + " " + user.userLName
  console.log(username)

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data, error } = await supabase.from("college_list").select("college, isarchived")

        if (error) {
          console.error("Error fetching colleges:", error)
          return
        }

        // Create a map of college abbreviations to their archive status
        const archiveStatusMap = {}
        data.forEach((college) => {
          archiveStatusMap[college.college] = college.isarchived || false
        })

        setCollegeArchiveStatus(archiveStatusMap)
      } catch (error) {
        console.error("Unexpected error fetching colleges:", error)
      }
    }

    fetchColleges()
  }, [])

  useEffect(() => {
    const fetchResearch = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("research")
          .select(
            "researchID, title, college, department, abstract, location, researchCallNum, pubDate, author, keywords",
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

  useEffect(() => {
    if (inventoryData.length > 0) {
      const departments = []

      // Filter research by college type and archive status
      const filteredResearch = inventoryData.filter((research) => {
        // Skip if college is archived and we're not showing archived
        if (collegeArchiveStatus[research.college] && !showArchivedColleges) {
          return false
        }

        return collegeType === "All" || research.college === collegeType
      })

      filteredResearch.forEach((research) => {
        if (research.department) {
          departments.push(research.department)
        }
      })

      const uniqueDepartments = [...new Set(departments)]
      setAvailableDepartments(uniqueDepartments)

      // Reset department filter if the current selection is no longer available
      if (departmentType !== "All" && !uniqueDepartments.includes(departmentType)) {
        setDepartmentType("All")
      }
    }
  }, [collegeType, inventoryData, collegeArchiveStatus, showArchivedColleges])

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
    // Skip if college is archived and we're not showing archived
    if (collegeArchiveStatus[research.college] && !showArchivedColleges) {
      return false
    }

    // Filter by publication date if specified
    const matchesPubDate =
      !pubDateFilter || String(research.pubDate).toLowerCase().includes(pubDateFilter.toLowerCase())

    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      (typeof research.title === "string" && research.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof research.college === "string" && research.college.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof research.department === "string" &&
        research.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof research.keywords === "string" &&
        (research.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
          research.keywords
            .split(",")
            .some((keyword) => keyword.trim().toLowerCase().includes(searchTerm.toLowerCase())))) ||
      (Array.isArray(research.keywords) &&
        research.keywords.some(
          (keyword) => typeof keyword === "string" && keyword.toLowerCase().includes(searchTerm.toLowerCase()),
        )) ||
      (typeof research.author === "string" && research.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(research.author) &&
        research.author.some(
          (author) => typeof author === "string" && author.toLowerCase().includes(searchTerm.toLowerCase()),
        ))

    // Filter by college type
    const matchesCollege =
      collegeType === "All" ||
      (research.college && research.college.toLowerCase().startsWith(collegeType.toLowerCase()))
    // Filter by department type
    const matchesDepartment = departmentType === "All" || research.department === departmentType

    return matchesPubDate && matchesSearch && matchesCollege && matchesDepartment
  })

  // Check if there are any research items for the selected program
  const hasResearchForProgram =
    collegeType === "All" ||
    inventoryData.some(
      (research) =>
        research.college &&
        research.college.toLowerCase().startsWith(collegeType.toLowerCase()) &&
        (!collegeArchiveStatus[research.college] || showArchivedColleges),
    )

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedResearch = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const handleRowClick = (research) => {
    setSelectedResearch(research)
    if (onResearchSelect) {
      onResearchSelect(research)
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
      return `${formattedAuthors[0]}, ${formattedAuthors[1]}, ...`
    }
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, collegeType, departmentType, pubDateFilter, showArchivedColleges])

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Current Research Inventory</h3>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
              className="sort-by bg-gray-200 border-grey py-1 px-1 rounded-lg text-sm w-24"
            >
              {sortOrder}
            </button>
          </div>

          {/* College Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Program:</span>
            <select
              className="bg-gray-200 py-1 px-1 border border-grey rounded-lg text-sm w-[105px]"
              value={collegeType}
              onChange={(e) => setCollegeType(e.target.value)}
            >
              <option value="All">All Programs</option>
              <option value="COECSA">COECSA</option>
              <option value="CLAE">CLAE</option>
              <option value="CITHM">CITHM</option>
              <option value="CAMS">CAMS</option>
              <option value="CBA">CBA</option>
              <option value="LAW">LAW</option>
              <option value="CFAD">CFAD</option>
              <option value="CON">CON</option>
              <option value="IS">IS</option>
              <option value="Graduate School">Graduate School</option>
            </select>
          </div>

          {/* Department Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Department:</span>
            <select
              className="bg-gray-200 py-1 px-1 border border-grey rounded-lg text-sm w-[90px]"
              value={departmentType}
              onChange={(e) => setDepartmentType(e.target.value)}
              disabled={availableDepartments.length === 0}
            >
              <option value="All">All Depts.</option>
              {availableDepartments.map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          {/* Pub Date Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Pub. Year:</span>
            <input
              type="number"
              className="bg-gray-200 py-1 px-2 border border-grey rounded-lg text-sm w-[90px]"
              placeholder="YYYY"
              value={pubDateFilter}
              onChange={(e) => setPubDateFilter(e.target.value)}
            />
          </div>

          {/* Entries Per Page */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Entries:</span>
            <select
              className="bg-gray-200 py-1 px-1 border border-grey rounded-lg text-sm w-13"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>


          <div>
            <button
              className="sort-by bg-arcadia-red hover:bg-white text-white hover:text-arcadia-red font-semibold py-1 px-3 rounded-lg text-sm w-28"
              onClick={() => setIsPrintModalOpen(true)}
            >
              Print Report
            </button>
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
              placeholder="Title, author, or keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Show Archived Toggle */}
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showArchivedColleges}
                onChange={() => setShowArchivedColleges(!showArchivedColleges)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arcadia-red"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                {showArchivedColleges ? "Showing Archived" : "Show Archived"}
              </span>
            </label>
          </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program & Department
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Authors
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Call No.
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Pub. Year
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
                  className={`hover:bg-light-gray cursor-pointer ${selectedResearch?.researchID === item.researchID ? "bg-gray-200" : ""
                    } ${collegeArchiveStatus[item.college] ? "bg-gray-100" : ""}`}
                  onClick={() => handleRowClick(item)}
                >
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-36">
                    <div className="flex justify-center">
                      <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1">
                        {item.department !== "N/A" ? `${item.college} - ${item.department}` : item.college}
                        {collegeArchiveStatus[item.college] && (
                          <span className="ml-1 text-xs text-gray-500">(Archived)</span>
                        )}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm max-w-36 hidden">
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

                  <td className="px-4 py-4 text-sm max-w-48 relative group">
                    <div className="flex items-center space-x-1 w-fit">
                      <span className="inline-block truncate break-words">{formatAuthor(item.author)}</span>
                      {Array.isArray(item.author) && item.author.length > 2 && (
                        <div className="absolute top-0 left-1/2 bg-white border border-grey rounded p-2 z-10 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                          {item.author.slice(2).map((author, i) => (
                            <div key={i} className="mt-1">
                              {formatAuthor([author])}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center text-sm text-gray-500 w-1/8">{item.researchCallNum}</td>

                  <td className="px-4 py-4 text-center text-sm text-gray-500 w-1/8">{item.pubDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
                  {collegeType !== "All" && !hasResearchForProgram
                    ? showArchivedColleges
                      ? "No Research under this program yet."
                      : "No active Research under this program. Try enabling 'Show Archived'."
                    : showArchivedColleges
                      ? "No research found."
                      : "No active research found. Try enabling 'Show Archived'."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span className="text-xs text-arcadia-red">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>
        <button
          className={`uPage-btn ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next Page
        </button>
      </div>
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        filteredData={filteredData} // Pass the filtered data
        reportType={"ResearchInventory"}
        filters={{
          type: [collegeType, departmentType],
          pubDateFilter,
          sortOrder,
          searchTerm,
        }}
        username={username}
      />
    </div>
  )
}

export default CurrentResearchInventory
