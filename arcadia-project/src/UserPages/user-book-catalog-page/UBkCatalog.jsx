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
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HIghestRatedBk"
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
      <USearchBar placeholder="Search books..." onSearch={setQuery} />
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

        <div className="w-10/12 mx-auto py-8 userContent-container relative">
          {/* Main content layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar for desktop */}
            {query.trim() && (
              <div className="lg:block hidden sticky top-5">
                <FilterSidebar />
              </div>
            )}

            {/* Mobile sidebar overlay */}
            {query.trim() && showMobileFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleMobileFilters}>
                <div
                  className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white overflow-y-auto z-50 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Filters</h3>
                  </div>
                  <FilterSidebar onClose={toggleMobileFilters} />
                </div>
              </div>
            )}

            {/* Regular sidebar for non-search state */}
            {!query.trim() && (
              <div className="lg:w-1/4 lg:block hidden space-y-4 sticky top-5">
                <ArcOpHr />
                <UpEvents />
                <Services />
                <MostPopBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                <HighestRatedBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
              </div>
            )}

            {/* Main content area */}
            <div className="userMain-content lg:w-3/4 w-full">
              {seeMoreComponent ? (
                <SeeMore
                  selectedComponent={seeMoreComponent.title}
                  onBackClick={handleBackClick}
                  fetchBooks={seeMoreComponent.fetchBooks}
                />
              ) : (
                <>
                  {query.trim() && <UBkResults query={query} />}
                  {!query.trim() && (
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
        </div>
      </FilterProvider>
    </div>
  )
}

export default UBkCatalog

