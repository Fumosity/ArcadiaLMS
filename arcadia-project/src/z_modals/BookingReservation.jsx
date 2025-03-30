import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const BookingReservation = ({ isOpen, onClose, reservation, onSave, onUpdate }) => {
  const [room, setRoom] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const convertTo24Hour = (time) => {
    if (!time) return ""

    // Check if the time is already in 24-hour format (HH:MM)
    if (time.match(/^\d{1,2}:\d{2}$/)) {
      return time
    }

    // Parse 12-hour format (HH:MM AM/PM)
    const match = time.match(/(\d+):(\d+)\s*(AM|PM|am|pm)/i)
    if (!match) return time

    let [_, hours, minutes, period] = match
    hours = Number.parseInt(hours, 10)

    // Convert to 24-hour format
    if (period.toLowerCase() === "pm" && hours < 12) {
      hours += 12
    } else if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`
  }

  useEffect(() => {
    if (reservation && isOpen) {
      setRoom(reservation.room || "")
      setDate(reservation.date || "")

      if (reservation.rawData) {
        setStartTime(convertTo24Hour(reservation.rawData.startTime || ""))
        setEndTime(convertTo24Hour(reservation.rawData.endTime || ""))
      } else if (reservation.period) {
        const [start, end] = reservation.period.split(" - ")
        setStartTime(convertTo24Hour(start.trim() || ""))
        setEndTime(convertTo24Hour(end.trim() || ""))
      }

      setTitle(reservation.purpose || "")
    }
  }, [reservation, isOpen])

  const isSunday = (date) => new Date(date).getDay() === 0

  const checkExistingReservation = async () => {
    const { data } = await supabase
      .from("reservation")
      .select("reservationID, reservationData")
      .filter("reservationData->>room", "eq", room)
      .filter("reservationData->>date", "eq", date)
      .filter("reservationData->>startTime", "lt", endTime)
      .filter("reservationData->>endTime", "gt", startTime)

    // Exclude the current reservation from the conflict check
    return data?.some((res) => res.reservationID !== reservation.reservationID)
  }

  const isTimeWithinAllowedHours = (time) => {
    if (!time) return false

    const hours = Number.parseInt(time.split(":")[0], 10)
    return hours >= 7 && hours <= 17 // 7:00 AM to 5:00 PM (17:00)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if the time is within allowed hours (7:00 AM to 5:00 PM)
    const startHour = Number.parseInt(startTime.split(":")[0], 10)
    const endHour = Number.parseInt(endTime.split(":")[0], 10)
    const endMinutes = Number.parseInt(endTime.split(":")[1], 10)

    if (startHour < 7 || endHour > 17 || (endHour === 17 && endMinutes > 0)) {
      toast.warn("Bookings are only allowed from 7:00 AM to 5:00 PM!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
      setIsLoading(false)
      return
    }

    if (new Date(`${date}T${startTime}`) < new Date()) {
      toast.warn("You cannot book a past date or time!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
      setIsLoading(false)
      return
    }

    if (isSunday(date)) {
      toast.warn("Bookings are not allowed on Sundays!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
      setIsLoading(false)
      return
    }

    if (new Date(`${date}T${endTime}`) <= new Date(`${date}T${startTime}`)) {
      toast.warn("End time must be after the start time!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
      setIsLoading(false)
      return
    }

    if (await checkExistingReservation()) {
      toast.warn("This room is already reserved for the selected time!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
      setIsLoading(false)
      return
    }

    // Format times to 12-hour format for display
    const formatTo12Hour = (time24) => {
      const [hours, minutes] = time24.split(":")
      const hour = Number.parseInt(hours, 10)
      const period = hour >= 12 ? "PM" : "AM"
      const hour12 = hour % 12 || 12 // Convert 0 to 12 for 12 AM
      return `${hour12}:${minutes} ${period}`
    }

    const startTime12 = formatTo12Hour(startTime)
    const endTime12 = formatTo12Hour(endTime)

    const updatedData = {
      ...reservation.rawData,
      room,
      date,
      startTime: startTime12,
      endTime: endTime12,
      title,
    }

    const { error } = await supabase
      .from("reservation")
      .update({ reservationData: updatedData })
      .eq("reservationID", reservation.reservationID)

    if (error) {
      toast.error("Failed to update reservation.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    } else {
      const updatedReservation = {
        ...reservation,
        room,
        date,
        period: `${startTime12} - ${endTime12}`,
        purpose: title,
        rawData: updatedData,
      }

      onSave(updatedReservation)

      // Show success toast
      toast.success("Reservation updated successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })

      // Trigger calendar refresh if onUpdate is provided
      if (typeof onUpdate === "function") {
        onUpdate()
      }

      onClose()
    }

    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-96 p-8">
        <h2 className="text-2xl font-semibold mb-6 text-left">Modify Booking Reservation</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Room:</span>
              <select value={room} onChange={(e) => setRoom(e.target.value)} className="inputBox" required>
                <option value="">Select Room</option>
                <option value="Discussion Room">Discussion Room</option>
                <option value="Law Discussion Room">Law Discussion Room</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Date:</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="inputBox" required />
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Start Time:</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="inputBox"
                required
              />
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">End Time:</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="inputBox"
                required
              />
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Title:</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="inputBox"
                placeholder="Purpose of reservation"
                required
              />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button type="submit" className="penBtn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="cancelModify" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingReservation