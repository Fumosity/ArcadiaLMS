import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "/src/supabaseClient.js"
import { toast } from "react-toastify"

const FileATix = () => {
  const [searchParams] = useSearchParams()
  const [type, setType] = useState("select-type")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [userID, setUserID] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketCount, setTicketCount] = useState(0)
  const [charactersLeft, setCharactersLeft] = useState(300)
  const MAX_TICKETS_PER_HOUR = 3
  const MAX_CHARACTERS = 300

  // Set default values from query parameters
  useEffect(() => {
    const defaultType = searchParams.get("type")
    const defaultSubject = searchParams.get("subject")
    if (defaultType) setType(defaultType)
    if (defaultSubject) setSubject(defaultSubject)
  }, [searchParams])

  // Retrieve the user_ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user.userID) {
      setUserID(user.userID)
      checkTicketLimit(user.userID)
    }
  }, [])

  // Check how many tickets the user has submitted in the past hour
  const checkTicketLimit = async (userId) => {
    if (!userId) return

    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)
    const oneHourAgoStr = oneHourAgo.toISOString()

    try {
      const { data, error } = await supabase
        .from("support_ticket")
        .select("*")
        .eq("userID", userId)
        .gt("created_at", oneHourAgoStr)

      if (error) {
        console.error("Error checking ticket limit:", error)
        return
      }

      setTicketCount(data ? data.length : 0)
    } catch (error) {
      console.error("Error checking ticket limit:", error)
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

    if (!userID) {
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

    // Check if user has reached the ticket limit
    if (ticketCount >= MAX_TICKETS_PER_HOUR) {
      toast.error(`You can only submit ${MAX_TICKETS_PER_HOUR} support tickets per hour. Please try again later.`, {
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

    const { error } = await supabase.from("support_ticket").insert([
      {
        userID,
        type,
        status: "Pending",
        date,
        time,
        subject,
        content,
      },
    ])

    setIsSubmitting(false)

    if (error) {
      console.error("Error submitting ticket:", error)
      toast.error("Failed to submit the ticket. Please try again.", {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      })
    } else {
      // Update ticket count
      setTicketCount((prevCount) => prevCount + 1)

      toast.success("Ticket filed successfully!", {
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
      <h3 className="text-2xl font-semibold mb-4">File A Ticket</h3>
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
          <option value="Account" className="text-center">
            Account
          </option>
          <option value="Book" className="text-center">
            Book
          </option>
          <option value="Research" className="text-center">
            Research
          </option>
          <option value="Room Reservation" className="text-center">
            Room Reservation
          </option>
        </select>

        <label className="text-sm ml-4 mr-2 font-semibold">Subject:</label>
        <input
          type="text"
          className="flex-1 px-2 py-1 border border-grey rounded-full text-sm"
          placeholder="Enter the subject of the ticket here."
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
        placeholder={
          type === "Room Reservation"
            ? `Enter Room Name Here:\nDate:\nSet Starting & End Time:\nReason for reserving the room:`
            : "Enter the content of your ticket."
        }
        value={content}
        onChange={handleContentChange}
        rows={6}
        maxLength={MAX_CHARACTERS}
      ></textarea>
      <div className="flex flex-col items-center">
        {ticketCount >= MAX_TICKETS_PER_HOUR && (
          <p className="text-red-500 text-sm mb-2">
            You've reached the limit of {MAX_TICKETS_PER_HOUR} tickets per hour.
          </p>
        )}
        {ticketCount > 0 && ticketCount < MAX_TICKETS_PER_HOUR && (
          <p className="text-gray-500 text-sm mb-2">
            You've submitted {ticketCount} of {MAX_TICKETS_PER_HOUR} allowed tickets in the past hour.
          </p>
        )}
        <button
          className={`px-4 py-1 text-sm bg-arcadia-red text-white rounded-full font-medium hover:bg-red ${
            isSubmitting || ticketCount >= MAX_TICKETS_PER_HOUR ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting || ticketCount >= MAX_TICKETS_PER_HOUR}
        >
          {isSubmitting ? "Submitting..." : "File Ticket"}
        </button>
      </div>
    </div>
  )
}

export default FileATix
