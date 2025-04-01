import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ARoomBooking({ addReservation }) {
  const [formData, setFormData] = useState({
    userId: "",
    schoolId: "",
    name: "",
    college: "",
    department: "",
    room: "Discussion Room",
    date: "",
    startTime: "07:00",
    endTime: "08:00",
    title: "",
  })

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setFormData((prev) => ({
      ...prev,
      date: today,
    }))
  }, [])

  const handleInputChange = async (e) => {
    const { name, value } = e.target

    // Update the form data with the new value
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If the school ID field is updated
    if (name === "schoolId") {
      // If the school ID is empty, clear the dependent fields
      if (value.trim() === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          userId: "",
          name: "",
          college: "",
          department: "",
        }))
        return
      }

      // If school ID has a value, fetch user data
      try {
        const { data, error } = await supabase
          .from("user_accounts")
          .select("userID, userFName, userLName, userCollege, userDepartment")
          .eq("userLPUID", value)

        if (error) {
          console.error("Error fetching user details:", error.message)
          return
        }

        if (!data || data.length === 0) {
          // Clear the fields if no user is found
          setFormData((prev) => ({
            ...prev,
            userId: "",
            name: "",
            college: "",
            department: "",
          }))
          console.log("No user found with the provided School ID")
          return
        }

        if (data.length > 1) {
          console.error("Multiple users found with the same School ID")
          return
        }

        console.log("User found with the provided School ID")

        const user = data[0]
        setFormData((prev) => ({
          ...prev,
          userId: user.userID,
          name: `${user.userFName} ${user.userLName}`,
          college: user.userCollege,
          department: user.userDepartment,
        }))
      } catch (error) {
        console.error("Error fetching user details:", error.message)
      }
    }
  }

  const checkExistingReservation = async () => {
    try {
      const { data, error } = await supabase
        .from("reservation")
        .select("reservationData")
        .filter("reservationData->>room", "eq", formData.room)
        .filter("reservationData->>date", "eq", formData.date)
        .filter("reservationData->>startTime", "lt", formData.endTime)
        .filter("reservationData->>endTime", "gt", formData.startTime)

      if (error) {
        throw new Error(`Error checking existing reservations: ${error.message}`)
      }

      if (data.length > 0) {
        toast.warn("This room is already reserved for the selected time!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: "bg-yellow text-white",
        })
        return true
      }

      return false
    } catch (error) {
      console.error(error.message)
      toast.error("Error checking existing reservations", {
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
      return false
    }
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
      toast.warn("You cannot book a past date or time!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-yellow text-white",
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

    if (
      !formData.userId ||
      !formData.schoolId ||
      !formData.name ||
      !formData.college ||
      !formData.room ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.title
    ) {
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

    const isReserved = await checkExistingReservation()
    if (isReserved) {
      return // Prevent form submission if the room is already booked
    }

    const newEvent = {
      id: String(Date.now()),
      resourceId: formData.room,
      title: formData.title,
      start: `${formData.date}T${formData.startTime}`,
      end: `${formData.date}T${formData.endTime}`,
    }

    addReservation(newEvent)

    const formatTimeTo12Hour = (time24) => {
      const [hour, minute] = time24.split(":")
      const date = new Date()
      date.setHours(hour, minute)
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    }

    const reserveData = {
      room: formData.room,
      date: formData.date,
      startTime: formData.startTime, // Keep as 24-hour format
      endTime: formData.endTime,
      title: formData.title,
    }

    try {
      const { data, error } = await supabase.from("reservation").insert({
        userID: formData.userId,
        reservationData: reserveData,
      })

      if (error) {
        console.error("Error saving reservation:", error.message)
        toast.error("Error saving reservation", {
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
        console.log("Reservation successfully saved:", data)
        toast.success("Reservation successfully saved", {
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
        setTimeout(() => {
          window.location.reload()
        }, 1500)
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

  return (
    <div className="bg-white p-4 rounded-lg border-grey border overflow-x-auto">
      <h3 className="text-2xl font-semibold mb-4">Room Booking</h3>
      <div className="flex space-x-4 pb-5 overflow-x-auto">
        <div className="space-y-2 flex-1">
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">School ID*:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="schoolId"
                value={formData.schoolId}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Name:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="name"
                value={formData.name}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">College:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="college"
                value={formData.college}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Department:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="department"
                value={formData.department}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
                required
              />
            </div>
          </div>
          <div className="items-center hidden">
            <span className="w-1/3 text-md capitalize">User ID:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Room: </span>
            <div className="w-2/3 flex items-center">
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
              >
                <option value="Discussion Room">Discussion Room </option>
                <option value="Law Discussion Room">Law Discussion Room </option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Reservation Date:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
              />
            </div>
          </div>

          <div className="flex w-full items-center">
            <span className="w-1/3 text-md capitalize">Start / End Time:</span>
            <div className=" w-2/3 flex items-center space-x-2">
              <div className="w-full flex items-center">
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="px-3 py-1 rounded-full border border-grey w-full"
                />
              </div>
              <div className="w-full flex items-center">
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="px-3 py-1 rounded-full border border-grey w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Title:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="add-book w-1/4 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          onClick={handleFormSubmit}
        >
          Reserve a Room
        </button>
      </div>
    </div>
  )
}