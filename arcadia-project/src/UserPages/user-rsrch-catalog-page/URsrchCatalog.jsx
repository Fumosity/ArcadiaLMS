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

const URsrchCatalog = () => {
  const [query, setSearchQuery] = useState("")
  const { user, updateUser } = useUser()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const researchID = queryParams.get("researchID")
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <USearchBarR placeholder="Search for research..." onSearch={setSearchQuery} />
      <Title>Research Catalog</Title>
      <ResearchFilterProvider>
        <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start">
          {query.trim() && <URFilterSidebar />}
          {!query.trim() && (
            <div className="lg:w-1/4 lg:block md:hidden space-y-4">
              <ArcOpHr />
              <UpEvents />
              <Services />
            </div>
          )}
          <div className="userMain-content lg:w-3/4 md:w-full">
            {query.trim() && <UResResults query={query} />}
            <div id="research">
              {!query.trim() && <ResearchRecommend />}
            </div>
            <div id="new-research">
              {!query.trim() && <NewAddResearch />}
            </div>

          </div>
        </div>
      </ResearchFilterProvider>
    </div>
  )
}

export default URsrchCatalog

