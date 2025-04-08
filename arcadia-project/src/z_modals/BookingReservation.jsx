import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function BookingReservation({ isOpen, onClose, reservation, onSave, onUpdate, checkForConflicts }) {
  const [formData, setFormData] = useState({
    reservationID: "",
    room: "Discussion Room",
    date: "",
    startTime: "07:00",
    endTime: "08:00",
    title: "",
    userID: "",
  })

  useEffect(() => {
    if (reservation) {
      setFormData({
        reservationID: reservation.reservationID || "",
        room: reservation.rawData?.room || "Discussion Room",
        date: reservation.date || "",
        startTime: reservation.rawData?.startTime || "07:00",
        endTime: reservation.rawData?.endTime || "08:00",
        title: reservation.rawData?.title || reservation.purpose || "",
        userID: reservation.user_accounts?.userID || "",
      })
    }
  }, [reservation])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isSunday = (date) => {
    const selectedDay = new Date(date).getDay() // 0 = Sunday
    return selectedDay === 0
  }

  const handleFormSubmit = async () => {
    const now = new Date()
    const selectedDateTime = new Date(`${formData.date}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`)

    if (selectedDateTime < now) {
      toast.error("You cannot book a past date or time!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red text-white",
      })
      return
    }

    const startHour = Number.parseInt(formData.startTime.split(":")[0], 10)
    const endHour = Number.parseInt(formData.endTime.split(":")[0], 10)

    if (endDateTime <= selectedDateTime) {
      toast.error("End time must be after the start time!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red text-white",
      })
      return
    }

    if (isSunday(formData.date)) {
      toast.error("Bookings are not allowed on Sundays!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red text-white",
      })
      return
    }

    // Validate booking hours (07:00 - 17:00)
    if (startHour < 7 || endHour > 17) {
      toast.error("Bookings are only allowed from 7:00 AM to 5:00 PM!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red text-white",
      })
      return
    }

    if (!formData.room || !formData.date || !formData.startTime || !formData.endTime || !formData.title) {
      toast.error("Please fill in all required fields.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red text-white",
      })
      return
    }

    // Check for conflicts with existing reservations
    const hasConflict = await checkExistingReservation()
    if (hasConflict) {
      return // Prevent form submission if there's a conflict
    }

    const reserveData = {
      room: formData.room,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      title: formData.title,
    }

    try {
      if (formData.reservationID) {
        // Update existing reservation
        const { data, error } = await supabase
          .from("reservation")
          .update({
            reservationData: reserveData,
          })
          .eq("reservationID", formData.reservationID)

        if (error) {
          console.error("Error updating reservation:", error.message)
          toast.error("Error updating reservation", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "bg-red text-white",
          })
        } else {
          console.log("Reservation successfully updated:", data)
          toast.success("Reservation successfully updated", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "bg-green text-white",
          })

          // Update the local state with the updated reservation
          const updatedReservation = {
            ...reservation,
            date: formData.date,
            room: formData.room,
            purpose: formData.title,
            period: `${formData.startTime} - ${formData.endTime}`,
            rawData: reserveData,
          }

          onSave(updatedReservation)
          onUpdate()
        }
      }
    } catch (error) {
      console.error("Error while submitting reservation:", error.message)
      toast.error("Error while submitting reservation", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red text-white",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Modify Reservation</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Room:</label>
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Discussion Room">Discussion Room</option>
                <option value="Law Discussion Room">Law Discussion Room</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">End Time:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium">Purpose:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={handleFormSubmit} className="px-4 py-2 bg-arcadia-red text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )

  async function checkExistingReservation() {
    const { room, date, startTime, endTime } = formData
    try {
      // Get all reservations for the same room and date
      const { data, error } = await supabase
        .from("reservation")
        .select("reservationID, reservationData")
        .filter("reservationData->>room", "eq", room)
        .filter("reservationData->>date", "eq", date)
    
    if (error) {
      console.error("Error checking existing reservations:", error.message)
      toast.error("Error checking for reservation conflicts", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red text-white",
      })
      return true // Return true to prevent booking on error
    }
    
    // Convert times to comparable values (minutes since midnight)
    const convertTimeToMinutes = (timeStr) => {
      // Handle 24-hour format (from form)
      if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
        const [hours, minutes] = timeStr.split(":").map(num => Number.parseInt(num, 10))
        return hours * 60 + minutes
      }
      
      // Handle 12-hour format (from database)
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM|am|pm)/i)
      if (match) {
        let [_, hours, minutes, period] = match
        hours = Number.parseInt(hours, 10)
        minutes = Number.parseInt(minutes, 10)
        
        // Convert to 24-hour format
        if (period.toLowerCase() === "pm" && hours < 12) {
          hours += 12
        } else if (period.toLowerCase() === "am" && hours === 12) {
          hours = 0
        }
        
        return hours * 60 + minutes
      }
      
      return 0 // Default fallback
    }
    
    const newStartMinutes = convertTimeToMinutes(startTime)
    const newEndMinutes = convertTimeToMinutes(endTime)
    
    // Check each existing reservation for overlap, excluding the current one
    for (const item of data) {
      // Skip the current reservation being edited
      if (item.reservationID === reservation?.reservationID) {
        continue
      }
      
      const existingStartMinutes = convertTimeToMinutes(item.reservationData.startTime)
      const existingEndMinutes = convertTimeToMinutes(item.reservationData.endTime)
      
      // Check for overlap
      if (
        (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes) ||
        (existingStartMinutes < newEndMinutes && existingEndMinutes > newStartMinutes)
      ) {
        toast.error("This room is already reserved for the selected time!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: "bg-red text-white",
        })
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error("Error checking for conflicts:", error.message)
    toast.error("Error checking for reservation conflicts", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      className: "bg-red text-white",
    })
    return true // Return true to prevent booking on error
  }
}}
