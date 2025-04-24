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

  // Get filter state from context
  const { selectedYear, yearRange, selectedCollege, selectedDepartment, sortOption } = useResearchFilters()

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

      // Filter by search query
      if (query) {
        const searchQuery = query.toLowerCase()
        results = results.filter((research) => {
          const titleMatch = research.title.toLowerCase().includes(searchQuery)
          const authorString =
            research.author && Array.isArray(research.author) ? research.author.join(", ").toLowerCase() : ""
          const authorMatch = authorString.includes(searchQuery)
          return titleMatch || authorMatch
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
  }, [query, researchList, selectedYear, yearRange, selectedCollege, selectedDepartment, sortOption])

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

      <div className="flex flex-col w-full space-y-2 my-4">
        {displayedResearch.map((research, index) => (
          <div key={index} className="block genCard-cont">
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

