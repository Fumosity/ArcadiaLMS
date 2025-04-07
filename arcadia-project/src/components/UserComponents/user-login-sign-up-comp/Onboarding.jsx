import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../../supabaseClient.js"
import { useUser } from "../../../backend/UserContext.jsx"
import { API_URL } from "../../../api.js"

export default function Onboarding({ userData, selectedGenres }) {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { updateUser } = useUser()

  console.log("Rendered Onboarding")
  console.log("UserData:", userData)
  console.log("SelectedGenres:", selectedGenres)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isSubmitting) return
    setIsSubmitting(true)
    setError("")

    try {
      // Determine account type
      let account_type = ""
      if (userData.emailSuffix === "@lpunetwork.edu.ph") {
        account_type = "Student"
      } else if (userData.emailSuffix === "@lpu.edu.ph") {
        account_type = "Faculty"
      }

      const userPayload = {
        userFName: userData.firstName,
        userLName: userData.lastName,
        userLPUID: userData.studentNumber,
        userEmail: userData.email + userData.emailSuffix,
        userCollege: userData.college,
        userDepartment: userData.department,
        userPassword: userData.password,
        userAccountType: account_type,
      }

      // Insert into Supabase
      const { data: userInsertData, error: userInsertError } = await supabase
        .from("user_accounts")
        .insert([userPayload])
        .select("userID")

      if (userInsertError || !userInsertData) {
        console.error("Error inserting user:", userInsertError)
        alert("Failed to register. Please try again.")
        setIsSubmitting(false)
        return
      }

      const newUserID = userInsertData[0].userID
      console.log("New userID:", newUserID)

      // Send verification email - use API_URL to ensure correct endpoint
      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email + userData.emailSuffix,
          firstName: userData.firstName,
          lpuID: userData.studentNumber,
        }),
      })

      const result = await response.json()
      if (response.ok) {
        console.log("Verification email sent:", result)
        alert("A verification email has been sent. Please check your inbox.")
      } else {
        console.error("Email sending failed:", result.detail || result.error)
        alert("Failed to send verification email.")
      }

      // Insert selected genres
      if (selectedGenres.length > 0) {
        const genreLinks = selectedGenres.map((genreID) => ({
          userID: newUserID,
          genreID,
        }))

        const { error: genreInsertError } = await supabase.from("user_genre_link").insert(genreLinks)

        if (genreInsertError) {
          console.error("Error inserting interests:", genreInsertError)
          alert("Failed to save interests.")
        } else {
          console.log("User interests added successfully.")
        }
      }

      // Navigate to login after success
      navigate("/user/login")
    } catch (err) {
      console.error("Submission error:", err)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="uMain-cont flex max-h-auto max-w-[950px] h-full w-full bg-white">
      {/* Left Section */}
      <div className="max-w-md mx-auto p-8 flex flex-col items-center text-center">
        <div className="mb-6">
          <h3 className="text-5xl font-semibold">Congratulations!</h3>
        </div>

        <p className="text-black mb-6">
          Welcome to Arcadia, <b>{userData.firstName}</b>!
        </p>
        <p className="text-black mb-6">
          Please press the button below and check your registered email afterwards to confirm your account registration.{" "}
          <br />
          <br />
          Once done, you may now log in!
        </p>

        <div className="flex justify-center mt-24">
          <button type="submit" className="genRedBtns" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Continue"}
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 relative rounded-2xl bg-cover bg-center hidden md:block max-h-[600px]">
        <img src="/image/hero2.jpeg" alt="Hero Background" className="w-full h-full object-cover rounded-lg" />
        <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />
        <div className="absolute inset-0 flex items-end p-12 z-10">
          <h2 className="text-white text-4xl text-right font-semibold">Knowledge that empowers.</h2>
        </div>
      </div>
    </div>
  )
}

