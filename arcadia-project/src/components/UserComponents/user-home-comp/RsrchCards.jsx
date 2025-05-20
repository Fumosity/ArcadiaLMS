import { useState, useEffect } from "react"
import { Link } from "react-router-dom" // Import Link from react-router-dom
import { supabase } from "../../../supabaseClient"

const RsrchCards = ({ title, fetchResearch, onSeeMoreClick }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [research, setResearch] = useState([])
  const [error, setError] = useState(null)
  const [activeColleges, setActiveColleges] = useState([])
  const entriesPerPage = 5
  const maxPages = 5

  const [isLoading, setIsLoading] = useState(true)

  // Fetch active colleges
  useEffect(() => {
    const fetchActiveColleges = async () => {
      try {
        const { data, error } = await supabase.from("college_list").select("college").eq("isarchived", false)

        if (error) {
          console.error("Error fetching active colleges:", error)
          return
        }

        setActiveColleges(data.map((college) => college.college))
      } catch (error) {
        console.error("Error processing active colleges:", error)
      }
    }

    fetchActiveColleges()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fetchedResearch = await fetchResearch()
        console.log(title, fetchedResearch)

        // Filter out research from archived colleges
        const filteredResearch = fetchedResearch.research.filter((item) => activeColleges.includes(item.college))

        setResearch(filteredResearch || [])
      } catch (error) {
        setError(error.message)
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (activeColleges.length > 0) {
      fetchData()
    }
  }, [fetchResearch, activeColleges])

  const totalEntries = research.length
  const totalPages = Math.min(Math.ceil(totalEntries / entriesPerPage), maxPages)
  const paginatedResearch = research.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  const generatePlaceholders = () => {
    const numPlaceholders = entriesPerPage - paginatedResearch.length
    return Array(numPlaceholders).fill(null)
  }

  if (error) {
    return <div>Error: {error}</div>
  }

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

  return (
    <div className="uMain-cont">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {/* {onSeeMoreClick != null && (
          <button className="uSee-more" onClick={onSeeMoreClick}>
            See more
          </button>
        )} */}
      </div>
      <div className="flex flex-col w-full space-y-2 my-4">
        {isLoading ? (
          Array(entriesPerPage)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="genCard-cont animate-pulse">
                <div className="text-lg font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
              </div>
            ))
        ) : (
          <>
            {paginatedResearch.length > 0 ? (
              paginatedResearch.map((research, index) => (
                // Replace <a> with <Link> for client-side navigation
                <Link
                  key={index}
                  to={`/user/researchview?researchID=${research.researchID}`}
                  className="block genCard-cont"
                  title={research.title}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <div className="w-full flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="w-3/4 text-xl h-auto leading-tight font-ZenSerif whitespace-pre-wrap line-clamp-2 mb-1 truncate break-words">
                        {research.title}
                      </h3>
                      {research.pdf && (
                        <div className="w-1/6 bg-arcadia-red rounded-full font-semibold text-white text-center text-xs px-2 py-1">
                          Preview Available
                        </div>
                      )}
                    </div>

                    <p className="text-gray-500 mb-1 truncate">
                      {Array.isArray(formatAuthor(research.author))
                        ? research.author.join(", ")
                        : formatAuthor(research.author)}
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
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-gray-600">No research available.</div>
            )}
            {paginatedResearch.length > 0 &&
              generatePlaceholders().map((_, index) => (
                <div key={`placeholder-${index}`} className="bg-white border border-grey rounded-xl p-4">
                  <div className="text-lg h-[3rem] font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                  <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                  <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
                </div>
              ))}
          </>
        )}
      </div>
      {paginatedResearch.length > 0 && (
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

export default RsrchCards
