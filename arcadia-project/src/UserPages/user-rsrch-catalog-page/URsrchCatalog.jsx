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
import { useUser } from "../../backend/UserContext"
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr"
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents"
import Services from "../../components/UserComponents/user-main-comp/Services"
import { ResearchFilterProvider } from "../../backend/ResearchFilterContext"
import { Filter } from "lucide-react"

const URsrchCatalog = () => {
  const [query, setSearchQuery] = useState("")
  const { user, updateUser } = useUser()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const researchID = queryParams.get("researchID")
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

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

  // Reset mobile filters when query changes
  useEffect(() => {
    setShowMobileFilters(false)
  }, [query])

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters)
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

        <div className="w-10/12 mx-auto py-8 userContent-container relative">
          {/* Main content layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar for desktop */}
            {query.trim() && (
              <div className="lg:block hidden sticky top-5">
                <URFilterSidebar />
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
                  <URFilterSidebar onClose={toggleMobileFilters} />
                </div>
              </div>
            )}

            {/* Regular sidebar for non-search state */}
            {!query.trim() && (
              <div className="lg:w-1/4 lg:block hidden space-y-4 sticky top-5">
                <ArcOpHr />
                <UpEvents />
                <Services />
              </div>
            )}

            {/* Main content area */}
            <div className="userMain-content lg:w-3/4 w-full">
              {query.trim() && <UResResults query={query} />}
              <div id="research">{!query.trim() && <ResearchRecommend />}</div>
              <div id="new-research">{!query.trim() && <NewAddResearch />}</div>
            </div>
          </div>
        </div>
      </ResearchFilterProvider>
    </div>
  )
}

export default URsrchCatalog

