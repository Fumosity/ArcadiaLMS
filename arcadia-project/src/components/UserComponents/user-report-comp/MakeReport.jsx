import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "/src/supabaseClient.js"
import { useUser } from "../../../backend/UserContext"
import { toast } from "react-toastify"

const MakeReport = () => {
  const [searchParams] = useSearchParams()
  const [type, setType] = useState("select-type")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportCount, setReportCount] = useState(0)
  const [charactersLeft, setCharactersLeft] = useState(300)
  const { user } = useUser() // Access the logged-in user
  const MAX_REPORTS_PER_HOUR = 3
  const MAX_CHARACTERS = 300

  // Set default values from query parameters
  useEffect(() => {
    const defaultType = searchParams.get("type")
    const defaultSubject = searchParams.get("subject")
    if (defaultType) setType(defaultType)
    if (defaultSubject) setSubject(defaultSubject)
  }, [searchParams])

  // Check how many reports the user has submitted in the past hour
  useEffect(() => {
    if (user && user.userID) {
      checkReportLimit(user.userID)
    }
  }, [user])

  const checkReportLimit = async (userId) => {
    if (!userId) return

    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)
    const oneHourAgoStr = oneHourAgo.toISOString()

    try {
      const { data, error } = await supabase
        .from("report_ticket")
        .select("*")
        .eq("userID", userId)
        .gt("created_at", oneHourAgoStr)

      if (error) {
        console.error("Error checking report limit:", error)
        return
      }

      setReportCount(data ? data.length : 0)
    } catch (error) {
      console.error("Error checking report limit:", error)
    }
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    if (newContent.length <= MAX_CHARACTERS) {
      setContent(newContent)
      setCharactersLeft(MAX_CHARACTERS - newContent.length)
    }
  }

  const handleSubmit = async () => {
    if (type === "select-type" || !subject || !content) {
      toast.warn("Please fill out all fields.", {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      })
      return
    }

    if (!user) {
      toast.warn("You need to log in first.", {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      })
      return
    }

    // Check if user has reached the report limit
    if (reportCount >= MAX_REPORTS_PER_HOUR) {
      toast.error(`You can only submit ${MAX_REPORTS_PER_HOUR} reports per hour. Please try again later.`, {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      })
      return
    }

    setIsSubmitting(true)
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()

    const { error } = await supabase.from("report_ticket").insert([
      {
        type,
        status: "Ongoing",
        date,
        time,
        subject,
        content,
        userID: user.userID, // Get the userID from the logged-in user object
      },
    ])

    setIsSubmitting(false)

    if (error) {
      console.error("Error submitting report:", error)
      toast.error("Failed to submit the report. Please try again.", {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      })
    } else {
      // Update report count
      setReportCount((prevCount) => prevCount + 1)

      toast.success("Report submitted successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })

      // Reset form fields
      setType("select-type")
      setSubject("")
      setContent("")
      setCharactersLeft(MAX_CHARACTERS)

      // Navigate after toast
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }

  return (
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <h3 className="text-2xl font-semibold mb-4">Make a Report</h3>
      <div className="flex items-center mb-4">
        <label className="text-sm mr-2 font-semibold">Type:</label>
        <select
          className="w-[136px] px-2 py-1 border text-a-t-red border-a-t-red rounded-full text-center text-sm focus:outline-none focus:ring-0 appearance-none"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="select-type" className="text-center text-grey">
            Select Type
          </option>
          <option value="System" className="text-center">
            System
          </option>
          <option value="Feedback" className="text-center">
            Feedback
          </option>
          <option value="Book" className="text-center">
            Book
          </option>
          <option value="Research" className="text-center">
            Research
          </option>
        </select>

        <label className="text-sm ml-4 mr-2 font-semibold">Subject:</label>
        <input
          type="text"
          className="flex-1 px-2 py-1 border border-grey rounded-full text-sm"
          placeholder="Enter the subject of the report here."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="mb-1 flex justify-between items-center">
        <label className="text-sm text-left mr-2 font-semibold">Content:</label>
        <span className={`text-xs ${charactersLeft < 50 ? "text-red-500" : "text-gray-500"}`}>
          {charactersLeft} characters left
        </span>
      </div>
      <textarea
        className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
        placeholder="Enter the content of the report here."
        value={content}
        onChange={handleContentChange}
        rows={6}
        maxLength={MAX_CHARACTERS}
      ></textarea>
      <div className="flex flex-col items-center">
        {reportCount >= MAX_REPORTS_PER_HOUR && (
          <p className="text-red-500 text-sm mb-2">
            You've reached the limit of {MAX_REPORTS_PER_HOUR} reports per hour.
          </p>
        )}
        {reportCount > 0 && reportCount < MAX_REPORTS_PER_HOUR && (
          <p className="text-gray-500 text-sm mb-2">
            You've submitted {reportCount} of {MAX_REPORTS_PER_HOUR} allowed reports in the past hour.
          </p>
        )}
        <button
          className={`px-4 py-1 text-sm bg-arcadia-red text-white rounded-full font-medium hover:bg-red ${
            isSubmitting || reportCount >= MAX_REPORTS_PER_HOUR ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting || reportCount >= MAX_REPORTS_PER_HOUR}
        >
          {isSubmitting ? "Submitting..." : "Make a Report"}
        </button>
      </div>
    </div>
  )
}

export default MakeReport
