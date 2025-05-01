import React from "react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { supabase } from "../../supabaseClient"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import USearchBarR from "../../components/UserComponents/user-main-comp/USearchBarR"
import Title from "../../components/main-comp/Title"
import URFilterSidebar from "../../components/UserComponents/user-rsrch-catalog-comp/URFilterSidebar"
import UResResults from "./UResResults"
import ResearchRecommend from "../../components/UserComponents/user-rsrch-catalog-comp/ResearchRecommend"
import NewAddResearch from "../../components/UserComponents/user-rsrch-catalog-comp/NewAddResearch"
import SeeMoreResearch from "../../components/UserComponents/user-home-comp/SeeMoreResearch"
import { useUser } from "../../backend/UserContext"
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr"
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents"
import Services from "../../components/UserComponents/user-main-comp/Services"
import { ResearchFilterProvider } from "../../backend/ResearchFilterContext"
import { Filter } from "lucide-react"

const URsrchCatalog = () => {
  useEffect(() => {
    document.title = "Arcadia | Research Catalog";
}, []);
  const [query, setSearchQuery] = useState("")
  const { user, updateUser } = useUser()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const researchID = queryParams.get("researchID")
  const viewParam = queryParams.get("view")
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [seeMoreComponent, setSeeMoreComponent] = useState(null)
  const isGuest = user?.userAccountType === "Guest"

  React.useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 300)
      }
    }
  }, [])

  // Check URL query parameters on component mount
  useEffect(() => {
    const viewParam = queryParams.get("view")

    if (viewParam === "recommended") {
      // Set up the recommended research component
      setSeeMoreComponent({
        title: "Recommended for You",
        fetchResearch: () => fetchRecommendedResearch(user?.userCollege, user?.userDepartment),
      })
    }

    if (viewParam === "recentlyPublished") {
      // Set up the recently published research component
      setSeeMoreComponent({
        title: "Recently Published",
        fetchResearch: fetchNewlyAddedResearch,
      })
    }
  }, [location, user])

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!researchID) {
        setError("Research ID not provided")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from("research").select("*").eq("researchID", researchID).single()

      if (error || !data) {
        console.error("Error fetching or no data:", error)
        setError("Failed to fetch research details or research not found")
        setLoading(false)
        return
      }

      setBookDetails(data)
      setLoading(false)
    }

    if (researchID) {
      fetchBookDetails()
    } else {
      setLoading(false)
    }
  }, [researchID])

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

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters)
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
      fetchResearch: fetchFunction,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Update URL to reflect the current view
    const url = new URL(window.location)
    if (component === "Recommended for You") {
      url.searchParams.set("view", "recommended")
    } else if (component === "Recently Published") {
      url.searchParams.set("view", "recentlyPublished")
    }
    window.history.pushState({}, "", url)
  }

  // These functions are placeholders to match the expected function signatures
  // They should be imported from the actual components in a real implementation
  const fetchRecommendedResearch = async (userCollege, userDepartment) => {
    try {
      console.log(userCollege, userDepartment)

      const query = supabase.from("research").select("*")

      if (userCollege === "COECSA") {
        // Fetch COECSA research (prioritizing same department)
        const { data: research, error: researchError } = await query.eq("college", "COECSA")

        if (researchError) throw researchError

        const currentYear = new Date().getFullYear()
        const fiveYearsAgo = currentYear - 5

        // Sort by department first, then prioritize within COECSA
        const sortedResearch = research
          .map((paper) => ({
            ...paper,
            isSameDepartment: paper.department === userDepartment ? 1 : 0, // Highest priority
            priority: (paper.pdf ? 2 : 0) + (paper.pubdate >= fiveYearsAgo ? 1 : 0),
            random: Math.random(),
          }))
          .sort(
            (a, b) =>
              b.isSameDepartment - a.isSameDepartment || // Same department first
              b.priority - a.priority ||
              b.random - a.random,
          )

        console.log({ sortedResearch })
        return { research: sortedResearch }
      } else {
        // Default behavior for other colleges
        const { data: research, error: researchError } = await query.eq("college", userCollege)

        if (researchError) throw researchError

        const currentYear = new Date().getFullYear()
        const fiveYearsAgo = currentYear - 5

        const sortedResearch = research
          .map((paper) => ({
            ...paper,
            priority: (paper.pdf ? 2 : 0) + (paper.pubdate >= fiveYearsAgo ? 1 : 0),
            random: Math.random(),
          }))
          .sort((a, b) => b.priority - a.priority || b.random - a.random)

        console.log({ sortedResearch })
        return { research: sortedResearch }
      }
    } catch (error) {
      console.error("Error fetching recommended research:", error)
      return { research: [] }
    }
  }

  const fetchNewlyAddedResearch = async () => {
    try {
      const { data: research, error } = await supabase
        .from("research")
        .select("*")
        .order("pubDate", { ascending: false })

      if (error) throw error

      console.log({ research })
      return { research }
    } catch (error) {
      console.error("Error fetching newly added research:", error)
      return { research: [] }
    }
  }

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <USearchBarR placeholder="Search for research..." onSearch={setSearchQuery} />
      <Title>Research Catalog</Title>

      <ResearchFilterProvider>
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

        {/* Added min-height-screen to ensure consistent behavior with UBkCatalog */}
        <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start min-h-screen">
          {/* Sidebar - Already working correctly, but added the same classes for consistency */}
          {query.trim() ? (
            <div className="lg:w-1/4 lg:block md:hidden space-y-4 sticky top-5 self-start max-h-screen overflow-visible">
              <URFilterSidebar />
            </div>
          ) : (
            <div className="lg:w-1/4 lg:block md:hidden space-y-4">
              <ArcOpHr />
              <UpEvents />
              {!isGuest &&<Services />}
            </div>
          )}

          {/* Mobile sidebar overlay - Fixed to position fixed and left-0 to ensure full width coverage */}
          {query.trim() && showMobileFilters && (
            <>
              {/* Full-screen overlay positioned relative to viewport */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={toggleMobileFilters}
                style={{ left: 0, right: 0 }}
              />
              {/* Filter sidebar positioned on top of overlay */}
              <div
                className="fixed right-0 top-0 h-full w-3/4 max-w-xs bg-white overflow-y-auto z-50 p-4 lg:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                </div>
                <URFilterSidebar onClose={toggleMobileFilters} />
              </div>
            </>
          )}

          {/* Main content area */}
          <div className="userMain-content lg:w-3/4 md:w-full">
            {seeMoreComponent ? (
              <SeeMoreResearch
                selectedComponent={seeMoreComponent.title}
                onBackClick={handleBackClick}
                fetchResearch={seeMoreComponent.fetchResearch}
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
                      <UResResults query={query} />
                    )}
                  </>
                )}
                {!query.trim() && !isGuest && (
                  <>
                    <div id="research">
                      <ResearchRecommend onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                    </div>
                  </>
                )}
                {!query.trim() && (
                  <>
                    <div id="new-research">
                      <NewAddResearch onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </ResearchFilterProvider>
    </div>
  )
}

export default URsrchCatalog

