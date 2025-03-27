import { useEffect, useState, useMemo } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import BookingReservation from "../z_modals/BookingReservation"
import WrmgDeleteReserve from "../z_modals/warning-modals/WrmgDeleteReserve"

const periods = [
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
]
const rooms = ["Discussion Room", "Law Discussion Room"]
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function ACurrentReserv() {
  // Create a date object for the current date in the user's local timezone
  const today = new Date()
  // Ensure we're working with the current date by setting to midnight in local timezone
  today.setHours(0, 0, 0, 0)

  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(() => {
    // Format today's date as YYYY-MM-DD in local timezone
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  })
  const [reservations, setReservations] = useState({})
  const [activeReservations, setActiveReservations] = useState([])
  const [loading, setLoading] = useState(true)

  // Table controls
  const [sortOrder, setSortOrder] = useState("Ascending")
  const [roomFilter, setRoomFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true)

      // Fetch room availability data
      const { data, error } = await supabase.from("reservation").select("userID, reservationData")

      if (error) {
        console.error("Error fetching reservations:", error)
        setLoading(false)
        return
      }

      const availability = {}
      periods.forEach((period) => {
        availability[period] = {}
        rooms.forEach((room) => {
          availability[period][room] = "Available"
        })
      })

      data.forEach(({ reservationData }) => {
        const { date, room, startTime, endTime } = reservationData

        // Fix timezone handling to ensure correct date comparison
        const reservationDate = new Date(date)
        const formattedDate = reservationDate.toISOString().split("T")[0]

        if (formattedDate === selectedDate) {
          // Properly parse 12-hour time format to 24-hour
          const parse12HourTime = (time12) => {
            if (!time12) return { hours: 0, minutes: 0 }

            const [timePart, modifier] = time12.split(" ")
            let [hours, minutes] = timePart.split(":").map((num) => Number.parseInt(num, 10))

            if (modifier === "PM" && hours < 12) {
              hours += 12
            } else if (modifier === "AM" && hours === 12) {
              hours = 0
            }

            return { hours, minutes }
          }

          // Parse reservation times
          const reservationStart = parse12HourTime(startTime)
          const reservationEnd = parse12HourTime(endTime)

          // Convert to decimal for easier comparison
          const reservationStartDecimal = reservationStart.hours + reservationStart.minutes / 60
          const reservationEndDecimal = reservationEnd.hours + reservationEnd.minutes / 60

          periods.forEach((period) => {
            // Parse period times (format: "HH:00 - HH:00")
            const [periodStart, periodEnd] = period.split(" - ")

            // Handle the special case for afternoon hours (12:00 - 01:00, etc.)
            const parsePeriodTime = (timeStr) => {
              const [hourStr] = timeStr.split(":")
              let hour = Number.parseInt(hourStr, 10)

              // Convert 12-hour format to 24-hour
              // For periods after 12:00, we need to add 12 to get PM hours
              if (hour < 7 && periods.indexOf(period) >= 6) {
                // If hour is 1-6 and it's in the afternoon periods
                hour += 12
              }

              return hour
            }

            const periodStartHour = parsePeriodTime(periodStart)
            const periodEndHour = parsePeriodTime(periodEnd)

            // Check if this period overlaps with the reservation
            if (
              (periodStartHour >= reservationStartDecimal && periodStartHour < reservationEndDecimal) ||
              (periodEndHour > reservationStartDecimal && periodEndHour <= reservationEndDecimal) ||
              (periodStartHour <= reservationStartDecimal && periodEndHour >= reservationEndDecimal)
            ) {
              availability[period][room] = "Reserved"
            }
          })
        }
      })

      setReservations(availability)

      // Fetch active reservations with user data
      const { data: activeData, error: activeError } = await supabase
        .from("reservation")
        .select("*, user_accounts(userFName, userLName, userID, userAccountType)")

      if (activeError) {
        console.error("Error fetching active reservations:", activeError.message)
      } else {
        const formattedData = activeData.map((item) => ({
          reservationID: item.reservationID,
          date: item.reservationData.date
            ? new Date(item.reservationData.date).toISOString().split("T")[0]
            : "Invalid Date",
          room: item.reservationData.room || "Unknown Room",
          purpose: item.reservationData.title || "No Purpose",
          period:
            item.reservationData.startTime && item.reservationData.endTime
              ? `${item.reservationData.startTime} - ${item.reservationData.endTime}`
              : "Invalid Time",
          name: item.user_accounts ? `${item.user_accounts.userFName} ${item.user_accounts.userLName}` : "N/A",
          user_accounts: item.user_accounts,
          rawData: item.reservationData, // Store raw data for debugging
        }))

        setActiveReservations(formattedData)
      }

      setLoading(false)
    }

    fetchReservations()
  }, [selectedDate])

  // Filter, Sort, and Search Logic for active reservations
  const filteredReservations = useMemo(() => {
    let filtered = [...activeReservations]

    // Filtering by Room
    if (roomFilter !== "All") {
      filtered = filtered.filter((res) => res.room === roomFilter)
    }

    // Searching (Matches Room, Borrower, or Purpose)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (res) =>
          res.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sorting by Date
    filtered.sort((a, b) => {
      return sortOrder === "Ascending" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    })

    return filtered
  }, [activeReservations, sortOrder, roomFilter, searchTerm])

  // Calculate total pages
  const totalPages = Math.ceil(filteredReservations.length / entriesPerPage)

  // Pagination logic
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedReservations = filteredReservations.slice(startIndex, startIndex + entriesPerPage)

  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction
    let newYear = currentYear

    if (newMonth < 0) {
      newMonth = 11
      newYear--
    } else if (newMonth > 11) {
      newMonth = 0
      newYear++
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentYear, currentMonth, i))
  }

  // Format the selected date for display
  const selectedDateObj = new Date(selectedDate + "T00:00:00")
  const formattedSelectedDate = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleUserClick = (reservation) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: reservation.user_accounts.userID },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatTo12Hour = (timeString) => {
    // Check if the time is already in 12-hour format
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString
    }

    // Handle 24-hour format (HH:MM)
    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(":").map((num) => Number.parseInt(num, 10))
      const period = hours >= 12 ? "PM" : "AM"
      const displayHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
    }

    return timeString // Return original if format is unknown
  }

  const formatPeriod = (period) => {
    if (!period) return ""

    const [start, end] = period.split(" - ")
    if (!start || !end) return period

    return `${formatTo12Hour(start.trim())} - ${formatTo12Hour(end.trim())}`
  }

  const handleModifyReservation = (reservation) => {
    setSelectedReservation({
      ...reservation,
      startTime: reservation.rawData.startTime, // Ensure separate fields are passed
      endTime: reservation.rawData.endTime,
    })
    setIsModalOpen(true)
  }

  const handleDeleteReservation = (reservation) => {
    if (!reservation || !reservation.reservationID) {
      console.error("Error: Reservation ID is undefined")
      alert("Cannot delete reservation: ID is missing")
      return
    }

    setReservationToDelete(reservation)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteReservation = async () => {
    if (!reservationToDelete || !reservationToDelete.reservationID) {
      console.error("Error: Reservation ID is undefined")
      return
    }

    try {
      const { error } = await supabase
        .from("reservation")
        .delete()
        .eq("reservationID", reservationToDelete.reservationID)

      if (error) {
        console.error("Error deleting reservation:", error.message)
        alert("Failed to delete reservation. Please try again.")
      } else {
        // Update the local state to remove the deleted reservation
        setActiveReservations(
          activeReservations.filter((res) => res.reservationID !== reservationToDelete.reservationID),
        )

        // Refresh the calendar view
        const fetchReservations = async () => {
          const { data, error } = await supabase.from("reservation").select("userID, reservationData")
          if (!error && data) {
            // Update reservations state with new data
            // (simplified - the full logic is in the useEffect)
            const availability = {}
            periods.forEach((period) => {
              availability[period] = {}
              rooms.forEach((room) => {
                availability[period][room] = "Available"
              })
            })
            // Process data and update state
            setReservations(availability)
          }
        }
        fetchReservations()
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred.")
    } finally {
      setIsDeleteModalOpen(false)
      setReservationToDelete(null)
    }
  }

  return (
    <div className="uHero-cont max-w-[1500px] w-full p-6 bg-white rounded-lg border border-grey">
      <h2 className="text-2xl font-semibold mb-6">Room Reservations</h2>

      <div className="flex flex-col md:flex-row gap-3 mb-2">
        {/* Calendar Section */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 border border-grey">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h3 className="text-lg font-medium">
              {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              if (!date) {
                return <div key={i} className="h-10 w-full opacity-0 cursor-default"></div>
              }

              // Create a date string in YYYY-MM-DD format for comparison
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, "0")
              const day = String(date.getDate()).padStart(2, "0")
              const dateString = `${year}-${month}-${day}`

              const isPast = date < today
              const isSunday = date.getDay() === 0
              const isToday = date.getTime() === today.getTime()
              const isSelected = dateString === selectedDate

              // Build class string conditionally
              let dayClasses =
                "h-10 w-full flex items-center justify-center rounded-md text-sm transition-all duration-200"

              if (isToday) {
                dayClasses += " bg-arcadia-red text-white" // Always highlight today
              } else if (isSelected) {
                dayClasses += " bg-ongoing text-white" // Highlight selected future dates
              } else {
                dayClasses += " hover:bg-gray-100" // Default hover effect
              }

              if (isPast || isSunday) {
                dayClasses += " text-grey cursor-not-allowed" // Disable past dates and Sundays
              } else {
                dayClasses += " cursor-pointer" // Enable clickable dates
              }

              return (
                <div
                  key={i}
                  className={dayClasses}
                  onClick={() => !(isPast || isSunday) && setSelectedDate(dateString)}
                >
                  {date.getDate()}
                </div>
              )
            })}
          </div>
        </div>

        {/* Reservation Table */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg border border-grey overflow-hidden p-2">
            <div className="text-md font-medium text-gray-700 p-3 bg-gray-50 border-b">
              Availability for {formattedSelectedDate}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-t-0 border-grey">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left font-medium text-gray-700 border-b border-r">Period</th>
                    {rooms.map((room) => (
                      <th
                        key={room}
                        className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r last:border-r-0"
                      >
                        {room}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period, idx) => {
                    const isLastRow = idx === periods.length - 1

                    return (
                      <tr key={period} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className={`py-2 px-3 border-r font-medium ${isLastRow ? "" : "border-b"}`}>{period}</td>

                        {rooms.map((room, roomIdx) => {
                          const isReserved = reservations[period]?.[room] === "Reserved"
                          const cellClasses = `
                            py-2 px-3 text-center font-semibold 
                            border-grey border-r
                            ${isLastRow ? "" : "border-b"}
                            ${roomIdx === rooms.length - 1 ? "border-r-0" : ""}
                            ${isReserved ? "bg-intended text-white" : "bg-resolved text-white"}
                          `

                          return (
                            <td key={room} className={cellClasses.trim()}>
                              {reservations[period]?.[room] || "Available"}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Active Reservations Table */}
      <div className="bg-white p-4 rounded-lg border-grey border mt-3">
        <h3 className="text-xl font-semibold mb-4">Active Reservations</h3>

        {/* Controls for sort, filter, and search */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Sort:</span>
              <button
                onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
                className="sort-by bg-gray-200 border-grey py-1 px-3 rounded-lg text-sm w-28"
              >
                {sortOrder}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Room:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
              >
                <option value="All">All</option>
                {[...new Set(activeReservations.map((res) => res.room))].map((room, idx) => (
                  <option key={idx} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Entries:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2 min-w-[0]">
            <label htmlFor="search" className="font-medium text-sm">
              Search:
            </label>
            <input
              type="text"
              id="search"
              className="border border-grey rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
              placeholder="Room, borrower, or purpose"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booker
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center">
                    Loading data...
                  </td>
                </tr>
              ) : displayedReservations.length > 0 ? (
                displayedReservations.map((res, index) => (
                  <tr key={index} className="hover:bg-light-gray">
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">
                      <div className="py-1 px-3 rounded-full bg-grey font-semibold">{res.room}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {new Date(res.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{formatPeriod(res.period)}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => handleUserClick(res)}
                        className="text-sm text-arcadia-red font-semibold hover:underline"
                      >
                        {res.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{res.user_accounts?.userAccountType || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-center">{res.purpose}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleModifyReservation(res)}
                          className="bg-dark-blue hover:bg-light-blue text-black py-1 px-2 rounded text-xs"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteReservation(res)}
                          className="bg-arcadia-red hover:bg-red text-white py-1 px-2 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center text-zinc-600">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-2 space-x-4">
          <button
            className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <span className="text-xs text-arcadia-red">Page {currentPage}</span>
          <button
            className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      </div>

      {/* Booking Reservation Modal */}
      <BookingReservation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reservation={selectedReservation}
        onSave={(updatedReservation) => {
          setActiveReservations((prev) =>
            prev.map((res) => (res.reservationID === updatedReservation.reservationID ? updatedReservation : res)),
          )
          setIsModalOpen(false)
        }}
        onUpdate={() => {
          // This will trigger a refresh of the reservation data
          async function fetchReservations() {
            setLoading(true)

            // Fetch room availability data
            const { data, error } = await supabase.from("reservation").select("userID, reservationData")

            if (error) {
              console.error("Error fetching reservations:", error)
              setLoading(false)
              return
            }

            const availability = {}
            periods.forEach((period) => {
              availability[period] = {}
              rooms.forEach((room) => {
                availability[period][room] = "Available"
              })
            })

            data.forEach(({ reservationData }) => {
              const { date, room, startTime, endTime } = reservationData

              // Fix timezone handling to ensure correct date comparison
              const reservationDate = new Date(date)
              const formattedDate = reservationDate.toISOString().split("T")[0]

              if (formattedDate === selectedDate) {
                // Properly parse 12-hour time format to 24-hour
                const parse12HourTime = (time12) => {
                  if (!time12) return { hours: 0, minutes: 0 }

                  const [timePart, modifier] = time12.split(" ")
                  let [hours, minutes] = timePart.split(":").map((num) => Number.parseInt(num, 10))

                  if (modifier === "PM" && hours < 12) {
                    hours += 12
                  } else if (modifier === "AM" && hours === 12) {
                    hours = 0
                  }

                  return { hours, minutes }
                }

                // Parse reservation times
                const reservationStart = parse12HourTime(startTime)
                const reservationEnd = parse12HourTime(endTime)

                // Convert to decimal for easier comparison
                const reservationStartDecimal = reservationStart.hours + reservationStart.minutes / 60
                const reservationEndDecimal = reservationEnd.hours + reservationEnd.minutes / 60

                periods.forEach((period) => {
                  // Parse period times (format: "HH:00 - HH:00")
                  const [periodStart, periodEnd] = period.split(" - ")

                  // Handle the special case for afternoon hours (12:00 - 01:00, etc.)
                  const parsePeriodTime = (timeStr) => {
                    const [hourStr] = timeStr.split(":")
                    let hour = Number.parseInt(hourStr, 10)

                    // Convert 12-hour format to 24-hour
                    // For periods after 12:00, we need to add 12 to get PM hours
                    if (hour < 7 && periods.indexOf(period) >= 6) {
                      // If hour is 1-6 and it's in the afternoon periods
                      hour += 12
                    }

                    return hour
                  }

                  const periodStartHour = parsePeriodTime(periodStart)
                  const periodEndHour = parsePeriodTime(periodEnd)

                  // Check if this period overlaps with the reservation
                  if (
                    (periodStartHour >= reservationStartDecimal && periodStartHour < reservationEndDecimal) ||
                    (periodEndHour > reservationStartDecimal && periodEndHour <= reservationEndDecimal) ||
                    (periodStartHour <= reservationStartDecimal && periodEndHour >= reservationEndDecimal)
                  ) {
                    availability[period][room] = "Reserved"
                  }
                })
              }
            })

            setReservations(availability)

            // Fetch active reservations with user data
            const { data: activeData, error: activeError } = await supabase
              .from("reservation")
              .select("*, user_accounts(userFName, userLName, userID, userAccountType)")

            if (activeError) {
              console.error("Error fetching active reservations:", activeError.message)
            } else {
              const formattedData = activeData.map((item) => ({
                reservationID: item.reservationID,
                date: item.reservationData.date
                  ? new Date(item.reservationData.date).toISOString().split("T")[0]
                  : "Invalid Date",
                room: item.reservationData.room || "Unknown Room",
                purpose: item.reservationData.title || "No Purpose",
                period:
                  item.reservationData.startTime && item.reservationData.endTime
                    ? `${item.reservationData.startTime} - ${item.reservationData.endTime}`
                    : "Invalid Time",
                name: item.user_accounts ? `${item.user_accounts.userFName} ${item.user_accounts.userLName}` : "N/A",
                user_accounts: item.user_accounts,
                rawData: item.reservationData, // Store raw data for debugging
              }))

              setActiveReservations(formattedData)
            }

            setLoading(false)
          }

          fetchReservations()
        }}
      />

      {/* Delete Confirmation Modal */}
      <WrmgDeleteReserve
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteReservation}
        itemName={
          reservationToDelete
            ? `${reservationToDelete.room} on ${new Date(reservationToDelete.date).toLocaleDateString()}`
            : ""
        }
      />
    </div>
  )
}