import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import { useResearchFilters } from "../../backend/ResearchFilterContext"

const UResResults = ({ query }) => {
  const [researchList, setResearchList] = useState([])
  const [filteredResearch, setFilteredResearch] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 8
  const navigate = useNavigate()
  const [collegeArchiveStatus, setCollegeArchiveStatus] = useState({})
  const [showArchivedColleges, setShowArchivedColleges] = useState(false)

  // Get filter state from context
  const { selectedYear, yearRange, selectedCollege, selectedDepartment, sortOption } = useResearchFilters()

  // Fetch college archive status
  useEffect(() => {
    const fetchCollegeStatus = async () => {
      try {
        const { data, error } = await supabase.from("college_list").select("college, isarchived")

        if (error) {
          console.error("Error fetching college status:", error)
          return
        }

        // Create a map of college abbreviations to their archive status
        const archiveStatusMap = {}
        data.forEach((college) => {
          archiveStatusMap[college.college] = college.isarchived || false
        })

        setCollegeArchiveStatus(archiveStatusMap)
      } catch (error) {
        console.error("Error processing college status:", error)
      }
    }

    fetchCollegeStatus()
  }, [])

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase.from("research").select("*")
        if (error) {
          console.error("Error fetching research data:", error)
          return
        }

        // Process the data to ensure consistent format
        const processedData = data.map((research) => ({
          ...research,
          publishedYear: research.pubDate ? research.pubDate : "Unknown Year",
        }))

        setResearchList(processedData)
      } catch (error) {
        console.error("Error processing research data:", error)
      }
    }

    fetchResearch()
  }, [])

  useEffect(() => {
    if (researchList.length > 0) {
      let results = [...researchList]

      // Filter out research from archived colleges unless showArchivedColleges is true
      results = results.filter((research) => {
        // If college is archived and we're not showing archived, filter it out
        if (collegeArchiveStatus[research.college] && !showArchivedColleges) {
          return false
        }
        return true
      })

      // Filter by search query
      if (query) {
        const searchQuery = query.toLowerCase()
        results = results.filter((research) => {
          const titleMatch = research.title.toLowerCase().includes(searchQuery)

          // Handle author matching
          const authorString =
            research.author && Array.isArray(research.author)
              ? research.author.join(", ").toLowerCase()
              : typeof research.author === "string"
                ? research.author.toLowerCase()
                : ""
          const authorMatch = authorString.includes(searchQuery)

          // Add keyword matching
          let keywordMatch = false
          if (research.keywords && Array.isArray(research.keywords)) {
            keywordMatch = research.keywords.some(
              (keyword) => keyword && typeof keyword === "string" && keyword.toLowerCase().includes(searchQuery),
            )
          }

          return titleMatch || authorMatch || keywordMatch
        })
      }

      // Apply college filter
      if (selectedCollege && selectedCollege !== "All") {
        results = results.filter(
          (research) => research.college && research.college.toLowerCase() === selectedCollege.toLowerCase(),
        )
      }

      // Apply department filter
      if (selectedDepartment && selectedDepartment !== "All") {
        results = results.filter(
          (research) => research.department && research.department.toLowerCase() === selectedDepartment.toLowerCase(),
        )
      }

      // Apply year filters
      if (selectedYear) {
        const currentYear = new Date().getFullYear()
        let fromYear

        switch (selectedYear) {
          case "Last 5 Years":
            fromYear = currentYear - 5
            break
          case "Last 10 Years":
            fromYear = currentYear - 10
            break
          case "Last 25 Years":
            fromYear = currentYear - 25
            break
          default:
            fromYear = null
        }

        if (fromYear) {
          results = results.filter(
            (research) =>
              research.publishedYear !== "Unknown Year" && Number.parseInt(research.publishedYear) >= fromYear,
          )
        }
      } else if (yearRange.from || yearRange.to) {
        // Apply custom year range
        results = results.filter((research) => {
          if (research.publishedYear === "Unknown Year") return false

          const pubYear = Number.parseInt(research.publishedYear)
          const fromCondition = yearRange.from ? pubYear >= Number.parseInt(yearRange.from) : true
          const toCondition = yearRange.to ? pubYear <= Number.parseInt(yearRange.to) : true

          return fromCondition && toCondition
        })
      }

      // Apply sorting
      switch (sortOption) {
        case "title-asc":
          results.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "title-desc":
          results.sort((a, b) => b.title.localeCompare(a.title))
          break
        case "date-desc":
          results.sort((a, b) => {
            if (a.publishedYear === "Unknown Year") return 1
            if (b.publishedYear === "Unknown Year") return -1
            return Number.parseInt(b.publishedYear) - Number.parseInt(a.publishedYear)
          })
          break
        case "date-asc":
          results.sort((a, b) => {
            if (a.publishedYear === "Unknown Year") return 1
            if (b.publishedYear === "Unknown Year") return -1
            return Number.parseInt(a.publishedYear) - Number.parseInt(b.publishedYear)
          })
          break
        // best-match is default, no sorting needed
      }

      setFilteredResearch(results)
      // Reset to first page when filters change
      setCurrentPage(1)
    }
  }, [
    query,
    researchList,
    selectedYear,
    yearRange,
    selectedCollege,
    selectedDepartment,
    sortOption,
    collegeArchiveStatus,
    showArchivedColleges,
  ])

  const totalPages = Math.ceil(filteredResearch.length / entriesPerPage)
  const displayedResearch = filteredResearch.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  const formatAuthor = (authors) => {
    if (!authors || !Array.isArray(authors) || authors.length === 0) {
      return "Unknown Author"
    }

    return authors
      .map((authorName) => {
        const trimmedName = authorName.trim()
        const names = trimmedName.split(" ")
        const lastName = names.pop()
        const initials = names.map((name) => name[0] + ".").join("")
        return initials ? `${initials} ${lastName}` : lastName
      })
      .join(", ")
  }

  const formatPubDate = (dateString) => {
    if (!dateString) return "Unknown Date"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", { month: "long", year: "numeric" })
  }

  // Create a summary of active filters
  const getActiveFilters = () => {
    const filters = []

    if (selectedCollege && selectedCollege !== "All") {
      filters.push(`College: ${selectedCollege}`)

      if (selectedDepartment && selectedDepartment !== "All") {
        filters.push(`Department: ${selectedDepartment}`)
      }
    }

    if (selectedYear) {
      filters.push(`Time Period: ${selectedYear}`)
    } else if (yearRange.from || yearRange.to) {
      const fromText = yearRange.from || "Any"
      const toText = yearRange.to || "Present"
      filters.push(`Year Range: ${fromText} - ${toText}`)
    }

    if (sortOption !== "best-match") {
      const sortLabels = {
        "title-asc": "Title (A-Z)",
        "title-desc": "Title (Z-A)",
        "date-desc": "Newest First",
        "date-asc": "Oldest First",
      }
      filters.push(`Sorted by: ${sortLabels[sortOption] || sortOption}`)
    }

    return filters
  }

  const activeFilters = getActiveFilters()

  // Check if there are any archived colleges in the current search results
  const hasArchivedColleges = researchList.some((research) => collegeArchiveStatus[research.college])

  return (
    <div className="uMain-cont">
      {query && (
        <h2 className="text-xl font-semibold mb-4">
          {filteredResearch.length > 0 ? (
            <>
              {filteredResearch.length} results for "{query}"
              {activeFilters.length > 0 && (
                <div className="text-md font-normal mt-2">
                  <span className="font-medium">Active Filters:</span> {activeFilters.join(" • ")}
                </div>
              )}
            </>
          ) : (
            <>No results for "{query}"</>
          )}
        </h2>
      )}

      {/* Show archived toggle if there are archived colleges */}
      {hasArchivedColleges && (
        <div className="flex items-center mb-4">
          {/* <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showArchivedColleges}
              onChange={() => setShowArchivedColleges(!showArchivedColleges)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arcadia-red"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              {showArchivedColleges ? "Showing Archived Colleges" : "Show Archived Colleges"}
            </span>
          </label> */}
        </div>
      )}

      <div className="flex flex-col w-full space-y-2 my-4">
        {displayedResearch.map((research, index) => (
          <div
            key={index}
            className={`block genCard-cont ${collegeArchiveStatus[research.college] ? "bg-gray-50 border-gray-300" : ""}`}
          >
            <div className="w-full flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="w-3/4 text-xl h-auto leading-tight font-ZenSerif whitespace-pre-wrap line-clamp-2 mb-1 truncate break-words">
                  {research.title}
                </h3>
                {research.pdf && (
                  <div className="w-1/8 bg-arcadia-red rounded-full font-semibold text-white text-center text-xs px-2 py-1">
                    Preview Available
                  </div>
                )}
              </div>
              <p className="text-gray-500 mb-1 truncate">
                {Array.isArray(research.author) ? formatAuthor(research.author) : research.author}
              </p>
              <p className="text-gray-400 mb-1 truncate">
                {research.college}
                {collegeArchiveStatus[research.college] && (
                  <span className="ml-1 text-xs text-gray-500 italic">(Archived)</span>
                )}
                <span className="ml-1">
                  {research.department && research.department !== "N/A" && `- ${research.department} `}
                </span>
                <span className="">&nbsp;•&nbsp;&nbsp;{research.pubDate}</span>
              </p>
              <p className="w-full leading-tight whitespace-pre-wrap line-clamp-3 truncate break-words">
                {research.abstract}
              </p>
            </div>
            <div className="flex align-baseline items-center justify-start gap-2 mt-2">
              <button
                className="w-1/8 hover:bg-arcadia-red rounded-lg hover:text-white text-center text-sm px-2 py-1 bg-white text-arcadia-red border border-arcadia-red"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                  navigate(`/user/researchview?researchID=${research.researchID}`)
                }}
              >
                View Research
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResearch.length === 0 && !showArchivedColleges && hasArchivedColleges && (
        <div className="text-center py-4 text-gray-600">
          <p>No results, some contents maybe hidden.</p>
          {/* <button className="text-arcadia-red hover:underline mt-2" onClick={() => setShowArchivedColleges(true)}>
            Show results from archived colleges
          </button> */}
        </div>
      )}

      {filteredResearch.length > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red hover:font-semibold"}`}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <span className="text-xs">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-red"}`}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  )
}

export default UResResults
