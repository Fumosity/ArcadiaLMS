import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const ResearchGrid = ({ title, fetchResearch }) => {
  const [research, setResearch] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10 // Show more items per page in the expanded view

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fetchedResearch = await fetchResearch()
        console.log("Fetched research in ResearchGrid:", fetchedResearch)
        setResearch(fetchedResearch.research || [])
      } catch (error) {
        setError(error.message)
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [fetchResearch])

  const totalEntries = research.length
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const paginatedResearch = research.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

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

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="uMain-cont">
      <div className="flex flex-col w-full space-y-4">
        {isLoading ? (
          Array(entriesPerPage)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-white border border-grey rounded-xl p-4 animate-pulse">
                <div className="text-lg font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="w-full h-16 bg-light-gray rounded">&nbsp;</div>
              </div>
            ))
        ) : (
          <>
            {paginatedResearch.map((research, index) => (
              <Link
                key={index}
                to={`/user/researchview?researchID=${research.researchID}`}
                className="block bg-white border border-grey rounded-xl p-4 hover:shadow-md transition-shadow"
                title={research.title}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="w-full flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="w-3/4 text-xl h-auto leading-tight font-ZenSerif whitespace-pre-wrap line-clamp-2 mb-1 break-words">
                      {research.title}
                    </h3>
                    {research.pdf && (
                      <div className="bg-arcadia-red rounded-full font-semibold text-white text-center text-xs px-2 py-1">
                        Preview Available
                      </div>
                    )}
                  </div>

                  <p className="text-gray-500 mb-1">
                    {Array.isArray(formatAuthor(research.author))
                      ? research.author.join(", ")
                      : formatAuthor(research.author)}
                  </p>
                  <p className="text-gray-400 mb-1">
                    {research.college}
                    <span className="ml-1">
                      {research.department && research.department !== "N/A" && `- ${research.department} `}
                    </span>
                    <span className="">&nbsp;•&nbsp;&nbsp;{(research.pubDate)}</span>
                  </p>
                  <p className="w-full leading-tight whitespace-pre-wrap line-clamp-3 break-words">
                    {research.abstract}
                  </p>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Pagination controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <span className="text-xs text-arcadia-red">
            Page {currentPage} of {totalPages}
          </span>
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

export default ResearchGrid

