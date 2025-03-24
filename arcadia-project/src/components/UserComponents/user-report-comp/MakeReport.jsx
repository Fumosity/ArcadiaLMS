import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "/src/supabaseClient.js"
import { useUser } from "../../../backend/UserContext" // Adjust the path if necessary

const MakeReport = () => {
  const [searchParams] = useSearchParams()
  const [type, setType] = useState("select-type")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const { user } = useUser() // Access the logged-in user

  // Set default values from query parameters
  useEffect(() => {
    const defaultType = searchParams.get("type")
    const defaultSubject = searchParams.get("subject")
    if (defaultType) setType(defaultType)
    if (defaultSubject) setSubject(defaultSubject)
  }, [searchParams])

  const handleSubmit = async () => {
    if (type === "select-type" || !subject || !content) {
      alert("Please fill out all fields.")
      return
    }

    if (!user) {
      alert("You need to log in first.")
      return
    }

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

    if (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit the report. Please try again.")
    } else {
      alert("Report submitted successfully!")
      setType("select-type")
      setSubject("")
      setContent("")
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
      <label className="text-sm text-left mb-4 mr-2 font-semibold">Content:</label>
      <textarea
        className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
        placeholder="Enter the content of the report here."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex justify-center">
        <button
          className="px-4 py-1 text-sm bg-arcadia-red text-white rounded-full font-medium hover:bg-red"
          onClick={handleSubmit}
        >
          Make a Report
        </button>
      </div>
    </div>
  )
}

export default MakeReport

