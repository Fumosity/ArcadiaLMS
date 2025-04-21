import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalfAlt, faStar as faRegularStar } from "@fortawesome/free-solid-svg-icons"
import { supabase } from "../../../supabaseClient" // Import your Supabase client
import { useUser } from "../../../backend/UserContext" // Import UserContext
import { useNavigate } from "react-router-dom"

export default function BookInformation({ book }) {
  const { user } = useUser() // Access user from context
  const navigate = useNavigate()
  const [selectedRating, setSelectedRating] = useState(0) // Track selected rating
  const [existingRatingID, setExistingRatingID] = useState(null) // Track existing rating ID
  const [message, setMessage] = useState("") // Feedback message

  useEffect(() => {
    const fetchExistingRating = async () => {
      if (!user || !user.userID || !book || user.userAccountType === "Guest") return

      try {
        const { data, error } = await supabase
          .from("ratings")
          .select("ratingID, ratingValue")
          .eq("userID", user.userID)
          .eq("titleID", book.titleID)
          .single()

        if (error) {
          //console.error("Error fetching existing rating:", error);
        } else if (data) {
          setSelectedRating(data.ratingValue)
          setExistingRatingID(data.ratingID)
        }
      } catch (err) {
        console.error("Unexpected error fetching rating:", err)
      }
    }

    fetchExistingRating()
  }, [user, book])

  const handleStarClick = (rating) => {
    setSelectedRating(rating)
    setMessage("")
  }

  const handleSubmitRating = async () => {
    if (!user) {
      navigate("/user/login")
      return
    }

    if (selectedRating === 0) {
      setMessage("Please select a rating before submitting!")
      return
    }

    try {
      if (existingRatingID) {
        // Update existing rating
        const { error } = await supabase
          .from("ratings")
          .update({
            ratingValue: selectedRating,
            ratingDateTime: new Date().toISOString(),
          })
          .eq("ratingID", existingRatingID)

        if (error) {
          console.error("Error updating rating:", error)
          setMessage("Error updating rating. Please try again.")
        } else {
          setMessage("Rating updated successfully!")
        }
      } else {
        // Add new rating
        const { data, error } = await supabase
          .from("ratings")
          .insert({
            ratingValue: selectedRating,
            ratingDateTime: new Date().toISOString(),
            titleID: book.titleID,
            userID: user.userID,
          })
          .select()
          .single()

        if (error) {
          console.error("Error submitting new rating:", error)
          setMessage("Error submitting rating. Please try again.")
        } else {
          setExistingRatingID(data.ratingID)
          setMessage("Rating submitted successfully!")
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setMessage("Unexpected error occurred. Please try again.")
    }
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
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className="text-arcadia-yellow cursor-pointer"
              onClick={() => handleStarClick(i + 1)}
            />
          ))}
          {halfStar && (
            <FontAwesomeIcon
              icon={faStarHalfAlt}
              className="text-arcadia-yellow cursor-pointer"
              onClick={() => handleStarClick(fullStars + 1)}
            />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faRegularStar}
              className="text-grey cursor-pointer"
              onClick={() => handleStarClick(fullStars + 1 + (halfStar ? 1 : i))}
            />
          ))}
        </span>
        <span className="ml-2 text-sm text-gray-600">{selectedRating || "No rating selected"}</span>
      </span>
    )
  }

  const handleReportIssue = () => {
    // Create query parameters for type and subject
    const queryParams = new URLSearchParams({
      type: "Book",
      subject: `Issue with book: ${book.titleCallNum}`,
    }).toString()

    // Navigate to the reports page with query parameters
    navigate(`/user/support/reportticket?${queryParams}`)
  }

  return (
    <div className="uMain-cont">
      {/* Main Book Info */}
      <div className="flex w-full gap-4 p-4 border border-grey bg-silver rounded-lg shadow-sm overflow-hidden">
        <div className="flex-shrink-0 w-[200px]">
          <img
            src={book.image_url || "https://via.placeholder.com/150x300"}
            alt={book.title}
            className="w-full h-[300px] bg-grey object-cover border border-grey rounded-md"
          />

          <p className="text-arcadia-red text-xs mt-2 cursor-pointer text-center hover:underline" onClick={handleReportIssue}>
            Report a broken link or error
          </p>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-ZenSerif">{book.title}</h3>
          <div className="text-md text-gray-700 mt-1 space-y-1">
            <p>
              <span className="font-semibold">Author:</span> {book.author.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Year Published:</span> {book.pubDate}
            </p>
            <p>
              <span className="font-semibold">Category:</span> {book.category}{" "}
              <span className="font-semibold">Genres:</span> {book.genres.join(", ")}
            </p>
            <p className="min-h-[6rem] leading-relaxed text-justify">
              <span className="text-justify whitespace-pre-line"> {book.synopsis || "No synopsis available."} </span>
            </p>
          </div>

          {user && user.userAccountType !== "Guest" && (
            <div className="flex w-full justify-start space-x-2">
              <div className="flex items-center justify-start gap-1 mt-2">{renderStars(selectedRating)}</div>

              <button
                className="mt-2 w-1/6 bg-arcadia-red hover:bg-red hover:text-white text-white py-1 px-2 rounded-xl text-sm"
                onClick={() => {
                  if (!user) {
                    navigate("/user/login")
                  } else {
                    handleSubmitRating()
                  }
                }}
              >
                {!user ? "Log In to Rate" : existingRatingID ? "Update Rating" : "Rate"}
              </button>
            </div>
          )}
          {message && <p className="w-full text-sm text-left mt-2 text-gray-500">{message}</p>}
        </div>
      </div>
      {/* Additional Information Section */}
      <div className="mt-4 border-t border-grey p-2">
        <h3 className="text-2xl font-semibold mt-4 mb-2">Additional Information</h3>
        <div className="flex w-full">
          <div className="flex flex-col space-y-2 w-1/2">
            <p>
              <span className="font-semibold">Category:</span> {book.category || "No category available"}
            </p>
            <p>
              <span className="font-semibold">Genre:</span> {book.genres.join(", ") || "No genre available"}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {book.location || "No location available"}
            </p>
            <p>
              <span className="font-semibold">Call Number:</span> {book.titleCallNum || "No location available"}
            </p>
            <p>
              <span className="font-semibold">Keywords:</span> {book.keywords.join(", ") || "No keywords available"}
            </p>
          </div>
          <div className="flex flex-col space-y-2 w-1/2">
            <p>
              <span className="font-semibold">Publisher:</span> {book.publisher || "No publisher information"}
            </p>
            <p>
              <span className="font-semibold">Date Published:</span>{" "}
              {book.pubDate || "No date information"}
            </p>
            <p>
              <span className="font-semibold">ISBN:</span> {book.isbn || "No ISBN available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

