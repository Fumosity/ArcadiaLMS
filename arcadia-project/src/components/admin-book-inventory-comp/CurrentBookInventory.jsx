"use client"

import { useEffect, useState } from "react"
import { supabase } from "/src/supabaseClient.js"
import { Link } from "react-router-dom"
import BookCopies from "../../z_modals/BookCopies"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const CurrentBookInventory = ({ onBookSelect }) => {
  const [inventoryData, setInventoryData] = useState([])
  const [sortOrder, setSortOrder] = useState("Descending")
  const [pubDateFilter, setPubDateFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredGenreIndex, setHoveredGenreIndex] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [categoryType, setCategoryType] = useState("All")
  const [genreType, setGenreType] = useState("All")
  const [availableGenres, setAvailableGenres] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const { data: bookTitles, error: titleError } = await supabase
          .from("book_titles")
          .select("*, book_genre_link(genres(genreID, genreName, category))")

        if (titleError) {
          console.error("Error fetching book titles:", titleError.message)
          return
        }

        if (!bookTitles || bookTitles.length === 0) {
          console.log("No book titles found.")
          setInventoryData([])
          return
        }

        const bookIDs = bookTitles.map((book) => book.titleID)

        const { data: bookIndiv, error: bookError } = await supabase
          .from("book_indiv")
          .select("bookID, titleID")
          .in("titleID", bookIDs)

        if (bookError) {
          console.error("Error fetching book_indiv:", bookError.message)
          return
        }

        // Process genre data
        const combinedData = bookTitles.map((title) => {
          const books = bookIndiv.filter((b) => b.titleID === title.titleID)
          const genres = title.book_genre_link.map((link) => link.genres.genreName)
          const category = title.book_genre_link[0]?.genres.category || "Uncategorized"

          return {
            ...title,
            copies: books,
            category,
            genres,
          }
        })

        console.log("Combined data:", combinedData)
        setInventoryData(combinedData)
      } catch (error) {
        console.error("An unexpected error occurred:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    if (inventoryData.length > 0) {
      // Filter genres based on selected category type
      let genres = []

      if (categoryType === "All") {
        // Get all unique genres across all books
        inventoryData.forEach((book) => {
          if (book.genres && book.genres.length > 0) {
            genres = [...genres, ...book.genres]
          }
        })
      } else {
        // Get genres only for the selected category type
        inventoryData
          .filter((book) => book.category === categoryType)
          .forEach((book) => {
            if (book.genres && book.genres.length > 0) {
              genres = [...genres, ...book.genres]
            }
          })
      }

      // Remove duplicates
      const uniqueGenres = [...new Set(genres)]
      setAvailableGenres(uniqueGenres)

      // Reset genre selection when category changes
      setGenreType("All")
    }
  }, [categoryType, inventoryData])

  const handleRowClick = (book) => {
    setSelectedBook(book)
    onBookSelect(book)
  }

  const handleViewClick = (book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedBook(null)
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

  // Handle sorting
  const sortedData = [...inventoryData].sort((a, b) => {
    if (sortOrder === "Ascending") {
      return a.title.localeCompare(b.title)
    } else {
      return b.title.localeCompare(a.title)
    }
  })

  // Handle filtering and searching
  const filteredData = sortedData.filter((book) => {
    // Filter by publication date if specified
    const matchesPubDate =
      !pubDateFilter ||
      (book.originalPubDate && book.originalPubDate.toLowerCase().includes(pubDateFilter.toLowerCase()))

    // Helper function to check if a value matches the search term
    const matchesSearchTerm = (value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTerm.toLowerCase())
      } else if (Array.isArray(value)) {
        return value.some((item) => typeof item === "string" && item.toLowerCase().includes(searchTerm.toLowerCase()))
      }
      return false
    }

    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      matchesSearchTerm(book.title) ||
      matchesSearchTerm(book.category) ||
      matchesSearchTerm(book.arcID) ||
      matchesSearchTerm(book.keywords) ||
      (book.author &&
        ((typeof book.author === "string" && matchesSearchTerm(book.author)) ||
          (Array.isArray(book.author) && book.author.some((author) => matchesSearchTerm(author)))))

    // Filter by category type
    const matchesCategory = categoryType === "All" || book.category === categoryType

    // Filter by genre type
    const matchesGenre = genreType === "All" || (book.genres && book.genres.includes(genreType))

    return matchesPubDate && matchesSearch && matchesCategory && matchesGenre
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedBooks = filteredData.slice(startIndex, startIndex + entriesPerPage)

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">Current Book Inventory</h3>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
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

          {/* Category Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Category:</span>
            <select
              className="bg-gray-200 py-1 px-1 border rounded-lg text-sm w-auto"
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-fiction">Non-fiction</option>
            </select>
          </div>

          {/* Genre Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Genre:</span>
            <select
              className="bbg-gray-200 py-1 px-1 border rounded-lg text-sm w-auto"
              value={genreType}
              onChange={(e) => setGenreType(e.target.value)}
              disabled={availableGenres.length === 0}
            >
              <option value="All">All Genres</option>
              {availableGenres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Pub Date Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Pub. Date:</span>
            <input
              type="text"
              className="bg-gray-200 py-1 px-2 border rounded-lg text-sm w-[90px]"
              placeholder="YYYY-MM"
              value={pubDateFilter}
              onChange={(e) => setPubDateFilter(e.target.value)}
            />
          </div>

          {/* Entries Per Page */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Entries:</span>
            <select
              className="bg-gray-200 py-1 px-1 border rounded-lg text-sm w-13"
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
        <div className="flex items-center space-x-2 min-w-[0]">
          <label htmlFor="search" className="font-medium text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
            placeholder="Title, author, category, keywords, or call no."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Category", "Genres", "Book Title", "Author", "Call No.", "Org. Pub. Date", "Copies"].map((header) => (
                <th
                  key={header}
                  className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
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
                  <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                    <Skeleton className="w-20" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                    <Skeleton className="w-32" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                    <Skeleton className="w-20" />
                  </td>
                </tr>
              ))
            ) : displayedBooks.length > 0 ? (
              displayedBooks.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`hover:bg-light-gray cursor-pointer ${
                      selectedBook?.titleID === item.titleID ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleRowClick(item)}
                  >
                    {/* Rest of the row content remains the same */}
                    <td className="px-4 py-4 text-sm text-gray-900 flex justify-center max-w-36">
                      <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1">
                        {item.category}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4 text-sm"
                      onMouseEnter={() => setHoveredGenreIndex(index)}
                      onMouseLeave={() => setHoveredGenreIndex(null)}
                    >
                      <div className="flex justify-start items-center space-x-1">
                        <span className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-gray px-2 py-1 break-words">
                          {item.genres.length > 0 ? item.genres[0] : "No Genre"}
                        </span>
                        {item.genres.length > 1 && (
                          <span className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-grey px-2 py-1 break-words">
                            ...
                          </span>
                        )}
                      </div>
                      {hoveredGenreIndex === index && item.genres.length > 1 && (
                        <div className="flex-col justify-center mt-1 transition-opacity duration-300 ease-in-out opacity-100 w-full">
                          {item.genres.slice(1).map((genres, i) => (
                            <div
                              key={i}
                              className="bookinv-genre rounded-full font-medium px-2 py-1 mt-1 text-sm w-fit break-words"
                            >
                              {genres}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate max-w-64">
                      <Link
                        to={`/admin/abviewer?titleID=${encodeURIComponent(item.titleID)}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm max-w-48 relative group">
                      <div className="flex items-center space-x-1">
                        <span className="inline-block truncate break-words">{formatAuthor(item.author)}</span>
                        {Array.isArray(item.author) && item.author.length > 2 && (
                          <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded p-2 z-10 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                            {item.author.slice(2).map((author, i) => (
                              <div key={i} className="mt-1">
                                {formatAuthor([author])}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-500 truncate min-w-4">
                      {item.arcID || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-500 truncate min-w-8">
                      {item.originalPubDate}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <button
                        className="bg-light-gray hover:bg-grey text-black py-1 px-3 rounded-full border-grey border"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewClick(item)
                        }}
                      >
                        Copies
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-zinc-600">
                  No books found.
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

      {isModalOpen && selectedBook && (
        <BookCopies isOpen={isModalOpen} onClose={closeModal} titleID={selectedBook.titleID} />
      )}
    </div>
  )
}

export default CurrentBookInventory

