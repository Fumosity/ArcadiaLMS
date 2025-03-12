"use client"

import { supabase } from "../../supabaseClient"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import Title from "../../components/main-comp/Title"
import BookAvailability from "../../components/UserComponents/user-book-view-comp/BookAvailability"
import ReturnToSearch from "../../components/UserComponents/user-book-view-comp/ReturnToSearch"
import BookInformation from "../../components/UserComponents/user-book-view-comp/BookInformation"
import SimBooks from "../../components/UserComponents/user-book-search-comp/SimBooks"
import { useUser } from "../../backend/UserContext"
import Pathfinder from "../../components/UserComponents/pathfinder-comp/Pathfinder"

const UBookView = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const titleId = queryParams.get("titleID")
  const { user, updateUser } = useUser()
  const [bookDetails, setBookDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ratingInfo, setRatingInfo] = useState({ avgRating: 0, totalRatings: 0 })

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!titleId) {
        setError("Title ID not provided")
        setLoading(false)
        return
      }

      try {
        // Fetch book details
        const { data, error } = await supabase.from("book_titles").select("*").eq("titleID", titleId).single()

        if (error || !data) {
          console.error("Error fetching or no data:", error)
          setError("Failed to fetch book details or book not found")
          setLoading(false)
          return
        }

        // Fetch ratings for this book
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("ratings")
          .select("ratingValue")
          .eq("titleID", titleId)

        if (ratingsError) {
          console.error("Error fetching ratings:", ratingsError)
        } else {
          // Calculate average rating
          let avgRating = 0
          const totalRatings = ratingsData ? ratingsData.length : 0

          if (totalRatings > 0) {
            const sum = ratingsData.reduce((acc, { ratingValue }) => acc + ratingValue, 0)
            avgRating = sum / totalRatings
          }

          setRatingInfo({ avgRating, totalRatings })
        }

        const publishedYear = data.originalPubDate ? new Date(data.originalPubDate).getFullYear() : "Unknown Year"

        setBookDetails({
          ...data,
          image_url: data.cover || "https://via.placeholder.com/150x300",
          publishedYear,
        })
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [titleId])

  // Format rating count for display (1000+ for counts >= 1000)
  const formatRatingCount = (count) => {
    if (count >= 1000) {
      return "1000+"
    }
    return count.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light-white flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading book details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-white flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <Title>Book View</Title>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
          <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mt-4 mr-5">
            <BookAvailability isAvailable={bookDetails?.isAvailable || false} />
          </div>

          <div className="userMain-content lg:w-3/4 w-full mt-4 ml-5">
            <ReturnToSearch />
            <BookInformation
              book={bookDetails}
              publishedYear={bookDetails?.publishedYear || "Unknown"}
              ratingInfo={{
                avgRating: ratingInfo.avgRating,
                totalRatings: ratingInfo.totalRatings,
                formattedRatingCount: formatRatingCount(ratingInfo.totalRatings),
              }}
            />
            <Pathfinder book={bookDetails} />
            <SimBooks titleID={titleId} userID={user.userID} category={bookDetails?.category} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default UBookView

