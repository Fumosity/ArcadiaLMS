"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom" // Import Link from react-router-dom

const RsrchCards = ({ title, fetchResearch, onSeeMoreClick }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [books, setBooks] = useState([])
  const [error, setError] = useState(null)
  const entriesPerPage = 5
  const maxPages = 5

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fetchedBooks = await fetchResearch()
        console.log(title, fetchedBooks)
        setBooks(fetchedBooks.books || [])
      } catch (error) {
        setError(error.message)
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [fetchResearch])

  const totalEntries = books.length
  const totalPages = Math.min(Math.ceil(totalEntries / entriesPerPage), maxPages)
  const paginatedBooks = books.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  const generatePlaceholders = () => {
    const numPlaceholders = entriesPerPage - paginatedBooks.length
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

  return (
    <div className="uMain-cont">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {onSeeMoreClick != null && (
          <button className="uSee-more" onClick={onSeeMoreClick}>
            See more
          </button>
        )}

      </div>
      <div className="flex flex-col w-full space-y-2 my-4">
        {isLoading ? (
          Array(entriesPerPage)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="genCard-cont animate-pulse">
                <div className="w-full h-60 rounded-lg mb-2 bg-light-gray"></div>
                <div className="text-lg font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
              </div>
            ))
        ) : (
          <>
            {paginatedBooks.map((book, index) => (
              // Replace <a> with <Link> for client-side navigation
              <Link
                key={index}
                to={`/user/researchview?researchID=${book.researchID}`}
                className="block genCard-cont"
                title={book.title}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >

                <div className="w-full flex flex-col">
                  <div className="flex justify-between items-center">
                    <h3 className="w-7/8 text-lg h-auto leading-tight font-semibold whitespace-pre-wrap line-clamp-2 mb-1 truncate break-words">
                      {book.title}
                    </h3>
                    {book.pdf &&
                      <div className="w-1/8 bg-arcadia-red rounded-full text-white text-xs px-2 py-1">
                        Preview Available
                      </div>
                    }
                  </div>

                  <p className="text-sm text-gray-500 mb-1 truncate">
                    {Array.isArray(formatAuthor(book.author)) ? book.author.join(", ") : formatAuthor(book.author)}
                  </p>
                  <p className="text-sm text-gray-400 mb-1 truncate">
                    {book.college}
                    <span className="ml-1">
                      {book.department != "" && `- ${book.department} `}
                    </span>
                    <span className="">
                      &nbsp;•&nbsp;&nbsp;{book.pubDate}
                    </span>
                  </p>
                  <p className="text-sm w-full leading-tight whitespace-pre-wrap line-clamp-2 truncate break-words">
                    {book.abstract}
                  </p>
                </div>
              </Link>
            ))}
            {generatePlaceholders().map((_, index) => (
              <div key={`placeholder-${index}`} className="bg-white border border-grey rounded-xl p-4">
                <div className="w-full h-60 rounded-lg mb-2 bg-light-gray"></div>
                <div className="text-lg h-[3rem] font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
              </div>
            ))}
          </>
        )}
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

export default RsrchCards

