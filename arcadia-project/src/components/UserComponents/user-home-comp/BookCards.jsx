"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom" // Import Link from react-router-dom
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalfAlt, faStar as faRegularStar } from "@fortawesome/free-solid-svg-icons"

const BookCards = ({ title, fetchBooks, onSeeMoreClick }) => {
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
        const fetchedBooks = await fetchBooks()
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
  }, [fetchBooks])

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

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating * 10) / 10
    const fullStars = Math.floor(roundedRating)
    const halfStar = (roundedRating * 2) % 2 !== 0

    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    emptyStars = Math.max(0, emptyStars)

    return (
      <span className="flex gap-1 items-center">
        <span className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className="text-arcadia-yellow" />
          ))}
          {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-grey" />}
          {[...Array(emptyStars)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faRegularStar} className="text-grey" />
          ))}
        </span>
        {formatRating(rating)}
      </span>
    )
  }

  const formatRating = (rating) => {
    return rating.toFixed(1)
  }

  return (
    <div className="uMain-cont">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button className="uSee-more" onClick={onSeeMoreClick}>
          See more
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 my-4">
        {isLoading ? (
          Array(entriesPerPage)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="genCard-cont animate-pulse">
                <div className="w-full h-60 rounded-lg mb-2 bg-light-gray"></div>
                <div className="text-lg font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
              </div>
            ))
        ) : (
          <>
            {paginatedBooks.map((book, index) => (
              // Replace <a> with <Link> for client-side navigation
              <Link
                key={index}
                to={`/user/bookview?titleID=${book.titleID}`}
                className="block genCard-cont"
                title={book.title}
              >
                <img
                  src={book.cover || "/image/arcadia_gray.png"}
                  alt={book.title}
                  className="w-full h-60 object-cover rounded-lg mb-2 bg-light-gray"
                />
                <h3 className="text-lg h-[3rem] leading-tight font-semibold whitespace-pre-wrap line-clamp-2 mb-1 truncate break-words">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1 truncate">
                  {Array.isArray(book.author) ? book.author.join(", ") : book.author}
                </p>
                <p className="text-sm text-gray-400 mb-1 truncate">{book.category}</p>
                <p className="text-sm text-gray-500 mb-1 truncate">
                  {book.weightedAvg && (
                    <span className="flex items-center gap-1">
                      {renderStars(book.weightedAvg)}
                      <span className="text-xs text-gray-500">
                        ({book.totalRatings >= 1000 ? "1000+" : book.totalRatings})
                      </span>
                    </span>
                  )}
                  {!book.weightedAvg && "Rating not available"}
                </p>
              </Link>
            ))}
            {generatePlaceholders().map((_, index) => (
              <div key={`placeholder-${index}`} className="bg-white border border-grey rounded-xl p-4">
                <div className="w-full h-60 rounded-lg mb-2 bg-light-gray"></div>
                <div className="text-lg h-[3rem] font-semibold mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-400 mb-1 truncate bg-light-gray">&nbsp;</div>
                <div className="text-sm text-gray-500 mb-1 truncate bg-light-gray">&nbsp;</div>
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

export default BookCards

