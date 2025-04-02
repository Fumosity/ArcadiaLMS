import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import USearchBar from "../../components/UserComponents/user-main-comp/USearchBar"
import Title from "../../components/main-comp/Title"
import FilterSidebar from "../../components/UserComponents/user-book-search-comp/FilterSidebar"
import Recommended from "../../components/UserComponents/user-home-comp/Recommended"
import MostPopular, { fetchMostPopularBooks } from "../../components/UserComponents/user-home-comp/MostPopular"
import HighlyRated, { fetchHighlyRatedBooks } from "../../components/UserComponents/user-home-comp/HighlyRated"
import NewlyAdded from "../../components/UserComponents/user-book-catalog-comp/NewlyAdded"
import ReleasedThisYear from "../../components/UserComponents/user-book-catalog-comp/ReleasedThisYear"
import Fiction, { fetchFictionBooks } from "../../components/UserComponents/user-book-catalog-comp/Fiction"
import Nonfiction, { fetchNonfictionBooks } from "../../components/UserComponents/user-book-catalog-comp/Nonfiction"
import UBkResults from "./UBkResults"
import { useUser } from "../../backend/UserContext"
import SeeMore from "../../components/UserComponents/user-home-comp/SeeMore"
import { supabase } from "/src/supabaseClient.js"
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr"
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents"
import Services from "../../components/UserComponents/user-main-comp/Services"
import MostPopBk from "../../components/UserComponents/user-main-comp/MostPopBk"
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HighestRatedBk"
import { FilterProvider } from "../../backend/filterContext"
import { Filter } from "lucide-react"

const UBkCatalog = () => {
  const [query, setQuery] = useState("")
  const { user, updateUser } = useUser()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const titleId = queryParams.get("titleID")
  const viewParam = queryParams.get("view")
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seeMoreComponent, setSeeMoreComponent] = useState(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [resultsLoading, setResultsLoading] = useState(false)
  const isGuest = user?.userAccountType === "Guest"

  useEffect(() => {
    if (viewParam === "highlyRated") {
      setSeeMoreComponent({
        title: "Highly Rated",
        fetchBooks: fetchHighlyRatedBooks,
      })
    }
    if (viewParam === "mostPopular") {
      setSeeMoreComponent({
        title: "Most Popular",
        fetchBooks: fetchMostPopularBooks,
      })
    }
    if (viewParam === "fictionBooks") {
      setSeeMoreComponent({
        title: "Fiction Books",
        fetchBooks: fetchFictionBooks,
      })
    }
    if (viewParam === "nonFictionBooks") {
      setSeeMoreComponent({
        title: "Non-fiction Books",
        fetchBooks: fetchNonfictionBooks,
      })
    }
  }, [viewParam])

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!titleId) {
        setError("Title ID not provided")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from("book_titles").select("*").eq("titleID", titleId).single()

      if (error || !data) {
        console.error("Error fetching or no data:", error)
        setError("Failed to fetch book details or book not found")
        setLoading(false)
        return
      }

      const publishedYear = data.originalPubDate ? new Date(data.originalPubDate).getFullYear() : "Unknown Year"

      setBookDetails({
        ...data,
        image_url: data.cover || "https://via.placeholder.com/150x300",
        publishedYear,
      })
      setLoading(false)
    }

    if (titleId) {
      fetchBookDetails()
    } else {
      setLoading(false)
    }
  }, [titleId])

  // Set loading state when query changes
  useEffect(() => {
    if (query.trim()) {
      setResultsLoading(true)
      // Simulate loading time for search results
      const timer = setTimeout(() => {
        setResultsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [query])

  // Reset mobile filters when query changes
  useEffect(() => {
    setShowMobileFilters(false)
  }, [query])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleBackClick = () => {
    setSeeMoreComponent(null)
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Clear the URL query parameter when going back
    const url = new URL(window.location)
    url.searchParams.delete("view")
    window.history.pushState({}, "", url)
  }

  const handleSeeMoreClick = (component, fetchFunction) => {
    if (typeof fetchFunction !== "function") {
      console.error("fetchFunction is not a function", fetchFunction)
      return
    }
    setSeeMoreComponent({
      title: component,
      fetchBooks: fetchFunction,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters)
  }

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <USearchBar placeholder="Search books/authors.." onSearch={setQuery} />
      <Title>Book Catalog</Title>

      <FilterProvider>
        {/* Mobile Filter Toggle Button - Only show when searching */}
        {query.trim() && (
          <div className="lg:hidden w-10/12 mx-auto mt-4">
            <button
              onClick={toggleMobileFilters}
              className="flex items-center gap-2 px-4 py-2 bg-arcadia-red text-white rounded-xl shadow-sm"
            >
              <Filter size={18} />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        )}

        {/* Added min-height-screen to ensure scrollable context */}
        <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start min-h-screen">
          {/* Sidebar - Fixed sticky behavior with self-start, max-h-screen, and overflow-visible */}
          {query.trim() ? (
            <div className="lg:w-1/4 lg:block md:hidden space-y-4 sticky top-5 self-start max-h-screen overflow-visible">
              <FilterSidebar />
            </div>
          ) : (
            <div className="lg:w-1/4 lg:block md:hidden space-y-4">
              <ArcOpHr />
              <UpEvents />
              {!isGuest && <Services />}
              <MostPopBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
              <HighestRatedBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
            </div>
          )}

          {/* Mobile sidebar overlay - Fixed to position fixed and left-0 to ensure full width coverage */}
          {query.trim() && showMobileFilters && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={toggleMobileFilters}
                style={{ left: 0, right: 0 }}
              />
              <div
                className="fixed right-0 top-0 h-full w-3/4 max-w-xs bg-white overflow-y-auto z-50 p-4 lg:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                </div>
                <FilterSidebar onClose={toggleMobileFilters} />
              </div>
            </>
          )}

          {/* Main content area - match exact structure from UHomePage */}
          <div className="userMain-content lg:w-3/4 md:w-full">
            {seeMoreComponent ? (
              <SeeMore
                selectedComponent={seeMoreComponent.title}
                onBackClick={handleBackClick}
                fetchBooks={seeMoreComponent.fetchBooks}
              />
            ) : (
              <>
                {query.trim() && (
                  <>
                    {resultsLoading ? (
                      <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-arcadia-red"></div>
                      </div>
                    ) : (
                      <UBkResults query={query} />
                    )}
                  </>
                )}
                {!query.trim() && !isGuest && (
                  <Recommended
                    titleID={titleId}
                    userID={user.userID}
                    category={bookDetails?.category || "General"}
                    onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)}
                  />
                )}
                {!query.trim() && (
                  <MostPopular onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                )}
                {!query.trim() && (
                  <HighlyRated onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                )}
                {!query.trim() && (
                  <NewlyAdded onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                )}
                {!query.trim() && (
                  <ReleasedThisYear onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                )}
                {!query.trim() && (
                  <Fiction onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                )}
                {!query.trim() && (
                  <Nonfiction onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                )}
              </>
            )}
          </div>
        </div>
      </FilterProvider>
    </div>
  )
}

export default UBkCatalog

